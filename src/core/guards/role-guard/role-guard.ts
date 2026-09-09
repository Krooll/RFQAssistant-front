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
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const currentUserRole = currentUserData.user.role;
  const expectedRole = route.data['role'];

  if (expectedRole && currentUserRole !== expectedRole) {
    return router.createUrlTree([RouteEndpoints.unauthorized]);
  }

  return true;
};
