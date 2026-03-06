import { useEffect, useState } from "react";
import {
  Timestamp,
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "../firebase";
import { sortedApps, formatDateTime } from "../helpers";

type AnalyticsSummary = {
  totalDevices: number;
  activeDevices30d: number;
  notificationsEnabled30d: number;
  devicesByPackage: Array<{ packageName: string; count: number }>;
  recentCoverageReports: Array<{
    id: string;
    days: number;
    generatedAt: string;
    packageCount: number;
    totalActiveDevices: number;
    totalDevices: number;
  }>;
  loadedAt: string;
};

const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "makerpars-oaslananka-mobil";

export default function AnalyticsPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const now = Date.now();
        const activeSince = Timestamp.fromDate(new Date(now - 30 * 24 * 60 * 60 * 1000));

        const devicesRef = collection(firestore, "devices");
        const [
          totalCountSnap,
          activeCountSnap,
          notificationsEnabledSnap,
          devicesByPackage,
          coverageReportSnapshots,
        ] =
          await Promise.all([
            getCountFromServer(devicesRef),
            getCountFromServer(query(devicesRef, where("updatedAt", ">=", activeSince))),
            getCountFromServer(
              query(
                devicesRef,
                where("updatedAt", ">=", activeSince),
                where("notificationsEnabled", "==", true),
              ),
            ),
            Promise.all(
              sortedApps.map(async (app) => ({
                packageName: app.package,
                count: (
                  await getCountFromServer(
                    query(devicesRef, where("packageName", "==", app.package)),
                  )
                ).data().count,
              })),
            ),
            getDocs(
              query(collection(firestore, "coverage_reports"), orderBy("generatedAt", "desc"), limit(5)),
            ),
          ]);

        const recentCoverageReports = coverageReportSnapshots.docs.map((doc) => {
          const data = doc.data() as {
            days?: number;
            generatedAt?: string;
            byPackage?: Array<{ activeDeviceCount?: number; totalDeviceCount?: number }>;
          };
          const byPackage = Array.isArray(data.byPackage) ? data.byPackage : [];
          return {
            id: doc.id,
            days: typeof data.days === "number" ? data.days : 0,
            generatedAt: typeof data.generatedAt === "string" ? data.generatedAt : "",
            packageCount: byPackage.length,
            totalActiveDevices: byPackage.reduce(
              (sum, item) => sum + (typeof item.activeDeviceCount === "number" ? item.activeDeviceCount : 0),
              0,
            ),
            totalDevices: byPackage.reduce(
              (sum, item) => sum + (typeof item.totalDeviceCount === "number" ? item.totalDeviceCount : 0),
              0,
            ),
          };
        }).filter((item) => item.generatedAt);

        if (!cancelled) {
          setSummary({
            totalDevices: totalCountSnap.data().count,
            activeDevices30d: activeCountSnap.data().count,
            notificationsEnabled30d: notificationsEnabledSnap.data().count,
            devicesByPackage: devicesByPackage
              .filter((item) => item.count > 0)
              .sort((a, b) => b.count - a.count),
            recentCoverageReports,
            loadedAt: new Date().toISOString(),
          });
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load analytics summary.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="single-panel-grid"
      id="tabpanel-analytics"
      role="tabpanel"
      aria-labelledby="tab-analytics"
    >
      <main className="panel form-panel" role="main" aria-label="Analytics panel">
        <div className="panel-header">
          <h2>Analytics</h2>
        </div>

        <section className="subsection" aria-label="Push registration summary">
          <div className="coverage-box">
            <div className="device-preview-header">
              <strong>Push registration summary</strong>
              <span className="muted">{loading ? "Loading…" : summary ? `loaded ${formatDateTime(new Date(summary.loadedAt))}` : "not loaded"}</span>
            </div>

            <p className="muted">
              Current metrics come from Firestore <code>devices</code>. Deeper DAU, retention and event funnels remain in Firebase Analytics / BigQuery.
            </p>

            {error && <p className="inline-error" role="alert">{error}</p>}

            {summary && !error && (
              <>
                <div className="health-grid analytics-metric-grid">
                  <div className="health-card glass-card">
                    <div className="health-card-label">Total devices</div>
                    <div className="health-card-value">{summary.totalDevices}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Active 30d</div>
                    <div className="health-card-value">{summary.activeDevices30d}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Notifications enabled</div>
                    <div className="health-card-value">{summary.notificationsEnabled30d}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Enable rate</div>
                    <div className="health-card-value">
                      {summary.activeDevices30d > 0
                        ? `${((summary.notificationsEnabled30d / summary.activeDevices30d) * 100).toFixed(1)}%`
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Registered devices</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.devicesByPackage.map((item) => (
                        <tr key={item.packageName}>
                          <td><code>{item.packageName}</code></td>
                          <td>{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Coverage report</th>
                        <th>Generated</th>
                        <th>Package count</th>
                        <th>Active devices</th>
                        <th>Total devices</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.recentCoverageReports.length > 0 ? (
                        summary.recentCoverageReports.map((report) => (
                          <tr key={report.id}>
                            <td>{report.days}d snapshot</td>
                            <td>{formatDateTime(new Date(report.generatedAt))}</td>
                            <td>{report.packageCount}</td>
                            <td>{report.totalActiveDevices}</td>
                            <td>{report.totalDevices}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="muted">No coverage_reports documents found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="subsection health-cards" aria-label="Console links">
          <h3>Console links</h3>
          <div className="flavor-grid">
            {sortedApps.map((app) => (
              <article key={app.package} className="flavor-card glass-card">
                <div className="flavor-card-header">
                  <div>
                    <strong>{app.name ?? app.flavor}</strong>
                    <div className="muted">{app.package}</div>
                  </div>
                </div>
                <div className="flavor-links">
                  <a
                    className="btn-secondary"
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/analytics/app/android:${app.package}/dashboard`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Analytics
                  </a>
                  <a
                    className="btn-secondary"
                    href={`https://console.firebase.google.com/project/${firebaseProjectId}/crashlytics/app/android:${app.package}/issues`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Crashlytics
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
