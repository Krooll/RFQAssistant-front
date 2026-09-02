import { Component, computed, inject, Signal } from '@angular/core';
import { Application } from '@core/dtos/application/application';
import { Endpoints } from '@env/endpoints';
import { UserDataService } from '@core/services/user-data-service/user-data';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [TranslateFallbackPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly _userDataService = inject(UserDataService);
  private readonly _router = inject(Router);

  protected readonly applicationList: Application[] = [
    {
      id: 'user',
      name: 'Użytkownik',
      nameFallback: 'Użytkownik',
      route: Endpoints.user,
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

  protected navigateToSelectedApp(url: string) {
    if (url.length > 0) {
      this._router.navigateByUrl(url);
    }
  }
}
