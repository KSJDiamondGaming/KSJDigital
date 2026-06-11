import { portalUser } from '../../data/portalData';
import { PORTAL_ROLES } from './permissions';
import { createPortalSession, storeSession } from './sessionManager';

const demoUsers = [
  {
    ...portalUser,
    role: PORTAL_ROLES.CLIENT,
    projectIds: ['twotonetaj'],
  },
];

export function getDemoPortalUser() {
  return demoUsers[0];
}

export function createDemoLoginSession() {
  const session = createPortalSession(getDemoPortalUser());
  storeSession(session);
  return session;
}

export function isValidPortalEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.');
}

export function normalisePortalEmail(email) {
  return email.trim().toLowerCase();
}
