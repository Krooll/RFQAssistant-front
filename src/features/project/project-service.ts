import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { ProjectDto } from '@core/dtos';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpringPageable } from '@core/core-dtos/pageable/pageable';
import { Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class ProjectService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _destroyRef = inject(DestroyRef);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public totalElements = signal<number>(0);
  public projectList = signal<ProjectDto[] | undefined>(undefined);

  private getProjects(pageParams: PageRequestParams, extraParams: HttpParams): Observable<SpringPageable<ProjectDto>> {
    return this._baseHttpService.getPageData(Endpoints.project, pageParams, extraParams);
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
}
