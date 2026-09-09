import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Router } from '@angular/router';
import { AuthDto, CreateAuthRequest } from '@core/dtos';
import { Observable, tap } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { RouteEndpoints } from '@env/route-endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _userDataService = inject(UserDataService);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);

  public login(createAuthRequest: CreateAuthRequest): Observable<AuthDto> {
    return this._baseHttpService
      .postData<AuthDto, CreateAuthRequest>(Endpoints.authLogin, createAuthRequest)
      .pipe(
        tap((response) => {
          this._userDataService.saveCurrentUserData(response);
        }),
      );
  }

  public logout(): void {
    this._userDataService.clearCurrentUserData();
    this._modalService.closeAllModals();
    this._router.navigateByUrl(RouteEndpoints.authLogin);
  }
}
