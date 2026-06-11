import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';

export default function PortalsSupport() {
  const session = getStoredSession();

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Portal support">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Portals</span>
          <nav>
            <a href="/portals/dashboard">Dashboard</a>
            <a href="/portals/websites/twotonetaj">My Website</a>
            <a href="/portals/drafts">Drafts</a>
            <a href="/portals/publish-requests">Publish Requests</a>
            <a href="/portals/support" className="active">Support</a>
            <a href="/portals/account">Account</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Support</p>
              <h2>KSJ Digital Support</h2>
              <p className="portal-role-line">Signed in as <strong>{session?.user?.name ?? 'Client'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <div className="portal-grid-two">
            <section className="portal-editor-panel">
              <div className="portal-editor-header">
                <div>
                  <p className="eyebrow">New Request</p>
                  <h2>Contact Support</h2>
                  <p>Raise a website support request for KSJ Digital to review.</p>
                </div>
              </div>
              <div className="portal-admin-form">
                <label>
                  Subject
                  <input type="text" placeholder="What do you need help with?" />
                </label>
                <label>
                  Priority
                  <select defaultValue="normal">
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </label>
                <label>
                  Message
                  <input type="text" placeholder="Briefly describe the issue" />
                </label>
                <button type="button">Prepare Request</button>
              </div>
            </section>

            <section className="portal-help-card">
              <h3>Support Details</h3>
              <p>For urgent website issues, contact KSJ Digital directly.</p>
              <div className="portal-activity-list">
                <small>support@ksjdigital.co.uk</small>
                <small>Portal requests will later become tickets.</small>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
