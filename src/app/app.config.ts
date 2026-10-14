import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth.interceptor';
import { PreloadWhenAuthedStrategy } from './shared/strategies/preload-when-authed.strategy';

// NOTE: client hydration is intentionally NOT enabled. The pages are still
// prerendered (SEO / fast first paint), but a hydration mismatch on the
// marketing pages was duplicating the DOM and leaving routerLinks/handlers
// inert (clicks did nothing). Without hydration the client bootstraps and
// renders fresh, so all navigation and interactivity work reliably.
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      // Prefetch lazy chunks after first paint — but only for signed-in users.
      withPreloading(PreloadWhenAuthedStrategy),
    ),
  ],
};
