import { Component, DestroyRef, effect, inject, Injector, model, OnDestroy, signal } from '@angular/core';
import { ProjectDto, UpdateProjectRequest } from '@core/dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';
import { ProjectFormService } from '@features/project/services/project-form-service';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { DocumentCard } from '@shared/shared-ui/document-card/document-card';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SectionButtonsTypes } from '@features/project/types/section-buttons/section-buttons';
import { DateService } from '@core/services/date-service/date-service';
import { DownloadService } from '@core/services/download-service/download-service';
import { ProjectMetricService } from '@features/project/services/project-metric-service';
import { ProjectMetrics } from '@features/project/project-metrics/project-metrics';

@Component({
  selector: 'app-project-form',
  imports: [
    TranslateFallbackPipe,
    FormsModule,
    ReactiveFormsModule,
    Button,
    ItemList,
    FormField,
    DocumentCard,
    ProjectMetrics,
  ],
  providers: [ProjectFormService, ProjectMetricService],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  readonly _projectFormService = inject(ProjectFormService);
  private readonly _dateService = inject(DateService);
  readonly _metricService = inject(ProjectMetricService);
  private readonly _downloadService = inject(DownloadService);
  private readonly _injector = inject(Injector);
  private readonly _destroyRef = inject(DestroyRef);

  protected projectData = model<ProjectDto>();

  protected formGroup = signal<FormGroup | undefined>(undefined);

  constructor() {
    effect(() => {
      const projectData = this.projectData();
      if (projectData?.id) {
        this.updateStateAndPatchForm();
      }
    });

    this.formGroup.set(
      this._formBuilder.group({
        validFrom: ['', Validators.required],
        validTo: ['', Validators.required],
        name: ['', Validators.required],
        projectNumber: ['', Validators.required],
        projectSOP: ['', Validators.required],
        metrics: [''],
        description: ['', Validators.maxLength(500)],
        status: [''],
      }),
    );
  }

  ngOnDestroy() {
    this.clearForm();
  }

  protected onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    const formData = this.formGroup()?.getRawValue();

    const updateProjectRequest: UpdateProjectRequest = {
      ...formData,
      id: this.projectData()?.id,
      validTo: this._dateService.changeDateToISOString(formData.validTo),
      validFrom: this._dateService.changeDateToISOString(formData.validFrom),
      projectSOP: this._dateService.changeDateToISOString(formData.projectSOP),
      metrics: this._metricService.generatedMetricList(),
    };

    this.updateProject(updateProjectRequest);
  }

  private updateProject(payload: UpdateProjectRequest): void {
    this._projectFormService
      .updateProject(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.getProjectById(this.projectData()?.id);
          }
        },
      });
  }

  private updateStateAndPatchForm(): void {
    this.formGroup()?.patchValue({
      validFrom: this._dateService.formatIsoToInputDate(this.projectData()?.validFrom),
      validTo: this._dateService.formatIsoToInputDate(this.projectData()?.validTo),
      name: this.projectData()?.name,
      projectNumber: this.projectData()?.projectNumber,
      projectSOP: this._dateService.formatIsoToInputDate(this.projectData()?.projectSOP),
      description: this.projectData()?.description,
      status: this.projectData()?.status,
    });

    this._metricService.generatedMetricList.set(this.projectData()?.metrics ?? []);
    this._metricService.percent.set(this.projectData()?.metrics?.[0]?.percent ?? 0);

    this.formGroup()?.disable();
  }

  private getProjectById(id: number | undefined): void {
    if (!id) return;
    this._projectFormService
      .getProjectById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: ProjectDto) => {
          if (response) {
            this.projectData.set(response);
          }
        },
      });
  }

  protected onAddComponentButtonClick(): void {
    this._projectFormService
      .showCreateComponentModal(this._injector)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getProjectById(this.projectData()?.id);
          }
        },
      });
  }

  protected onInfoComponentButtonClick(id: number | undefined): void {
    this._projectFormService.getCurrentComponentById(id, this._injector);
  }

  protected onDeleteComponentButtonClick(id: number | undefined): void {
    if (!id) return;

    this._projectFormService
      .showDeleteComponentModal(id, this._injector)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getProjectById(this.projectData()?.id);
          }
        },
      });
  }

  protected onAddDocumentComponentButtonClick(id: number | undefined): void {
    if (!id) return;

    this._projectFormService
      .showCreateDocumentModal(id, this._injector)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getProjectById(this.projectData()?.id);
          }
        },
      });
  }

  protected onDeleteDocumentButtonClick(id: number | undefined): void {
    if (!id) return;

    this._projectFormService
      .showDeleteDocumentModal(id, this._injector)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getProjectById(this.projectData()?.id);
          }
        },
      });
  }

  protected onProjectMetricButtonClick(): void {
    this._projectFormService
      .showMetricModal(this._injector)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (metricFormData: { metricsYears: number; metricsPercent: number }) => {
          const sop = this.projectData()?.projectSOP;
          const currentMetricList = this.projectData()?.metrics;
          if (metricFormData && sop) {
            this._metricService.generateMetricList(metricFormData, sop, currentMetricList);
          }
        },
      });
  }

  protected onPaste(event: { event: ClipboardEvent; index: number }): void {
    event.event.preventDefault();
    const clipboardText = event.event.clipboardData?.getData('text');

    if (clipboardText) {
      this._metricService.pasteMetrics(event.index, clipboardText);
    }
  }

  protected onDownloadDocumentButtonClick(id: number | undefined): void {
    this._downloadService.downloadCurrentFile(id);
  }

  protected onPreviewDocumentButtonClick(id: number | undefined): void {
    this._downloadService.previewCurrentFile(id);
  }

  protected onEdit(): void {
    this.formGroup()?.enable();
  }

  protected onAbort(): void {
    this.formGroup()?.disable();
  }

  private clearForm(): void {
    this.formGroup()?.reset();
  }

  private isFormValid(): boolean {
    if (this.formGroup()?.invalid) {
      this.formGroup()?.markAllAsTouched();
      return false;
    }

    return true;
  }

  protected readonly SectionButtonsTypes = SectionButtonsTypes;
}
