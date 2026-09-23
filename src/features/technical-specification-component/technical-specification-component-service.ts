import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Observable } from 'rxjs';
import { ComponentDto, CreateComponentRequest, ProcessDto, UpdateComponentRequest } from '@core/dtos';
import { Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { HttpParams } from '@angular/common/http';
import { SpringPageable } from '@core/core-dtos/pageable/pageable';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class TechnicalSpecificationComponentService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public processList = signal<ProcessDto[] | undefined>(undefined);
  public selectedProcessList = signal<ProcessDto[] | undefined>(undefined);

  public processPageParams = signal<PageRequestParams>({ page: 0, size: 100 });

  public createComponent(createComponentRequest: CreateComponentRequest): Observable<ComponentDto> {
    return this._baseHttpService.postData(Endpoints.component, createComponentRequest);
  }

  public updateComponent(updateComponentRequest: UpdateComponentRequest): Observable<ComponentDto> {
    return this._baseHttpService.patchData(Endpoints.component, updateComponentRequest);
  }

  private getProcesses(
    pageParamsService: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<ProcessDto>> {
    return this._baseHttpService.getPageData(Endpoints.process, pageParamsService, extraPageParams);
  }

  public getAllProcesses() {
    this.getProcesses(this.processPageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.processList.set(response.content);
          }
        },
      });
  }

  public addSelectedProcessToList(item: ProcessDto): void {
    if (!item?.id) {
      return;
    }

    this.selectedProcessList.update((currentList = []) => {
      const exists = currentList.some((process) => process.id === item.id);

      if (exists) {
        return currentList;
      }

      return [...currentList, item];
    });
  }

  public removeSelectedProcessFromList(id: number | undefined): void {
    if (!id) return;
    this.selectedProcessList.update((currentList) => (currentList ?? []).filter((process) => process.id !== id));
  }

  public closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
