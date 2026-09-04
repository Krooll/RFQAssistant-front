import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';

export const loggedGuard = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.getUserDataFromLocalStorage()?.user) {
    return router.createUrlTree([RouteEndpoints.dashboard]);
  }

  return true;
};
