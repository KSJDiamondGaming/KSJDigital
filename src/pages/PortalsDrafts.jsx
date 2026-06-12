import { useMemo, useState } from 'react';
import KsjDigitalLogo from '../assets/logos/KsjDigitalLogo.png';
import { clearSession, getStoredSession } from '../portals/auth/sessionManager';
import { getPortalDrafts, getPortalWebsiteById } from '../portals/data/portalManager';

export default function PortalsDrafts() {
  const session = getStoredSession();
  const portalDrafts = getPortalDrafts();
  const [selectedDraftId, setSelectedDraftId] = useState(portalDrafts[0]?.id ?? null);
  const [reviewStatus, setReviewStatus] = useState('Ready For Review');

  const selectedDraft = useMemo(
    () => portalDrafts.find((draft) => draft.id === selectedDraftId) ?? portalDrafts[0],
    [portalDrafts, selectedDraftId],
  );
  const selectedWebsite = selectedDraft ? getPortalWebsiteById(selectedDraft.websiteId) : null;

  function handleLogout() {
    clearSession();
    window.location.href = '/portals';
  }

  return (
    <main className="portals-shell portals-dashboard-page">
      <section className="portal-dashboard-frame" aria-label="Portal drafts">
        <aside className="portal-sidebar">
          <img src={KsjDigitalLogo} alt="KSJ Digital" />
          <span>Portals</span>
          <nav>
            <a href="/portals/dashboard">Dashboard</a>
            <a href="/portals/websites/twotonetaj">Editor</a>
            <a href="/portals/drafts" className="active">Drafts</a>
            <a href="/portals/publish-requests">Publish Requests</a>
            <a href="/portals/support">Support</a>
            <a href="/portals/account">Account</a>
          </nav>
        </aside>

        <div className="portal-dashboard-main">
          <header className="portal-dashboard-header">
            <div>
              <p className="eyebrow">Draft Review</p>
              <h2>Saved Website Drafts</h2>
              <p className="portal-role-line">Signed in as <strong>{session?.user?.name ?? 'Client'}</strong></p>
            </div>
            <button className="portal-logout-button" type="button" onClick={handleLogout}>Logout</button>
          </header>

          <div className="portal-admin-stats">
            <article className="portal-help-card"><p className="eyebrow">Drafts</p><h3>{portalDrafts.length}</h3></article>
            <article className="portal-help-card"><p className="eyebrow">Ready</p><h3>{portalDrafts.filter((draft) => draft.status === 'Draft Ready').length}</h3></article>
            <article className="portal-help-card"><p className="eyebrow">Needs Review</p><h3>{portalDrafts.filter((draft) => draft.status === 'Needs Review').length}</h3></article>
            <article className="portal-help-card"><p className="eyebrow">Selected</p><h3>{selectedDraft?.section ?? 'None'}</h3></article>
          </div>

          <div className="portal-grid-two">
            <section className="portal-editor-panel">
              <div className="portal-editor-header">
                <div>
                  <p className="eyebrow">Draft Queue</p>
                  <h2>Review Drafts</h2>
                  <p>Select a saved client draft to compare it against the current live version.</p>
                </div>
              </div>

              <div className="portal-section-list">
                {portalDrafts.map((draft) => {
                  const website = getPortalWebsiteById(draft.websiteId);
                  return (
                    <article key={draft.id}>
                      <div>
                        <div className="portal-section-title-row"><strong>{draft.section}</strong><span>{draft.status}</span></div>
                        <p>{draft.summary}</p>
                        <ul>
                          <li>{website?.name ?? draft.websiteId}</li>
                          <li>Updated by {draft.updatedBy}</li>
                          <li>Submitted: {draft.submittedAt ?? 'Not submitted yet'}</li>
                        </ul>
                      </div>
                      <button type="button" onClick={() => setSelectedDraftId(draft.id)}>Review</button>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="portal-help-card portal-selection-guide">
              <p className="eyebrow">Draft Details</p>
              <h3>{selectedDraft?.section ?? 'No draft selected'}</h3>
              <p>{selectedDraft?.summary ?? 'Select a draft to review it.'}</p>

              {selectedDraft && (
                <>
                  <div className="portal-detail-group">
                    <strong>Review Info</strong>
                    <small>Website: {selectedWebsite?.name ?? selectedDraft.websiteId}</small>
                    <small>Status: {selectedDraft.status}</small>
                    <small>Updated by: {selectedDraft.updatedBy}</small>
                    <small>Review status: {reviewStatus}</small>
                  </div>

                  <div className="portal-grid-two">
                    <div className="portal-management-card compact">
                      <div className="portal-section-title-row"><strong>Current Live</strong><span>Protected</span></div>
                      <p>{selectedDraft.currentVersion ?? 'Current live content snapshot unavailable.'}</p>
                    </div>
                    <div className="portal-management-card compact">
                      <div className="portal-section-title-row"><strong>Draft Version</strong><span>Editable</span></div>
                      <p>{selectedDraft.draftVersion ?? 'Draft content snapshot unavailable.'}</p>
                    </div>
                  </div>

                  <div className="portal-action-row portal-action-row-primary">
                    <button type="button" onClick={() => setReviewStatus('Submitted For Approval')}>Submit For Approval</button>
                    <button type="button" className="portal-secondary-button" onClick={() => setReviewStatus('Needs Changes')}>Reject Draft</button>
                  </div>
                  <div className="portal-action-row portal-action-row-danger">
                    <button type="button" className="portal-warning-button" onClick={() => setReviewStatus('Ready To Publish')}>Mark Ready To Publish</button>
                  </div>
                  <p className="portal-inline-notice">Publishing this draft will create a 48-hour restore backup before replacing the live version.</p>
                </>
              )}
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
