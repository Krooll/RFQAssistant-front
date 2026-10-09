import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';

export const rootRedirectGuard: CanActivateFn = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);
  const userData = userDataService.getUserDataFromLocalStorage();

  if (!userData?.user) {
    return router.createUrlTree(['/auth/login']);
  }

  if (userData.user.supplierId) {
    return router.createUrlTree(['/dashboard/supplier-project']);
  }

  return router.createUrlTree(['/dashboard/project']);
};
