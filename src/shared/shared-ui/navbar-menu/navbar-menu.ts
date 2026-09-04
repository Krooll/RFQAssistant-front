import { Component, inject, input, output } from '@angular/core';
import { Application } from '@core/dtos/application/application';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { AuthorizationService } from '@core/services/auth-service/authorization';

@Component({
  selector: 'app-navbar-menu',
  imports: [TranslateFallbackPipe],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.scss',
})
export class NavbarMenu {
  private readonly _authorizationService = inject(AuthorizationService);

  readonly applicationList = input.required<Application[]>();

  selectedApplication = output<string | undefined>();

  onNavBarItemClick(url: string) {
    if (url.length > 0) {
      this.selectedApplication.emit(url);
    }
  }

  protected logOut() {
    this._authorizationService.logout();
  }
}
