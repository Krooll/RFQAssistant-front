import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalType } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { ProjectFormService } from '@features/project/services/project-form-service';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-project-metrics-modal',
  imports: [FormField, FormsModule, ModalBase, TranslateFallbackPipe, ReactiveFormsModule],
  templateUrl: './project-metrics-modal.html',
  styleUrl: './project-metrics-modal.scss',
})
export class ProjectMetricsModal implements OnDestroy {
  private readonly _projectFormComponentService = inject(ProjectFormService);
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _modalData = inject<ModalDataConfiguration<{ length: number; percent: number }>>(MAT_DIALOG_DATA);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected data = signal<{ length: number; percent: number } | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        metricsYears: [''],
        metricsPercent: [''],
      }),
    );

    effect(() => {
      const metricData: { length: number; percent: number } | undefined = this.data();

      if (metricData?.length) {
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

    if (!currentModalType || !this.isFormValid()) {
      return;
    }

    const formValue = this.formGroup()?.getRawValue();

    this.closeCurrentModal(formValue);
  }

  private updateStateAndPatchForm(): void {
    const metricData: { length: number; percent: number } | undefined = this.data();

    if (metricData?.length) {
      this.formGroup()?.patchValue({
        metricsYears: metricData?.length,
        metricsPercent: metricData?.percent,
      });
    }
  }

  protected closeCurrentModal(metricData?: { metricsYear: number; metricsPercent: number }): void {
    this._projectFormComponentService.closeCurrentModal(metricData ?? { metricsYear: 0, metricsPercent: 0 });
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
