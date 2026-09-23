import { DestroyRef, inject, Injectable, NgZone } from '@angular/core';
import { Endpoints } from '@env/endpoints';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { NotificationService } from '@core/services/notification-service/notification-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DownloadService {
  private readonly _notificationService = inject(NotificationService);
  private readonly _ngZone = inject(NgZone);
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _destroyRef = inject(DestroyRef);

  private downloadFile(id: number) {
    return this._baseHttpService.downloadFile(Endpoints.documentDownload, id);
  }

  public downloadCurrentFile(id: number | undefined) {
    if (!id) return;

    this.downloadFile(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (!blob) return;

          const contentDisposition = response.headers.get('content-disposition');
          let filename = `document_${id}.pdf`;

          if (contentDisposition) {
            const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = matches[1];
            }
          }

          const fileUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = filename;

          document.body.appendChild(link);
          link.click();

          document.body.removeChild(link);
          URL.revokeObjectURL(fileUrl);
        },
        error: (err: Error) => {
          this._notificationService.showError(err.message ? err.message : 'Brak pliku pdf...');
        },
      });
  }

  public previewCurrentFile(id: number | undefined) {
    if (!id) return;

    this.downloadFile(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response: HttpResponse<Blob>) => {
          const blob = response.body;
          if (!blob) return;

          const fileURL = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));

          window.open(fileURL, '_blank');

          this._ngZone.runOutsideAngular(() => {
            setTimeout(() => URL.revokeObjectURL(fileURL), 5000);
          });
        },
        error: (err: Error) => {
          this._notificationService.showError(err.message ? err.message : 'Brak pliku pdf...');
        },
      });
  }
}
