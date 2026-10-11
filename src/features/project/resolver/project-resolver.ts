import { ResolveFn, Router } from '@angular/router';
import { ProjectDto } from '@core/dtos';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ResolverService } from '@core/services/resolver-service/resolver-service';
import { RouteEndpoints } from '@env/route-endpoints';
import { Endpoints } from '@env/endpoints';

export const projectResolver: ResolveFn<ProjectDto> = (route) => {
  const router = inject(Router);
  const projectResolverService = inject(ResolverService);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigateByUrl(RouteEndpoints.project);
    return EMPTY;
  }

  return projectResolverService.getById<ProjectDto>(Endpoints.project, Number(id)).pipe(
    catchError(() => {
      router.navigateByUrl(RouteEndpoints.project);
      return EMPTY;
    }),
  );
};
