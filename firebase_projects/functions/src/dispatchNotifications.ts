import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as logger from "firebase-functions/logger";
import { getMatchingTimezones, getLocalDate, getLocalDayOfWeek, ALL_TIMEZONES } from "./utils/timezone";
import { sendToTokens } from "./utils/fcmSender";

/**
 * Event dokümanının tipi.
 */
interface ScheduledEvent {
    type: string;              // "kandil", "cuma", "ramazan", "gunluk"
    name: string;              // "Miraç Kandili"
    date?: string;             // "2026-02-27" (tek seferlik) veya undefined (tekrarlayan)
    recurrence?: string;       // "weekly:friday", "daily", undefined
    localDeliveryTime: string; // "21:00"
    topic?: string;            // "dini-bildirim"
    packages: string[];        // ["*"] veya ["com.parsfilo.yasinsuresi"]
    title: Record<string, string>;  // { "tr": "...", "en": "...", "ar": "..." }
    body: Record<string, string>;   // { "tr": "...", "en": "...", "ar": "..." }
    status: string;            // "scheduled", "sent", "expired"
    sentTimezones?: string[];  // Gönderilen timezone'lar
}

/**
 * Cihaz dokümanının tipi.
 */
interface DeviceDoc {
    fcmToken: string;
    timezone: string;
    locale: string;
    packageName: string;
    notificationsEnabled: boolean;
}

/**
 * dispatchNotifications — Her saat başı çalışır.
 *
 * 1. scheduled_events koleksiyonundan aktif event'leri çeker
 * 2. Her event için hangi timezone'ların teslimat saatine ulaştığını hesaplar
 * 3. O timezone'daki cihazları filtreler
 * 4. Her cihazın locale'ine göre doğru dildeki mesajı seçer
 * 5. FCM batch gönderir
 * 6. Gönderilen timezone'ları işaretler
 */
export const dispatchNotifications = onSchedule(
    {
        schedule: "0 * * * *", // Her saat başı
        region: "europe-west1",
        timeZone: "UTC",
    },
    async () => {
        const db = admin.firestore();

        // 1. Aktif event'leri çek
        const eventsSnap = await db
            .collection("scheduled_events")
            .where("status", "==", "scheduled")
            .get();

        if (eventsSnap.empty) {
            logger.info("No scheduled events found.");
            return;
        }

        logger.info(`Found ${eventsSnap.size} scheduled event(s).`);

        for (const eventDoc of eventsSnap.docs) {
            const event = eventDoc.data() as ScheduledEvent;

            try {
                await processEvent(db, eventDoc.id, event);
            } catch (error) {
                logger.error(`Error processing event ${eventDoc.id}`, { error });
            }
        }
    },
);

/**
 * Tek bir event'i işler: tarih/gün kontrolü, timezone eşleştirmesi, FCM gönderimi.
 */
async function processEvent(
    db: admin.firestore.Firestore,
    eventId: string,
    event: ScheduledEvent,
): Promise<void> {
    const now = new Date();
    const sentTimezones = event.sentTimezones ?? [];

    // 2. Hedef teslimat saatine uyan timezone'ları bul
    const matchingTimezones = getMatchingTimezones(event.localDeliveryTime, now);

    // Daha önce gönderilenleri çıkar
    const newTimezones = matchingTimezones.filter(
        (tz) => !sentTimezones.includes(tz),
    );

    if (newTimezones.length === 0) {
        return; // Bu saat dilimlerine zaten gönderilmiş veya eşleşen yok
    }

    // 3. Tarih/gün kontrolü
    // Tek bir referans timezone'u üzerinden (ilk eşleşen) kontrol yapalım
    const refTz = newTimezones[0];

    if (event.date) {
        // Tek seferlik event → tarih eşleşmesi kontrol et
        const localDate = getLocalDate(refTz, now);
        if (localDate !== event.date) {
            return; // Bu tarih değil
        }
    } else if (event.recurrence) {
        // Tekrarlayan event → gün kontrolü
        if (!matchesRecurrence(event.recurrence, refTz, now)) {
            return;
        }
    }

    logger.info(`Processing event "${event.name}" for timezone(s): ${newTimezones.join(", ")}`);

    // 4. Bu timezone'lardaki cihazları çek
    const devices = await getDevicesForTimezones(db, newTimezones, event.packages);

    if (devices.length === 0) {
        logger.info(`No devices found for timezones: ${newTimezones.join(", ")}`);
        // Yine de timezone'ları gönderildi olarak işaretle
        await markTimezonesAsSent(db, eventId, sentTimezones, newTimezones, event);
        return;
    }

    // 5. Locale'e göre grupla ve gönder
    const localeGroups = groupByLocale(devices);

    let totalSuccess = 0;
    let totalFailure = 0;
    const allInvalidTokens: string[] = [];

    for (const [locale, tokens] of Object.entries(localeGroups)) {
        const lang = locale.split("-")[0]; // "tr-TR" → "tr"
        const title = event.title[lang] ?? event.title["tr"] ?? event.name;
        const body = event.body[lang] ?? event.body["tr"] ?? "";

        const result = await sendToTokens(tokens, { title, body }, {
            type: event.type,
            eventId: eventId,
        });

        totalSuccess += result.successCount;
        totalFailure += result.failureCount;
        allInvalidTokens.push(...result.invalidTokens);
    }

    logger.info(
        `Event "${event.name}": sent=${totalSuccess}, failed=${totalFailure}, ` +
        `invalidTokens=${allInvalidTokens.length}`,
    );

    // 6. Geçersiz token'ları temizle
    if (allInvalidTokens.length > 0) {
        await cleanupInvalidTokens(db, allInvalidTokens);
    }

    // 7. Gönderilen timezone'ları kaydet
    await markTimezonesAsSent(db, eventId, sentTimezones, newTimezones, event);
}

/**
 * Tekrarlama kuralını kontrol eder.
 */
function matchesRecurrence(recurrence: string, timezone: string, now: Date): boolean {
    if (recurrence === "daily") {
        return true;
    }
    if (recurrence.startsWith("weekly:")) {
        const dayName = recurrence.split(":")[1]; // "friday"
        const dayMap: Record<string, number> = {
            sunday: 0, monday: 1, tuesday: 2, wednesday: 3,
            thursday: 4, friday: 5, saturday: 6,
        };
        const targetDay = dayMap[dayName];
        const currentDay = getLocalDayOfWeek(timezone, now);
        return targetDay === currentDay;
    }
    return false;
}

/**
 * Belirli timezone'lardaki ve paketlerdeki cihazları Firestore'dan çeker.
 */
async function getDevicesForTimezones(
    db: admin.firestore.Firestore,
    timezones: string[],
    packages: string[],
): Promise<Array<{ token: string; locale: string }>> {
    const devices: Array<{ token: string; locale: string }> = [];

    // Firestore `in` sorgusu en fazla 30 değer kabul eder
    const chunkSize = 30;
    for (let i = 0; i < timezones.length; i += chunkSize) {
        const tzChunk = timezones.slice(i, i + chunkSize);

        let query: admin.firestore.Query = db
            .collection("devices")
            .where("timezone", "in", tzChunk)
            .where("notificationsEnabled", "==", true);

        // Paket filtresi — ["*"] ise filtre uygulanmaz
        if (packages.length > 0 && !packages.includes("*")) {
            query = query.where("packageName", "in", packages);
        }

        const snap = await query.get();

        snap.forEach((doc) => {
            const data = doc.data() as DeviceDoc;
            devices.push({
                token: data.fcmToken,
                locale: data.locale,
            });
        });
    }

    return devices;
}

/**
 * Cihazları locale'e göre gruplar.
 */
function groupByLocale(
    devices: Array<{ token: string; locale: string }>,
): Record<string, string[]> {
    const groups: Record<string, string[]> = {};
    for (const device of devices) {
        const locale = device.locale || "tr-TR";
        if (!groups[locale]) {
            groups[locale] = [];
        }
        groups[locale].push(device.token);
    }
    return groups;
}

/**
 * Gönderilen timezone'ları event dokümanına yazar.
 * Tüm timezone'lara gönderildiyse status'u "sent" yapar.
 */
async function markTimezonesAsSent(
    db: admin.firestore.Firestore,
    eventId: string,
    previouslySent: string[],
    newlySent: string[],
    event: ScheduledEvent,
): Promise<void> {
    const allSent = [...new Set([...previouslySent, ...newlySent])];

    const updateData: Record<string, unknown> = {
        sentTimezones: allSent,
    };

    // Tek seferlik event ve tüm büyük timezone'lara gönderildiyse → "sent"
    if (!event.recurrence && allSent.length >= ALL_TIMEZONES.length) {
        updateData.status = "sent";
        logger.info(`Event "${event.name}" marked as SENT (all timezones covered).`);
    }

    await db.collection("scheduled_events").doc(eventId).update(updateData);
}

/**
 * Geçersiz FCM token'larına sahip cihazları Firestore'dan siler.
 * Firestore `in` sorgusu en fazla 30 değer kabul ettiğinden token'ları 30'luk gruplara böler.
 */
async function cleanupInvalidTokens(
    db: admin.firestore.Firestore,
    invalidTokens: string[],
): Promise<void> {
    let totalCleaned = 0;

    for (let i = 0; i < invalidTokens.length; i += 30) {
        const chunk = invalidTokens.slice(i, i + 30);
        const snap = await db
            .collection("devices")
            .where("fcmToken", "in", chunk)
            .get();

        if (!snap.empty) {
            const batch = db.batch();
            snap.forEach((doc) => batch.delete(doc.ref));
            await batch.commit();
            totalCleaned += snap.size;
        }
    }

    if (totalCleaned > 0) {
        logger.info(`Cleaned up ${totalCleaned} invalid device(s).`);
    }
}
