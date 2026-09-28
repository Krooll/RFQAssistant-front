import { Component, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateMaterialRequest, MaterialDto, UpdateMaterialRequest } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { MaterialService } from '@features/material-component/material-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-material-modal',
  imports: [FormField, ModalBase, ReactiveFormsModule, TranslateFallbackPipe],
  templateUrl: './material-modal.html',
  styleUrl: './material-modal.scss',
})
export class MaterialModal implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _materialComponentService = inject(MaterialService);
  private readonly _modalData = inject<ModalDataConfiguration<MaterialDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);

  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<MaterialDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        name: ['', [Validators.required]],
        description: ['', Validators.maxLength(500)],
        disable: [''],
      }),
    );

    effect(() => {
      const materialDto: MaterialDto | undefined = this.data();

      if (materialDto?.id) {
        this.updateStateAndPatchForm();
      }
    });
  }

  ngOnDestroy() {
    this.resetCurrentForm();
  }

  private loadData(): void {
    this.type.set(this._modalData.type);
    this.title.set({
      title: this._modalData.title,
      titleFallback: this._modalData.titleFallback,
    });
    this.data.set(this._modalData.data);
  }

  protected onSubmit(): void {
    const currentModalType = this.type();

    if (!currentModalType || !this.isFormValid()) {
      return;
    }

    const formValue = this.formGroup()?.getRawValue();

    switch (currentModalType) {
      case ModalTypes.create: {
        const createMaterialPayload: CreateMaterialRequest = {
          ...formValue,
          disable: !!formValue.disable,
        };
        this.createMaterial(createMaterialPayload);
        break;
      }

      case ModalTypes.update: {
        const updateMaterialPayload: UpdateMaterialRequest = {
          ...formValue,
          id: this.data()?.id,
        };
        this.updateMaterial(updateMaterialPayload);
        break;
      }

      case ModalTypes.info: {
        this.onUpdate();
        break;
      }
    }
  }

  private onUpdate(): void {
    this.type.set(ModalTypes.update);
    this.formGroup()?.enable();
  }

  private createMaterial(payload: CreateMaterialRequest): void {
    this._materialComponentService
      .createMaterial(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this._notificationService.showSuccess('Sukces');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateMaterial(payload: UpdateMaterialRequest): void {
    this._materialComponentService
      .updateMaterial(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this._notificationService.showSuccess('Sukces');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateStateAndPatchForm(): void {
    const materialData: MaterialDto | undefined = this.data();

    if (materialData?.id) {
      this.formGroup()?.patchValue({
        name: materialData?.name,
        description: materialData?.description,
        disable: materialData?.disable,
      });

      this.formGroup()?.disable();
    }
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._materialComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
  }

  private resetCurrentForm(): void {
    this.formGroup()?.reset();
  }

  private isFormValid(): boolean {
    if (this.formGroup()?.invalid) {
      this.formGroup()?.markAllAsTouched();
      return false;
    }

    return true;
  }
}
