import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ProjectDto } from '@core/dtos';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-form',
  imports: [],
  templateUrl: './project-form.html',
  styleUrl: './project-form.scss',
})
export class ProjectForm {
  private readonly _formBuilder = inject(FormBuilder);

  protected projectData = input<ProjectDto>();

  protected isEditMode = computed(() => !!this.projectData()?.id);

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
        name: ['', Validators.required],
      }),
    );
  }

  private updateStateAndPatchForm() {}
}
