// Single source of truth for the API base URL (no global prefix — the backend has no /api).
// NOTE: a deployed site cannot reach localhost; set this to the real API URL once the
// backend is hosted (e.g. https://api.engageflow.ai).
const API_URL = 'http://localhost:3000';

export const environment = {
  production: true,
  apiUrl: API_URL,
};
