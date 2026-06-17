// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// Local NestJS dev server runs on port 3000.
const API_URL = 'http://localhost:3000';

export const environment = {
  production: false,
  apiUrl: API_URL,
};
