import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataService = inject(UserDataService);

  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const accessToken = userDataService.getUserAccessToken();

  if (currentUserData && accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `${currentUserData.tokenType} ${accessToken}`,
      },
    });
  }

  return next(req);
};
