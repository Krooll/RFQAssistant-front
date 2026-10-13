import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { AuthorizationService } from '@core/services/auth-service/authorization';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonTypes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { Application } from '@core/core-dtos/application/application';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar-menu',
  imports: [TranslateFallbackPipe, Button],
  templateUrl: './navbar-menu.html',
  styleUrl: './navbar-menu.scss',
})
export class NavbarMenu {
  private readonly _authorizationService = inject(AuthorizationService);
  private readonly _router = inject(Router);
  private readonly _destroyRef = inject(DestroyRef);

  readonly applicationList = input.required<Application[]>();

  protected selectedApplication = output<string | undefined>();
  protected changeLangButtonCLickEmit = output<void>();

  private currentUrl = toSignal(
    this._router.events.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this._router.url },
  );

  protected isAppActive(id: string): boolean {
    const currentUrl = this.currentUrl();
    const appList = this.applicationList();

    if (!currentUrl || !appList.length) {
      return false;
    }

    return appList.some((app: Application) => currentUrl.includes(String(app.id)) && app.id === id);
  }

  protected menuNavBarButtonConfig: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.medium,
    padding: '',
    margin: 'mt-1',
  };

  protected menuNavBarLowerButtonConfig: ButtonConfiguration = {
    variant: ButtonVariants.primary,
    size: ButtonSizes.medium,
    padding: '',
    margin: 'mt-1',
  };

  protected onNavBarItemClick(url: string | void) {
    if (url && url?.length > 0) {
      this.selectedApplication.emit(url);
    }
  }

  protected onLangChangeButtonClick() {
    this.changeLangButtonCLickEmit.emit();
  }

  protected logOut() {
    this._authorizationService.logout();
  }

  protected readonly ButtonTypes = ButtonTypes;
}
