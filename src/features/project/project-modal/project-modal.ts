import { Component, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateProjectRequest, SimpleProjectDto, UserDto } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { ProjectService } from '@features/project/project-service';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { DateService } from '@core/services/date-service/date-service';

@Component({
  selector: 'app-project-modal',
  imports: [TranslateFallbackPipe, ReactiveFormsModule, FormField, ModalBase],
  templateUrl: './project-modal.html',
  styleUrl: './project-modal.scss',
})
export class ProjectModal implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _projectComponentService = inject(ProjectService);
  private readonly _modalData = inject<ModalDataConfiguration<SimpleProjectDto>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);
  private readonly _dateService = inject(DateService);
  private readonly _router = inject(Router);

  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<SimpleProjectDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        validFrom: ['', Validators.required],
        validTo: ['', Validators.required],
        name: ['', Validators.required],
        projectNumber: ['', Validators.required],
      }),
    );
  }

  ngOnDestroy(): void {
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

    if (!currentModalType) {
      return;
    }

    if (!this.isFormValid()) {
      return;
    }

    const formValue = this.formGroup()?.getRawValue();

    switch (currentModalType) {
      case ModalTypes.create: {
        const createProjectRequest: CreateProjectRequest = {
          ...formValue,
          validFrom: this.changeDateToISOString(formValue.validFrom),
          validTo: this.changeDateToISOString(formValue.validTo),
        };
        this.createProject(createProjectRequest);
        break;
      }
    }
  }

  private createProject(payload: CreateProjectRequest): void {
    this._projectComponentService
      .createProject(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: UserDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
            this._router.navigateByUrl(RouteEndpoints.projectForm + '/' + response.id);
          }
        },
      });
  }

  private changeDateToISOString(date: string): string {
    return this._dateService.changeDateToISOString(date);
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._projectComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
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
