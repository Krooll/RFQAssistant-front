import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateAuthRequest } from '@core/dtos';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, TranslateFallbackPipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _authorizationService = inject(AuthorizationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  formGroup = signal<FormGroup | undefined>(undefined);

  constructor() {
    this.formGroup.set(
      this._formBuilder.group({
        login: ['', [Validators.required]],
        password: ['', [Validators.required]],
      }),
    );
  }

  onSubmit() {
    const formData = this.formGroup()?.value;

    if (this.formGroup()?.valid) {
      const payload: CreateAuthRequest = {
        login: formData.login,
        password: formData.password,
      };

      this._authorizationService
        .login(payload)
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe({
          next: () => {
            this._router.navigateByUrl('/dashboard');
          },
        });
    } else {
      this.formGroup()?.markAllAsTouched();
    }
  }
}
