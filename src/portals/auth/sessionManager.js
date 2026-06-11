const SESSION_KEY = 'ksj_portal_session';

export function getStoredSession() {
  try {
    const rawSession = window.localStorage.getItem(SESSION_KEY);
    return rawSession ? JSON.parse(rawSession) : null;
  } catch {
    return null;
  }
}

export function storeSession(session) {
  if (!session) return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function createPortalSession(user) {
  return {
    user,
    createdAt: new Date().toISOString(),
  };
}

export function getActivePortalUser(fallbackUser) {
  const session = getStoredSession();
  return session?.user ?? fallbackUser;
}
