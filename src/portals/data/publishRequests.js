export const portalPublishRequests = [
  {
    id: 'request-homepage-draft',
    websiteId: 'twotonetaj',
    title: 'Homepage draft review',
    requestedBy: 'TwoToneTaj',
    status: 'Draft',
    updatedAt: 'Awaiting first portal draft',
    summary: 'No live publish request has been submitted yet.',
  },
];

export function getPublishRequestsByWebsite(websiteId) {
  return portalPublishRequests.filter((request) => request.websiteId === websiteId);
}
