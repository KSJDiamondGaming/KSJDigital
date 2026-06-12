import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalPublishRequests, getPortalWebsiteById } from '../portals/data/portalManager';

export default function PortalsPublishRequests() {
  const session = getStoredSession();
  const portalPublishRequests = getPortalPublishRequests();

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Portal publish requests">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Portals</span>
          <nav>
            <a href="/portals/dashboard">Dashboard</a>
            <a href="/portals/websites/twotonetaj">My Website</a>
            <a href="/portals/drafts">Drafts</a>
            <a href="/portals/publish-requests" className="active">Publish Requests</a>
            <a href="/portals/support">Support</a>
            <a href="/portals/account">Account</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Publishing</p>
              <h2>Publish Requests</h2>
              <p className="portal-role-line">Signed in as <strong>{session?.user?.name ?? 'Client'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <div className="portal-section-list">
            {portalPublishRequests.map((request) => {
              const website = getPortalWebsiteById(request.websiteId);
              return (
                <article key={request.id}>
                  <div>
                    <div className="portal-section-title-row">
                      <strong>{request.title}</strong>
                      <span>{request.status}</span>
                    </div>
                    <p>{request.summary}</p>
                    <ul>
                      <li>{website?.name ?? request.websiteId}</li>
                      <li>Requested by {request.requestedBy}</li>
                      <li>{request.updatedAt}</li>
                    </ul>
                  </div>
                  <button type="button">View</button>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
