import { Injectable } from '@angular/core';
import { AuthDto } from '@core/dtos';
import { UserDataLocalStorage } from '@core/dtos/user-data-local-storage/user-data-local-storage';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  decodeAndSetCurrentUserData(authResponse: AuthDto) {
    if (
      !authResponse ||
      !authResponse.user ||
      authResponse.expiresIn === undefined ||
      authResponse.expiresIn === null ||
      !authResponse.tokenType ||
      !authResponse.accessToken ||
      !authResponse.refreshToken
    ) {
      throw new Error(
        '[UserDataService]: Brak odpowiedzi lub danych użytkownika podczas logowania',
      );
    }

    const expiresAt = Date.now() + authResponse.expiresIn * 1000;

    const currentUserData: UserDataLocalStorage = {
      user: authResponse.user,
      expiresIn: expiresAt,
      tokenType: authResponse.tokenType,
    };

    localStorage.setItem('currentUserData', JSON.stringify(currentUserData));
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  clearCurrentUserData(): void {
    localStorage.removeItem('currentUserData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getUserDataFromLocalStorage(): UserDataLocalStorage | null {
    const data = localStorage.getItem('currentUserData');

    if (!data) {
      return null;
    }

    try {
      return JSON.parse(data) as UserDataLocalStorage;
    } catch (error) {
      console.error('[UserDataService]: Błąd podczas parsowania danych z localStorage', error);
      this.clearCurrentUserData();
      return null;
    }
  }

  getUserAccessToken(): string | null {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
      console.error('[UserDataService]: Błąd podczas pobierania tokenu z localStorage');
      return null;
    }

    return accessToken;
  }

  getUserRefreshToken(): string | null {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      console.error('[UserDataService]: Błąd podczas pobierania tokenu z localStorage');
      return null;
    }

    return refreshToken;
  }
}
