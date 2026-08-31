import { Injectable } from '@angular/core';
import { PageRequestParams } from '@core/dtos/page-request-params/page-request-params';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CreatePageParamsService {
  createPageParams(options?: PageRequestParams): HttpParams {
    let params = new HttpParams();

    if (!options) {
      return params;
    }

    if (options.page !== undefined && options.page !== null) {
      params = params.set('page', options.page.toString());
    }

    if (options.size !== undefined && options.size !== null) {
      params = params.set('size', options.size.toString());
    }

    if (options.sort) {
      params = params.set('sort', options.sort);
    }

    return params;
  }
}
