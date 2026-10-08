import { Component, DestroyRef, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { CreateUserRequest, UpdateUserRequest, UserDto } from '@core/dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Role, Roles, RolesInterface } from '@core/core-dtos/roles/roles';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-user-modal',
  imports: [ModalBase, FormField, FormsModule, TranslateFallbackPipe, ReactiveFormsModule, NgClass],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _userComponentService = inject(UserService);
  private readonly _modalData = inject<ModalDataConfiguration<UserDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);
  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<UserDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  protected roles: RolesInterface[] = [
    {
      label: 'ROLES.admin',
      labelFallback: 'Administrator',
      role: Roles.admin,
    },
    {
      label: 'ROLES.MANAGER',
      labelFallback: 'Manager',
      role: Roles.manager,
    },
    {
      label: 'ROLES.EMPLOYEE',
      labelFallback: 'Pracownik',
      role: Roles.employee,
    },
    {
      label: 'ROLES.SUPPLIER',
      labelFallback: 'Dostawca',
      role: Roles.supplier,
    },
  ];

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        username: ['', [Validators.required]],
        password: [''],
        name: ['', [Validators.required]],
        surname: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        disable: [''],
        role: ['', [Validators.required]],
      }),
    );

    effect(() => {
      const userData: UserDto | undefined = this.data();

      if (userData?.id) {
        this.updateStateAndPatchForm();
      }
    });
  }

  ngOnInit() {
    this.subscribeRolesChanges();
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
        const createUserPayload: CreateUserRequest = {
          ...formValue,
          disable: !!formValue.disable,
        };
        this.createUser(createUserPayload);
        break;
      }

      case ModalTypes.update: {
        const updateUserPayload: UpdateUserRequest = {
          ...formValue,
          id: this.data()?.id,
        };
        this.updateUser(updateUserPayload);
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

  private createUser(payload: CreateUserRequest): void {
    this._userComponentService
      .createUser(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: UserDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateUser(payload: UpdateUserRequest): void {
    this._userComponentService
      .updateUser(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: UserDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateStateAndPatchForm(): void {
    const userData: UserDto | undefined = this.data();

    if (userData?.id) {
      this.formGroup()?.patchValue({
        username: userData?.username,
        name: userData?.name,
        surname: userData?.surname,
        email: userData?.email,
        disable: userData?.disable,
        role: userData?.role,
      });

      this.formGroup()?.disable();
    }
  }

  private subscribeRolesChanges(): void {
    const roleControl = this.formGroup()?.get('role');

    roleControl?.valueChanges.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((role: Role) => {
      if (!roleControl.dirty) {
        return;
      }

      const isSupplier = role === Roles.supplier;
      const passwordControl = this.formGroup()?.get('password');
      const disableControl = this.formGroup()?.get('disable');

      passwordControl?.patchValue(isSupplier ? 'admin' : '');
      disableControl?.patchValue(isSupplier);

      const opts = { emitEvent: false };
      const action = isSupplier ? 'disable' : 'enable';

      [passwordControl, disableControl].forEach((control) => {
        control?.[action](opts);
      });
    });
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._userComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
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

  protected readonly ModalTypes = ModalTypes;
}
