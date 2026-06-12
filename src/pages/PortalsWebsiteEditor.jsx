import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalWebsiteById } from '../portals/data/portalManager';

const contentPages = [
  { id: 'homepage', title: 'Homepage', fields: ['Hero Title', 'Hero Subtitle', 'Hero Summary', 'Button Text', 'Button URL'] },
  { id: 'about', title: 'About', fields: ['Headline', 'Story Copy', 'Quote'] },
  { id: 'contact', title: 'Contact', fields: ['Public Email', 'Discord URL', 'Linktree URL'] },
  { id: 'merch', title: 'Merch', fields: ['Merch Intro', 'Coming Soon Toggle'] },
];

export default function PortalsWebsiteEditor() {
  const session = getStoredSession();
  const website = getPortalWebsiteById('twotonetaj');

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Website content manager">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Website</span>
          <nav>
            <a href="/portals/dashboard">Dashboard</a>
            <a href="/portals/websites/twotonetaj" className="active">Content</a>
            <a href="/portals/drafts">Drafts</a>
            <a href="/portals/publish-requests">Publish Requests</a>
            <a href="/portals/support">Support</a>
            <a href="/portals/account">Account</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Content Management</p>
              <h2>{website?.name ?? 'Website'} Content</h2>
              <p className="portal-role-line">Signed in as <strong>{session?.user?.name ?? 'Client'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <article className="portal-site-card">
            <div className="portal-site-preview">
              <strong>{website?.name?.toUpperCase() ?? 'WEBSITE'}</strong>
              <span>{website?.domain}</span>
            </div>
            <div>
              <span className="portal-status">Draft First</span>
              <h3>Website Content Registry</h3>
              <p>Clients will edit approved content fields only. Layouts, styles, components, branding, and code stay locked.</p>
              <dl>
                <div><dt>Publishing</dt><dd>{website?.publishMode}</dd></div>
                <div><dt>Approval</dt><dd>KSJ Digital Review</dd></div>
                <div><dt>Backup</dt><dd>48 Hour Restore Safety</dd></div>
              </dl>
            </div>
          </article>

          <section className="portal-editor-panel">
            <div className="portal-editor-header">
              <div>
                <p className="eyebrow">Content Registry V1</p>
                <h2>Editable Pages</h2>
                <p>This is the first CMS layer that defines what TwoToneTaj can edit before we connect the live website.</p>
              </div>
              <a href={website?.url ?? '/'}>View Live Site</a>
            </div>

            <div className="portal-section-list">
              {contentPages.map((page) => (
                <article key={page.id}>
                  <div>
                    <div className="portal-section-title-row"><strong>{page.title}</strong><span>{page.fields.length} Fields</span></div>
                    <p>Draft-first editable content controlled by KSJ Digital.</p>
                    <ul>{page.fields.map((field) => <li key={field}>{field}</li>)}</ul>
                  </div>
                  <button type="button">Prepare Editor</button>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
