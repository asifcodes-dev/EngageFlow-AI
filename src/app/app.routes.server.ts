import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Per-route rendering mode for the build-time prerender pass.
 *
 * Only the static, unauthenticated marketing/legal pages are prerendered —
 * this is what makes their content visible to crawlers (e.g. Meta's App
 * Review reviewer/bot) without running JavaScript, and gives them a real
 * canonical URL with real HTML for App Review's Privacy Policy / Terms of
 * Service / Data Deletion links.
 *
 * Everything else (auth, the authenticated dashboard, the dynamic public
 * store, and the 404 page) stays `RenderMode.Client` — i.e. unchanged from
 * today: shipped as the existing SPA bundle, rendered entirely in the
 * browser. Nothing here changes their behavior, guards, or data loading.
 */
export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'privacy-policy', renderMode: RenderMode.Prerender },
  { path: 'terms-of-service', renderMode: RenderMode.Prerender },
  { path: 'refund-policy', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
