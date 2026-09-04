import { Component, inject, input, output } from '@angular/core';
import { Application } from '@core/dtos/application/application';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { Button } from '@shared/shared-ui/button/button';
import { ButtonConfiguration } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-navbar-menu',
  imports: [TranslateFallbackPipe, Button],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.scss',
})
export class NavbarMenu {
  private readonly _authorizationService = inject(AuthorizationService);

  readonly applicationList = input.required<Application[]>();

  selectedApplication = output<string | undefined>();

  menuNavBarButtonConfig: ButtonConfiguration = {
    variant: 'transparent',
    size: 'medium',
    padding: '',
    margin: 'mt-1',
  };

  logoutButtonConfiguration: ButtonConfiguration = {
    variant: 'transparent',
    size: 'medium',
    padding: '',
    margin: 'mt-1',
  };

  onNavBarItemClick(url: string) {
    if (url.length > 0) {
      this.selectedApplication.emit(url);
    }
  }

  protected logOut() {
    this._authorizationService.logout();
  }
}
