import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Gates /dashboard/admin/*. The parent authGuard already handled the token;
 * this only checks the role. On a hard refresh the in-memory user is empty, so
 * fall back to loadCurrentUser() — which also warms currentUser$ for the
 * sidebar's Admin group. Non-admins go to the dashboard home, never logged out.
 * (UX only — the server enforces ADMIN with a 403 on every /admin endpoint.)
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const fallback = router.createUrlTree(['/dashboard']);

  const cached = auth.currentUser;
  if (cached?.role) {
    return cached.role === 'ADMIN' ? true : fallback;
  }
  return auth.loadCurrentUser().pipe(
    map((user) => (user.role === 'ADMIN' ? true : fallback)),
    catchError(() => of(fallback)), // a 401 already logs out via the interceptor
  );
};
