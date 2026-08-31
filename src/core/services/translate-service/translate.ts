import { inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class Translate {
  private readonly _translate = inject(TranslateService);

  currentLanguage = signal<string | undefined>(undefined);
  isLangListOpen = signal<boolean>(false);

  //TODO: Domyślnie jezyk bedzie zapisywany w obiekcie localstorage - user

  onChangeLang(id: string) {
    if (!id) return;
    localStorage.setItem('currentLang', id);
    this._translate.use(id).subscribe(() => {
      this.currentLanguage.set(id);
      this.isLangListOpen.set(false);
    });
  }
}
