import { useMemo, useState } from 'react';
import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import {
  getPortalData,
  getPortalWebsiteById,
  getWebsiteContentPage,
  getWebsiteSchemaPages,
  saveWebsiteDraftContent,
  submitWebsiteDraftForApproval,
} from '../portals/data/portalManager';

const DEFAULT_WEBSITE_ID = 'twotonetaj';

function getInitialDraftValues(websiteId, pageId, fields) {
  const pageContent = getWebsiteContentPage(websiteId, pageId);
  return fields.reduce((values, field) => ({
    ...values,
    [field.id]: pageContent.draft?.[field.id] ?? pageContent.live?.[field.id] ?? '',
  }), {});
}

export default function PortalsWebsiteEditor() {
  const session = getStoredSession();
  const actorName = session?.user?.name ?? 'Client';
  const website = getPortalWebsiteById(DEFAULT_WEBSITE_ID);
  const [portalData, setPortalData] = useState(getPortalData());
  const pages = getWebsiteSchemaPages(DEFAULT_WEBSITE_ID);
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? 'homepage');
  const activePage = useMemo(() => pages.find((page) => page.id === activePageId) ?? pages[0], [pages, activePageId]);
  const activePageContent = portalData.content?.[DEFAULT_WEBSITE_ID]?.[activePage?.id] ?? { live: {}, draft: {} };
  const [draftValues, setDraftValues] = useState(() => getInitialDraftValues(DEFAULT_WEBSITE_ID, activePageId, activePage?.fields ?? []));
  const [editorStatus, setEditorStatus] = useState('Ready');

  function refreshPortalData(nextData = getPortalData()) {
    setPortalData(nextData);
  }

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  function selectPage(pageId) {
    const nextPage = pages.find((page) => page.id === pageId);
    setActivePageId(pageId);
    setDraftValues(getInitialDraftValues(DEFAULT_WEBSITE_ID, pageId, nextPage?.fields ?? []));
    setEditorStatus('Ready');
  }

  function updateDraftValue(fieldId, value) {
    setDraftValues((current) => ({ ...current, [fieldId]: value }));
  }

  function saveDraft() {
    if (!activePage) return;
    const savedData = saveWebsiteDraftContent(DEFAULT_WEBSITE_ID, activePage.id, draftValues, actorName);
    refreshPortalData(savedData);
    setEditorStatus('Draft saved');
  }

  function submitForApproval() {
    if (!activePage) return;
    const savedData = saveWebsiteDraftContent(DEFAULT_WEBSITE_ID, activePage.id, draftValues, actorName);
    refreshPortalData(submitWebsiteDraftForApproval(DEFAULT_WEBSITE_ID, activePage.id, actorName));
    if (savedData) setEditorStatus('Submitted for approval');
  }

  const draftCount = Object.values(portalData.content?.[DEFAULT_WEBSITE_ID] ?? {}).filter((page) => Object.keys(page.draft ?? {}).length).length;

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
              <p className="portal-role-line">Signed in as <strong>{actorName}</strong></p>
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
              <p>Clients edit approved content fields only. Layouts, styles, components, branding, and code stay locked.</p>
              <dl>
                <div><dt>Publishing</dt><dd>{website?.publishMode}</dd></div>
                <div><dt>Draft Pages</dt><dd>{draftCount}</dd></div>
                <div><dt>Backup</dt><dd>48 Hour Restore Safety</dd></div>
              </dl>
            </div>
          </article>

          <section className="portal-editor-panel">
            <div className="portal-editor-header">
              <div>
                <p className="eyebrow">CMS Phase 2</p>
                <h2>Draft Editor</h2>
                <p>Edit content safely, save it as a draft, then submit it to KSJ Digital for approval.</p>
              </div>
              <a href="/">View Live Site</a>
            </div>

            <div className="portal-inline-actions">
              {pages.map((page) => (
                <button type="button" key={page.id} onClick={() => selectPage(page.id)}>{page.title}</button>
              ))}
            </div>

            <div className="portal-grid-two">
              <section className="portal-management-card compact">
                <div className="portal-section-title-row"><strong>{activePage?.title ?? 'Page'} Fields</strong><span>{editorStatus}</span></div>
                <p>{activePage?.description ?? 'Select a page to edit.'}</p>

                <div className="portal-admin-form">
                  {(activePage?.fields ?? []).map((field) => (
                    <label key={field.id}>
                      {field.label}
                      {field.type === 'textarea' ? (
                        <textarea value={draftValues[field.id] ?? ''} rows="4" onChange={(event) => updateDraftValue(field.id, event.target.value)} />
                      ) : (
                        <input value={draftValues[field.id] ?? ''} onChange={(event) => updateDraftValue(field.id, event.target.value)} />
                      )}
                    </label>
                  ))}
                </div>

                <div className="portal-action-row portal-action-row-primary">
                  <button type="button" onClick={saveDraft}>Save Draft</button>
                  <button type="button" className="portal-warning-button" onClick={submitForApproval}>Submit For Approval</button>
                </div>
                <p className="portal-inline-notice">Submitting does not publish the website. It creates a review item for KSJ Digital.</p>
              </section>

              <section className="portal-help-card portal-selection-guide">
                <p className="eyebrow">Live vs Draft</p>
                <h3>{activePage?.title ?? 'Page'} Snapshot</h3>
                <p>Live content remains protected until a publish request is approved and published.</p>

                <div className="portal-detail-group">
                  <strong>Current Live</strong>
                  {(activePage?.fields ?? []).map((field) => <small key={field.id}>{field.label}: {activePageContent.live?.[field.id] || 'Empty'}</small>)}
                </div>

                <div className="portal-detail-group">
                  <strong>Current Draft</strong>
                  {(activePage?.fields ?? []).map((field) => <small key={field.id}>{field.label}: {draftValues[field.id] || 'Empty'}</small>)}
                </div>
              </section>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
