import { Component, computed, inject, Signal } from '@angular/core';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { Router, RouterOutlet } from '@angular/router';
import { RouteEndpoints } from '@env/route-endpoints';
import { NavbarMenu } from '@shared/shared-ui/navbar-menu/navbar-menu';
import { Application } from '@core/core-dtos/application/application';
import { Roles } from '@core/core-dtos/roles/roles';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { ModalService } from '@core/services/modal-service/modal-service';
import { LanguageModal } from '@shared/shared-ui/language-modal/language-modal';

@Component({
  selector: 'app-dashboard-component',
  imports: [RouterOutlet, NavbarMenu],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);
  private readonly _modalService = inject(ModalService);

  protected readonly applicationList: Application[] = [
    {
      id: 'projects',
      name: 'NAVBAR.applicationsList.projects.name',
      nameFallback: 'Projekty',
      route: RouteEndpoints.project,
      expectedRoles: [Roles.admin, Roles.manager],
    },
    {
      id: 'supplier',
      name: 'NAVBAR.applicationsList.supplier.name',
      nameFallback: 'Dostawcy',
      route: RouteEndpoints.supplier,
      expectedRoles: [Roles.admin, Roles.manager],
    },
    {
      id: 'process',
      name: 'NAVBAR.applicationsList.process.name',
      nameFallback: 'Procesy',
      route: RouteEndpoints.process,
      expectedRoles: [Roles.admin, Roles.manager],
    },
    {
      id: 'material',
      name: 'NAVBAR.applicationsList.material.name',
      nameFallback: 'Materiały',
      route: RouteEndpoints.material,
      expectedRoles: [Roles.admin, Roles.manager],
    },
    {
      id: 'user',
      name: 'NAVBAR.applicationsList.user.name',
      nameFallback: 'Użytkownicy',
      route: RouteEndpoints.user,
      expectedRoles: [Roles.admin, Roles.manager],
    },
  ];

  protected readonly validApplicationList: Signal<Application[]> = computed(() => {
    const currentUserData = this._userDataService.getUserDataFromLocalStorage();
    const currentUserRole = currentUserData?.user?.role;

    if (!currentUserData || !currentUserRole) {
      return [];
    }

    return this.applicationList.filter((item) => item.expectedRoles.includes(currentUserRole));
  });

  protected navigateToSelectedApp(url: string | undefined): void {
    if (url && url.length > 0) {
      this._router.navigateByUrl(url);
    }
  }

  protected onLangChangeButtonClick(): void {
    const currentLang = localStorage.getItem('currentLang');
    this.showLangModal(currentLang);
  }

  public showLangModal(currentLang: string | null): void {
    const createModalConfiguration: ModalDataConfiguration<string | null> = {
      type: ModalTypes.empty,
      title: 'MODALS.lang.title',
      titleFallback: 'Zmień język',
      data: currentLang,
    };

    this._modalService.openModal(LanguageModal, createModalConfiguration).afterClosed();
  }
}
