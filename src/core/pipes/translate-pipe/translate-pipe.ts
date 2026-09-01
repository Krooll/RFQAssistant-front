import { ChangeDetectorRef, DestroyRef, inject, Pipe, PipeTransform } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'translateFallback', standalone: true, pure: false })
export class TranslateFallbackPipe implements PipeTransform {
  private readonly _translateService = inject(TranslateService);
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);

  constructor() {
    this._translateService.onLangChange.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(() => {
      this._cdr.markForCheck();
    });
  }

  transform(value: string | undefined, fallback: string): string {
    if (!value) {
      return '';
    }

    const translatedValue = this._translateService.instant(value);

    return (translatedValue === value || this.isBlank(translatedValue)) && !this.isBlank(fallback)
      ? fallback
      : translatedValue;
  }

  private isBlank(value: string | undefined | null): boolean {
    return value === null || value === undefined || value === '';
  }
}
