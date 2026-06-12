import { useState } from 'react';

import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalData } from '../portals/data/portalManager';

const adminActions = [
  'Create client user',
  'Assign website access',
  'Reset password',
  'Manage account access',
];

export default function PortalsAdmin() {
  const session = getStoredSession();
  const portalData = getPortalData();
  const portalUsers = portalData.users ?? [];
  const portalWebsites = portalData.websites ?? [];
  const user = session?.user ?? portalUsers[0];
  const firstWebsite = portalWebsites[0];
  const [notice, setNotice] = useState('');

  const adminStats = [
    { label: 'Users', value: String(portalUsers.length) },
    { label: 'Websites', value: String(portalWebsites.length) },
    { label: 'Drafts', value: String(portalData.drafts?.length ?? 0) },
    { label: 'Publish Requests', value: String(portalData.publishRequests?.length ?? 0) },
  ];

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  function handleCreateUser() {
    setNotice('Use Client Management to create users, assign roles, and manage website access.');
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="KSJ Digital Portals admin dashboard">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Management</span>
          <nav>
            <a href="/portals/admin" className="active">Client Management</a>
            <a href="/portals/admin/websites">Websites</a>
            <a href="/portals/admin/publish-requests">Publish Requests</a>
            <a href="/portals/dashboard">Client View</a>
            <a href="/portals/admin/settings">Settings</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">KSJ Digital Admin</p>
              <h2>Portal Management</h2>
              <p className="portal-role-line">Signed in as <strong>{user?.name ?? 'KSJ Digital Admin'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <div className="portal-admin-stats">
            {adminStats.map((stat) => (
              <article className="portal-help-card" key={stat.label}>
                <p className="eyebrow">{stat.label}</p>
                <h3>{stat.value}</h3>
              </article>
            ))}
          </div>

          <div className="portal-grid-two">
            <section className="portal-editor-panel">
              <div className="portal-editor-header">
                <div>
                  <p className="eyebrow">Users</p>
                  <h2>Client Access</h2>
                  <p>Create login access, assign websites, and manage permissions from the main Client Management page.</p>
                </div>
              </div>

              <div className="portal-admin-form">
                <label>
                  Client Name
                  <input type="text" placeholder="Example Client" />
                </label>
                <label>
                  Client Email
                  <input type="email" placeholder="client@example.com" />
                </label>
                <label>
                  Assign Website
                  <select defaultValue={firstWebsite?.id ?? ''}>
                    {portalWebsites.map((website) => (
                      <option value={website.id} key={website.id}>{website.name}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Role
                  <select defaultValue="clientAdmin">
                    <option value="clientAdmin">Client Administrator</option>
                    <option value="contentEditor">Content Editor</option>
                    <option value="websiteManager">Website Manager</option>
                  </select>
                </label>
                <button type="button" onClick={handleCreateUser}>Open Client Management</button>
              </div>

              {notice && <p className="portal-inline-notice">{notice}</p>}
            </section>

            <section className="portal-help-card">
              <h3>Admin Actions</h3>
              <div className="portal-activity-list">
                {adminActions.map((action) => <small key={action}>{action}</small>)}
              </div>
            </section>
          </div>

          {firstWebsite && (
            <article className="portal-site-card">
              <div className="portal-site-preview">
                <strong>{firstWebsite.name.toUpperCase()}</strong>
                <span>{firstWebsite.domain}</span>
              </div>
              <div>
                <span className="portal-status">{firstWebsite.status}</span>
                <h3>Website Assignment</h3>
                <p>{firstWebsite.name} is ready to be assigned to approved client users.</p>
                <dl>
                  <div>
                    <dt>Website</dt>
                    <dd>{firstWebsite.name}</dd>
                  </div>
                  <div>
                    <dt>Access</dt>
                    <dd>{firstWebsite.access}</dd>
                  </div>
                  <div>
                    <dt>Publishing</dt>
                    <dd>{firstWebsite.publishMode}</dd>
                  </div>
                </dl>
              </div>
            </article>
          )}
        </div>
      </section>
    </main>
  );
}
