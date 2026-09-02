import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { AuthorizationService } from '@core/services/auth-service/authorization';

export const roleGuard: CanActivateFn = (route, state) => {
  const userDataService = inject(UserDataService);
  const authorizationService = inject(AuthorizationService);
  const router = inject(Router);

  const currentUserData = userDataService.getUserDataFromLocalStorage();

  if (!currentUserData || !currentUserData.user) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  //TODO JAK JUZ BEDZIEMY MIELI REFRESH TOKEN TO NIE BEDZIEMY SPRAWDZAC W GUARD CZASU TOKENA
  if (userDataService.isUserTokenExpired()) {
    authorizationService.logout();
    return false;
  }

  const currentUserRole = currentUserData.user.role;
  const expectedRole = route.data['role'];

  if (expectedRole && currentUserRole !== expectedRole) {
    return router.createUrlTree(['/unauthorized']);
  }

  return true;
};
