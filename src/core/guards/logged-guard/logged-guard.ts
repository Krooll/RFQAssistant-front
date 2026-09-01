import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router } from '@angular/router';

export const loggedGuard = () => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  if (userDataService.getUserDataFromLocalStorage()?.user) {
    return router.createUrlTree(['/dashboard']);
  }

  return true;
};
