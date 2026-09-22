import { Component, computed, effect, inject, Injector, input, OnDestroy, signal } from '@angular/core';
import { ProjectDto } from '@core/dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';
import { ProjectFormService } from '@features/project/project-form-service';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { DocumentCard } from '@shared/shared-ui/document-card/document-card';

@Component({
  selector: 'app-project-form',
  imports: [TranslateFallbackPipe, FormsModule, ReactiveFormsModule, Button, ItemList, FormField, DocumentCard],
  providers: [ProjectFormService],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _projectFormService = inject(ProjectFormService);
  private readonly _injector = inject(Injector);

  protected projectData = input<ProjectDto>();

  protected editMode = computed(() => !!this.projectData()?.id);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  constructor() {
    effect(() => {
      const projectData = this.projectData();
      const editMode = this.editMode();
      if (editMode && projectData?.id) {
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
        //metrics: ['', Validators.required],
        //componentIds: ['', Validators.required],
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
  }

  private updateStateAndPatchForm() {
    this.formGroup()?.patchValue({
      validFrom: this.projectData()?.validFrom,
      validTo: this.projectData()?.validTo,
      name: this.projectData()?.name,
      projectNumber: this.projectData()?.projectNumber,
      projectSOP: this.projectData()?.projectSOP,
      //metrics: this.projectData()?.metricsByDate,
      description: this.projectData()?.description,
      status: this.projectData()?.status,
    });

    this.formGroup()?.disable();
  }

  protected onAddComponentButtonClick() {
    this._projectFormService.showCreateComponentModal(this._injector);
  }

  protected onInfoComponentButtonClick(id: number | undefined) {
    this._projectFormService.getCurrentComponentById(id, this._injector);
  }

  protected onDeleteComponentButtonClick(id: number | undefined) {
    this._projectFormService.showDeleteComponentModal(id, this._injector);
  }

  protected onAddDocumentComponentButtonClick(id: number | undefined) {
    this._projectFormService.showCreateDocumentModal(id, this._injector);
  }

  protected onDeleteDocumentButtonClick(id: number | undefined) {
    this._projectFormService.showDeleteDocumentModal(id, this._injector);
  }

  protected onDownloadDocumentButtonClick(id: number | undefined) {
    this._projectFormService.downloadCurrentFile(id);
  }

  protected onAbort() {
    this.formGroup()?.disable();
  }

  protected backToProjectMainPage() {
    this._projectFormService.closeFormAndRouteToProjectList();
    this.clearForm();
  }

  private clearForm() {
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
