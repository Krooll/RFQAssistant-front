import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Router } from '@angular/router';
import { TokenKeys } from '@core/services/auth-service/token-key';
import { AuthDto, CreateAuthRequest } from '@core/dtos';
import { Observable, tap } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { UserDataService } from '@core/services/user-data-service/user-data';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private readonly baseHttpService = inject(BaseHttpService);
  private readonly userDataService = inject(UserDataService);
  private readonly router = inject(Router);
  private readonly TOKEN_KEY = TokenKeys.auth_token;

  constructor() {
    this.checkInitialAuth();
  }

  login(createAuthRequest: CreateAuthRequest): Observable<AuthDto> {
    return this.baseHttpService
      .postData<AuthDto, CreateAuthRequest>(Endpoints.authLogin, createAuthRequest)
      .pipe(
        tap((response) => {
          this.userDataService.decodeAndSetCurrentUserData(response);
        }),
      );
  }

  logout(): void {
    this.userDataService.clearCurrentUserData();
    this.router.navigate(['/auth/login']);
  }

  checkInitialAuth(): void {
    const currentUserData = this.userDataService.getUserDataFromLocalStorage();
    const accessToken = this.userDataService.getUserAccessToken();
    const refreshToken = this.userDataService.getUserRefreshToken();

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
