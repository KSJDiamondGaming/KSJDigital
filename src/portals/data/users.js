export const portalUsers = [
  {
    id: 'ksj-admin',
    name: 'KSJ Digital Admin',
    email: 'ksj@ksjdigital.co.uk',
    role: 'Owner',
    status: 'Active',
    websiteIds: ['ksjdigital', 'twotonetaj'],
    lastLogin: 'Demo session',
  },
  {
    id: 'twotonetaj-client',
    name: 'TwoToneTaj',
    email: 'media@ksjdigital.co.uk',
    role: 'Client',
    status: 'Active',
    websiteIds: ['twotonetaj'],
    lastLogin: 'Not connected yet',
  },
];

export function getPortalUserById(userId) {
  return portalUsers.find((user) => user.id === userId) ?? null;
}

export function getPortalUsersByWebsite(websiteId) {
  return portalUsers.filter((user) => user.websiteIds.includes(websiteId));
}
