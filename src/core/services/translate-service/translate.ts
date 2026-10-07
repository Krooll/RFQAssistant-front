import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class Translate {
  private readonly _translate = inject(TranslateService);

  public currentLanguage = signal<string | undefined>(undefined);
  public isLangListOpen = signal<boolean>(false);

  public onChangeLang(id: string) {
    if (!id) return;
    localStorage.setItem('currentLang', id);
    this._translate.use(id).subscribe(() => {
      this.currentLanguage.set(id);
      this.isLangListOpen.set(false);
    });
  }
}
