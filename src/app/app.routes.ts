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
    loadComponent: () => import('@features/dashboard/dashboard').then((m) => m.Dashboard),
    canActivate: [roleGuard],
  },
  {
    path: 'user',
    loadComponent: () => import('@features/user/user').then((m) => m.User),
    canActivate: [roleGuard],
    data: { role: 'ROLE_ADMIN' },
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('@features/unauthorized/unauthorized').then((m) => m.Unauthorized),
  },
];
