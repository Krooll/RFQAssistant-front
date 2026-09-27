import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAuthRequest } from '@core/dtos';
import { Router } from '@angular/router';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonTypes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouteEndpoints } from '@env/route-endpoints';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TranslateFallbackPipe, Button, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authorizationService = inject(AuthorizationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  loginButtonConfig: ButtonConfiguration = {
    variant: ButtonVariants.primary,
    size: ButtonSizes.medium,
    margin: 'mt-4',
  };

  constructor() {
    this.formGroup.set(
      this._formBuilder.group({
        login: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }),
    );
  }

  protected onSubmit() {
    const formData = this.formGroup()?.value;

    if (!this.isFormValid()) return;

    const payload: CreateAuthRequest = {
      login: formData.login,
      password: formData.password,
    };

    this._authorizationService
      .login(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._router.navigateByUrl(RouteEndpoints.dashboard);
        },
      });
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
