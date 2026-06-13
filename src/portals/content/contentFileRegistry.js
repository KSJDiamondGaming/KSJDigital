export const CONTENT_FILE_ROOT = 'content';

export const contentFileRegistry = {
  twotonetaj: {
    websiteId: 'twotonetaj',
    label: 'TwoToneTaj',
    root: `${CONTENT_FILE_ROOT}/twotonetaj`,
    pages: {
      homepage: `${CONTENT_FILE_ROOT}/twotonetaj/homepage.json`,
      about: `${CONTENT_FILE_ROOT}/twotonetaj/about.json`,
      community: `${CONTENT_FILE_ROOT}/twotonetaj/community.json`,
      merch: `${CONTENT_FILE_ROOT}/twotonetaj/merch.json`,
      contact: `${CONTENT_FILE_ROOT}/twotonetaj/contact.json`,
    },
  },
};

export function getContentFilePath(websiteId, pageId) {
  return contentFileRegistry[websiteId]?.pages?.[pageId] ?? `${CONTENT_FILE_ROOT}/${websiteId}/${pageId}.json`;
}

export function createContentFilePayload({ websiteId, pageId, schemaId, content, actorName = 'KSJ Digital', status = 'live' }) {
  return {
    websiteId,
    pageId,
    schemaId,
    status,
    updatedBy: actorName,
    updatedAt: new Date().toISOString(),
    content: content ?? {},
  };
}

export function serialiseContentFile(payload) {
  return `${JSON.stringify(payload, null, 2)}\n`;
}
