import { DestroyRef, inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ComponentDto, CreateProjectRequest, ProjectDto, UpdateProjectRequest } from '@core/dtos';
import { Observable } from 'rxjs';
import { Endpoint, Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { TechnicalSpecificationComponentModal } from '@features/technical-specification-component/technical-specification-component-modal/technical-specification-component-modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';

@Injectable()
export class ProjectFormService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public createProject(createProjectRequest: CreateProjectRequest): Observable<ProjectDto> {
    return this._baseHttpService.postData(Endpoints.project, createProjectRequest);
  }

  public updateProject(updateProjectRequest: UpdateProjectRequest): Observable<ProjectDto> {
    return this._baseHttpService.patchData(Endpoints.project, updateProjectRequest);
  }

  public getProjectById(id: number): Observable<ProjectDto> {
    return this._baseHttpService.getPageDataById(Endpoints.project, id);
  }

  private getComponentById(id: number): Observable<ComponentDto> {
    return this._baseHttpService.getPageDataById(Endpoints.component, id);
  }

  public getCurrentComponentById(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    this.getComponentById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
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
            console.log('dodano komponent');
            //this.getAllUsers();
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
            //this.getAllUsers();
          }
        },
      });
  }

  public showDeleteModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.component.delete',
      titleFallback: 'Usuń komponent',
      data: { id: id, endpoint: Endpoints.user },
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
            //this.getAllUsers();
          }
        },
      });
  }

  public closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }

  closeFormAndRouteToProjectList() {
    this._router.navigateByUrl(RouteEndpoints.project);
  }
}
