import type { User } from "firebase/auth";
import type { AdminTab } from "../types";
import { appBuildId, appBuildTime } from "../helpers";

type HeaderProps = {
  user: User;
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onSignOut: () => void;
};

export default function Header({ user, activeTab, onTabChange, onSignOut }: HeaderProps) {
  return (
    <>
      <header className="topbar" role="banner">
        <div className="topbar-brand">
          <h1>
            <span className="brand-icon" aria-hidden="true">🔔</span>
            Notifications Admin
          </h1>
          <p className="topbar-subtitle">
            Manage Firestore <code>scheduled_events</code> used by dispatchNotifications.
          </p>
          <p className="topbar-build">
            build <code>{appBuildId}</code> · {appBuildTime}
          </p>
        </div>
        <div className="topbar-actions">
          <div className="user-pill" aria-label={`Signed in as ${user.email ?? user.uid}`}>
            <span className="user-avatar" aria-hidden="true">
              {(user.email ?? user.uid).charAt(0).toUpperCase()}
            </span>
            <span className="user-email">{user.email ?? user.uid}</span>
          </div>
          <button className="btn-secondary" onClick={onSignOut} aria-label="Sign out">
            Sign out
          </button>
        </div>
      </header>

      <nav className="admin-tabs" role="tablist" aria-label="Admin sections">
        <button
          type="button"
          role="tab"
          className={`tab-btn ${activeTab === "events" ? "active" : ""}`}
          aria-selected={activeTab === "events"}
          onClick={() => onTabChange("events")}
          id="tab-events"
          aria-controls="tabpanel-events"
        >
          <span className="tab-icon" aria-hidden="true">📋</span>
          Events
        </button>
        <button
          type="button"
          role="tab"
          className={`tab-btn ${activeTab === "test-push" ? "active" : ""}`}
          aria-selected={activeTab === "test-push"}
          onClick={() => onTabChange("test-push")}
          id="tab-test-push"
          aria-controls="tabpanel-test-push"
        >
          <span className="tab-icon" aria-hidden="true">🚀</span>
          Test Push
        </button>
        <button
          type="button"
          role="tab"
          className={`tab-btn ${activeTab === "system-health" ? "active" : ""}`}
          aria-selected={activeTab === "system-health"}
          onClick={() => onTabChange("system-health")}
          id="tab-system-health"
          aria-controls="tabpanel-system-health"
        >
          <span className="tab-icon" aria-hidden="true">💚</span>
          System Health
        </button>
      </nav>
    </>
  );
}
