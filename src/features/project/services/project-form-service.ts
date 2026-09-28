import { inject, Injectable, Injector } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ComponentDto, DocumentDto, ProjectDto, UpdateProjectRequest } from '@core/dtos';
import { defaultIfEmpty, map, Observable, of, switchMap } from 'rxjs';
import { Endpoint, Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { TechnicalSpecificationComponentModal } from '@features/technical-specification-component/technical-specification-component-modal/technical-specification-component-modal';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';
import { DocumentModal } from '@features/document-component/document-modal/document-modal';
import { SectionButtons, SectionButtonsTypes } from '@features/project/types/section-buttons/section-buttons';
import { ProjectStatuses } from '@features/project/types/project-status/project-status';
import { ProjectMetricsModal } from '@features/project/project-metrics-modal/project-metrics-modal';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';

@Injectable()
export class ProjectFormService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);

  public sectionButtonsList: SectionButtons[] = [
    {
      type: SectionButtonsTypes.general,
      label: 'PROJECT_COMPONENT.sectionButtons.general',
      labelTranslateFallback: 'Ogólne',
    },
    {
      type: SectionButtonsTypes.component,
      label: 'PROJECT_COMPONENT.sectionButtons.components',
      labelTranslateFallback: 'Komponenty',
    },
  ];

  public statusList: { value: string }[] = [
    {
      value: ProjectStatuses.active,
    },
    {
      value: ProjectStatuses.inactive,
    },
    {
      value: ProjectStatuses.suspended,
    },
  ];

  public updateProject(payload: UpdateProjectRequest): Observable<ProjectDto> {
    return this._baseHttpService.patchData(Endpoints.project, payload);
  }

  public getProjectById(id: number): Observable<ProjectDto> {
    return this._baseHttpService.getPageDataById(Endpoints.project, id);
  }

  private getComponentById(id: number): Observable<ComponentDto> {
    return this._baseHttpService.getPageDataById(Endpoints.component, id);
  }

  public showCreateComponentModal(injector: Injector): Observable<boolean> {
    const createModalConfiguration: ModalDataConfiguration<ComponentDto> = {
      type: ModalTypes.create,
      title: 'MODALS.component.create',
      titleFallback: 'Dodaj nowy komponent',
    };

    return this._modalService
      .openModal(TechnicalSpecificationComponentModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed();
  }

  public showInfoComponentModal(id: number, injector: Injector): Observable<boolean> {
    if (!id) return of(false);

    return this.getComponentById(id).pipe(
      switchMap((response: ComponentDto) => {
        if (!response) return of(false);

        const createModalConfiguration: ModalDataConfiguration<ComponentDto> = {
          type: ModalTypes.info,
          title: 'MODALS.component.info',
          titleFallback: 'Więcej informacji',
          data: response,
        };

        return this._modalService
          .openModal(TechnicalSpecificationComponentModal, createModalConfiguration, { injector })
          .afterClosed()
          .pipe(map((reloadPage) => !!reloadPage));
      }),
      defaultIfEmpty(false),
    );
  }

  public showDeleteComponentModal(id: number, injector: Injector): Observable<boolean> {
    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: ModalTypes.delete,
      title: 'MODALS.component.delete',
      titleFallback: 'Usuń komponent',
      data: { id: id, endpoint: Endpoints.component },
    };

    return this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed();
  }

  public showCreateDocumentModal(id: number, injector: Injector): Observable<boolean> {
    const createModalConfiguration: ModalDataConfiguration<{ componentId: number; data: DocumentDto | null }> = {
      type: ModalTypes.create,
      title: 'MODALS.document.create',
      titleFallback: 'Dodaj dokument',
      data: { componentId: id, data: null },
    };

    return this._modalService.openModal(DocumentModal, createModalConfiguration, { injector: injector }).afterClosed();
  }

  public showDeleteDocumentModal(id: number, injector: Injector): Observable<boolean> {
    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: ModalTypes.delete,
      title: 'MODALS.document.delete',
      titleFallback: 'Usuń dokument',
      data: { id: id, endpoint: Endpoints.document },
    };

    return this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed();
  }

  public showMetricModal(
    currentMetricListLength: number,
    currentPercent: number,
    injector: Injector,
  ): Observable<{ metricsYears: number; metricsPercent: number }> {
    const createModalConfiguration: ModalDataConfiguration<{
      length: number;
      percent: number;
    }> = {
      type: ModalTypes.create,
      title: 'MODALS.metric.create',
      titleFallback: 'Skonfiguruj metrykę',
      data: { length: currentMetricListLength, percent: currentPercent },
    };

    return this._modalService
      .openModal(ProjectMetricsModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed();
  }

  public closeCurrentModal(formData: { metricsYear: number; metricsPercent: number }): void {
    this._modalService.closeCurrentModal(formData);
  }
}
