import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '@core/services/user-data-service/user-data';

export const roleGuard: CanActivateFn = (route, state) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const currentUserRole = currentUserData?.user?.role;

  if (!currentUserData || !currentUserData.user) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  const expectedRole = route.data['role'];

  if (!expectedRole) {
    return true;
  }

  if (currentUserRole !== expectedRole) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
