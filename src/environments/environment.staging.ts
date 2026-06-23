// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Staging API is the staging NestJS backend on Railway.
// TODO: replace with the real staging backend host once it's provisioned.
const API_URL = 'https://engageflow-backend-staging.up.railway.app';

export const environment = {
  production: false,
  apiUrl: API_URL,
  previewUnlocked: false,
};
