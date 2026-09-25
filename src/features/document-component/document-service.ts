import { inject, Injectable } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { CreateDocumentRequest, DocumentDto } from '@core/dtos';
import { Observable } from 'rxjs';
import { Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';

@Injectable()
export class DocumentService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);

  public createDocument(createDocumentRequest: CreateDocumentRequest): Observable<DocumentDto> {
    return this._baseHttpService.postData(Endpoints.documentUpload, this.toFormData(createDocumentRequest));
  }

  public closeCurrentModal(reloadPage?: boolean): void {
    this._modalService.closeCurrentModal(reloadPage);
  }

  private toFormData<T extends Record<string, any>>(object: T): FormData {
    const formData = new FormData();

    Object.keys(object).forEach((key) => {
      const value = object[key];
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });
    return formData;
  }
}
