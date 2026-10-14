import { Component, DestroyRef, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateSupplierRequest, ProcessDto, SupplierDto, UpdateSupplierRequest } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupplierService } from '@features/supplier-component/supplier-service';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Roles } from '@core/core-dtos/roles/roles';
import { FormService } from '@core/services/form-service/form-service';

@Component({
  selector: 'app-supplier-modal',
  imports: [FormField, ModalBase, ReactiveFormsModule, TranslateFallbackPipe, Button],
  templateUrl: './supplier-modal.html',
  styleUrl: './supplier-modal.scss',
})
export class SupplierModal implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _modalData = inject<ModalDataConfiguration<SupplierDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _userDataService = inject(UserDataService);
  private readonly _globalFormService = inject(FormService);
  readonly _supplierComponentService = inject(SupplierService);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected isAdminRole = signal<boolean>(false);

  protected data = signal<SupplierDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  protected buttonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  constructor() {
    this.isAdminRole.set(this.checkUserRole());

    this._supplierComponentService.getAllProcesses();
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        name: ['', [Validators.required]],
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        province: ['', [Validators.required]],
        country: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
        emailAddress: ['', [Validators.required, Validators.email]],
        disable: [''],
        processesIds: [''],
      }),
    );

    effect(() => {
      const supplierData: SupplierDto | undefined = this.data();

      if (supplierData?.id && supplierData.processes) {
        this._supplierComponentService.selectedProcessList.set(supplierData?.processes);
        this.updateStateAndPatchForm();
      }
    });
  }

  ngOnInit() {
    this.subscribeFormChanges();

    if (!this.isAdminRole()) {
      this.watchProcessListChanges();
    }
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
        const createSupplierPayload: CreateSupplierRequest = {
          ...formValue,
          disable: !!formValue.disable,
          processesIds: this.extractProcessesIds(),
        };
        this.createSupplier(createSupplierPayload);
        break;
      }

      case ModalTypes.update: {
        const updateSupplierPayload: UpdateSupplierRequest = {
          ...formValue,
          id: this.data()?.id,
          disable: !!formValue.disable,
          processesIds: this.extractProcessesIds(),
        };
        this.updateSupplier(updateSupplierPayload);
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

    if (!this.isAdminRole()) {
      this.formGroup()?.get('disable')?.disable({ emitEvent: false });
    }
  }

  private createSupplier(payload: CreateSupplierRequest): void {
    this._supplierComponentService
      .createSupplier(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: SupplierDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateSupplier(payload: UpdateSupplierRequest): void {
    this._supplierComponentService
      .updateSupplier(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: SupplierDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateStateAndPatchForm(): void {
    const supplierData: SupplierDto | undefined = this.data();

    if (supplierData?.id) {
      this.formGroup()?.patchValue({
        name: supplierData?.name,
        street: supplierData?.street,
        city: supplierData?.city,
        province: supplierData?.province,
        country: supplierData?.country,
        phoneNumber: supplierData?.phoneNumber,
        emailAddress: supplierData?.emailAddress,
        disable: supplierData?.disable,
        processesIds: null,
      });

      this.formGroup()?.disable();
    }
  }

  private extractProcessesIds(): number[] | undefined {
    return this._supplierComponentService
      .selectedProcessList()
      ?.map((process) => process.id)
      .filter((id) => id !== undefined);
  }

  private subscribeFormChanges(): void {
    this._globalFormService
      .subscribeFormChanges<ProcessDto>(this.formGroup, 'processesIds')
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((selectedItem: ProcessDto) => {
        this._supplierComponentService.addSelectedProcessToList(selectedItem);
        this.formGroup()?.get('processesIds')?.setValue('', { emitEvent: false });
      });
  }

  private watchProcessListChanges(): void {
    this._globalFormService
      .subscribeFormChanges(this.formGroup, 'processesIds')
      ?.pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        const processes = this._supplierComponentService.selectedProcessList();
        const hasProcess = (processes?.length ?? 0) > 0;
        const disableField = this.formGroup()?.get('disable');

        if (disableField) {
          disableField.setValue(!hasProcess, { emitEvent: false });
        }
      });
  }

  private checkUserRole(): boolean {
    const currentRole = this._userDataService.getUserRole();

    return currentRole === Roles.admin;
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._supplierComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
  }

  private resetCurrentForm(): void {
    this.formGroup()?.reset();
    this._supplierComponentService.selectedProcessList.set([]);
  }

  private isFormValid(): boolean {
    if (this.formGroup()?.invalid) {
      this.formGroup()?.markAllAsTouched();
      return false;
    }

    return true;
  }
}
