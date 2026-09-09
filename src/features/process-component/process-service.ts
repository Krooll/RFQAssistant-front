import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ModalService } from '@core/services/modal-service/modal-service';
import {
  CreateProcessRequest,
  PageRequestParams,
  ProcessDto,
  SpringPageable,
  UpdateProcessRequest,
  UserDto,
} from '@core/dtos';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Endpoint, Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { ProcessModal } from '@features/process-component/process-modal/process-modal';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';

@Injectable()
export class ProcessService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public totalElements = signal<number>(0);
  public processList = signal<ProcessDto[] | undefined>(undefined);

  private getProcesses(
    pageParams: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<ProcessDto>> {
    return this._baseHttpService.getPageData(Endpoints.process, pageParams, extraPageParams);
  }

  private getProcessById(id: number): Observable<ProcessDto> {
    return this._baseHttpService.getPageDataById(Endpoints.process, id);
  }

  public createProcess(createProcessRequest: CreateProcessRequest): Observable<ProcessDto> {
    return this._baseHttpService.postData(Endpoints.process, createProcessRequest);
  }

  public updateProcess(updateProcessRequest: UpdateProcessRequest): Observable<ProcessDto> {
    return this._baseHttpService.patchData(Endpoints.process, updateProcessRequest);
  }

  getAllProcess() {
    this.getProcesses(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.processList.set(response.content);
            this.totalElements.set(response.totalElements);
          }
        },
      });
  }

  updatePageParams(params: PageRequestParams) {
    this.pageParams.set(params);
    this.getAllProcess();
  }

  getCurrentProcessById(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    this.getProcessById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.showInfoProcessModal(response, injector);
          }
        },
      });
  }

  showCreateProcessModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'create',
      title: 'MODALS.process.create',
      titleFallback: 'Dodaj nowy Process',
    };

    this._modalService
      .openModal(ProcessModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllProcess();
          }
        },
      });
  }

  showInfoProcessModal(response: ProcessDto, injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<ProcessDto> = {
      type: 'info',
      title: 'MODALS.process.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService
      .openModal(ProcessModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllProcess();
          }
        },
      });
  }

  showDeleteModal(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: 'delete',
      title: 'MODALS.user.delete',
      titleFallback: 'Usuń użytkownika',
      data: { id: id, endpoint: Endpoints.process },
    };

    this._modalService
      .openModal(DeleteModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllProcess();
          }
        },
      });
  }

  closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
