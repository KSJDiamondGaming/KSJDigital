import { useMemo, useState } from 'react';
import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalUsersByWebsite, portalUsers } from '../portals/data/users';
import { portalWebsites } from '../portals/data/websites';

const emptyWebsiteForm = {
  name: '',
  type: 'Managed Website',
  domain: '',
  status: 'Live',
  access: 'Website Management',
  publishMode: 'Approval Required',
  plan: 'Managed Website',
  description: '',
  assignedUserIds: [],
};

function createWebsiteId(name) {
  const safeName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  return safeName || `website-${Date.now()}`;
}

export default function PortalsAdminWebsites() {
  const session = getStoredSession();
  const user = session?.user;

  const [websites, setWebsites] = useState(portalWebsites);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(portalWebsites[0]?.id ?? null);
  const [mode, setMode] = useState('view');
  const [form, setForm] = useState(emptyWebsiteForm);

  const selectedWebsite = useMemo(
    () => websites.find((website) => website.id === selectedWebsiteId) ?? null,
    [selectedWebsiteId, websites],
  );

  const selectedAssignedUsers = selectedWebsite
    ? portalUsers.filter((portalUser) => selectedWebsite.assignedUserIds?.includes(portalUser.id))
    : [];

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  function startCreate() {
    setMode('create');
    setSelectedWebsiteId(null);
    setForm(emptyWebsiteForm);
  }

  function startEdit(website) {
    setMode('edit');
    setSelectedWebsiteId(website.id);
    setForm({
      name: website.name ?? '',
      type: website.type ?? 'Managed Website',
      domain: website.domain ?? '',
      status: website.status ?? 'Live',
      access: website.access ?? 'Website Management',
      publishMode: website.publishMode ?? 'Approval Required',
      plan: website.plan ?? 'Managed Website',
      description: website.description ?? '',
      assignedUserIds: website.assignedUserIds ?? [],
    });
  }

  function cancelForm() {
    setMode('view');
    setForm(emptyWebsiteForm);
    setSelectedWebsiteId(websites[0]?.id ?? null);
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleAssignedUser(userId) {
    setForm((current) => {
      const currentIds = current.assignedUserIds ?? [];
      const assignedUserIds = currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId];

      return { ...current, assignedUserIds };
    });
  }

  function saveWebsite(event) {
    event.preventDefault();

    const cleanedName = form.name.trim();
    const cleanedDomain = form.domain.trim();

    if (!cleanedName || !cleanedDomain) return;

    if (mode === 'create') {
      const baseId = createWebsiteId(cleanedName);
      const id = websites.some((website) => website.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
      const newWebsite = {
        id,
        ...form,
        name: cleanedName,
        domain: cleanedDomain,
        url: cleanedDomain.startsWith('http') ? cleanedDomain : `https://${cleanedDomain}/`,
      };

      setWebsites((current) => [...current, newWebsite]);
      setSelectedWebsiteId(id);
      setMode('view');
      setForm(emptyWebsiteForm);
      return;
    }

    setWebsites((current) => current.map((website) => {
      if (website.id !== selectedWebsiteId) return website;

      return {
        ...website,
        ...form,
        name: cleanedName,
        domain: cleanedDomain,
        url: cleanedDomain.startsWith('http') ? cleanedDomain : `https://${cleanedDomain}/`,
      };
    }));

    setMode('view');
    setForm(emptyWebsiteForm);
  }

  function disableWebsite(websiteId) {
    setWebsites((current) => current.map((website) => (
      website.id === websiteId ? { ...website, status: 'Suspended' } : website
    )));
  }

  function deleteWebsite(websiteId) {
    const website = websites.find((item) => item.id === websiteId);
    const confirmed = window.confirm(`Delete ${website?.name ?? 'this website'} from the portal list? This only affects the current frontend demo state.`);

    if (!confirmed) return;

    const remainingWebsites = websites.filter((item) => item.id !== websiteId);
    setWebsites(remainingWebsites);
    setSelectedWebsiteId(remainingWebsites[0]?.id ?? null);
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Portal websites management">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Management</span>
          <nav>
            <a href="/portals/admin">Client Management</a>
            <a href="/portals/admin/websites" className="active">Websites</a>
            <a href="/portals/admin/publish-requests">Publish Requests</a>
            <a href="/portals/dashboard">Client View</a>
            <a href="/portals/admin/settings">Settings</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Website Management</p>
              <h2>Client Websites</h2>
              <p className="portal-role-line">Signed in as <strong>{user?.name ?? 'KSJ Digital Admin'}</strong></p>
            </div>
            <div className="portal-header-actions">
              <button className="portal-logout-button" type="button" onClick={startCreate}>Create Website</button>
              <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
            </div>
          </header>

          {(mode === 'create' || mode === 'edit') && (
            <form className="portal-management-card" onSubmit={saveWebsite}>
              <div className="portal-section-title-row">
                <strong>{mode === 'create' ? 'Create Website' : `Edit ${selectedWebsite?.name ?? 'Website'}`}</strong>
                <span>{mode === 'create' ? 'New Website' : 'Editing'}</span>
              </div>

              <div className="portal-form-grid">
                <label>
                  Website Name
                  <input value={form.name} onChange={(event) => updateForm('name', event.target.value)} placeholder="TwoToneTaj" required />
                </label>

                <label>
                  Domain
                  <input value={form.domain} onChange={(event) => updateForm('domain', event.target.value)} placeholder="example.ksjdigital.co.uk" required />
                </label>

                <label>
                  Website Type
                  <input value={form.type} onChange={(event) => updateForm('type', event.target.value)} placeholder="Creator Website" />
                </label>

                <label>
                  Plan
                  <input value={form.plan} onChange={(event) => updateForm('plan', event.target.value)} placeholder="Managed Website" />
                </label>

                <label>
                  Status
                  <select value={form.status} onChange={(event) => updateForm('status', event.target.value)}>
                    <option>Live</option>
                    <option>Maintenance</option>
                    <option>Suspended</option>
                    <option>Archived</option>
                  </select>
                </label>

                <label>
                  Publish Mode
                  <select value={form.publishMode} onChange={(event) => updateForm('publishMode', event.target.value)}>
                    <option>Approval Required</option>
                    <option>Owner Controlled</option>
                    <option>Direct Publish</option>
                  </select>
                </label>
              </div>

              <label className="portal-full-field">
                Description
                <textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} rows="3" placeholder="Short internal website description" />
              </label>

              <div className="portal-management-card compact">
                <div className="portal-section-title-row">
                  <strong>Website Access</strong>
                  <span>{form.assignedUserIds.length} Assigned</span>
                </div>
                <div className="portal-checkbox-list">
                  {portalUsers.map((portalUser) => (
                    <label key={portalUser.id}>
                      <input
                        type="checkbox"
                        checked={form.assignedUserIds.includes(portalUser.id)}
                        onChange={() => toggleAssignedUser(portalUser.id)}
                      />
                      <span>{portalUser.name} - {portalUser.role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="portal-inline-actions">
                <button type="submit">{mode === 'create' ? 'Create Website' : 'Save Changes'}</button>
                <button type="button" onClick={cancelForm}>Cancel</button>
              </div>
            </form>
          )}

          <div className="portal-section-list">
            {websites.map((website) => {
              const assignedUsers = getPortalUsersByWebsite(website.id);
              const liveAssignedUsers = portalUsers.filter((portalUser) => website.assignedUserIds?.includes(portalUser.id));
              const userCount = website.assignedUserIds ? liveAssignedUsers.length : assignedUsers.length;

              return (
                <article key={website.id}>
                  <div>
                    <div className="portal-section-title-row">
                      <strong>{website.name}</strong>
                      <span>{website.status}</span>
                    </div>
                    <p>{website.domain}</p>
                    <ul>
                      <li>{website.type}</li>
                      <li>{website.access}</li>
                      <li>{website.publishMode}</li>
                      <li>{userCount} Assigned User(s)</li>
                    </ul>
                  </div>
                  <div className="portal-inline-actions">
                    <button type="button" onClick={() => setSelectedWebsiteId(website.id)}>View</button>
                    <button type="button" onClick={() => startEdit(website)}>Edit</button>
                    <button type="button" onClick={() => disableWebsite(website.id)}>Disable</button>
                    <button type="button" onClick={() => deleteWebsite(website.id)}>Delete</button>
                  </div>
                </article>
              );
            })}
          </div>

          {selectedWebsite && (
            <aside className="portal-management-card">
              <div className="portal-section-title-row">
                <strong>{selectedWebsite.name} Details</strong>
                <span>{selectedWebsite.status}</span>
              </div>
              <p>{selectedWebsite.description}</p>
              <ul>
                <li><strong>Domain:</strong> {selectedWebsite.domain}</li>
                <li><strong>Plan:</strong> {selectedWebsite.plan}</li>
                <li><strong>Publish Mode:</strong> {selectedWebsite.publishMode}</li>
                <li><strong>Access:</strong> {selectedWebsite.access}</li>
                <li><strong>Assigned Users:</strong> {selectedAssignedUsers.length ? selectedAssignedUsers.map((assignedUser) => assignedUser.name).join(', ') : 'None'}</li>
              </ul>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
