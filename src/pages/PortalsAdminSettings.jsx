import PortalSidebar from '../components/PortalSidebar';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';

export default function PortalsAdminSettings() {
  const session = getStoredSession();

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Portal admin settings">
        <PortalSidebar title="Admin" section="admin" />

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Management</p>
              <h2>Portal Settings</h2>
              <p className="portal-role-line">Signed in as <strong>{session?.user?.name ?? 'KSJ Digital Admin'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <section className="portal-editor-panel">
            <div className="portal-editor-header">
              <div>
                <p className="eyebrow">Configuration</p>
                <h2>Portal Controls</h2>
                <p>These controls will connect to backend settings when the portal API is added.</p>
              </div>
            </div>
            <div className="portal-section-list">
              <article>
                <div>
                  <div className="portal-section-title-row">
                    <strong>Authentication</strong>
                    <span>Planned</span>
                  </div>
                  <p>Email invites, password reset, and two-factor authentication.</p>
                </div>
              </article>
              <article>
                <div>
                  <div className="portal-section-title-row">
                    <strong>Publishing</strong>
                    <span>Approval Required</span>
                  </div>
                  <p>Client changes must be reviewed by KSJ Digital before going live.</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
