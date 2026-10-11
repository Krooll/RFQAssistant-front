import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Observable } from 'rxjs';
import { Endpoint } from '@env/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ResolverService {
  private readonly _baseHttpService = inject(BaseHttpService);

  public getById<T>(endpoint: Endpoint, id: number): Observable<T> {
    return this._baseHttpService.getPageDataById(endpoint, id);
  }
}
