import { ResolveFn, Router } from '@angular/router';
import { UserDto } from '@core/dtos';
import { inject } from '@angular/core';
import { ActivateUserService } from '@features/activate-user-component/activate-user-service';
import { RouteEndpoints } from '@env/route-endpoints';
import { catchError, EMPTY } from 'rxjs';

export const activateUserResolver: ResolveFn<UserDto> = (route) => {
  const router = inject(Router);
  const activationAccountService = inject(ActivateUserService);

  const token = route.queryParamMap.get('token');

  if (!token) {
    router.navigateByUrl(RouteEndpoints.unauthorized);
    return EMPTY;
  }

  return activationAccountService.getUserByActivateToken(token).pipe(
    catchError(() => {
      router.navigateByUrl(RouteEndpoints.unauthorized);
      return EMPTY;
    }),
  );
};
