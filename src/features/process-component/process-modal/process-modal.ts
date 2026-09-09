import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProcessService } from '@features/process-component/process-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateProcessRequest, ProcessDto, UpdateProcessRequest, UserDto } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-process-modal',
  imports: [FormField, FormsModule, ModalBase, TranslateFallbackPipe, ReactiveFormsModule],
  templateUrl: './process-modal.html',
  styleUrl: './process-modal.scss',
})
export class ProcessModal {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _processComponentService = inject(ProcessService);
  private readonly _modalData = inject<ModalDataConfiguration<ProcessDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);

  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<ProcessDto | undefined>(undefined);
  protected type = signal<ModalTypes | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        name: ['', [Validators.required]],
        description: [''],
        disable: [''],
      }),
    );

    effect(() => {
      const userData: UserDto | undefined = this.data();

      if (userData?.id) {
        this.updateStateAndPatchForm();
      }
    });
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

    if (!currentModalType) {
      return;
    }

    if (currentModalType === 'info') {
      this.onUpdate();
      return;
    }

    if (!this.isFormValid()) {
      return;
    }

    const formValue = this.formGroup()?.getRawValue();

    switch (currentModalType) {
      case 'create': {
        const createProcessPayload: CreateProcessRequest = {
          ...formValue,
          disable: !!formValue.disable,
        };
        this.createProcess(createProcessPayload);
        break;
      }

      case 'update': {
        const updateProcessPayload: UpdateProcessRequest = {
          id: this.data()?.id,
          ...formValue,
        };
        this.updateProcess(updateProcessPayload);
        break;
      }
    }
  }

  private onUpdate(): void {
    this.type.set('update');
    this.formGroup()?.enable();
  }

  private createProcess(payload: CreateProcessRequest): void {
    this._processComponentService
      .createProcess(payload)
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

  private updateProcess(payload: UpdateProcessRequest): void {
    this._processComponentService
      .updateProcess(payload)
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
    const processData: ProcessDto | undefined = this.data();

    if (processData?.id) {
      this.formGroup()?.patchValue({
        name: processData?.name,
        description: processData?.description,
        disable: processData?.disable,
      });

      this.formGroup()?.disable();
    }
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._processComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
    this.resetCurrentForm();
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
