import { Router, Routes } from '@angular/router';
import { inject } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { roleGuard } from '@core/guards/role-guard/role-guard';
import { loggedGuard } from '@core/guards/logged-guard/logged-guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [
      () => {
        const userDataService = inject(UserDataService);
        const router = inject(Router);

        const userData = userDataService.getUserDataFromLocalStorage();

        if (userData?.user) {
          return router.createUrlTree(['/dashboard']);
        }

        return router.createUrlTree(['/auth/login']);
      },
    ],
    children: [],
  },
  {
    path: 'auth/login',
    loadComponent: () => import('@features/auth/login/login').then((m) => m.Login),
    canActivate: [loggedGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('@features/dashboard-component/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [roleGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'project',
      },
      {
        path: 'project',
        loadComponent: () => import('@features/project/project/project').then((m) => m.Project),
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'user',
        loadComponent: () => import('@features/user-component/user/user').then((m) => m.User),
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN'] },
      },
      {
        path: 'process',
        loadComponent: () => import('@features/process-component/process/process').then((m) => m.Process),
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'supplier',
        loadComponent: () => import('@features/supplier-component/supplier/supplier').then((m) => m.Supplier),
        canActivate: [roleGuard],
        data: { roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
      },
      {
        path: 'unauthorized',
        loadComponent: () =>
          import('@features/unauthorized-component/unauthorized/unauthorized').then((m) => m.Unauthorized),
      },
    ],
  },
];
