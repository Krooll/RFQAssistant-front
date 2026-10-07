import { Component, DestroyRef, effect, inject, model, OnDestroy, signal } from '@angular/core';
import { ActivateUserDto, ActivateUserRequest } from '@core/dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivateUserService } from '@features/activate-user-component/activate-user-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { Button } from '@shared/shared-ui/button/button';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-activate-user-component',
  imports: [TranslateFallbackPipe, FormField, ReactiveFormsModule, Button],
  templateUrl: './activate-user.html',
  styleUrl: './activate-user.scss',
})
export class ActivateUser implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _notificationService = inject(NotificationService);
  private readonly _router = inject(Router);
  private readonly _activateUserService = inject(ActivateUserService);
  private readonly _destroyRef = inject(DestroyRef);

  protected userData = model<ActivateUserDto>();
  protected formGroup = signal<FormGroup | undefined>(undefined);

  private currentToken = signal<string | undefined>(
    this._activatedRoute.snapshot.queryParamMap.get('token') ?? undefined,
  );

  constructor() {
    this.formGroup.set(
      this._formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required],
        name: ['', Validators.required],
        surname: ['', Validators.required],
      }),
    );

    effect(() => {
      const user = this.userData();

      if (user) {
        this.updateActivationForm(user);
      }
    });
  }

  ngOnDestroy() {
    this.resetCurrentForm();
  }

  protected onSubmit(): void {
    const token = this.currentToken();

    if (!this.isFormValid() || !token) {
      return;
    }

    const formValue = this.formGroup()?.getRawValue();

    const payload: ActivateUserRequest = {
      token: token,
      username: formValue.username,
      password: formValue.password,
      name: formValue.name,
      surname: formValue.surname,
    };

    this._activateUserService
      .activateUser(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: ActivateUserDto) => {
          if (response) {
            this._notificationService.showSuccess('Udało się aktywować użytkownika!');
            this._router.navigateByUrl(RouteEndpoints.authLogin);
          }
        },
      });
  }

  private updateActivationForm(user: ActivateUserDto): void {
    this.formGroup()?.patchValue({
      username: user.username,
      name: user.name,
      surname: user.surname,
    });
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

  protected readonly ButtonTypes = ButtonTypes;
}
