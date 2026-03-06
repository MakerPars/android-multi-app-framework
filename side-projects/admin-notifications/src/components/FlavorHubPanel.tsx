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
import { formatDateTime, parseFlavorVersions, sortedApps } from "../helpers";

type CoverageSnapshot = {
  days: number;
  generatedAt: string;
  byPackage: Array<{
    packageName: string;
    activeDeviceCount: number;
    totalDeviceCount: number;
  }>;
};

type FlavorHubState = {
  loadedAt: string;
  source: "coverage_reports" | "devices";
  coverage: Record<string, { active: number; total: number }>;
};

const flavorVersions = parseFlavorVersions();
const firebaseConsoleUrl = "https://console.firebase.google.com/project/makerpars-oaslananka-mobil/overview";
const playConsoleBaseUrl = "https://play.google.com/console/u/0/developers";

export default function FlavorHubPanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = useState<FlavorHubState | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const latestCoverage = await loadLatestCoverageSnapshot();
        if (latestCoverage) {
          const coverage = Object.fromEntries(
            latestCoverage.byPackage.map((item) => [
              item.packageName,
              { active: item.activeDeviceCount, total: item.totalDeviceCount },
            ]),
          );

          if (!cancelled) {
            setState({
              loadedAt: latestCoverage.generatedAt,
              source: "coverage_reports",
              coverage,
            });
          }
          return;
        }

        const fallbackCoverage = await loadCoverageFromDevices();
        if (!cancelled) {
          setState({
            loadedAt: new Date().toISOString(),
            source: "devices",
            coverage: fallbackCoverage,
          });
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load flavor coverage.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      className="single-panel-grid"
      id="tabpanel-flavor-hub"
      role="tabpanel"
      aria-labelledby="tab-flavor-hub"
    >
      <main className="panel form-panel" role="main" aria-label="Flavor Hub panel">
        <div className="panel-header">
          <h2>Flavor Hub</h2>
        </div>

        <section className="subsection" aria-label="Flavor inventory">
          <div className="coverage-box">
            <div className="device-preview-header">
              <strong>Android app inventory</strong>
              <span className="muted">
                {loading
                  ? "Loading…"
                  : state
                    ? `${sortedApps.length} flavors · ${state.source === "coverage_reports" ? "coverage_reports" : "devices"}`
                    : `${sortedApps.length} flavors`}
              </span>
            </div>
            <p className="muted">
              Version data comes from <code>VITE_FLAVOR_VERSIONS</code>. If blank, run{" "}
              <code>npm run inject:flavor-versions</code> and append the output to your admin env.
            </p>
            {state && (
              <p className="muted">
                Coverage source <code>{state.source}</code> · loaded {formatDateTime(new Date(state.loadedAt))}
              </p>
            )}
            {error && <p className="inline-error" role="alert">{error}</p>}

            <div className="flavor-grid" role="list" aria-label="Flavor inventory">
              {sortedApps.map((app) => {
                const versionInfo = flavorVersions[app.flavor] ?? {};
                const coverage = state?.coverage[app.package];
                const activeDevices = coverage?.active ?? 0;
                const totalDevices = coverage?.total ?? 0;
                const coverageRate = totalDevices > 0
                  ? `${((activeDevices / totalDevices) * 100).toFixed(1)}%`
                  : "-";
                return (
                  <article key={app.package} className="flavor-card glass-card" role="listitem">
                    <div className="flavor-card-header">
                      <div>
                        <strong>{app.name}</strong>
                        <div className="muted">{app.flavor}</div>
                      </div>
                      <span className="status-pill status-scheduled">Android</span>
                    </div>

                    <dl className="meta-list">
                      <dt>Package</dt>
                      <dd><code>{app.package}</code></dd>
                      <dt>Version</dt>
                      <dd>{versionInfo.versionName ?? "-"}</dd>
                      <dt>Version code</dt>
                      <dd>{versionInfo.versionCode ?? "-"}</dd>
                      <dt>Active devices (30d)</dt>
                      <dd>{activeDevices}</dd>
                      <dt>Total devices</dt>
                      <dd>{totalDevices}</dd>
                      <dt>Push coverage</dt>
                      <dd>{coverageRate}</dd>
                      <dt>AdMob App ID</dt>
                      <dd><code>{app.admob_app_id}</code></dd>
                    </dl>

                    <div className="flavor-links">
                      <a
                        className="btn-secondary"
                        href={`https://play.google.com/store/apps/details?id=${app.package}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Play Store
                      </a>
                      <a
                        className="btn-secondary"
                        href={firebaseConsoleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Firebase
                      </a>
                      <a
                        className="btn-secondary"
                        href={playConsoleBaseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Play Console
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

async function loadLatestCoverageSnapshot(): Promise<CoverageSnapshot | null> {
  const snapshot = await getDocs(
    query(collection(firestore, "coverage_reports"), orderBy("generatedAt", "desc"), limit(5)),
  );

  if (snapshot.empty) {
    return null;
  }

  const docs = snapshot.docs
    .map((doc) => doc.data() as CoverageSnapshot)
    .filter((item) => Array.isArray(item.byPackage) && typeof item.generatedAt === "string");

  return docs.find((item) => item.days === 30) ?? docs[0] ?? null;
}

async function loadCoverageFromDevices(): Promise<Record<string, { active: number; total: number }>> {
  const devicesRef = collection(firestore, "devices");
  const activeSince = Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));

  const coverageEntries = await Promise.all(
    sortedApps.map(async (app) => {
      const [totalCountSnap, activeCountSnap] = await Promise.all([
        getCountFromServer(query(devicesRef, where("packageName", "==", app.package))),
        getCountFromServer(
          query(
            devicesRef,
            where("packageName", "==", app.package),
            where("updatedAt", ">=", activeSince),
          ),
        ),
      ]);

      return [
        app.package,
        {
          active: activeCountSnap.data().count,
          total: totalCountSnap.data().count,
        },
      ] as const;
    }),
  );

  return Object.fromEntries(coverageEntries);
}
