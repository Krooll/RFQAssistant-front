import { Component, inject, input, output } from '@angular/core';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { Button } from '@shared/shared-ui/button/button';
import { ButtonConfiguration } from '@shared/model-ui/button-configuration/button-configuration';
import { Application } from '@core/core-dtos/application/application';

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

  protected onNavBarItemClick(url: string | void) {
    if (url && url?.length > 0) {
      this.selectedApplication.emit(url);
    }
  }

  protected logOut() {
    this._authorizationService.logout();
  }
}
