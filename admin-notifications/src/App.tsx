import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
  type DocumentData,
} from "firebase/firestore";
import ciApps from "@ciapps";
import { auth, firestore, functionsBaseUrl, googleProvider } from "./firebase";
import {
  DEFAULT_FORM,
  WEEKDAYS,
  type LocaleKey,
  type ScheduledEventForm,
  type ScheduledEventRecord,
  type WeekdayKey,
} from "./types";

type LoadState = "loading" | "ready" | "error";

type AdminState = "checking" | "authorized" | "unauthorized";
type TestPushTargetMode = "installationId" | "token";

type DeviceFinderItem = {
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

const EVENT_STATUSES = ["scheduled", "paused", "sent", "expired"] as const;

function parseEventStatus(value: unknown): ScheduledEventRecord["status"] {
  if (typeof value === "string" && EVENT_STATUSES.includes(value as any)) {
    return value as ScheduledEventRecord["status"];
  }
  return "scheduled";
}

function toDate(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (value instanceof Timestamp) return value.toDate();
  return null;
}

function parseLocaleMap(value: unknown): Record<LocaleKey, string> {
  const input = (value && typeof value === "object" ? value : {}) as Record<string, unknown>;
  return {
    tr: typeof input.tr === "string" ? input.tr : "",
    en: typeof input.en === "string" ? input.en : "",
    de: typeof input.de === "string" ? input.de : "",
  };
}

function parseDeviceFinderItem(docId: string, raw: DocumentData): DeviceFinderItem {
  const token = typeof raw.fcmToken === "string" ? raw.fcmToken.trim() : "";
  return {
    id: docId,
    packageName: typeof raw.packageName === "string" ? raw.packageName : "",
    locale: typeof raw.locale === "string" ? raw.locale : "",
    timezone: typeof raw.timezone === "string" ? raw.timezone : "",
    notificationsEnabled:
      typeof raw.notificationsEnabled === "boolean" ? raw.notificationsEnabled : true,
    deviceModel: typeof raw.deviceModel === "string" ? raw.deviceModel : undefined,
    appVersion: typeof raw.appVersion === "string" ? raw.appVersion : undefined,
    updatedAt: toDate(raw.updatedAt),
    hasValidToken: token.length >= 80,
  };
}

function parseEvent(docId: string, raw: DocumentData): ScheduledEventRecord {
  return {
    id: docId,
    name: typeof raw.name === "string" ? raw.name : "",
    type: typeof raw.type === "string" ? raw.type : "campaign",
    status: parseEventStatus(raw.status),
    localDeliveryTime:
      typeof raw.localDeliveryTime === "string" ? raw.localDeliveryTime : "21:00",
    topic: typeof raw.topic === "string" ? raw.topic : "",
    packages: Array.isArray(raw.packages)
      ? raw.packages.filter((x: unknown): x is string => typeof x === "string")
      : ["*"],
    title: parseLocaleMap(raw.title),
    body: parseLocaleMap(raw.body),
    date: typeof raw.date === "string" ? raw.date : undefined,
    recurrence: typeof raw.recurrence === "string" ? raw.recurrence : undefined,
    sentTimezones: Array.isArray(raw.sentTimezones)
      ? raw.sentTimezones.filter((x: unknown): x is string => typeof x === "string")
      : [],
    lastResetAt: toDate(raw.lastResetAt),
    lastDispatchedAt: toDate(raw.lastDispatchedAt),
    createdAt: toDate(raw.createdAt),
    updatedAt: toDate(raw.updatedAt),
    createdBy: typeof raw.createdBy === "string" ? raw.createdBy : undefined,
    updatedBy: typeof raw.updatedBy === "string" ? raw.updatedBy : undefined,
  };
}

function formFromRecord(record: ScheduledEventRecord): ScheduledEventForm {
  let scheduleMode: ScheduledEventForm["scheduleMode"] = "daily";
  let weeklyDay: WeekdayKey = "friday";
  if (record.date) {
    scheduleMode = "once";
  } else if (record.recurrence?.startsWith("weekly:")) {
    scheduleMode = "weekly";
    const candidate = record.recurrence.split(":")[1] as WeekdayKey | undefined;
    if (candidate && WEEKDAYS.includes(candidate)) {
      weeklyDay = candidate;
    }
  } else if (record.recurrence === "daily") {
    scheduleMode = "daily";
  }

  return {
    name: record.name,
    type: record.type,
    status: record.status,
    localDeliveryTime: record.localDeliveryTime,
    topic: record.topic,
    packages: record.packages.length > 0 ? record.packages : ["*"],
    scheduleMode,
    date: record.date ?? "",
    weeklyDay,
    title: { ...record.title },
    body: { ...record.body },
  };
}

function buildPayload(form: ScheduledEventForm, user: User, isCreate: boolean) {
  const base: Record<string, unknown> = {
    name: form.name.trim(),
    type: form.type.trim(),
    status: form.status,
    localDeliveryTime: form.localDeliveryTime.trim(),
    topic: form.topic.trim() || null,
    packages: normalizePackages(form.packages),
    title: {
      tr: form.title.tr.trim(),
      en: form.title.en.trim(),
      de: form.title.de.trim(),
    },
    body: {
      tr: form.body.tr.trim(),
      en: form.body.en.trim(),
      de: form.body.de.trim(),
    },
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  };

  if (form.scheduleMode === "once") {
    base.date = form.date.trim();
    base.recurrence = null;
  } else if (form.scheduleMode === "daily") {
    base.date = null;
    base.recurrence = "daily";
  } else {
    base.date = null;
    base.recurrence = `weekly:${form.weeklyDay}`;
  }

  if (isCreate) {
    base.sentTimezones = [];
    base.lastResetAt = null;
    base.lastDispatchedAt = null;
    base.createdAt = serverTimestamp();
    base.createdBy = user.uid;
  }

  return base;
}

function normalizePackages(packages: string[]): string[] {
  if (packages.includes("*")) return ["*"];
  return [...new Set(packages)].sort();
}

function validateForm(form: ScheduledEventForm): string | null {
  if (!form.name.trim()) return "Event name is required.";
  if (!form.type.trim()) return "Type is required.";
  if (!/^\d{2}:\d{2}$/.test(form.localDeliveryTime.trim())) {
    return "Local delivery time must be HH:mm.";
  }
  if (form.scheduleMode === "once" && !form.date.trim()) {
    return "Date is required for one-time events.";
  }
  if (!form.title.tr.trim()) return "TR title is required.";
  if (!form.body.tr.trim()) return "TR body is required.";
  if (normalizePackages(form.packages).length === 0) {
    return "At least one target package or '*' is required.";
  }
  return null;
}

function parseTestPushDataInput(raw: string): { data: Record<string, string> | null; error: string | null } {
  const lines = raw
    .split(/\r?\n/g)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { data: null, error: null };
  }

  const data: Record<string, string> = {};
  for (const line of lines) {
    const idx = line.indexOf("=");
    if (idx <= 0) {
      return { data: null, error: `Invalid data line (expected key=value): ${line}` };
    }
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1);
    if (!key) {
      return { data: null, error: `Invalid empty data key: ${line}` };
    }
    data[key] = value;
  }

  return { data, error: null };
}

function summarizeApiError(errorPayload: unknown, fallback: string): string {
  if (
    errorPayload &&
    typeof errorPayload === "object" &&
    "error" in errorPayload &&
    typeof (errorPayload as { error?: unknown }).error === "string"
  ) {
    return (errorPayload as { error: string }).error;
  }
  return fallback;
}

function formatDateTime(date?: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function scheduleLabel(record: ScheduledEventRecord): string {
  if (record.date) return `Once: ${record.date} @ ${record.localDeliveryTime}`;
  if (record.recurrence) return `${record.recurrence} @ ${record.localDeliveryTime}`;
  return `@ ${record.localDeliveryTime}`;
}

function packageLabel(packages: string[]): string {
  if (packages.includes("*")) return "All apps (*)";
  return `${packages.length} app(s)`;
}

const sortedApps = [...ciApps].sort((a, b) => a.flavor.localeCompare(b.flavor));

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authState, setAuthState] = useState<LoadState>("loading");
  const [adminState, setAdminState] = useState<AdminState>("checking");
  const [events, setEvents] = useState<ScheduledEventRecord[]>([]);
  const [eventsState, setEventsState] = useState<LoadState>("loading");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<ScheduledEventForm>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewCount, setPreviewCount] = useState<number | null>(null);
  const [previewByPackage, setPreviewByPackage] = useState<Record<string, number>>({});
  const [previewError, setPreviewError] = useState<string>("");
  const [testPushTargetMode, setTestPushTargetMode] = useState<TestPushTargetMode>("installationId");
  const [testPushInstallationId, setTestPushInstallationId] = useState("");
  const [testPushToken, setTestPushToken] = useState("");
  const [testPushTitle, setTestPushTitle] = useState("Test Bildirim");
  const [testPushBody, setTestPushBody] = useState("Admin panel test bildirimi");
  const [testPushDataInput, setTestPushDataInput] = useState("type=test");
  const [testPushIncludeNotification, setTestPushIncludeNotification] = useState(false);
  const [testPushLoading, setTestPushLoading] = useState(false);
  const [testPushError, setTestPushError] = useState("");
  const [deviceFinderLoading, setDeviceFinderLoading] = useState(false);
  const [deviceFinderError, setDeviceFinderError] = useState("");
  const [deviceFinderMessage, setDeviceFinderMessage] = useState("");
  const [deviceFinderSearch, setDeviceFinderSearch] = useState("");
  const [deviceFinderResults, setDeviceFinderResults] = useState<DeviceFinderItem[]>([]);
  const [testPushResult, setTestPushResult] = useState<{
    messageId: string;
    mode: string;
    targetType: TestPushTargetMode;
    installationId?: string | null;
    packageName?: string | null;
    locale?: string | null;
  } | null>(null);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      async (nextUser) => {
        setUser(nextUser);
        setAuthState("ready");
        setEvents([]);
        setSelectedId(null);
        setEventsState("loading");
        setAdminState(nextUser ? "checking" : "unauthorized");
        if (!nextUser) return;

        try {
          const adminDoc = await getDoc(doc(firestore, "admins", nextUser.uid));
          setAdminState(adminDoc.exists() ? "authorized" : "unauthorized");
        } catch (e) {
          console.error(e);
          setError("Failed to verify admin access.");
          setAdminState("unauthorized");
        }
      },
      (authError) => {
        console.error(authError);
        setAuthState("error");
        setError("Firebase Auth initialization failed.");
      },
    );
    return () => unsub();
  }, []);

  useEffect(() => {
    if (adminState !== "authorized") return;
    setEventsState("loading");
    const q = query(collection(firestore, "scheduled_events"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const nextEvents = snap.docs.map((d) => parseEvent(d.id, d.data()));
        setEvents(nextEvents);
        setEventsState("ready");

        if (selectedId) {
          const selected = nextEvents.find((e) => e.id === selectedId);
          if (selected) {
            setForm(formFromRecord(selected));
            return;
          }
        }

        if (!selectedId && nextEvents.length > 0) {
          setSelectedId(nextEvents[0].id);
          setForm(formFromRecord(nextEvents[0]));
        }
      },
      (snapshotError) => {
        console.error(snapshotError);
        setEventsState("error");
        setError("Failed to load scheduled_events.");
      },
    );
    return () => unsub();
  }, [adminState, selectedId]);

  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedId) ?? null,
    [events, selectedId],
  );
  const filteredDeviceFinderResults = useMemo(() => {
    const needle = deviceFinderSearch.trim().toLowerCase();
    if (!needle) return deviceFinderResults;
    return deviceFinderResults.filter((item) =>
      item.id.toLowerCase().includes(needle) ||
      item.packageName.toLowerCase().includes(needle) ||
      (item.deviceModel ?? "").toLowerCase().includes(needle) ||
      (item.locale ?? "").toLowerCase().includes(needle),
    );
  }, [deviceFinderResults, deviceFinderSearch]);

  const isCreateMode = selectedId === null;

  const resetForm = () => {
    setSelectedId(null);
    setForm(DEFAULT_FORM);
    setError("");
    setMessage("");
  };

  const selectEvent = (event: ScheduledEventRecord) => {
    setSelectedId(event.id);
    setForm(formFromRecord(event));
    setError("");
    setMessage("");
  };

  const handleSignIn = async () => {
    setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error(e);
      setError("Google sign-in failed.");
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    resetForm();
  };

  const saveEvent = async () => {
    if (!user) return;
    const validation = validateForm(form);
    if (validation) {
      setError(validation);
      return;
    }
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = buildPayload(form, user, isCreateMode);
      if (isCreateMode) {
        const ref = await addDoc(collection(firestore, "scheduled_events"), payload);
        setSelectedId(ref.id);
        setMessage("Event created.");
      } else if (selectedId) {
        await setDoc(doc(firestore, "scheduled_events", selectedId), payload, { merge: true });
        setMessage("Event updated.");
      }
    } catch (e) {
      console.error(e);
      setError("Failed to save event.");
    } finally {
      setSaving(false);
    }
  };

  const removeEvent = async () => {
    if (!selectedId) return;
    const ok = window.confirm("Delete this scheduled event?");
    if (!ok) return;
    setDeleting(true);
    setError("");
    setMessage("");
    try {
      await deleteDoc(doc(firestore, "scheduled_events", selectedId));
      setMessage("Event deleted.");
      resetForm();
    } catch (e) {
      console.error(e);
      setError("Failed to delete event.");
    } finally {
      setDeleting(false);
    }
  };

  const updatePackages = (packageName: string, checked: boolean) => {
    setForm((prev) => {
      if (packageName === "*") {
        return { ...prev, packages: checked ? ["*"] : [] };
      }
      const withoutAll = prev.packages.filter((x) => x !== "*");
      const next = checked
        ? [...withoutAll, packageName]
        : withoutAll.filter((x) => x !== packageName);
      return { ...prev, packages: normalizePackages(next) };
    });
  };

  const previewTargetDevices = async () => {
    setPreviewLoading(true);
    setPreviewError("");
    setPreviewCount(null);
    setPreviewByPackage({});
    try {
      const normalizedPackages = normalizePackages(form.packages);
      if (normalizedPackages.length === 0) {
        setPreviewCount(0);
        return;
      }

      if (normalizedPackages.includes("*")) {
        const snap = await getDocs(
          query(collection(firestore, "devices"), where("notificationsEnabled", "==", true)),
        );
        setPreviewCount(snap.size);
        return;
      }

      let total = 0;
      const breakdown: Record<string, number> = {};
      for (const packageName of normalizedPackages) {
        const snap = await getDocs(
          query(
            collection(firestore, "devices"),
            where("notificationsEnabled", "==", true),
            where("packageName", "==", packageName),
          ),
        );
        breakdown[packageName] = snap.size;
        total += snap.size;
      }
      setPreviewByPackage(breakdown);
      setPreviewCount(total);
    } catch (e) {
      console.error(e);
      setPreviewError(
        "Failed to preview target devices. Check Firestore rules/admin access for devices read.",
      );
    } finally {
      setPreviewLoading(false);
    }
  };

  const useDeviceForTestPush = (device: DeviceFinderItem) => {
    setTestPushTargetMode("installationId");
    setTestPushInstallationId(device.id);
    setDeviceFinderMessage(
      `Selected ${device.id}${device.packageName ? ` (${device.packageName})` : ""}`,
    );
    setTestPushError("");
    setTestPushResult(null);
  };

  const lookupDeviceByInstallationId = async () => {
    const installationId = testPushInstallationId.trim();
    if (!installationId) {
      setDeviceFinderError("Enter a Cihaz Kimliği (installationId) first.");
      return;
    }

    setDeviceFinderLoading(true);
    setDeviceFinderError("");
    setDeviceFinderMessage("");
    try {
      const snap = await getDoc(doc(firestore, "devices", installationId));
      if (!snap.exists()) {
        setDeviceFinderResults([]);
        setDeviceFinderError(`No device found for installationId: ${installationId}`);
        return;
      }

      const item = parseDeviceFinderItem(snap.id, snap.data());
      setDeviceFinderResults([item]);
      setDeviceFinderMessage(
        `Device found${item.hasValidToken ? "" : " (warning: no valid FCM token on record)"}.`,
      );
    } catch (e) {
      console.error(e);
      setDeviceFinderError("Failed to lookup device by installationId.");
    } finally {
      setDeviceFinderLoading(false);
    }
  };

  const loadRecentDevices = async () => {
    setDeviceFinderLoading(true);
    setDeviceFinderError("");
    setDeviceFinderMessage("");
    try {
      const snap = await getDocs(
        query(collection(firestore, "devices"), orderBy("updatedAt", "desc"), limit(30)),
      );
      const items = snap.docs.map((d) => parseDeviceFinderItem(d.id, d.data()));
      setDeviceFinderResults(items);
      setDeviceFinderMessage(`Loaded ${items.length} recent device record(s).`);
    } catch (e) {
      console.error(e);
      setDeviceFinderError(
        "Failed to load recent devices. Check Firestore rules or indexes if this persists.",
      );
    } finally {
      setDeviceFinderLoading(false);
    }
  };

  const sendTestPushToSingleDevice = async () => {
    if (!user) return;

    const token = testPushToken.trim();
    const installationId = testPushInstallationId.trim();
    const targetValue = testPushTargetMode === "token" ? token : installationId;
    if (!targetValue) {
      setTestPushError(
        testPushTargetMode === "token"
          ? "Device token is required."
          : "Cihaz Kimliği (installationId) is required.",
      );
      setTestPushResult(null);
      return;
    }

    const parsedData = parseTestPushDataInput(testPushDataInput);
    if (parsedData.error) {
      setTestPushError(parsedData.error);
      setTestPushResult(null);
      return;
    }

    setTestPushLoading(true);
    setTestPushError("");
    setTestPushResult(null);

    try {
      const idToken = await user.getIdToken();
      const response = await fetch(`${functionsBaseUrl}/sendTestNotification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...(testPushTargetMode === "token" ? { token } : { installationId }),
          title: testPushTitle,
          body: testPushBody,
          data: parsedData.data ?? undefined,
          useNotificationPayload: testPushIncludeNotification,
        }),
      });

      let responseBody: unknown = null;
      try {
        responseBody = await response.json();
      } catch {
        responseBody = null;
      }

      if (!response.ok) {
        throw new Error(
          summarizeApiError(responseBody, `HTTP ${response.status}: Failed to send test push`),
        );
      }

      const payload = responseBody as {
        messageId?: unknown;
        mode?: unknown;
        targetType?: unknown;
        installationId?: unknown;
        packageName?: unknown;
        locale?: unknown;
      };
      const messageId = typeof payload.messageId === "string" ? payload.messageId : "(unknown)";
      const mode = typeof payload.mode === "string" ? payload.mode : "data-only";
      const targetType =
        payload.targetType === "token" || payload.targetType === "installationId"
          ? payload.targetType
          : testPushTargetMode;
      setTestPushResult({
        messageId,
        mode,
        targetType,
        installationId:
          typeof payload.installationId === "string" || payload.installationId === null
            ? payload.installationId
            : null,
        packageName:
          typeof payload.packageName === "string" || payload.packageName === null
            ? payload.packageName
            : null,
        locale: typeof payload.locale === "string" || payload.locale === null ? payload.locale : null,
      });
    } catch (e) {
      console.error(e);
      const message = e instanceof Error ? e.message : "Failed to send test push.";
      setTestPushError(message);
    } finally {
      setTestPushLoading(false);
    }
  };

  if (authState === "loading") {
    return <div className="center-screen">Loading Firebase Auth…</div>;
  }

  if (authState === "error") {
    return <div className="center-screen error">Auth init failed. Check console.</div>;
  }

  if (!user) {
    return (
      <div className="center-screen">
        <div className="auth-card">
          <h1>Notifications Admin</h1>
          <p>Sign in with Google to manage scheduled push events.</p>
          <button onClick={handleSignIn}>Sign in with Google</button>
          {error && <p className="inline-error">{error}</p>}
        </div>
      </div>
    );
  }

  if (adminState === "checking") {
    return <div className="center-screen">Checking admin access…</div>;
  }

  if (adminState === "unauthorized") {
    return (
      <div className="center-screen">
        <div className="auth-card">
          <h1>Access denied</h1>
          <p>{user.email ?? user.uid} is not in the Firestore <code>admins</code> list.</p>
          <button onClick={handleSignOut}>Sign out</button>
          {error && <p className="inline-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>Notifications Admin</h1>
          <p>Manage Firestore <code>scheduled_events</code> used by dispatchNotifications.</p>
        </div>
        <div className="topbar-actions">
          <div className="user-pill">{user.email ?? user.uid}</div>
          <button className="secondary" onClick={handleSignOut}>Sign out</button>
        </div>
      </header>

      {(error || message) && (
        <div className={`banner ${error ? "banner-error" : "banner-success"}`}>
          {error || message}
        </div>
      )}

      <div className="content-grid">
        <aside className="panel list-panel">
          <div className="panel-header">
            <h2>Scheduled events</h2>
            <button className="secondary" onClick={resetForm}>New event</button>
          </div>
          {eventsState === "loading" && <p className="muted">Loading events…</p>}
          {eventsState === "error" && <p className="inline-error">Failed to load events.</p>}
          {eventsState === "ready" && events.length === 0 && (
            <p className="muted">No scheduled_events documents yet.</p>
          )}
          <div className="event-list">
            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                className={`event-card ${selectedId === event.id ? "active" : ""}`}
                onClick={() => selectEvent(event)}
              >
                <div className="event-card-top">
                  <strong>{event.name || "(untitled)"}</strong>
                  <span className={`status-pill status-${event.status}`}>{event.status}</span>
                </div>
                <div className="event-card-meta">{event.type} · {scheduleLabel(event)}</div>
                <div className="event-card-meta">{packageLabel(event.packages)}</div>
                <div className="event-card-meta">
                  sentTimezones={event.sentTimezones.length} · updated {formatDateTime(event.updatedAt)}
                </div>
              </button>
            ))}
          </div>
        </aside>

        <main className="panel form-panel">
          <div className="panel-header">
            <h2>{isCreateMode ? "Create event" : "Edit event"}</h2>
            {!isCreateMode && (
              <button className="danger" onClick={removeEvent} disabled={deleting || saving}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            )}
          </div>

          <div className="form-grid">
            <label>
              Event name
              <input
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Friday reminder"
              />
            </label>

            <label>
              Type
              <input
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                placeholder="campaign"
              />
            </label>

            <label>
              Status
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as any }))}
              >
                <option value="scheduled">scheduled</option>
                <option value="paused">paused</option>
                <option value="sent">sent</option>
                <option value="expired">expired</option>
              </select>
            </label>

            <label>
              Local delivery time
              <input
                type="time"
                value={form.localDeliveryTime}
                onChange={(e) => setForm((p) => ({ ...p, localDeliveryTime: e.target.value }))}
              />
            </label>

            <label>
              Topic (optional, metadata-only for now)
              <input
                value={form.topic}
                onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                placeholder="dini-bildirim"
              />
              <small className="muted">
                Scheduler currently uses timezone/device targeting. Topic is stored for future use / manual sends.
              </small>
            </label>

            <label>
              Schedule mode
              <select
                value={form.scheduleMode}
                onChange={(e) =>
                  setForm((p) => ({ ...p, scheduleMode: e.target.value as any }))
                }
              >
                <option value="daily">daily</option>
                <option value="weekly">weekly</option>
                <option value="once">once</option>
              </select>
            </label>

            {form.scheduleMode === "weekly" && (
              <label>
                Weekly day
                <select
                  value={form.weeklyDay}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, weeklyDay: e.target.value as WeekdayKey }))
                  }
                >
                  {WEEKDAYS.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </label>
            )}

            {form.scheduleMode === "once" && (
              <label>
                Date
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </label>
            )}
          </div>

          <section className="subsection">
            <h3>Target apps</h3>
            <div className="checkbox-grid">
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.packages.includes("*")}
                  onChange={(e) => updatePackages("*", e.target.checked)}
                />
                All apps (*)
              </label>
              {sortedApps.map((app) => {
                const disabled = form.packages.includes("*");
                return (
                  <label key={app.package} className={`checkbox-row ${disabled ? "disabled" : ""}`}>
                    <input
                      type="checkbox"
                      checked={!disabled && form.packages.includes(app.package)}
                      disabled={disabled}
                      onChange={(e) => updatePackages(app.package, e.target.checked)}
                    />
                    <span>{app.flavor}</span>
                    <small>{app.package}</small>
                  </label>
                );
              })}
            </div>
            <div className="device-preview-box">
              <div className="device-preview-header">
                <strong>Target device preview</strong>
                <button
                  type="button"
                  className="secondary"
                  onClick={previewTargetDevices}
                  disabled={previewLoading}
                >
                  {previewLoading ? "Checking…" : "Preview target device count"}
                </button>
              </div>
              <p className="muted device-preview-note">
                Estimate only: actual dispatch also filters by timezone, schedule date, recurrence,
                and sentTimezones.
              </p>
              {previewError && <p className="inline-error">{previewError}</p>}
              {previewCount != null && !previewError && (
                <div className="device-preview-result">
                  <div className="device-preview-total">
                    <span>Estimated target devices</span>
                    <strong>{previewCount}</strong>
                  </div>
                  {!normalizePackages(form.packages).includes("*") &&
                    Object.keys(previewByPackage).length > 0 && (
                      <ul className="device-preview-list">
                        {Object.entries(previewByPackage).map(([pkg, count]) => (
                          <li key={pkg}>
                            <code>{pkg}</code>
                            <span>{count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </div>
          </section>

          <section className="subsection">
            <div className="test-push-box">
              <div className="device-preview-header">
                <strong>Single-device test push</strong>
                <button
                  type="button"
                  onClick={sendTestPushToSingleDevice}
                  disabled={testPushLoading}
                >
                  {testPushLoading ? "Sending…" : "Send test push"}
                </button>
              </div>

              <p className="muted device-preview-note">
                Sends a test push to exactly one device via admin-only Cloud Function (FCM token or
                Cihaz Kimliği / installationId).
              </p>

              <div className="test-push-grid">
                <label>
                  Target type
                  <select
                    value={testPushTargetMode}
                    onChange={(e) =>
                      setTestPushTargetMode(e.target.value as TestPushTargetMode)
                    }
                  >
                    <option value="installationId">Cihaz Kimliği (installationId)</option>
                    <option value="token">FCM device token</option>
                  </select>
                </label>

                <label className="test-push-token">
                  {testPushTargetMode === "token"
                    ? "FCM device token"
                    : "Cihaz Kimliği (installationId)"}
                  <textarea
                    rows={3}
                    value={testPushTargetMode === "token" ? testPushToken : testPushInstallationId}
                    onChange={(e) =>
                      testPushTargetMode === "token"
                        ? setTestPushToken(e.target.value)
                        : setTestPushInstallationId(e.target.value)
                    }
                    placeholder={
                      testPushTargetMode === "token"
                        ? "FCM registration token"
                        : "Uygulama içindeki 'Cihaz Kimliği' değeri"
                    }
                  />
                </label>

                <div className="device-finder-box">
                  <div className="device-finder-header">
                    <strong>Device finder (Firestore `devices`)</strong>
                    <div className="device-finder-actions">
                      <button
                        type="button"
                        className="secondary"
                        onClick={lookupDeviceByInstallationId}
                        disabled={deviceFinderLoading}
                      >
                        {deviceFinderLoading ? "Checking…" : "Find by Cihaz Kimliği"}
                      </button>
                      <button
                        type="button"
                        className="secondary"
                        onClick={loadRecentDevices}
                        disabled={deviceFinderLoading}
                      >
                        {deviceFinderLoading ? "Loading…" : "Load recent devices"}
                      </button>
                    </div>
                  </div>

                  <label>
                    Filter results
                    <input
                      value={deviceFinderSearch}
                      onChange={(e) => setDeviceFinderSearch(e.target.value)}
                      placeholder="installationId / package / model / locale"
                    />
                  </label>

                  {deviceFinderError && <p className="inline-error">{deviceFinderError}</p>}
                  {deviceFinderMessage && !deviceFinderError && (
                    <p className="muted">{deviceFinderMessage}</p>
                  )}

                  {filteredDeviceFinderResults.length > 0 && (
                    <div className="device-finder-list">
                      {filteredDeviceFinderResults.map((device) => (
                        <div key={device.id} className="device-finder-item">
                          <div className="device-finder-item-main">
                            <code>{device.id}</code>
                            <span>
                              {device.packageName || "(no package)"} · {device.locale || "-"} ·{" "}
                              {device.timezone || "-"}
                            </span>
                            <small>
                              {device.deviceModel || "Unknown device"} · v
                              {device.appVersion || "?"} · updated {formatDateTime(device.updatedAt)}
                            </small>
                            {!device.hasValidToken && (
                              <small className="inline-error">
                                Warning: record has no valid FCM token
                              </small>
                            )}
                          </div>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => useDeviceForTestPush(device)}
                          >
                            Use this device
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <label>
                  Title
                  <input
                    value={testPushTitle}
                    onChange={(e) => setTestPushTitle(e.target.value)}
                    placeholder="Test Bildirim"
                  />
                </label>

                <label>
                  Body
                  <textarea
                    rows={3}
                    value={testPushBody}
                    onChange={(e) => setTestPushBody(e.target.value)}
                    placeholder="Admin panel test bildirimi"
                  />
                </label>

                <label>
                  Data payload (key=value per line)
                  <textarea
                    rows={4}
                    value={testPushDataInput}
                    onChange={(e) => setTestPushDataInput(e.target.value)}
                    placeholder={"type=test\nsource=admin-panel"}
                  />
                </label>

                <label className="checkbox-row test-push-checkbox">
                  <input
                    type="checkbox"
                    checked={testPushIncludeNotification}
                    onChange={(e) => setTestPushIncludeNotification(e.target.checked)}
                  />
                  <span>Include notification payload (otherwise data-only)</span>
                  <small>
                    Data-only is recommended for in-app persistence checks. Notification+data tests system UI behavior.
                  </small>
                </label>
              </div>

              {testPushError && <p className="inline-error">{testPushError}</p>}
              {testPushResult && !testPushError && (
                <div className="test-push-result">
                  <span>Sent successfully</span>
                  <strong>{testPushResult.mode}</strong>
                  <div>
                    target={testPushResult.targetType}
                    {testPushResult.installationId ? ` · installationId=${testPushResult.installationId}` : ""}
                  </div>
                  {(testPushResult.packageName || testPushResult.locale) && (
                    <div>
                      {testPushResult.packageName ? `pkg=${testPushResult.packageName}` : "pkg=-"}
                      {" · "}
                      {testPushResult.locale ? `locale=${testPushResult.locale}` : "locale=-"}
                    </div>
                  )}
                  <code>{testPushResult.messageId}</code>
                </div>
              )}
            </div>
          </section>

          <section className="subsection locale-grid">
            {(["tr", "en", "de"] as LocaleKey[]).map((locale) => (
              <div key={locale} className="locale-card">
                <h3>{locale.toUpperCase()}</h3>
                <label>
                  Title
                  <input
                    value={form.title[locale]}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        title: { ...p.title, [locale]: e.target.value },
                      }))
                    }
                  />
                </label>
                <label>
                  Body
                  <textarea
                    value={form.body[locale]}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        body: { ...p.body, [locale]: e.target.value },
                      }))
                    }
                    rows={4}
                  />
                </label>
              </div>
            ))}
          </section>

          <section className="subsection preview-grid">
            <div>
              <h3>Preview</h3>
              <div className="preview-cards">
                {(["tr", "en", "de"] as LocaleKey[]).map((locale) => (
                  <div key={locale} className="preview-card">
                    <div className="preview-locale">{locale.toUpperCase()}</div>
                    <div className="preview-title">{form.title[locale] || "(empty title)"}</div>
                    <div className="preview-body">{form.body[locale] || "(empty body)"}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3>Dispatch metadata</h3>
              <dl className="meta-list">
                <dt>sentTimezones</dt>
                <dd>{selectedEvent?.sentTimezones.length ?? 0}</dd>
                <dt>lastResetAt</dt>
                <dd>{formatDateTime(selectedEvent?.lastResetAt)}</dd>
                <dt>lastDispatchedAt</dt>
                <dd>{formatDateTime(selectedEvent?.lastDispatchedAt)}</dd>
                <dt>createdAt</dt>
                <dd>{formatDateTime(selectedEvent?.createdAt)}</dd>
                <dt>updatedAt</dt>
                <dd>{formatDateTime(selectedEvent?.updatedAt)}</dd>
                <dt>createdBy</dt>
                <dd>{selectedEvent?.createdBy ?? "-"}</dd>
                <dt>updatedBy</dt>
                <dd>{selectedEvent?.updatedBy ?? "-"}</dd>
              </dl>
            </div>
          </section>

          <div className="form-actions">
            <button onClick={saveEvent} disabled={saving || deleting}>
              {saving ? "Saving…" : isCreateMode ? "Create event" : "Save changes"}
            </button>
            <button className="secondary" onClick={resetForm} disabled={saving || deleting}>
              Reset form
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
