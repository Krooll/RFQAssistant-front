import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ModalService } from '@core/services/modal-service/modal-service';
import {
  CreateSupplierRequest,
  PageRequestParams,
  ProcessDto,
  SpringPageable,
  SupplierDto,
  UpdateSupplierRequest,
  UserDto,
} from '@core/dtos';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Endpoint, Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { SupplierModal } from '@features/supplier-component/supplier-modal/supplier-modal';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';

@Injectable()
export class SupplierService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public processPageParams = signal<PageRequestParams>({ page: 0, size: 100 });
  public totalElements = signal<number>(0);
  public supplierList = signal<SupplierDto[] | undefined>(undefined);

  public processList = signal<ProcessDto[] | undefined>(undefined);
  public selectedProcessList = signal<ProcessDto[] | undefined>(undefined);

  private getProcesses(
    pageParamsService: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<ProcessDto>> {
    return this._baseHttpService.getPageData(Endpoints.process, pageParamsService, extraPageParams);
  }

  private getSuppliers(
    pageParamsService: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<SupplierDto>> {
    return this._baseHttpService.getPageData(
      Endpoints.supplier,
      pageParamsService,
      extraPageParams,
    );
  }

  private getSupplierById(id: number): Observable<SupplierDto> {
    return this._baseHttpService.getPageDataById(Endpoints.supplier, id);
  }

  public createSupplier(createSupplierRequest: CreateSupplierRequest): Observable<SupplierDto> {
    return this._baseHttpService.postData(Endpoints.supplier, createSupplierRequest);
  }

  public updateSupplier(updateSupplierRequest: UpdateSupplierRequest): Observable<SupplierDto> {
    return this._baseHttpService.patchData(Endpoints.supplier, updateSupplierRequest);
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

  public getAllSuppliers() {
    this.getSuppliers(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.supplierList.set(response.content);
            this.totalElements.set(response.totalElements);
          }
        },
      });
  }

  updatePageParams(params: PageRequestParams) {
    this.pageParams.set(params);
    this.getAllSuppliers();
  }

  public getCurrentSupplierById(id: number | undefined, injector: Injector) {
    if (!id) {
      return;
    }

    this.getSupplierById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.showInfoSupplierModal(response, injector);
          }
        },
      });
  }

  showCreateSupplierModal(injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<SupplierDto> = {
      type: 'create',
      title: 'MODALS.supplier.create',
      titleFallback: 'Dodaj nowego dostawcę',
    };

    this._modalService
      .openModal(SupplierModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllSuppliers();
          }
        },
      });
  }

  showInfoSupplierModal(response: SupplierDto, injector: Injector) {
    const createModalConfiguration: ModalDataConfiguration<UserDto> = {
      type: 'info',
      title: 'MODALS.supplier.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService
      .openModal(SupplierModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllSuppliers();
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
      title: 'MODALS.supplier.delete',
      titleFallback: 'Usuń dostawcę',
      data: { id: id, endpoint: Endpoints.supplier },
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
            this.getAllSuppliers();
          }
        },
      });
  }

  addSelectedProcessToList(item: ProcessDto): void {
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

  removeSelectedProcessFromList(id: number | undefined): void {
    if (!id) return;
    this.selectedProcessList.update((currentList) =>
      (currentList ?? []).filter((process) => process.id !== id),
    );
  }

  closeCurrentModal(reloadPage?: boolean) {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
