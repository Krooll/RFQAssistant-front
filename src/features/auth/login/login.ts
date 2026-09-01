import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthDto, CreateAuthRequest } from '@core/dtos';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);

  formGroup = signal<FormGroup | undefined>(undefined);

  private readonly destroyRef = inject(DestroyRef);

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

      this._baseHttpService
        .postData<AuthDto, CreateAuthRequest>(Endpoints.authLogin, payload)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response: AuthDto) => {
            this._userDataService.decodeAndSetCurrentUserData(response);
            this._router.navigateByUrl('/dashboard');
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.formGroup()?.markAllAsTouched();
    }
  }
}
