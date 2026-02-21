import * as admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

/**
 * registerDevice — Mobil uygulamadan gelen cihaz kaydını Firestore'a yazar.
 *
 * Mevcut PushRegistrationPayload ile birebir uyumlu:
 * - installationId, fcmToken, packageName, locale, timezone
 * - notificationsEnabled, appVersion, deviceModel, reason
 *
 * Bu URL, mobil uygulamadaki PUSH_REGISTRATION_URL olarak ayarlanır.
 */
export const registerDevice = onRequest(
    { region: "europe-west1", cors: true },
    async (req, res) => {
        // Sadece POST kabul et
        if (req.method !== "POST") {
            res.status(405).json({ error: "Method not allowed" });
            return;
        }

        try {
            const body = req.body;

            // Zorunlu alanları kontrol et
            const installationId = body.installationId as string | undefined;
            const fcmToken = body.fcmToken as string | undefined;

            if (!installationId || !fcmToken) {
                res.status(400).json({
                    error: "Missing required fields: installationId, fcmToken",
                });
                return;
            }

            const deviceData = {
                fcmToken: fcmToken,
                timezone: body.timezone ?? "UTC",
                locale: body.locale ?? "tr-TR",
                packageName: body.packageName ?? "",
                notificationsEnabled: body.notificationsEnabled ?? true,
                appVersion: body.appVersion ?? "unknown",
                deviceModel: body.deviceModel ?? "unknown",
                reason: body.reason ?? "unknown",
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };

            // Firestore'a upsert (aynı installationId varsa güncelle)
            await admin.firestore()
                .collection("devices")
                .doc(installationId)
                .set(deviceData, { merge: true });

            logger.info("Device registered", {
                installationId,
                timezone: deviceData.timezone,
                packageName: deviceData.packageName,
                reason: deviceData.reason,
            });

            res.status(200).json({ success: true });
        } catch (error) {
            logger.error("Device registration failed", { error });
            res.status(500).json({ error: "Internal server error" });
        }
    },
);
