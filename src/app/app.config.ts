import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideTranslateService, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from '@core/pipes/translate-pipe/translate-loader';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { Translate } from '@core/services/translate-service/translate';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'pl',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    provideAppInitializer(() => {
      const translate = inject(TranslateService);
      const languageService = inject(Translate);

      const lang = localStorage.getItem('currentLang') ?? 'pl';
      languageService.currentLanguage.set(lang);
      translate.addLangs(['pl', 'en']);
      translate.use(lang);

      return;
    }),
  ],
};
