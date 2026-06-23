// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Local NestJS dev server runs on port 3000.
const API_URL = 'http://localhost:3000';

export const environment = {
  production: false,
  apiUrl: API_URL,
  // Flip to `true` (then restart `npm start`) to preview the Instagram-gated
  // pages unlocked, without a connected account. Locked by default.
  previewUnlocked: false,
};
