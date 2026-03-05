type AuthScreenProps = {
  error: string;
  onSignIn: () => void;
  mode: "login" | "unauthorized" | "loading" | "checking" | "error";
  userEmail?: string;
  onSignOut?: () => void;
};

export default function AuthScreen({ error, onSignIn, mode, userEmail, onSignOut }: AuthScreenProps) {
  if (mode === "loading") {
    return (
      <div className="center-screen" role="status" aria-label="Loading">
        <div className="auth-card glass-card">
          <div className="loading-spinner" aria-hidden="true" />
          <p className="loading-text">Loading Firebase Auth…</p>
        </div>
      </div>
    );
  }

  if (mode === "error") {
    return (
      <div className="center-screen" role="alert">
        <div className="auth-card glass-card">
          <div className="auth-icon" aria-hidden="true">⚠️</div>
          <h1>Auth Error</h1>
          <p>Auth init failed. Check console.</p>
          {error && <p className="inline-error">{error}</p>}
        </div>
      </div>
    );
  }

  if (mode === "checking") {
    return (
      <div className="center-screen" role="status" aria-label="Checking admin access">
        <div className="auth-card glass-card">
          <div className="loading-spinner" aria-hidden="true" />
          <p className="loading-text">Checking admin access…</p>
        </div>
      </div>
    );
  }

  if (mode === "unauthorized") {
    return (
      <div className="center-screen">
        <div className="auth-card glass-card" role="alert">
          <div className="auth-icon" aria-hidden="true">🔒</div>
          <h1>Access denied</h1>
          <p>{userEmail} is not authorized by backend admin policy.</p>
          <p className="muted">
            Add your UID to <code>/admins/&lt;uid&gt;</code> in Firestore or include your email in
            server-side <code>ADMIN_ALLOWED_EMAILS</code>.
          </p>
          {onSignOut && (
            <button className="btn-primary" onClick={onSignOut}>Sign out</button>
          )}
          {error && <p className="inline-error">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="center-screen">
      <div className="auth-card glass-card">
        <div className="auth-icon" aria-hidden="true">🔔</div>
        <h1>Notifications Admin</h1>
        <p>Sign in with Google to manage scheduled push events.</p>
        <button className="btn-primary btn-google" onClick={onSignIn}>
          <span className="btn-icon" aria-hidden="true">G</span>
          Sign in with Google
        </button>
        {error && <p className="inline-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
