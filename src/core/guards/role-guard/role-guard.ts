import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';

export const roleGuard: CanActivateFn = (route, state) => {
  const userDataService = inject(UserDataService);
  const router = inject(Router);

  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const currentUserRole = currentUserData?.user?.role;

  const expectedRole = route.data['role'] || undefined;

  if (!currentUserData || !currentUserRole) {
    return router.createUrlTree(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
  }

  if (!expectedRole || expectedRole.length === 0) {
    return true;
  }

  const hasRequiredRole = checkRoles(expectedRole, currentUserRole);

  if (hasRequiredRole) {
    return true;
  }

  return router.createUrlTree(['/unauthorized']);
};

function checkRoles(expectedRole: string, inputRole: string): boolean {
  return expectedRole === inputRole;
}
