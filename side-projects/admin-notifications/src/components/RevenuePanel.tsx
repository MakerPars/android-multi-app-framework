import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase";
import { formatDateTime, formatPercent, formatTry, sortedApps } from "../helpers";
import type { AdPerformanceReport } from "../types";

type RevenueSummary = {
  activeSubscriptions: number;
  verifiedSubscriptions: number;
  verifiedInAppPurchases: number;
  monthlyVerifiedPurchases: number;
  monthlyVerifiedRevenueTry: number;
  adRevenueTodayTry: number;
  adRevenueRangeTry: number;
  totalTrackedRevenueTry: number;
  purchasesByPackage: Array<{
    packageName: string;
    count: number;
    revenueTry: number;
  }>;
  adAlerts: AdPerformanceReport["alerts"];
  reportGeneratedAt?: string;
  reportRangeLabel?: string;
  loadedAt: string;
};

const admobAccountUrl =
  "https://admob.google.com/v2/home?utm_source=admin-panel&utm_medium=deep-link";
const playConsoleUrl =
  "https://play.google.com/console/u/0/developers/makerpars-oaslananka-mobil";

function toMillis(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function inferRevenueTry(raw: Record<string, unknown>): number {
  const candidates = [
    raw.priceAmountTry,
    raw.amountTry,
    raw.revenueTry,
    raw.localizedPriceTry,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }
    if (typeof candidate === "string" && candidate.trim() !== "") {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

export default function RevenuePanel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<RevenueSummary | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const now = Date.now();
        const monthStart = new Date();
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const [purchaseDocs, adReportDocs] = await Promise.all([
          getDocs(query(collection(firestore, "purchase_verifications"), where("verified", "==", true))),
          getDocs(collection(firestore, "ad_performance_reports")),
        ]);

        const purchasesByPackage = new Map<string, { count: number; revenueTry: number }>();
        let activeSubscriptions = 0;
        let verifiedSubscriptions = 0;
        let verifiedInAppPurchases = 0;
        let monthlyVerifiedPurchases = 0;
        let monthlyVerifiedRevenueTry = 0;

        for (const docSnap of purchaseDocs.docs) {
          const data = docSnap.data() as Record<string, unknown>;
          const packageName = typeof data.packageName === "string" ? data.packageName : "unknown";
          const purchaseType = typeof data.purchaseType === "string" ? data.purchaseType : "inapp";
          const updatedAt = toMillis(data.updatedAt);
          const expiryTimeMillis = toMillis(data.expiryTimeMillis);
          const revenueTry = inferRevenueTry(data);

          if (purchaseType === "subs") {
            verifiedSubscriptions += 1;
            if (expiryTimeMillis !== null && expiryTimeMillis > now) {
              activeSubscriptions += 1;
            }
          } else {
            verifiedInAppPurchases += 1;
          }

          if (updatedAt !== null && updatedAt >= monthStart.getTime()) {
            monthlyVerifiedPurchases += 1;
            monthlyVerifiedRevenueTry += revenueTry;
          }

          const current = purchasesByPackage.get(packageName) ?? { count: 0, revenueTry: 0 };
          current.count += 1;
          current.revenueTry += revenueTry;
          purchasesByPackage.set(packageName, current);
        }

        const latestReport = adReportDocs.docs
          .map((docSnap) => docSnap.data() as Record<string, unknown>)
          .filter((item) => typeof item.generatedAt === "string")
          .sort((left, right) =>
            String(right.generatedAt).localeCompare(String(left.generatedAt)),
          )[0] as (Record<string, unknown> & AdPerformanceReport) | undefined;

        const adRevenueRangeTry =
          latestReport?.totals && typeof latestReport.totals.earningsTry === "number"
            ? latestReport.totals.earningsTry
            : 0;
        const latestReportToday = latestReport?.today as { earningsTry?: unknown } | undefined;
        const adRevenueTodayTry =
          typeof latestReportToday?.earningsTry === "number" ? latestReportToday.earningsTry : 0;

        const summarizedPackages = Array.from(purchasesByPackage.entries())
          .map(([packageName, value]) => ({
            packageName,
            count: value.count,
            revenueTry: value.revenueTry,
          }))
          .sort((a, b) => b.revenueTry - a.revenueTry || b.count - a.count)
          .slice(0, 12);

        if (!cancelled) {
          setSummary({
            activeSubscriptions,
            verifiedSubscriptions,
            verifiedInAppPurchases,
            monthlyVerifiedPurchases,
            monthlyVerifiedRevenueTry,
            adRevenueTodayTry,
            adRevenueRangeTry,
            totalTrackedRevenueTry: monthlyVerifiedRevenueTry + adRevenueRangeTry,
            purchasesByPackage: summarizedPackages,
            adAlerts: Array.isArray(latestReport?.alerts) ? latestReport.alerts : [],
            reportGeneratedAt:
              typeof latestReport?.generatedAt === "string" ? latestReport.generatedAt : undefined,
            reportRangeLabel:
              typeof latestReport?.rangeStart === "string" &&
              typeof latestReport?.rangeEnd === "string"
                ? `${latestReport.rangeStart} → ${latestReport.rangeEnd}`
                : undefined,
            loadedAt: new Date().toISOString(),
          });
        }
      } catch (loadError) {
        console.error(loadError);
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load revenue data.");
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
      id="tabpanel-revenue"
      role="tabpanel"
      aria-labelledby="tab-revenue"
    >
      <main className="panel form-panel" role="main" aria-label="Revenue panel">
        <div className="panel-header">
          <h2>Revenue</h2>
        </div>

        <section className="subsection" aria-label="Revenue summary">
          <div className="coverage-box">
            <div className="device-preview-header">
              <strong>Tracked monetization summary</strong>
              <span className="muted">
                {loading
                  ? "Loading…"
                  : summary
                    ? `loaded ${formatDateTime(new Date(summary.loadedAt))}`
                    : "not loaded"}
              </span>
            </div>

            <p className="muted">
              Subscription metrics come from Firestore <code>purchase_verifications</code>. Ad metrics come from the latest <code>ad_performance_reports</code> snapshot.
            </p>

            {error && <p className="inline-error" role="alert">{error}</p>}

            {summary && !error && (
              <>
                <div className="health-grid analytics-metric-grid">
                  <div className="health-card glass-card">
                    <div className="health-card-label">Active subscriptions</div>
                    <div className="health-card-value">{summary.activeSubscriptions}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Verified subscriptions</div>
                    <div className="health-card-value">{summary.verifiedSubscriptions}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Verified in-app</div>
                    <div className="health-card-value">{summary.verifiedInAppPurchases}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">This month purchases</div>
                    <div className="health-card-value">{summary.monthlyVerifiedPurchases}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">This month purchase revenue</div>
                    <div className="health-card-value">{formatTry(summary.monthlyVerifiedRevenueTry)}</div>
                  </div>
                  <div className="health-card glass-card">
                    <div className="health-card-label">Ad revenue snapshot</div>
                    <div className="health-card-value">{formatTry(summary.adRevenueRangeTry)}</div>
                  </div>
                </div>

                <div className="analytics-table-wrap">
                  <table className="analytics-table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Verified purchases</th>
                        <th>Tracked purchase revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.purchasesByPackage.map((item) => (
                        <tr key={item.packageName}>
                          <td><code>{item.packageName}</code></td>
                          <td>{item.count}</td>
                          <td>{formatTry(item.revenueTry)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {summary.adAlerts.length > 0 && (
                  <div className="ad-alert-list revenue-alert-list">
                    {summary.adAlerts.slice(0, 8).map((alert) => (
                      <article key={`${alert.appId}-${alert.format}`} className="ad-alert-item glass-card">
                        <div className="ad-alert-header">
                          <strong>{alert.appLabel}</strong>
                          <span className="status-pill status-paused">
                            <span className="status-dot" />
                            {alert.format}
                          </span>
                        </div>
                        <div className="ad-alert-metrics">
                          fill {formatPercent(alert.fillRatePct)} · show {formatPercent(alert.showRatePct)} · eCPM {formatTry(alert.ecpmTry)}
                        </div>
                        <div className="ad-alert-reasons">
                          {alert.reasons.map((reason) => (
                            <span key={reason} className="status-pill status-expired">
                              <span className="status-dot" />
                              {reason}
                            </span>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                <div className="meta-list revenue-meta-list">
                  <dt>Ad snapshot generated</dt>
                  <dd>{summary.reportGeneratedAt ? formatDateTime(new Date(summary.reportGeneratedAt)) : "-"}</dd>
                  <dt>Ad snapshot range</dt>
                  <dd>{summary.reportRangeLabel ?? "-"}</dd>
                  <dt>Today ad revenue</dt>
                  <dd>{formatTry(summary.adRevenueTodayTry)}</dd>
                  <dt>Combined tracked revenue</dt>
                  <dd>{formatTry(summary.totalTrackedRevenueTry)}</dd>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="subsection health-cards" aria-label="Revenue console links">
          <h3>Revenue console links</h3>
          <div className="flavor-grid">
            <article className="flavor-card glass-card">
              <div className="flavor-card-header">
                <div>
                  <strong>AdMob</strong>
                  <div className="muted">Global mediation and app revenue dashboard</div>
                </div>
              </div>
              <div className="flavor-links">
                <a className="btn-secondary" href={admobAccountUrl} target="_blank" rel="noopener noreferrer">
                  Open AdMob
                </a>
              </div>
            </article>

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
                    href={`${playConsoleUrl}/app/${app.package}/monetize`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Play Console
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
