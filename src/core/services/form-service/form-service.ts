import { DestroyRef, inject, Injectable, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { FormListService } from '@core/services/form-list-service/form-list-service';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _formListService = inject(FormListService);

  public subscribeFormChangesAndAddSelectedItemToCurrentList<T extends { id?: number }>(
    formGroup: WritableSignal<FormGroup | undefined>,
    currentList: WritableSignal<T[]>,
    inputField: string,
  ): void {
    formGroup()
      ?.get(inputField)
      ?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((selectedItem: T) => {
        if (!selectedItem || selectedItem.id == null) {
          return;
        }

        this._formListService.addSelectedItemToCurrentList(currentList, selectedItem);
        formGroup()?.get(inputField)?.setValue('', { emitEvent: false });
      });
  }
}
