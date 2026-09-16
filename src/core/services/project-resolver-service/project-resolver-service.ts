import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Observable } from 'rxjs';
import { ProjectDto } from '@core/dtos';
import { Endpoints } from '@env/endpoints';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolverService {
  private readonly _baseHttpService = inject(BaseHttpService);

  public getById(id: number): Observable<ProjectDto> {
    return this._baseHttpService.getPageDataById(Endpoints.project, id);
  }
}
