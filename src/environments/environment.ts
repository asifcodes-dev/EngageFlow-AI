// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Production API is the Railway-hosted NestJS backend.
const API_URL = 'https://engageflow-backend-production.up.railway.app';

export const environment = {
  production: true,
  apiUrl: API_URL,
};
