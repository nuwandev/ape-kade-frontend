import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { catchError, map, of } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.me().pipe(
    map((res) => {
      if (res.success && res.data) {
        return router.createUrlTree(['/dashboard']);
      } else {
        return true;
      }
    }),
    catchError(() => {
      return of(true);
    }),
  );
};
