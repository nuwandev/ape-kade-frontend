import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.me().pipe(
    map((res) => {
      if (res.success && res.data) {
        return true;
      } else {
        return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
      }
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } }));
    }),
  );
};
