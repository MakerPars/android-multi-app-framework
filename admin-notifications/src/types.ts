export type LocaleKey = "tr" | "en" | "de";

export type EventStatus = "scheduled" | "paused" | "sent" | "expired";

export type ScheduleMode = "once" | "daily" | "weekly";

export interface ScheduledEventRecord {
  id: string;
  name: string;
  type: string;
  status: EventStatus;
  localDeliveryTime: string;
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
  topic: "",
  packages: ["*"],
  scheduleMode: "daily",
  date: "",
  weeklyDay: "friday",
  title: { tr: "", en: "", de: "" },
  body: { tr: "", en: "", de: "" },
};

