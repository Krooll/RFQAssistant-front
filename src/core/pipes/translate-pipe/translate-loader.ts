import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

const ASSETS_PATH = './assets/i18n/';

export const BUILD_HASH = '';

export class CustomTranslateHttpLoader implements TranslateLoader {
  constructor(private readonly _httpClient: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const buildHash = BUILD_HASH ? `?v=${BUILD_HASH}` : '';
    const url = `${ASSETS_PATH}${lang}.json${buildHash}`;

    return this._httpClient.get<TranslationObject>(url).pipe(catchError(() => of({})));
  }
}

export const HttpLoaderFactory = (httpClient: HttpClient): TranslateLoader =>
  new CustomTranslateHttpLoader(httpClient);
