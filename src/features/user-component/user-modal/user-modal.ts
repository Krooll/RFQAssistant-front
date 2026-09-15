import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { UserService } from '@features/user-component/user-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { CreateUserRequest, UpdateUserRequest, UserDto } from '@core/dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { RolesInterface } from '@core/core-dtos/roles/roles';

@Component({
  selector: 'app-user-modal',
  imports: [ModalBase, FormField, FormsModule, TranslateFallbackPipe, ReactiveFormsModule],
  templateUrl: './user-modal.html',
  styleUrl: './user-modal.scss',
})
export class UserModal {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _userComponentService = inject(UserService);
  private readonly _modalData = inject<ModalDataConfiguration<UserDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);

  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<UserDto | undefined>(undefined);
  protected type = signal<ModalTypes | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  protected roles: RolesInterface[] = [
    {
      label: 'ROLES.admin',
      labelFallback: 'Administrator',
      role: 'ROLE_ADMIN',
    },
    {
      label: 'ROLES.MANAGER',
      labelFallback: 'Manager',
      role: 'ROLE_MANAGER',
    },
    {
      label: 'ROLES.USER',
      labelFallback: 'Użytkownik',
      role: 'ROLE_USER',
    },
  ];

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required]],
        name: [''],
        surname: [''],
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
        const createUserPayload: CreateUserRequest = {
          ...formValue,
          disable: !!formValue.disable,
        };
        this.createUser(createUserPayload);
        break;
      }

      case 'update': {
        const updateUserPayload: UpdateUserRequest = {
          ...formValue,
          id: this.data()?.id,
        };
        this.updateUser(updateUserPayload);
        break;
      }
    }
  }

  private onUpdate(): void {
    this.type.set('update');
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

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._userComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
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
