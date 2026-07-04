// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Production API is the self-hosted NestJS backend on the VPS.
const API_URL = 'https://api.engageflow.khandelwaldeepak.com';

export const environment = {
  production: true,
  apiUrl: API_URL,
  // Dev-only escape hatch to preview Instagram-gated UI. MUST stay false in prod —
  // real lock state comes from the backend connection status.
  previewUnlocked: false,
  // Public Google OAuth client id for social login (Phase 10). Empty = disabled.
  googleClientId: "495688753227-rivnc44ut038uund6mp33tqpc8lpbc4r.apps.googleusercontent.com"
};
