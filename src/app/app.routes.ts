import { Routes } from '@angular/router';
import { roleGuard } from '@core/guards/role-guard/role-guard';
import { loggedGuard } from '@core/guards/logged-guard/logged-guard';
import { projectResolver } from '@features/project/resolver/project-resolver';
import { Roles } from '@core/core-dtos/roles/roles';
import { activateUserResolver } from '@features/activate-user-component/resolver/activate-user-resolver';
import { ActivateUserService } from '@features/activate-user-component/activate-user-service';
import { rootRedirectGuard } from '@core/guards/root-redirect-guard/root-redirect-guard';
import { activateUserGuard } from '@core/guards/activate-user-guard/activate-user-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [rootRedirectGuard],
    children: [],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
    canActivate: [loggedGuard],
  },
  {
    path: 'activate-user',
    loadComponent: () =>
      import('@features/activate-user-component/activate-user/activate-user').then((m) => m.ActivateUser),
    canActivate: [activateUserGuard],
    providers: [ActivateUserService],
    resolve: { userData: activateUserResolver },
  },
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('@features/unauthorized-component/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard-component/dashboard/dashboard').then((m) => m.Dashboard),
    children: [
      {
        path: 'project',
        loadComponent: () => import('@features/project/project/project').then((m) => m.Project),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin, Roles.manager, Roles.employee] },
      },
      {
        path: 'supplier-project',
        loadComponent: () =>
          import('@features/supplier-project/supplier-project/supplier-project').then((m) => m.SupplierProject),
        canActivate: [roleGuard],
        data: { roles: [Roles.supplier] },
      },
      {
        path: 'project/form/:id',
        loadComponent: () => import('@features/project/project-form/project-form').then((m) => m.ProjectForm),
        canActivate: [roleGuard],
        resolve: { projectData: projectResolver },
        data: { roles: [Roles.admin, Roles.manager, Roles.employee] },
      },
      {
        path: 'user',
        loadComponent: () => import('@features/user-component/user/user').then((m) => m.User),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] },
      },
      {
        path: 'material',
        loadComponent: () => import('@features/material-component/material/material').then((m) => m.Material),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] },
      },
      {
        path: 'process',
        loadComponent: () => import('@features/process-component/process/process').then((m) => m.Process),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] },
      },
      {
        path: 'supplier',
        loadComponent: () => import('@features/supplier-component/supplier/supplier').then((m) => m.Supplier),
        canActivate: [roleGuard],
        data: { roles: [Roles.admin] },
      },
    ],
  },
];
