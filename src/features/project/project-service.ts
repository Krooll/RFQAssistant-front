import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { CreateProjectRequest, ProjectDto, SimpleProjectDto, UpdateProjectRequest } from '@core/dtos';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpringPageable } from '@core/core-dtos/pageable/pageable';
import { Endpoint, Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';
import { ModalService } from '@core/services/modal-service/modal-service';
import { ProjectModal } from '@features/project/project-modal/project-modal';
import { Router } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';

@Injectable()
export class ProjectService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public totalElements = signal<number>(0);
  public projectList = signal<SimpleProjectDto[] | undefined>(undefined);

  private getProjects(
    pageParams: PageRequestParams,
    extraParams: HttpParams,
  ): Observable<SpringPageable<SimpleProjectDto>> {
    return this._baseHttpService.getPageData(Endpoints.project, pageParams, extraParams);
  }

  private getProjectById(id: number): Observable<SimpleProjectDto> {
    return this._baseHttpService.getPageDataById(Endpoints.project, id);
  }

  public createProject(createProjectRequest: CreateProjectRequest): Observable<ProjectDto> {
    return this._baseHttpService.postData(Endpoints.project, createProjectRequest);
  }

  public updateProject(updateProjectRequest: UpdateProjectRequest): Observable<ProjectDto> {
    return this._baseHttpService.patchData(Endpoints.project, updateProjectRequest);
  }

  public getAllProjects() {
    this.getProjects(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          this.projectList.set(response.content);
          this.totalElements.set(response.totalElements);
        },
      });
  }

  updatePageParams(params: PageRequestParams) {
    this.pageParams.set(params);
    this.getAllProjects();
  }

  public showCreateProjectModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<ProjectDto> = {
      type: 'create',
      title: 'MODALS.project.create',
      titleFallback: 'Dodaj nowy projekt',
    };

    this._modalService.openModal(ProjectModal, createModalConfiguration, {
      injector: injector,
    });
  }

  public routeToCurrentProject(id: number | undefined) {
    if (!id) return;
    this._router.navigateByUrl(RouteEndpoints.projectForm + '/' + id);
  }

  public showDeleteModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.project.delete',
      titleFallback: 'Usuń projekt',
      data: { id: id, endpoint: Endpoints.project },
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
            this.getAllProjects();
          }
        },
      });
  }

  public closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
