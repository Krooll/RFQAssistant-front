import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { RouteEndpoints } from '@env/route-endpoints';

export const dashboardRedirectGuard = () => {
  const router = inject(Router);
  const userDataService = inject(UserDataService);
  const userData = userDataService.getUserDataFromLocalStorage();

  const targetPath = userData?.user?.supplierId ? RouteEndpoints.supplierProject : RouteEndpoints.project;

  return router.createUrlTree([targetPath]);
};
