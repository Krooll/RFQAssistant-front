import { inject, Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private _snackbar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };

  public showError(message: string, customConfig?: MatSnackBarConfig) {
    const mergedConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...customConfig,
      panelClass: 'snackbar-error',
    };

    return this._snackbar.open(message, '', mergedConfig);
  }

  public showSuccess(message: string, customConfig?: MatSnackBarConfig) {
    const mergedConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...customConfig,
      panelClass: 'snackbar-success',
    };

    return this._snackbar.open(message, '', mergedConfig);
  }

  public showWarning(message: string, customConfig?: MatSnackBarConfig) {
    const mergedConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...customConfig,
      panelClass: 'snackbar-warning',
    };

    return this._snackbar.open(message, '', mergedConfig);
  }

  public showInfo(message: string, customConfig?: MatSnackBarConfig) {
    const mergedConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...customConfig,
      panelClass: 'snackbar-info',
    };

    return this._snackbar.open(message, '', mergedConfig);
  }
}
