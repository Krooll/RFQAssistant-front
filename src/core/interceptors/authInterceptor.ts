import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { EMPTY } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataService = inject(UserDataService);
  const authorizationService = inject(AuthorizationService);

  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const accessToken = userDataService.getUserAccessToken();

  if (req.url.includes('/auth/') || !currentUserData || !accessToken) {
    return next(req);
  }

  if (userDataService.isUserTokenExpired()) {
    authorizationService.logout();
    return EMPTY;
  }

  if (currentUserData && accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `${currentUserData.tokenType} ${accessToken}`,
      },
    });
  }

  return next(req);
};
