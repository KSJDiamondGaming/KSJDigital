import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import {
  portalContentSnapshot,
  portalEditableSections,
  portalEditorTabs,
  portalProject,
  portalQuickActions,
  portalRecentActivity,
  portalUser,
} from '../data/portalData';
import { getDemoPortalUser } from '../portals/auth/authService';
import { canAccessProject, hasPermission, PORTAL_PERMISSIONS } from '../portals/auth/permissions';
import { getActivePortalUser } from '../portals/auth/sessionManager';

export default function Portals() {
  const fallbackUser = getDemoPortalUser();
  const activeUser = getActivePortalUser(fallbackUser);
  const canManageProject = canAccessProject(activeUser, portalProject.id);
  const canRequestPublish = hasPermission(activeUser, PORTAL_PERMISSIONS.REQUEST_PUBLISH);
  const canApprovePublish = hasPermission(activeUser, PORTAL_PERMISSIONS.APPROVE_PUBLISH);

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
              <input type="email" placeholder={portalUser.email} disabled />
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
              <p className="eyebrow">Welcome, {activeUser.name}</p>
              <h2>Client Dashboard</h2>
              <p className="portal-role-line">
                Role: <strong>{activeUser.role}</strong> • Project Access: <strong>{canManageProject ? 'Allowed' : 'Restricted'}</strong>
              </p>
            </div>
            <span className="portal-avatar">{activeUser.initials}</span>
          </header>

          <article className="portal-site-card">
            <div className="portal-site-preview">
              <strong>{portalProject.name.toUpperCase()}</strong>
              <span>{portalProject.domain}</span>
            </div>
            <div>
              <span className="portal-status">{portalProject.status}</span>
              <h3>{portalProject.name}</h3>
              <p>{portalProject.description}</p>
              <dl>
                <div>
                  <dt>Status</dt>
                  <dd>{portalProject.status}</dd>
                </div>
                <div>
                  <dt>Access</dt>
                  <dd>{canManageProject ? portalProject.access : 'Restricted'}</dd>
                </div>
                <div>
                  <dt>Publish Mode</dt>
                  <dd>{portalProject.publishMode}</dd>
                </div>
              </dl>
            </div>
            <a className="portal-manage-button" href={`/portals/websites/${portalProject.id}`}>Manage Website</a>
          </article>

          <div className="portal-grid-two">
            <section>
              <h3>Quick Actions</h3>
              <div className="portal-action-grid">
                {portalQuickActions.map((action) => (
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
                <h2>{portalProject.name}</h2>
                <p>Edit and manage website content safely before requesting publication.</p>
              </div>
              <a href={portalProject.url}>Preview Website</a>
            </div>

            <div className="portal-tabs" aria-label="Website editor tabs">
              {portalEditorTabs.map((tab, index) => (
                <button type="button" className={index === 0 ? 'active' : ''} key={tab}>{tab}</button>
              ))}
            </div>

            <div className="portal-editor-layout">
              <div className="portal-section-list">
                {portalEditableSections.map((section) => (
                  <article key={section.id}>
                    <div>
                      <div className="portal-section-title-row">
                        <strong>{section.title}</strong>
                        <span>{section.status}</span>
                      </div>
                      <p>{section.text}</p>
                      <ul>
                        {section.fields.map((field) => <li key={field}>{field}</li>)}
                      </ul>
                    </div>
                    <button type="button">Edit</button>
                  </article>
                ))}
              </div>

              <aside className="portal-publish-card">
                <span className="portal-draft-badge">Draft</span>
                <h3>Publish Status</h3>
                <p>{portalContentSnapshot.publish.nextStep}</p>
                <button type="button">Save Changes</button>
                <button type="button" className="secondary" disabled={!canRequestPublish}>Request Publish</button>
                {canApprovePublish && <button type="button" className="secondary">Approve Publish</button>}
                <div>
                  <strong>Recent Activity</strong>
                  {portalRecentActivity.map((item) => <small key={item}>{item}</small>)}
                </div>
              </aside>
            </div>
          </section>

          <section className="portal-content-snapshot">
            <div>
              <p className="eyebrow">Current content structure</p>
              <h2>TwoToneTaj editable content</h2>
              <p>
                This is the first structured content layer that will later connect to save drafts,
                preview changes, and publish approved updates to the live website.
              </p>
            </div>

            <div className="portal-snapshot-grid">
              <article>
                <span>Homepage</span>
                <strong>{portalContentSnapshot.homepage.heroTitle}</strong>
                <p>{portalContentSnapshot.homepage.summary}</p>
              </article>
              <article>
                <span>About</span>
                <strong>{portalContentSnapshot.about.headline}</strong>
                <p>{portalContentSnapshot.about.quote}</p>
              </article>
              <article>
                <span>Contact</span>
                <strong>{portalContentSnapshot.contact.email}</strong>
                <p>Support: {portalContentSnapshot.contact.supportEmail}</p>
              </article>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
