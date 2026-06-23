// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Production API is the Railway-hosted NestJS backend.
const API_URL = 'https://engageflow-backend-production.up.railway.app';

export const environment = {
  production: true,
  apiUrl: API_URL,
  // Dev-only escape hatch to preview Instagram-gated UI. MUST stay false in prod —
  // real lock state comes from the backend connection status.
  previewUnlocked: false,
};
