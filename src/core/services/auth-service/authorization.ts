import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Router } from '@angular/router';
import { AuthDto, CreateAuthRequest } from '@core/dtos';
import { Observable, tap } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { UserDataService } from '@core/services/user-data-service/user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);

  constructor() {
    this.checkInitialAuth();
  }

  login(createAuthRequest: CreateAuthRequest): Observable<AuthDto> {
    return this._baseHttpService
      .postData<AuthDto, CreateAuthRequest>(Endpoints.authLogin, createAuthRequest)
      .pipe(
        tap((response) => {
          this._userDataService.decodeAndSetCurrentUserData(response);
        }),
      );
  }

  logout(): void {
    this._userDataService.clearCurrentUserData();
    this._router.navigateByUrl('/auth/login');
  }

  checkInitialAuth(): void {
    const currentUserData = this._userDataService.getUserDataFromLocalStorage();
    const accessToken = this._userDataService.getUserAccessToken();
    const refreshToken = this._userDataService.getUserRefreshToken();

    if (
      !currentUserData ||
      !accessToken ||
      !refreshToken ||
      Date.now() >= currentUserData.expiresIn
    ) {
      this.logout();
    }
  }
}
