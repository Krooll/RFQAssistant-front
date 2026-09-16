import { ResolveFn, Router } from '@angular/router';
import { ProjectDto } from '@core/dtos';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { ProjectResolverService } from '@core/services/project-resolver-service/project-resolver-service';
import { RouteEndpoints } from '@env/route-endpoints';

export const projectResolver: ResolveFn<ProjectDto> = (route) => {
  const router = inject(Router);
  const projectResolverService = inject(ProjectResolverService);
  const id = route.paramMap.get('id');

  if (!id) {
    router.navigateByUrl(RouteEndpoints.project);
    return EMPTY;
  }

  return projectResolverService.getById(Number(id)).pipe(
    catchError(() => {
      router.navigateByUrl(RouteEndpoints.project);
      return EMPTY;
    }),
  );
};
