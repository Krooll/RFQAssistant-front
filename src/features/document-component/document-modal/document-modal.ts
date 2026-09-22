import { Component, DestroyRef, effect, inject, OnDestroy, signal } from '@angular/core';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { CreateDocumentRequest, DocumentDto } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '@features/document-component/document-service';
import { ModalType, ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { FormField } from '@shared/shared-ui/form-field/form-field';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Button } from '@shared/shared-ui/button/button';

@Component({
  selector: 'app-document-modal',
  imports: [ModalBase, FormField, FormsModule, TranslateFallbackPipe, ReactiveFormsModule, Button],
  providers: [DocumentService],
  templateUrl: './document-modal.html',
  styleUrl: './document-modal.scss',
})
export class DocumentModal implements OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _documentComponentService = inject(DocumentService);
  private readonly _modalData =
    inject<ModalDataConfiguration<{ componentId: number; data: DocumentDto | null }>>(MAT_DIALOG_DATA);
  private readonly _notificationService = inject(NotificationService);

  private readonly _destroyRef = inject(DestroyRef);

  protected formGroup = signal<FormGroup | undefined>(undefined);

  protected selectedFile = signal<File | null>(null);

  protected data = signal<{ componentId: number; data: DocumentDto | null } | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();

    this.formGroup.set(
      this._formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.maxLength(500)],
      }),
    );

    effect(() => {
      const documentData: { componentId: number; data: DocumentDto | null } | undefined = this.data();

      if (documentData?.data?.id) {
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
        const file = this.selectedFile();

        if (!file) {
          this._notificationService.showError('Proszę wybrać plik PDF!');
          return;
        }
        const createDocumentRequest: CreateDocumentRequest = {
          ...formValue,
          componentId: this.data()?.componentId,
          file: file,
        };
        this.createDocument(createDocumentRequest);
        break;
      }

      // case ModalTypes.update: {
      //   const updateProjectRequest:  = {
      //     ...formValue,
      //     id: this.data()?.data?.id,
      //   };
      //   this.updateProject(updateProjectRequest);
      //   break;
      // }
    }
  }

  private createDocument(createDocumentRequest: CreateDocumentRequest): void {
    this._documentComponentService
      .createDocument(createDocumentRequest)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: DocumentDto) => {
          if (response) {
            this._notificationService.showSuccess('Sukces!');
            this.closeCurrentModal(true);
          }
        },
      });
  }

  private onUpdate(): void {
    this.type.set(ModalTypes.update);
    this.formGroup()?.enable();
  }

  private updateStateAndPatchForm(): void {
    const documentData: { componentId: number; data: DocumentDto | null } | undefined = this.data();

    if (documentData?.data?.id) {
      this.formGroup()?.patchValue({
        name: documentData?.data?.name,
        description: documentData?.data?.description,
      });

      this.formGroup()?.disable();
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event?.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile.set(input.files[0]);
    }
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._documentComponentService.closeCurrentModal(reloadPage ? reloadPage : false);
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
