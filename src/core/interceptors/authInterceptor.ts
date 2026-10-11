import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { catchError, EMPTY, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const userDataService = inject(UserDataService);
  const currentUserData = userDataService.getUserDataFromLocalStorage();
  const accessToken = userDataService.getUserAccessToken();

  if (req.url.includes('/auth/')) {
    return next(req);
  }

  if (!currentUserData || !accessToken) {
    return next(req);
  }

  if (userDataService.isUserTokenExpired()) {
    userDataService.clearCurrentUserData();
    return EMPTY;
  }

  if (currentUserData && accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `${currentUserData.tokenType} ${accessToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        userDataService.clearCurrentUserData();
      }
      return throwError(() => err);
    }),
  );
};
