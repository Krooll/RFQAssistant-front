import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Wystąpił nieoczekiwany błąd serwera.';

      if (error.status === 0) {
        errorMessage = 'Brak połączenia z serwerem. Sprawdź swoje łącze internetowe.';
      } else if (error.error) {
        if (typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else if (typeof error.error === 'object' && !error.error.message) {
          const validationErrors = Object.values(error.error).join('\n');
          errorMessage = validationErrors || errorMessage;
        } else if (typeof error.error === 'string') {
          errorMessage = error.error;
        }
      }

      notificationService.showError(errorMessage);

      return throwError(() => error);
    }),
  );
};
