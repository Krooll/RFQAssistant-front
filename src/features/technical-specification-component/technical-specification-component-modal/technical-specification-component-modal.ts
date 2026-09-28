import { Component, DestroyRef, effect, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ComponentDto, CreateComponentRequest, UpdateComponentRequest } from '@core/dtos';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TechnicalSpecificationComponentService } from '@features/technical-specification-component/technical-specification-component-service';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { ActivatedRoute } from '@angular/router';
import { FormListService } from '@core/services/form-list-service/form-list-service';
import { FormService } from '@core/services/form-service/form-service';

@Component({
  selector: 'app-technical-specification-component-modal',
  imports: [ModalBase, FormsModule, ReactiveFormsModule, FormField, TranslateFallbackPipe, Button],
  providers: [TechnicalSpecificationComponentService],
  templateUrl: './technical-specification-component-modal.html',
  styleUrl: './technical-specification-component-modal.scss',
})
export class TechnicalSpecificationComponentModal implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _modalData = inject<ModalDataConfiguration<ComponentDto>>(MAT_DIALOG_DATA);
  readonly _technicalSpecificationComponentService = inject(TechnicalSpecificationComponentService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _formListService = inject(FormListService);
  private readonly _formService = inject(FormService);

  private readonly _destroyRef = inject(DestroyRef);
  protected formGroup = signal<FormGroup | undefined>(undefined);

  private readonly currentProjectId = signal<number | undefined>(undefined);

  protected data = signal<ComponentDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  buttonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  constructor() {
    this.currentProjectId.set(this._activatedRoute.snapshot.params['id']);

    this._technicalSpecificationComponentService.getAllProcesses();
    this._technicalSpecificationComponentService.getAllMaterials();

    this.formGroup.set(
      this._formBuilder.group({
        number: ['', Validators.required],
        revision: ['', Validators.required],
        name: ['', Validators.required],
        usage: ['', Validators.required],
        materialIds: [''],
        description: ['', Validators.maxLength(500)],
        processesIds: [''],
      }),
    );

    effect(() => {
      const componentData: ComponentDto | undefined = this.data();

      if (componentData?.id) {
        this.updateStateAndPatchForm();
      }
    });
  }

  ngOnInit() {
    this.loadData();
    this.subscribeProcessFormField();
    this.subscribeMaterialFormField();
  }

  ngOnDestroy() {
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

    switch (currentModalType) {
      case ModalTypes.create: {
        const createComponentRequest: CreateComponentRequest = {
          ...formValue,
          projectId: this.currentProjectId(),
          processesIds: this.extractProcessesIds(),
          materialIds: this.extractMaterialsIds(),
        };

        this.createComponent(createComponentRequest);
        break;
      }

      case ModalTypes.update: {
        const updateComponentRequest: UpdateComponentRequest = {
          ...formValue,
          id: this.data()?.id,
          processesIds: this.extractProcessesIds(),
          materialIds: this.extractMaterialsIds(),
        };
        this.updateComponent(updateComponentRequest);
        break;
      }

      case ModalTypes.info: {
        this.onUpdate();
        break;
      }
    }
  }

  private onUpdate(): void {
    this.type.set(ModalTypes.update);
    this.formGroup()?.enable();
  }

  private createComponent(payload: CreateComponentRequest): void {
    this._technicalSpecificationComponentService
      .createComponent(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: ComponentDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateComponent(payload: UpdateComponentRequest): void {
    this._technicalSpecificationComponentService
      .updateComponent(payload)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: ComponentDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private updateStateAndPatchForm(): void {
    const componentData: ComponentDto | undefined = this.data();

    this._technicalSpecificationComponentService.selectedProcessList.set(componentData?.processes ?? []);
    this._technicalSpecificationComponentService.selectedMaterialList.set(componentData?.materials ?? []);

    if (componentData?.id) {
      this.formGroup()?.patchValue({
        number: componentData.number,
        revision: componentData.revision,
        usage: componentData.usage,
        name: componentData.name,
        description: componentData.description,
      });

      this.formGroup()?.disable();
    }
  }

  private extractProcessesIds(): number[] | undefined {
    return this._formListService.extractItemsIdFromCurrentList(
      this._technicalSpecificationComponentService.selectedProcessList,
    );
  }

  private extractMaterialsIds(): number[] | undefined {
    return this._formListService.extractItemsIdFromCurrentList(
      this._technicalSpecificationComponentService.selectedMaterialList,
    );
  }

  private subscribeProcessFormField(): void {
    this._formService.subscribeFormChangesAndAddSelectedItemToCurrentList(
      this.formGroup,
      this._technicalSpecificationComponentService.selectedProcessList,
      'processesIds',
    );
  }

  private subscribeMaterialFormField(): void {
    this._formService.subscribeFormChangesAndAddSelectedItemToCurrentList(
      this.formGroup,
      this._technicalSpecificationComponentService.selectedMaterialList,
      'materialIds',
    );
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._technicalSpecificationComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
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
