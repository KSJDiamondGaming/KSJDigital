export const portalWebsites = [
  {
    id: 'ksjdigital',
    name: 'KSJ Digital',
    type: 'Business Website',
    domain: 'ksjdigital.co.uk',
    url: 'https://ksjdigital.co.uk/',
    status: 'Live',
    access: 'Owner Management',
    publishMode: 'Owner Controlled',
    plan: 'KSJ Internal',
    assignedUserIds: ['ksj-admin'],
    description: 'Internal KSJ Digital website and portal management access for the owner/admin account.',
  },
  {
    id: 'twotonetaj',
    name: 'TwoToneTaj',
    type: 'Creator Website',
    domain: 'twotonetaj.ksjdigital.co.uk',
    url: 'https://twotonetaj.ksjdigital.co.uk/',
    status: 'Live',
    access: 'Website Management',
    publishMode: 'Approval Required',
    plan: 'Managed Website',
    assignedUserIds: ['twotonetaj-client'],
    description: 'Client creator website managed through KSJ Digital Portals with draft-first publishing approval.',
  },
];

export function getPortalWebsiteById(websiteId) {
  return portalWebsites.find((website) => website.id === websiteId) ?? null;
}

export function getPortalWebsitesByUser(user) {
  if (!user?.websiteIds) return [];
  return portalWebsites.filter((website) => user.websiteIds.includes(website.id));
}
