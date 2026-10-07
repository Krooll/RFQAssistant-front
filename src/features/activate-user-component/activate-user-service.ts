import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Observable } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { ActivateUserDto, ActivateUserRequest } from '@core/dtos';

@Injectable()
export class ActivateUserService {
  private readonly _baseHttpService = inject(BaseHttpService);

  public getUserByActivateToken(token: string): Observable<ActivateUserDto> {
    return this._baseHttpService.getPageDataByToken(Endpoints.activationUser, token);
  }

  public activateUser(payload: ActivateUserRequest): Observable<ActivateUserDto> {
    return this._baseHttpService.patchData(Endpoints.activateUser, payload);
  }
}
