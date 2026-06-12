import { useMemo, useState } from 'react';
import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalData, savePortalData } from '../portals/data/portalManager';

const emptyWebsiteForm = {
  name: '',
  type: 'Managed Website',
  domain: '',
  additionalDomainsText: '',
  hostingStatus: 'Live',
  portalStatus: 'Active',
  sslStatus: 'Pending',
  access: 'Website Management',
  publishMode: 'Approval Required',
  plan: 'Managed Website',
  ownerUserId: '',
  storageLimitMb: 2048,
  analyticsEnabled: false,
  backupEnabled: true,
  backupRetentionHours: 48,
  vpsPath: '',
  buildCommand: 'npm run build',
  description: '',
  assignedUserIds: [],
};

function createWebsiteId(name) {
  const safeName = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return safeName || `website-${Date.now()}`;
}

function getHostingStatus(website) {
  return website.hostingStatus ?? website.status ?? 'Live';
}

function getPortalStatus(website) {
  return website.portalStatus ?? 'Active';
}

function getAdditionalDomainsText(website) {
  return (website.additionalDomains ?? []).join('\n');
}

function parseAdditionalDomains(value) {
  return value.split('\n').map((domain) => domain.trim()).filter(Boolean);
}

function formatStorage(website) {
  const used = website.storageUsedMb ?? 0;
  const limit = website.storageLimitMb ?? 0;
  if (!limit) return `${used} MB used`;
  return `${used} MB / ${limit} MB`;
}

function getStoragePercent(website) {
  const used = website.storageUsedMb ?? 0;
  const limit = website.storageLimitMb ?? 0;
  if (!limit) return 0;
  return Math.min(100, Math.round((used / limit) * 100));
}

function getOwnerName(website, users) {
  return users.find((portalUser) => portalUser.id === website.ownerUserId)?.name ?? 'Unassigned';
}

function createWebsitePayload(form, currentWebsite, editorName) {
  return {
    ...currentWebsite,
    ...form,
    additionalDomains: parseAdditionalDomains(form.additionalDomainsText),
    status: form.hostingStatus,
    storageLimitMb: Number(form.storageLimitMb) || 0,
    analytics: {
      ...(currentWebsite?.analytics ?? {}),
      enabled: Boolean(form.analyticsEnabled),
      monthlyViews: currentWebsite?.analytics?.monthlyViews ?? 0,
      monthlyVisitors: currentWebsite?.analytics?.monthlyVisitors ?? 0,
      lastChecked: currentWebsite?.analytics?.lastChecked ?? 'Not connected yet',
    },
    backup: {
      ...(currentWebsite?.backup ?? {}),
      enabled: Boolean(form.backupEnabled),
      retentionHours: Number(form.backupRetentionHours) || 48,
      status: currentWebsite?.backup?.status ?? 'No active backup',
      expiresAt: currentWebsite?.backup?.expiresAt ?? '',
      lastCreatedAt: currentWebsite?.backup?.lastCreatedAt ?? '',
    },
    deployment: {
      ...(currentWebsite?.deployment ?? {}),
      provider: 'VPS / Nginx',
      vpsPath: form.vpsPath,
      buildCommand: form.buildCommand,
      lastBuild: currentWebsite?.deployment?.lastBuild ?? 'Not built through portal yet',
    },
    lastEditor: editorName,
  };
}

export default function PortalsAdminWebsites() {
  const session = getStoredSession();
  const user = session?.user;
  const initialPortalData = getPortalData();

  const [portalData, setPortalData] = useState(initialPortalData);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(initialPortalData.websites[0]?.id ?? null);
  const [mode, setMode] = useState('view');
  const [form, setForm] = useState(emptyWebsiteForm);

  const websites = portalData.websites ?? [];
  const portalUsers = portalData.users ?? [];

  const selectedWebsite = useMemo(
    () => websites.find((website) => website.id === selectedWebsiteId) ?? null,
    [selectedWebsiteId, websites],
  );

  const selectedAssignedUsers = selectedWebsite
    ? portalUsers.filter((portalUser) => selectedWebsite.assignedUserIds?.includes(portalUser.id))
    : [];

  function commitPortalData(nextData) {
    const savedData = savePortalData(nextData);
    setPortalData(savedData);
    return savedData;
  }

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  function startCreate() {
    setMode('create');
    setSelectedWebsiteId(null);
    setForm({ ...emptyWebsiteForm, ownerUserId: portalUsers[0]?.id ?? '' });
  }

  function startEdit(website) {
    setMode('edit');
    setSelectedWebsiteId(website.id);
    setForm({
      name: website.name ?? '',
      type: website.type ?? 'Managed Website',
      domain: website.domain ?? '',
      additionalDomainsText: getAdditionalDomainsText(website),
      hostingStatus: getHostingStatus(website),
      portalStatus: getPortalStatus(website),
      sslStatus: website.sslStatus ?? 'Pending',
      access: website.access ?? 'Website Management',
      publishMode: website.publishMode ?? 'Approval Required',
      plan: website.plan ?? 'Managed Website',
      ownerUserId: website.ownerUserId ?? website.assignedUserIds?.[0] ?? '',
      storageLimitMb: website.storageLimitMb ?? 2048,
      analyticsEnabled: Boolean(website.analytics?.enabled),
      backupEnabled: website.backup?.enabled !== false,
      backupRetentionHours: website.backup?.retentionHours ?? 48,
      vpsPath: website.deployment?.vpsPath ?? '',
      buildCommand: website.deployment?.buildCommand ?? 'npm run build',
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
      const assignedUserIds = currentIds.includes(userId) ? currentIds.filter((id) => id !== userId) : [...currentIds, userId];
      return { ...current, assignedUserIds };
    });
  }

  function syncUserWebsiteAccess(users, websiteId, assignedUserIds) {
    return users.map((portalUser) => {
      const websiteIds = portalUser.websiteIds ?? [];
      const shouldHaveAccess = assignedUserIds.includes(portalUser.id);
      const alreadyHasAccess = websiteIds.includes(websiteId);
      if (shouldHaveAccess && !alreadyHasAccess) return { ...portalUser, websiteIds: [...websiteIds, websiteId] };
      if (!shouldHaveAccess && alreadyHasAccess) return { ...portalUser, websiteIds: websiteIds.filter((id) => id !== websiteId) };
      return portalUser;
    });
  }

  function saveWebsite(event) {
    event.preventDefault();
    const cleanedName = form.name.trim();
    const cleanedDomain = form.domain.trim();
    if (!cleanedName || !cleanedDomain) return;

    const assignedUserIds = Array.from(new Set([...(form.assignedUserIds ?? []), form.ownerUserId].filter(Boolean)));
    const editorName = user?.name ?? 'KSJ Digital Admin';

    if (mode === 'create') {
      const baseId = createWebsiteId(cleanedName);
      const id = websites.some((website) => website.id === baseId) ? `${baseId}-${Date.now()}` : baseId;
      const newWebsite = createWebsitePayload({ ...form, assignedUserIds }, null, editorName);
      newWebsite.id = id;
      newWebsite.name = cleanedName;
      newWebsite.domain = cleanedDomain;
      newWebsite.url = cleanedDomain.startsWith('http') ? cleanedDomain : `https://${cleanedDomain}/`;
      newWebsite.storageUsedMb = 0;
      newWebsite.lastPublish = 'Not published through portal yet';

      commitPortalData({
        ...portalData,
        websites: [...websites, newWebsite],
        users: syncUserWebsiteAccess(portalUsers, id, assignedUserIds),
      });
      setSelectedWebsiteId(id);
      setMode('view');
      setForm(emptyWebsiteForm);
      return;
    }

    const nextWebsites = websites.map((website) => {
      if (website.id !== selectedWebsiteId) return website;
      const updatedWebsite = createWebsitePayload({ ...form, assignedUserIds }, website, editorName);
      updatedWebsite.name = cleanedName;
      updatedWebsite.domain = cleanedDomain;
      updatedWebsite.url = cleanedDomain.startsWith('http') ? cleanedDomain : `https://${cleanedDomain}/`;
      return updatedWebsite;
    });

    commitPortalData({ ...portalData, websites: nextWebsites, users: syncUserWebsiteAccess(portalUsers, selectedWebsiteId, assignedUserIds) });
    setMode('view');
    setForm(emptyWebsiteForm);
  }

  function setWebsiteHostingStatus(websiteId, hostingStatus) {
    commitPortalData({
      ...portalData,
      websites: websites.map((website) => (website.id === websiteId ? { ...website, hostingStatus, status: hostingStatus } : website)),
    });
  }

  function setWebsitePortalStatus(websiteId, portalStatus) {
    commitPortalData({
      ...portalData,
      websites: websites.map((website) => (website.id === websiteId ? { ...website, portalStatus } : website)),
    });
  }

  function removeWebsite(websiteId) {
    const website = websites.find((item) => item.id === websiteId);
    const confirmed = window.confirm(`Remove ${website?.name ?? 'this website'} from the portal list? This updates the central portal JSON demo store.`);
    if (!confirmed) return;

    const remainingWebsites = websites.filter((item) => item.id !== websiteId);
    const nextUsers = portalUsers.map((portalUser) => ({ ...portalUser, websiteIds: portalUser.websiteIds?.filter((id) => id !== websiteId) ?? [] }));
    commitPortalData({ ...portalData, websites: remainingWebsites, users: nextUsers });
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
              <div className="portal-section-title-row"><strong>{mode === 'create' ? 'Create Website' : `Edit ${selectedWebsite?.name ?? 'Website'}`}</strong><span>Website Settings</span></div>

              <div className="portal-form-grid">
                <label>Website Name<input value={form.name} onChange={(event) => updateForm('name', event.target.value)} required /></label>
                <label>Primary Domain<input value={form.domain} onChange={(event) => updateForm('domain', event.target.value)} required /></label>
                <label>Website Type<input value={form.type} onChange={(event) => updateForm('type', event.target.value)} /></label>
                <label>Plan<input value={form.plan} onChange={(event) => updateForm('plan', event.target.value)} /></label>
                <label>Owner<select value={form.ownerUserId} onChange={(event) => updateForm('ownerUserId', event.target.value)}>{portalUsers.map((portalUser) => <option key={portalUser.id} value={portalUser.id}>{portalUser.name}</option>)}</select></label>
                <label>SSL Status<select value={form.sslStatus} onChange={(event) => updateForm('sslStatus', event.target.value)}><option>Active</option><option>Pending</option><option>Expired</option><option>Not Configured</option></select></label>
                <label>Website Status<select value={form.hostingStatus} onChange={(event) => updateForm('hostingStatus', event.target.value)}><option>Live</option><option>Maintenance</option><option>Offline</option></select></label>
                <label>Portal Access<select value={form.portalStatus} onChange={(event) => updateForm('portalStatus', event.target.value)}><option>Active</option><option>Suspended</option><option>Archived</option></select></label>
                <label>Publish Settings<select value={form.publishMode} onChange={(event) => updateForm('publishMode', event.target.value)}><option>Approval Required</option><option>Owner Controlled</option><option>Direct Publish</option></select></label>
                <label>Storage Limit MB<input type="number" value={form.storageLimitMb} onChange={(event) => updateForm('storageLimitMb', event.target.value)} /></label>
                <label>Backup Retention Hours<input type="number" value={form.backupRetentionHours} onChange={(event) => updateForm('backupRetentionHours', event.target.value)} /></label>
                <label>VPS Path<input value={form.vpsPath} onChange={(event) => updateForm('vpsPath', event.target.value)} /></label>
                <label>Build Command<input value={form.buildCommand} onChange={(event) => updateForm('buildCommand', event.target.value)} /></label>
              </div>

              <label className="portal-full-field">Additional Domains<textarea value={form.additionalDomainsText} onChange={(event) => updateForm('additionalDomainsText', event.target.value)} rows="3" placeholder="www.example.co.uk" /></label>
              <label className="portal-full-field">Description<textarea value={form.description} onChange={(event) => updateForm('description', event.target.value)} rows="3" /></label>

              <div className="portal-management-card compact">
                <div className="portal-section-title-row"><strong>Feature Settings</strong><span>Portal Controls</span></div>
                <div className="portal-checkbox-list">
                  <label><input type="checkbox" checked={form.backupEnabled} onChange={(event) => updateForm('backupEnabled', event.target.checked)} /><span>Enable 48-hour restore backups</span></label>
                  <label><input type="checkbox" checked={form.analyticsEnabled} onChange={(event) => updateForm('analyticsEnabled', event.target.checked)} /><span>Enable analytics tracking</span></label>
                </div>
              </div>

              <div className="portal-management-card compact">
                <div className="portal-section-title-row"><strong>Website Access</strong><span>{form.assignedUserIds.length} Assigned</span></div>
                <div className="portal-checkbox-list">
                  {portalUsers.map((portalUser) => <label key={portalUser.id}><input type="checkbox" checked={form.assignedUserIds.includes(portalUser.id)} onChange={() => toggleAssignedUser(portalUser.id)} /><span>{portalUser.name} - {portalUser.role}</span></label>)}
                </div>
              </div>

              <div className="portal-inline-actions"><button type="submit">Save Website Settings</button><button type="button" onClick={cancelForm}>Cancel</button></div>
            </form>
          )}

          <div className="portal-section-list">
            {websites.map((website) => {
              const liveAssignedUsers = portalUsers.filter((portalUser) => website.assignedUserIds?.includes(portalUser.id));
              const hostingStatus = getHostingStatus(website);
              const portalStatus = getPortalStatus(website);
              return (
                <article key={website.id}>
                  <div>
                    <div className="portal-section-title-row"><strong>{website.name}</strong><span>{hostingStatus}</span></div>
                    <p>{website.domain}</p>
                    <ul>
                      <li>Owner: {getOwnerName(website, portalUsers)}</li>
                      <li>SSL: {website.sslStatus ?? 'Pending'}</li>
                      <li>Portal Access: {portalStatus}</li>
                      <li>Storage: {formatStorage(website)}</li>
                      <li>{liveAssignedUsers.length} Assigned User(s)</li>
                    </ul>
                  </div>
                  <div className="portal-inline-actions">
                    <button type="button" onClick={() => setSelectedWebsiteId(website.id)}>View</button>
                    <button type="button" onClick={() => startEdit(website)}>Settings</button>
                    <button type="button" onClick={() => setWebsiteHostingStatus(website.id, 'Live')}>Go Live</button>
                    <button type="button" onClick={() => setWebsiteHostingStatus(website.id, 'Maintenance')}>Maintenance</button>
                    <button type="button" onClick={() => setWebsiteHostingStatus(website.id, 'Offline')}>Take Offline</button>
                    <button type="button" onClick={() => setWebsitePortalStatus(website.id, portalStatus === 'Active' ? 'Suspended' : 'Active')}>{portalStatus === 'Active' ? 'Suspend Portal' : 'Activate Portal'}</button>
                    <button type="button" onClick={() => removeWebsite(website.id)}>Remove</button>
                  </div>
                </article>
              );
            })}
          </div>

          {selectedWebsite && (
            <aside className="portal-management-card">
              <div className="portal-section-title-row"><strong>{selectedWebsite.name} Settings</strong><span>{getHostingStatus(selectedWebsite)}</span></div>
              <p>{selectedWebsite.description}</p>
              <div className="portal-admin-stats">
                <article className="portal-help-card"><p className="eyebrow">Owner</p><h3>{getOwnerName(selectedWebsite, portalUsers)}</h3></article>
                <article className="portal-help-card"><p className="eyebrow">Storage</p><h3>{getStoragePercent(selectedWebsite)}%</h3></article>
                <article className="portal-help-card"><p className="eyebrow">SSL</p><h3>{selectedWebsite.sslStatus ?? 'Pending'}</h3></article>
                <article className="portal-help-card"><p className="eyebrow">Backup</p><h3>{selectedWebsite.backup?.enabled ? `${selectedWebsite.backup?.retentionHours ?? 48}h` : 'Off'}</h3></article>
              </div>
              <ul>
                <li><strong>Primary Domain:</strong> {selectedWebsite.domain}</li>
                <li><strong>Additional Domains:</strong> {selectedWebsite.additionalDomains?.length ? selectedWebsite.additionalDomains.join(', ') : 'None'}</li>
                <li><strong>Website Status:</strong> {getHostingStatus(selectedWebsite)}</li>
                <li><strong>Portal Status:</strong> {getPortalStatus(selectedWebsite)}</li>
                <li><strong>Publish Settings:</strong> {selectedWebsite.publishMode}</li>
                <li><strong>Storage Limit:</strong> {formatStorage(selectedWebsite)}</li>
                <li><strong>Analytics Settings:</strong> {selectedWebsite.analytics?.enabled ? 'Enabled' : 'Disabled'} · {selectedWebsite.analytics?.monthlyVisitors ?? 0} visitors this month</li>
                <li><strong>Backup Settings:</strong> {selectedWebsite.backup?.enabled ? `Enabled · ${selectedWebsite.backup?.retentionHours ?? 48} hour retention` : 'Disabled'}</li>
                <li><strong>48 Hour Backup:</strong> {selectedWebsite.backup?.status ?? 'No active backup'}{selectedWebsite.backup?.expiresAt ? ` · Expires ${selectedWebsite.backup.expiresAt}` : ''}</li>
                <li><strong>Deployment:</strong> {selectedWebsite.deployment?.provider ?? 'VPS / Nginx'} · {selectedWebsite.deployment?.vpsPath ?? 'Path not set'}</li>
                <li><strong>Build Command:</strong> {selectedWebsite.deployment?.buildCommand ?? 'Not set'}</li>
                <li><strong>Last Build:</strong> {selectedWebsite.deployment?.lastBuild ?? 'Not built through portal yet'}</li>
                <li><strong>Last Publish:</strong> {selectedWebsite.lastPublish ?? 'Not published through portal yet'}</li>
                <li><strong>Last Editor:</strong> {selectedWebsite.lastEditor ?? 'Unknown'}</li>
                <li><strong>Assigned Users:</strong> {selectedAssignedUsers.length ? selectedAssignedUsers.map((assignedUser) => assignedUser.name).join(', ') : 'None'}</li>
              </ul>
            </aside>
          )}
        </div>
      </section>
    </main>
  );
}
