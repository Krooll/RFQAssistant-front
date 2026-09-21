import { Component, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateProjectRequest, SimpleProjectDto, UpdateProjectRequest, UserDto } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { ProjectService } from '@features/project/project-service';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';

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
        projectSOP: ['', Validators.required],
        //metrics: ['', Validators.required],
        //componentIds: ['', Validators.required],
        description: [''],
        status: [''],
      }),
    );

    effect(() => {
      const projectData: SimpleProjectDto | undefined = this.data();

      if (projectData?.id) {
        this.updateStateAndPatchForm();
      }
    });
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

    if (currentModalType === ModalTypes.info) {
      this.onUpdate();
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

      case ModalTypes.update: {
        const updateProjectRequest: UpdateProjectRequest = {
          ...formValue,
          id: this.data()?.id,
          validFrom: this.changeDateToISOString(formValue.validFrom),
          validTo: this.changeDateToISOString(formValue.validTo),
        };
        this.updateProject(updateProjectRequest);
        break;
      }
    }
  }

  private onUpdate(): void {
    this.type.set(ModalTypes.update);
    this.formGroup()?.enable();
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
          }
        },
      });
  }

  private updateProject(payload: UpdateProjectRequest): void {
    this._projectComponentService
      .updateProject(payload)
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
    const projectData: SimpleProjectDto | undefined = this.data();

    if (projectData?.id) {
      this.formGroup()?.patchValue({
        validFrom: projectData.validFrom,
        validTo: projectData.validTo,
        name: projectData.name,
        projectNumber: projectData.projectNumber,
        projectSOP: projectData.projectSOP,
        //metrics: ['', Validators.required],
        //componentIds: ['', Validators.required],
        description: projectData.description,
        status: projectData.status,
      });

      this.formGroup()?.disable();
    }
  }

  private changeDateToISOString(date: string): string {
    return new Date(date).toISOString();
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
