import { createContentFilePayload, getContentFilePath, serialiseContentFile } from './contentFileRegistry';

function getSchemaId(portalData, websiteId, request) {
  return request?.schemaId ?? portalData.websiteRegistry?.[websiteId]?.schemaId ?? 'custom';
}

export function createPublishContentWrite({ portalData, request, draft, actorName }) {
  const websiteId = request?.websiteId ?? draft?.websiteId;
  const pageId = request?.pageId ?? draft?.pageId;
  const currentPageContent = websiteId && pageId
    ? portalData.content?.[websiteId]?.[pageId] ?? { live: {}, draft: {}, backup: null }
    : { live: {}, draft: {}, backup: null };
  const content = currentPageContent.draft ?? {};
  const schemaId = getSchemaId(portalData, websiteId, request);
  const contentFilePath = request?.contentFilePath ?? draft?.contentFilePath ?? getContentFilePath(websiteId, pageId);
  const payload = createContentFilePayload({ websiteId, pageId, schemaId, content, actorName, status: 'live' });

  return {
    websiteId,
    pageId,
    schemaId,
    contentFilePath,
    content,
    payload,
    serialisedContent: serialiseContentFile(payload),
    commitMessage: `Publish ${websiteId} ${pageId} content`,
    status: 'Prepared',
    note: 'Prepared for GitHub content-file write. The browser demo records this metadata; backend publishing will use it to update the repository file.',
  };
}

export function createRestoreContentWrite({ portalData, backup, actorName }) {
  const websiteId = backup?.websiteId;
  const pageId = backup?.pageId;
  const schemaId = portalData.websiteRegistry?.[websiteId]?.schemaId ?? 'custom';
  const contentFilePath = backup?.contentFilePath ?? getContentFilePath(websiteId, pageId);
  const payload = createContentFilePayload({ websiteId, pageId, schemaId, content: backup?.contentSnapshot ?? {}, actorName, status: 'live' });

  return {
    websiteId,
    pageId,
    schemaId,
    contentFilePath,
    content: backup?.contentSnapshot ?? {},
    payload,
    serialisedContent: serialiseContentFile(payload),
    commitMessage: `Restore ${websiteId} ${pageId} content backup`,
    status: 'Prepared',
    note: 'Prepared for GitHub content-file restore write. Backend publishing will use it to update the repository file.',
  };
}
