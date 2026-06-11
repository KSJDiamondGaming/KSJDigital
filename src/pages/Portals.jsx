import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';

const quickActions = [
  {
    icon: '⌂',
    title: 'Edit Homepage',
    text: 'Update hero content, featured sections, and calls to action.',
  },
  {
    icon: '✎',
    title: 'Edit About',
    text: 'Manage biography, story sections, images, and page copy.',
  },
  {
    icon: '✉',
    title: 'Edit Contact',
    text: 'Update contact details, support email, and external links.',
  },
  {
    icon: '◉',
    title: 'Preview Website',
    text: 'Review changes before requesting a live publish.',
  },
];

const editorTabs = ['Homepage', 'About', 'Social Links', 'Schedule', 'Contact', 'Site Settings'];

const editableSections = [
  {
    title: 'Hero Section',
    text: 'Headline, intro copy, hero buttons, and featured image.',
  },
  {
    title: 'About Section',
    text: 'Creator story, highlight cards, and community message.',
  },
  {
    title: 'Featured Content',
    text: 'Videos, Twitch panel, YouTube feed placeholders, and links.',
  },
  {
    title: 'Merch Section',
    text: 'Coming soon text, product previews, and shop messaging.',
  },
];

const recentActivity = [
  'Homepage draft prepared',
  'Social links ready for review',
  'Contact information checked',
];

export default function Portals() {
  return (
    <main className="portals-shell">
      <section className="portals-hero">
        <div className="portals-brand-card">
          <img src={KsjDigitalLogo} alt="KSJ Digital" className="portals-logo" />
          <div>
            <p className="eyebrow">KSJ Digital Portals</p>
            <h1>Secure website management for KSJ Digital clients.</h1>
            <p>
              A clean, protected space where clients can manage their website content,
              preview updates, and request publish approval without touching code.
            </p>
            <div className="portal-feature-row" aria-label="Portal features">
              <span>Secure Login</span>
              <span>Manage Websites</span>
              <span>Edit Content</span>
              <span>Publish Requests</span>
            </div>
          </div>
        </div>

        <aside className="portal-login-card" aria-label="Client portal login preview">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <h2>Welcome Back</h2>
          <p>Login to access your client portal.</p>
          <form>
            <label>
              Email Address
              <input type="email" placeholder="client@example.com" disabled />
            </label>
            <label>
              Password
              <input type="password" placeholder="••••••••" disabled />
            </label>
            <div className="portal-login-options">
              <span>Remember me</span>
              <span>Forgot password?</span>
            </div>
            <button type="button">Login</button>
          </form>
          <small>Account access is created and approved by KSJ Digital.</small>
        </aside>
      </section>

      <section className="portal-dashboard-frame" aria-label="TwoToneTaj client portal dashboard preview">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Portals</span>
          <nav>
            <a href="/portals" className="active">Dashboard</a>
            <a href="/portals/websites">My Websites</a>
            <a href="/portals/account">Account Settings</a>
            <a href="mailto:support@ksjdigital.co.uk">Support</a>
            <a href="/portals/billing">Billing</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Welcome, TwoToneTaj</p>
              <h2>Client Dashboard</h2>
            </div>
            <span className="portal-avatar">TT</span>
          </header>

          <article className="portal-site-card">
            <div className="portal-site-preview">
              <strong>TWOTONETAJ</strong>
              <span>twotonetaj.ksjdigital.co.uk</span>
            </div>
            <div>
              <span className="portal-status">Live</span>
              <h3>TwoToneTaj</h3>
              <p>Creator website and community platform managed through KSJ Digital Portals.</p>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>Live</dd>
                </div>
                <div>
                  <dt>Access</dt>
                  <dd>Website Management</dd>
                </div>
                <div>
                  <dt>Publish Mode</dt>
                  <dd>Approval Required</dd>
                </div>
              </dl>
            </div>
            <a className="portal-manage-button" href="/portals/websites/twotonetaj">Manage Website</a>
          </article>

          <div className="portal-grid-two">
            <section>
              <h3>Quick Actions</h3>
              <div className="portal-action-grid">
                {quickActions.map((action) => (
                  <button type="button" key={action.title}>
                    <span>{action.icon}</span>
                    <strong>{action.title}</strong>
                    <small>{action.text}</small>
                  </button>
                ))}
              </div>
            </section>

            <section className="portal-help-card">
              <h3>Need Help?</h3>
              <p>Visit the KSJ Digital support centre or contact us for portal support.</p>
              <a href="mailto:support@ksjdigital.co.uk">Contact Support</a>
            </section>
          </div>

          <section className="portal-editor-panel">
            <div className="portal-editor-header">
              <div>
                <p className="eyebrow">Website Editor</p>
                <h2>TwoToneTaj</h2>
                <p>Edit and manage website content safely before requesting publication.</p>
              </div>
              <a href="https://twotonetaj.ksjdigital.co.uk/">Preview Website</a>
            </div>

            <div className="portal-tabs" aria-label="Website editor tabs">
              {editorTabs.map((tab, index) => (
                <button type="button" className={index === 0 ? 'active' : ''} key={tab}>{tab}</button>
              ))}
            </div>

            <div className="portal-editor-layout">
              <div className="portal-section-list">
                {editableSections.map((section) => (
                  <article key={section.title}>
                    <div>
                      <strong>{section.title}</strong>
                      <p>{section.text}</p>
                    </div>
                    <button type="button">Edit</button>
                  </article>
                ))}
              </div>

              <aside className="portal-publish-card">
                <span className="portal-draft-badge">Draft</span>
                <h3>Publish Status</h3>
                <p>You have unpublished changes waiting for review.</p>
                <button type="button">Save Changes</button>
                <button type="button" className="secondary">Request Publish</button>
                <div>
                  <strong>Recent Activity</strong>
                  {recentActivity.map((item) => <small key={item}>{item}</small>)}
                </div>
              </aside>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
