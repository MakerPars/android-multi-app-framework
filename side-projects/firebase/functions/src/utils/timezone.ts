/**
 * Timezone hesaplama yardımcıları.
 *
 * Verilen IANA timezone'unda şu anki yerel saati hesaplar ve
 * hedef teslimat saatiyle eşleştirme yapar.
 */

/**
 * Belirli bir IANA timezone'unda şu anki yerel saati döndürür.
 * @example getLocalHour("Europe/Istanbul") => 21
 */
export function getLocalHour(timezoneId: string, now?: Date): number {
    const date = now ?? new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezoneId,
        hour: "numeric",
        hour12: false,
    });
    return parseInt(formatter.format(date), 10);
}

/**
 * Belirli bir IANA timezone'unda şu anki yerel günü döndürür (0=Pazar, 5=Cuma).
 */
export function getLocalDayOfWeek(timezoneId: string, now?: Date): number {
    const date = now ?? new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezoneId,
        weekday: "short",
    });
    const dayMap: Record<string, number> = {
        Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
    };
    return dayMap[formatter.format(date)] ?? -1;
}

/**
 * Belirli bir IANA timezone'unda şu anki yerel tarihi "YYYY-MM-DD" formatında döndürür.
 */
export function getLocalDate(timezoneId: string, now?: Date): string {
    const date = now ?? new Date();
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timezoneId,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    return formatter.format(date); // "2026-02-27"
}

/**
 * "21:00" gibi bir saat string'ini parse eder.
 */
export function parseDeliveryHour(timeStr: string): number {
    const [hourStr] = timeStr.split(":");
    return parseInt(hourStr, 10);
}

/**
 * Bilinen tüm IANA timezone ID'leri.
 * Intl API'si ile desteklenen yaygın timezone'lar.
 */
export const ALL_TIMEZONES: string[] = [
    // UTC-12 → UTC+14 sırasıyla
    "Pacific/Pago_Pago",      // UTC-11
    "Pacific/Honolulu",        // UTC-10
    "America/Anchorage",       // UTC-9
    "America/Los_Angeles",     // UTC-8
    "America/Denver",          // UTC-7
    "America/Chicago",         // UTC-6
    "America/New_York",        // UTC-5
    "America/Halifax",         // UTC-4
    "America/Sao_Paulo",       // UTC-3
    "Atlantic/South_Georgia",  // UTC-2
    "Atlantic/Azores",         // UTC-1
    "Europe/London",           // UTC+0
    "Europe/Berlin",           // UTC+1
    "Europe/Istanbul",         // UTC+3
    "Asia/Dubai",              // UTC+4
    "Asia/Karachi",            // UTC+5
    "Asia/Dhaka",              // UTC+6
    "Asia/Bangkok",            // UTC+7
    "Asia/Shanghai",           // UTC+8
    "Asia/Tokyo",              // UTC+9
    "Australia/Sydney",        // UTC+10/11
    "Pacific/Auckland",        // UTC+12/13
    "Asia/Kolkata",            // UTC+5:30
    "Asia/Riyadh",             // UTC+3
    "Africa/Cairo",            // UTC+2
    "Europe/Moscow",           // UTC+3
    "Asia/Kuala_Lumpur",       // UTC+8
    "Asia/Jakarta",            // UTC+7
];

/**
 * Hedef teslimat saatine uyan tüm timezone'ları döndürür.
 * @param deliveryTime "21:00" gibi saat string'i
 * @returns Şu an o saatte olan timezone ID'leri
 */
export function getMatchingTimezones(deliveryTime: string, now?: Date): string[] {
    const targetHour = parseDeliveryHour(deliveryTime);
    return ALL_TIMEZONES.filter((tz) => getLocalHour(tz, now) === targetHour);
}
