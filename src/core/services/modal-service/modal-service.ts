import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { ComponentType } from '@angular/cdk/portal';

Injectable({
  providedIn: 'root',
});
export class ModalService {
  private readonly _matDialog = inject(MatDialog);
  private openModalsStack: MatDialogRef<unknown>[] = [];

  openModal<C, D = unknown>(
    component: ComponentType<C>,
    data?: ModalDataConfiguration<D>,
    config?: Partial<MatDialogConfig>,
  ) {
    const dialogRef = this._matDialog.open(component, {
      data,
      disableClose: true,
      ...config,
    });

    this.openModalsStack.push(dialogRef);

    dialogRef.afterClosed().subscribe(() => {
      this.openModalsStack = this.openModalsStack.filter((ref) => ref !== dialogRef);
    });
  }

  closeCurrentModal(): void {
    const currentModal = this.openModalsStack.pop();
    if (currentModal) {
      currentModal.close();
    }
  }

  closeAllModals(): void {
    this._matDialog.closeAll();
    this.openModalsStack = [];
  }
}
