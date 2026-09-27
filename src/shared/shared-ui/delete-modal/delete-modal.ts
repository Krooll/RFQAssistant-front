import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Endpoint } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalType } from '@shared/model-ui/modal-configuration/modal-types/modal-types';

@Component({
  selector: 'app-delete-modal',
  imports: [ModalBase, TranslateFallbackPipe],
  templateUrl: './delete-modal.html',
  styleUrl: './delete-modal.scss',
})
export class DeleteModal {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalData = inject<ModalDataConfiguration<{ id: number; endpoint: Endpoint }>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  protected data = signal<{ id: number; endpoint: Endpoint } | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.type.set(this._modalData.type);
    this.title.set({
      title: this._modalData.title,
      titleFallback: this._modalData.titleFallback,
    });
    this.data.set(this._modalData.data);
  }

  protected onDelete() {
    const endpoint = this.data()?.endpoint;
    const id = this.data()?.id;

    if (!endpoint || !id) {
      return;
    }

    this._baseHttpService
      .deleteData<void>(endpoint, id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._notificationService.showSuccess('Udało się usunać pozycję!');
          this._modalService.closeCurrentModal(true);
        },
      });
  }

  protected closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
