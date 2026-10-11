import { ResolveFn } from '@angular/router';
import { SupplierDto } from '@core/dtos';
import { inject } from '@angular/core';
import { ResolverService } from '@core/services/resolver-service/resolver-service';
import { Endpoints } from '@env/endpoints';
import { catchError, EMPTY } from 'rxjs';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { AuthorizationService } from '@core/services/auth-service/authorization';

export const supplierProjectResolver: ResolveFn<SupplierDto> = () => {
  const resolverService = inject(ResolverService);
  const userDataService = inject(UserDataService);
  const authorizationServiceAccount = inject(AuthorizationService);

  const userData = userDataService.getUserDataFromLocalStorage();

  if (!userData?.user?.supplierId) {
    authorizationServiceAccount.logout();
    return EMPTY;
  }

  return resolverService.getById<SupplierDto>(Endpoints.supplier, userData?.user?.supplierId).pipe(
    catchError(() => {
      authorizationServiceAccount.logout();
      return EMPTY;
    }),
  );
};
