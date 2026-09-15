import { Component, computed, inject, Signal } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router, RouterOutlet } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { NavbarMenu } from '@shared/shared-ui/navbar-menu/navbar-menu';
import { Application } from '@core/core-dtos/application/application';

@Component({
  selector: 'app-dashboard-component',
  imports: [RouterOutlet, NavbarMenu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);

  protected readonly applicationList: Application[] = [
    {
      id: 'projects',
      name: 'NAVBAR.applicationList.name.projects',
      nameFallback: 'Projekty',
      route: RouteEndpoints.project,
      expectedRole: 'ROLE_ADMIN',
    },
    {
      id: 'technical-specification-component',
      name: 'NAVBAR.applicationList.name.components',
      nameFallback: 'Komponenty',
      route: RouteEndpoints.component,
      expectedRole: 'ROLE_ADMIN',
    },
    {
      id: 'supplier',
      name: 'NAVBAR.applicationList.name.supplier',
      nameFallback: 'Dostawcy',
      route: RouteEndpoints.supplier,
      expectedRole: 'ROLE_ADMIN',
    },
    {
      id: 'process',
      name: 'NAVBAR.applicationList.name.process',
      nameFallback: 'Procesy',
      route: RouteEndpoints.process,
      expectedRole: 'ROLE_ADMIN',
    },
    {
      id: 'user',
      name: 'NAVBAR.applicationList.name.user',
      nameFallback: 'Użytkownicy',
      route: RouteEndpoints.user,
      expectedRole: 'ROLE_ADMIN',
    },
  ];

  protected readonly validApplicationList: Signal<Application[]> = computed(() => {
    const currentUserData = this._userDataService.getUserDataFromLocalStorage();
    const currentUserRole = currentUserData?.user?.role;

    if (!currentUserData || !currentUserRole) {
      return [];
    }

    return this.applicationList.filter((item) => item.expectedRole === currentUserRole);
  });

  protected navigateToSelectedApp(url: string | undefined) {
    if (url && url.length > 0) {
      this._router.navigateByUrl(url);
    }
  }
}
