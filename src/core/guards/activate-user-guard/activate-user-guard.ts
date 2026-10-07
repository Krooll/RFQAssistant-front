import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { RouteEndpoints } from '@env/route-endpoints';

export const activateUserGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const token = route.queryParamMap.get('token');

  if (!token || token.trim() === '') {
    return router.createUrlTree([RouteEndpoints.unauthorized]);
  }

  return true;
};
