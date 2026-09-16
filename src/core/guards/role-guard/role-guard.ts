import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { RouteEndpoints } from '@env/route-endpoints';

export const roleGuard: CanActivateFn = (route, state) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const isTokenExpired = userDataService.isUserTokenExpired();

  if (!currentUserData || !currentUserData.user || isTokenExpired) {
    return router.createUrlTree([RouteEndpoints.authLogin], {
      queryParams: { returnUrl: state.url },
    });
  }

  const currentUserRole = currentUserData.user.role;

  if (!currentUserRole) {
    return router.createUrlTree([RouteEndpoints.unauthorized]);
  }

  const requiredRoles: string | string[] = route.data['roles'];

  if (requiredRoles) {
    const hasRole = Array.isArray(requiredRoles)
      ? requiredRoles.includes(currentUserRole)
      : currentUserRole === requiredRoles;

    if (!hasRole) {
      return router.createUrlTree([RouteEndpoints.unauthorized]);
    }
  }

  return true;
};
