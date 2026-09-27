import { Injectable } from '@angular/core';
import { AuthDto } from '@core/dtos';
import { UserDataLocalStorage } from '@core/core-dtos/user-data-local-storage/user-data-local-storage';
import { jwtDecode } from 'jwt-decode';
import { Token } from '@core/core-dtos/token/token';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  public saveCurrentUserData(authResponse: AuthDto) {
    if (
      !authResponse ||
      !authResponse.user ||
      !authResponse.tokenType ||
      !authResponse.accessToken ||
      !authResponse.refreshToken
    ) {
      throw new Error('[UserDataService]: Brak odpowiedzi lub danych użytkownika podczas logowania');
    }

    const currentUserData: UserDataLocalStorage = {
      user: authResponse.user,
      tokenType: authResponse.tokenType,
    };

    localStorage.setItem('currentUserData', JSON.stringify(currentUserData));
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
  }

  public clearCurrentUserData(): void {
    localStorage.removeItem('currentUserData');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  public getUserDataFromLocalStorage(): UserDataLocalStorage | null {
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

  public getUserAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public getUserRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private decodeAccessToken(accessToken: string): Token | null {
    try {
      return jwtDecode(accessToken);
    } catch (error) {
      console.error('[UserDataService]: Błąd dekodowania JWT', error);
      return null;
    }
  }

  public isUserTokenExpired(): boolean {
    const token = this.getUserAccessToken();
    if (!token) {
      return true;
    }

    const decodedToken = this.decodeAccessToken(token);

    if (!decodedToken || !decodedToken.exp) {
      return true;
    }

    const expTimeMs = decodedToken.exp * 1000;
    const marginInMs = 30 * 1000;

    return Date.now() >= expTimeMs - marginInMs;
  }
}
