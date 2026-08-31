import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreatePageParamsService } from '@core/services/create-page-params-service/create-page-params';
import { environment } from '@env/environment';
import { Endpoint } from '@env/endpoints';
import { PageRequestParams, SpringPageable } from '@core/dtos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BaseHttpService {
  private readonly httpClient = inject(HttpClient);
  private readonly createPageParamsService = inject(CreatePageParamsService);

  private readonly baseUrl: string = environment.apiUrl;

  getPageData<T>(
    endpoint: Endpoint,
    pageRequestParams?: PageRequestParams,
    extraHttpParams?: HttpParams,
  ): Observable<SpringPageable<T>> {
    let params = this.createPageParamsService.createPageParams(pageRequestParams);

    if (extraHttpParams) {
      extraHttpParams.keys().forEach((key) => {
        const values = extraHttpParams.getAll(key);
        if (values) {
          values.forEach((val) => (params = params.append(key, val)));
        }
      });
    }

    return this.httpClient.get<SpringPageable<T>>(this.generateUrlWithEndpoint(endpoint, false), {
      params,
    });
  }

  getPageDataById<T>(endpoint: Endpoint, id: number): Observable<T> {
    return this.httpClient.get<T>(this.generateUrlWithEndpoint(endpoint, true, id));
  }

  postData<T, B>(endpoint: Endpoint, requestBody: B): Observable<T> {
    return this.httpClient.post<T>(this.generateUrlWithEndpoint(endpoint, false), requestBody);
  }

  patchData<T, B>(endpoint: Endpoint, requestBody: B): Observable<T> {
    return this.httpClient.patch<T>(this.generateUrlWithEndpoint(endpoint, false), requestBody);
  }

  deleteData<T = void>(endpoint: Endpoint, id: number): Observable<T> {
    return this.httpClient.delete(
      this.generateUrlWithEndpoint(endpoint, true, id),
    ) as Observable<T>;
  }

  generateUrlWithEndpoint(endpoint: Endpoint, getByIdException: boolean, id?: number): string {
    if (!endpoint || endpoint.trim().length === 0) {
      const errorMessage = '[BaseHttpService]: Endpoint nie może być pusty!';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    if (getByIdException) {
      if (id === undefined || id === null) {
        const idErrorMessage = '[BaseHttpService]: Wymagany jest parametr ID dla tego endpointu!';
        console.error(idErrorMessage);
        throw new Error(idErrorMessage);
      }

      return `${this.baseUrl}${endpoint}/` + id;
    }

    return `${this.baseUrl}${endpoint}`;
  }
}
