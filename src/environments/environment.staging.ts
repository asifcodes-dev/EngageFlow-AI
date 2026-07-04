// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// No separate staging server is provisioned — everything runs on one self-hosted
// VPS. TODO: point at a real staging host if one is ever set up.
const API_URL = 'https://api.engageflow.khandelwaldeepak.com';

export const environment = {
  production: false,
  apiUrl: API_URL,
  previewUnlocked: false,
  // Public Google OAuth client id for social login (Phase 10). Empty = disabled.
  googleClientId: "495688753227-rivnc44ut038uund6mp33tqpc8lpbc4r.apps.googleusercontent.com"
};
