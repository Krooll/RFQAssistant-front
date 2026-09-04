import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Router } from '@angular/router';
import { AuthDto, CreateAuthRequest } from '@core/dtos';
import { Observable, tap } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { RouteEndpoints } from '@env/route-endpoints';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);

  login(createAuthRequest: CreateAuthRequest): Observable<AuthDto> {
    return this._baseHttpService
      .postData<AuthDto, CreateAuthRequest>(Endpoints.authLogin, createAuthRequest)
      .pipe(
        tap((response) => {
          this._userDataService.saveCurrentUserData(response);
        }),
      );
  }

  logout(): void {
    this._userDataService.clearCurrentUserData();
    this._router.navigateByUrl(RouteEndpoints.authLogin);
  }
}
