export type LocaleKey = "tr" | "en" | "de";

export type EventStatus = "scheduled" | "paused" | "sent" | "expired";

export type ScheduleMode = "once" | "daily" | "weekly";

export type LoadState = "loading" | "ready" | "error";

export type AdminState = "checking" | "authorized" | "unauthorized";
export type AdminTab = "events" | "test-push" | "system-health";
export type TestPushSubTab = "single-device" | "coverage" | "ad-health";
export type TestPushTargetMode = "installationId" | "token";

export interface ScheduledEventRecord {
  id: string;
  name: string;
  type: string;
  status: EventStatus;
  localDeliveryTime: string;
  targetTimezones?: string[];
  topic: string;
  packages: string[];
  title: Record<LocaleKey, string>;
  body: Record<LocaleKey, string>;
  date?: string;
  recurrence?: string;
  sentTimezones: string[];
  lastResetAt?: Date | null;
  lastDispatchedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  createdBy?: string;
  updatedBy?: string;
}

export interface ScheduledEventForm {
  name: string;
  type: string;
  status: EventStatus;
  localDeliveryTime: string;
  targetTimezonesInput: string;
  topic: string;
  packages: string[];
  scheduleMode: ScheduleMode;
  date: string;
  weeklyDay: WeekdayKey;
  title: Record<LocaleKey, string>;
  body: Record<LocaleKey, string>;
}

export type WeekdayKey =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export const WEEKDAYS: WeekdayKey[] = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const DEFAULT_FORM: ScheduledEventForm = {
  name: "",
  type: "campaign",
  status: "scheduled",
  localDeliveryTime: "21:00",
  targetTimezonesInput: "",
  topic: "",
  packages: ["*"],
  scheduleMode: "daily",
  date: "",
  weeklyDay: "friday",
  title: { tr: "", en: "", de: "" },
  body: { tr: "", en: "", de: "" },
};

export type DeviceFinderItem = {
  id: string;
  packageName: string;
  locale: string;
  timezone: string;
  notificationsEnabled: boolean;
  deviceModel?: string;
  appVersion?: string;
  updatedAt?: Date | null;
  hasValidToken: boolean;
};

export type CoverageItem = {
  packageName: string;
  activeDeviceCount: number;
  totalDeviceCount: number;
};

export type DeviceCoverageReport = {
  days: number;
  generatedAt: string;
  byPackage: CoverageItem[];
  missingPackages: string[];
  stalePackages: string[];
};

export type AdPerformanceAlert = {
  appId: string;
  appLabel: string;
  format: string;
  adRequests: number;
  matchedRequests: number;
  impressions: number;
  fillRatePct: number;
  showRatePct: number;
  earningsTry: number;
  ecpmTry?: number;
  reasons: string[];
};

export type AdPerformanceReport = {
  generatedAt: string;
  rangeStart: string;
  rangeEnd: string;
  status: "ok" | "misconfigured" | "error";
  thresholds: {
    minRequests: number;
    fillRatePct: number;
    showRatePct: number;
  };
  totals: {
    earningsTry: number;
    ecpmTry?: number;
    adRequests: number;
    matchedRequests: number;
    impressions: number;
    fillRatePct: number;
    showRatePct: number;
  };
  alerts: AdPerformanceAlert[];
  issue?: string;
};

export type AdPerformanceToday = {
  generatedAt: string;
  date: string;
  status: "ok" | "misconfigured" | "error";
  totals: {
    earningsTry: number;
    ecpmTry?: number;
    adRequests: number;
    matchedRequests: number;
    impressions: number;
    fillRatePct: number;
    showRatePct: number;
  };
  issue?: string;
};

export type AdminAccessResponse = {
  authorized?: boolean;
  source?: "firestore" | "allowlist" | "none";
  email?: string | null;
  error?: string;
};

export type TestPushResult = {
  messageId: string;
  mode: string;
  targetType: TestPushTargetMode;
  installationId?: string | null;
  packageName?: string | null;
  locale?: string | null;
};

export const EVENT_STATUSES = ["scheduled", "paused", "sent", "expired"] as const;
