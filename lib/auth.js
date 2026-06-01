// ============================================================
// lib/auth.js  –  Shared Auth / Session Helper
// ============================================================
// All pages import this to resolve the current user.
// Flow:
//   1. Check sessionStorage for saved uid + displayName (fast path)
//   2. If missing → redirect to login.html?redirect=<current page>

export function getSession() {
  return {
    uid:         sessionStorage.getItem('vv_uid'),
    displayName: sessionStorage.getItem('vv_name') || 'ผู้ใช้',
    avatar:      sessionStorage.getItem('vv_avatar') || '',
    lineUid:     sessionStorage.getItem('vv_line_uid') || null,
  };
}

export function saveSession({ uid, displayName, avatar, lineUid }) {
  sessionStorage.setItem('vv_uid',      uid);
  sessionStorage.setItem('vv_name',     displayName || '');
  sessionStorage.setItem('vv_avatar',   avatar      || '');
  if (lineUid) sessionStorage.setItem('vv_line_uid', lineUid);
}

export function clearSession() {
  ['vv_uid','vv_name','vv_avatar','vv_line_uid'].forEach(k => sessionStorage.removeItem(k));
}

// Call at the top of every protected page.
// If not logged in → redirects automatically and returns null.
export function requireAuth() {
  const session = getSession();
  if (!session.uid) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login.html?redirect=${redirect}`;
    return null;
  }
  return session;
}
