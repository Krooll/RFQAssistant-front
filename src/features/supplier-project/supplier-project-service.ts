import { DestroyRef, inject, Injectable, Injector } from '@angular/core';
import { SupplierDto } from '@core/dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { SupplierModal } from '@features/supplier-component/supplier-modal/supplier-modal';
import { ModalService } from '@core/services/modal-service/modal-service';

@Injectable()
export class SupplierProjectService {
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public showInfoSupplierModal(response: SupplierDto | undefined, injector: Injector): void {
    const createModalConfiguration: ModalDataConfiguration<SupplierDto> = {
      type: ModalTypes.info,
      title: 'MODALS.supplier.fillData',
      titleFallback: 'Uzupełnij dane aby korzystać z portalu',
      data: response,
    };

    this._modalService
      .openModal(SupplierModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //tutaj bedziemy sciagac juz poprawna liste projektow per procesy suppliera
          }
        },
      });
  }
}
