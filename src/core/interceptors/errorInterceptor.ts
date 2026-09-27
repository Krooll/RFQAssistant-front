import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Wystąpił nieoczekiwany błąd serwera.';

      switch (error.status) {
        case 0:
          errorMessage = 'Brak połączenia z serwerem. Sprawdź swoje łącze internetowe.';
          break;

        case 401:
          errorMessage = error.error?.message ? error.error.message : 'Twoja sesja wygasła. Zaloguj się ponownie.';
          break;

        case 403:
          errorMessage = 'Brak uprawnień do wykonania tej operacji.';
          break;

        case 404:
          errorMessage = 'Poszukiwany zasób nie istnieje.';
          break;

        default:
          errorMessage = extractBackendErrorMessage(error.error) ?? errorMessage;
          break;
      }

      notificationService.showError(errorMessage);
      return throwError(() => error);
    }),
  );
};

function extractBackendErrorMessage(errorBody: unknown): string | null {
  if (!errorBody) return null;

  if (typeof errorBody === 'string') {
    return errorBody;
  }

  if (typeof errorBody === 'object') {
    const body = errorBody as Record<string, unknown>;

    if (body['message'] && typeof body['message'] === 'string') {
      return body['message'];
    }

    const values = Object.values(body).filter((val) => typeof val === 'string');
    if (values.length > 0) {
      return values.join('\n');
    }
  }

  return null;
}
