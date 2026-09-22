import { DestroyRef, inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ComponentDto, DocumentDto, ProjectDto } from '@core/dtos';
import { Observable } from 'rxjs';
import { Endpoint, Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { TechnicalSpecificationComponentModal } from '@features/technical-specification-component/technical-specification-component-modal/technical-specification-component-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';
import { DocumentModal } from '@features/document-component/document-modal/document-modal';
import { HttpResponse } from '@angular/common/http';

@Injectable()
export class ProjectFormService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  private downloadFile(id: number) {
    return this._baseHttpService.downloadFile(Endpoints.documentDownload, id);
  }

  private getProjectById(id: number): Observable<ProjectDto> {
    return this._baseHttpService.getPageDataById(Endpoints.project, id);
  }

  private getComponentById(id: number): Observable<ComponentDto> {
    return this._baseHttpService.getPageDataById(Endpoints.component, id);
  }

  private getDocumentById(id: number): Observable<DocumentDto> {
    return this._baseHttpService.getPageDataById(Endpoints.document, id);
  }

  public getCurrentComponentById(id: number | undefined, injector: Injector) {
    if (!id) return;

    this.getComponentById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: ComponentDto) => {
          if (response) {
            this.showInfoComponentModal(response, injector);
          }
        },
      });
  }

  public showCreateComponentModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<ComponentDto> = {
      type: 'create',
      title: 'MODALS.component.create',
      titleFallback: 'Dodaj nowy komponent',
    };

    this._modalService
      .openModal(TechnicalSpecificationComponentModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //dobrze przemyslec sposob odswiezania aktualnego projektu po akcji dodawania komponentu
          }
        },
      });
  }

  public showInfoComponentModal(response: ComponentDto, injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<ComponentDto> = {
      type: 'info',
      title: 'MODALS.component.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService
      .openModal(TechnicalSpecificationComponentModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //dobrze przemyslec sposob odswiezania aktualnego projektu po akcji edytowania komponentu
          }
        },
      });
  }

  public showDeleteComponentModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.component.delete',
      titleFallback: 'Usuń komponent',
      data: { id: id, endpoint: Endpoints.component },
    };

    this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //dobrze przemyslec sposob odswiezania aktualnego projektu po akcji usuwania komponentu
          }
        },
      });
  }

  public downloadCurrentFile(id: number | undefined) {
    if (!id) return;

    this.downloadFile(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (!blob) return;

          const contentDisposition = response.headers.get('content-disposition');
          let filename = `document_${id}.pdf`;

          if (contentDisposition) {
            const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = matches[1];
            }
          }

          const fileUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = filename;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(fileUrl);
        },
        error: (err) => console.error('Błąd pobierania pliku:', err),
      });
  }

  public showCreateDocumentModal(id: number | undefined, injector: Injector) {
    if (!id) return;

    const createModalConfiguration: ModalDataConfiguration<{ componentId: number; data: DocumentDto | null }> = {
      type: 'create',
      title: 'MODALS.document.create',
      titleFallback: 'Dodaj dokument',
      data: { componentId: id, data: null },
    };

    this._modalService
      .openModal(DocumentModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //dobrze przemyslec sposob odswiezania aktualnego projektu po akcji dodania dokumentu
          }
        },
      });
  }

  public showDeleteDocumentModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.document.delete',
      titleFallback: 'Usuń dokument',
      data: { id: id, endpoint: Endpoints.document },
    };

    this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            //dobrze przemyslec sposob odswiezania aktualnego projektu po akcji usuwania dokumnetu
          }
        },
      });
  }

  closeFormAndRouteToProjectList() {
    this._router.navigateByUrl(RouteEndpoints.project);
  }
}
