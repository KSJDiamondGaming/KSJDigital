import { getPortalData, savePortalData } from '../data/portalManager';
import { createPortalSession, storeSession, clearSession, getStoredSession } from './sessionManager';

const OWNER_TEMP_PASSWORD = 'OwnerChangeMe123!';
const CLIENT_TEMP_PASSWORD = 'ClientChangeMe123!';

function normaliseRole(role) {
  if (role === 'staff') return 'websiteManager';
  if (role === 'client') return 'clientAdmin';
  return role ?? 'clientAdmin';
}

function sanitizeUserForSession(user) {
  const { passwordHash, passwordUpdatedAt, ...safeUser } = user;
  return {
    ...safeUser,
    role: normaliseRole(safeUser.role),
  };
}

async function sha256(value) {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function hashPortalPassword(password) {
  return sha256(String(password ?? ''));
}

export function isValidPortalEmail(email) {
  return typeof email === 'string' && email.includes('@') && email.includes('.');
}

export function normalisePortalEmail(email) {
  return String(email ?? '').trim().toLowerCase();
}

function getTemporaryPasswordForUser(user) {
  return normaliseRole(user?.role) === 'owner' ? OWNER_TEMP_PASSWORD : CLIENT_TEMP_PASSWORD;
}

export async function authenticatePortalUser(email, password, options = {}) {
  const cleanEmail = normalisePortalEmail(email);
  const cleanPassword = String(password ?? '');

  if (!isValidPortalEmail(cleanEmail)) {
    return { ok: false, message: 'Enter a valid email address.' };
  }

  if (!cleanPassword) {
    return { ok: false, message: 'Enter your password.' };
  }

  const portalData = getPortalData();
  const users = portalData.users ?? [];
  const user = users.find((portalUser) => normalisePortalEmail(portalUser.email) === cleanEmail);

  if (!user) {
    return { ok: false, message: 'No portal account exists for that email address.' };
  }

  if (user.status !== 'Active') {
    return { ok: false, message: 'This portal account is not active. Contact KSJ Digital support.' };
  }

  const providedHash = await hashPortalPassword(cleanPassword);
  const usingTemporaryPassword = !user.passwordHash;
  const fallbackHash = usingTemporaryPassword ? await hashPortalPassword(getTemporaryPasswordForUser(user)) : null;
  const expectedHash = user.passwordHash ?? fallbackHash;

  if (providedHash !== expectedHash) {
    return { ok: false, message: 'Incorrect email or password.' };
  }

  const updatedUsers = users.map((portalUser) => (
    portalUser.id === user.id
      ? {
          ...portalUser,
          passwordHash: expectedHash,
          passwordUpdatedAt: portalUser.passwordUpdatedAt ?? 'Temporary password activated',
          mustChangePassword: usingTemporaryPassword || portalUser.mustChangePassword,
          lastLogin: 'Just now',
        }
      : portalUser
  ));

  savePortalData({ ...portalData, users: updatedUsers });

  const session = createPortalSession(sanitizeUserForSession({ ...user, passwordHash: expectedHash, mustChangePassword: usingTemporaryPassword || user.mustChangePassword, lastLogin: 'Just now' }), { rememberMe: options.rememberMe });
  storeSession(session);
  return { ok: true, session };
}

export function validatePortalSession() {
  const portalData = getPortalData();
  const rawSession = getStoredSession();
  const sessionUser = rawSession?.user;
  if (!sessionUser?.id) return null;

  const currentUser = (portalData.users ?? []).find((user) => user.id === sessionUser.id);
  if (!currentUser || currentUser.status !== 'Active') {
    clearSession();
    return null;
  }

  return {
    ...rawSession,
    user: sanitizeUserForSession(currentUser),
  };
}

export async function changePortalPassword(userId, currentPassword, nextPassword, confirmPassword) {
  if (!nextPassword || nextPassword.length < 8) {
    return { ok: false, message: 'New password must be at least 8 characters long.' };
  }

  if (nextPassword !== confirmPassword) {
    return { ok: false, message: 'New passwords do not match.' };
  }

  const portalData = getPortalData();
  const users = portalData.users ?? [];
  const user = users.find((portalUser) => portalUser.id === userId);

  if (!user) return { ok: false, message: 'Portal user could not be found.' };

  const currentHash = await hashPortalPassword(currentPassword);
  const expectedHash = user.passwordHash ?? await hashPortalPassword(getTemporaryPasswordForUser(user));

  if (currentHash !== expectedHash) {
    return { ok: false, message: 'Current password is incorrect.' };
  }

  const nextHash = await hashPortalPassword(nextPassword);
  const nextUsers = users.map((portalUser) => portalUser.id === userId ? {
    ...portalUser,
    passwordHash: nextHash,
    passwordUpdatedAt: 'Just now',
    mustChangePassword: false,
  } : portalUser);

  savePortalData({ ...portalData, users: nextUsers });

  const activeSession = getStoredSession();
  if (activeSession?.user?.id === userId) {
    const updatedUser = nextUsers.find((portalUser) => portalUser.id === userId);
    storeSession({ ...activeSession, user: sanitizeUserForSession(updatedUser) });
  }

  return { ok: true, message: 'Password updated successfully.' };
}

export const PORTAL_TEMP_CREDENTIALS = {
  owner: OWNER_TEMP_PASSWORD,
  client: CLIENT_TEMP_PASSWORD,
};
