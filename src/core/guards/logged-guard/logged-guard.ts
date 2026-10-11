import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';

export const loggedGuard = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);
  const userData = userDataService.getUserDataFromLocalStorage();

  if (!userData?.user || userDataService.isUserTokenExpired()) {
    userDataService.clearCurrentUserData();
    return true;
  }

  return router.createUrlTree([RouteEndpoints.dashboard]);
};
