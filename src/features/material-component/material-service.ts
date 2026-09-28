import { DestroyRef, inject, Injectable, Injector, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { ModalService } from '@core/services/modal-service/modal-service';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { CreateMaterialRequest, MaterialDto, UpdateMaterialRequest } from '@core/dtos';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpringPageable } from '@core/core-dtos/pageable/pageable';
import { Endpoint, Endpoints } from '@env/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { MaterialModal } from '@features/material-component/material-modal/material-modal';
import { DeleteModal } from '@shared/shared-ui/delete-modal/delete-modal';

@Injectable()
export class MaterialService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public pageParams = signal<PageRequestParams>({ page: 0, size: 10 });
  public totalElements = signal<number>(0);
  public materialList = signal<MaterialDto[] | undefined>(undefined);

  private getMaterials(
    pageParams: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<MaterialDto>> {
    return this._baseHttpService.getPageData(Endpoints.material, pageParams, extraPageParams);
  }

  private getMaterialById(id: number): Observable<MaterialDto> {
    return this._baseHttpService.getPageDataById(Endpoints.material, id);
  }

  public createMaterial(createMaterialRequest: CreateMaterialRequest): Observable<MaterialDto> {
    return this._baseHttpService.postData(Endpoints.material, createMaterialRequest);
  }

  public updateMaterial(updateMaterialRequest: UpdateMaterialRequest): Observable<MaterialDto> {
    return this._baseHttpService.patchData(Endpoints.material, updateMaterialRequest);
  }

  closeCurrentModal(reloadPage?: boolean): void {
    this._modalService.closeCurrentModal(reloadPage);
  }

  getAllMaterials(): void {
    this.getMaterials(this.pageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.materialList.set(response.content);
            this.totalElements.set(response.totalElements);
          }
        },
      });
  }

  updatePageParams(params: PageRequestParams): void {
    this.pageParams.set(params);
    this.getAllMaterials();
  }

  getCurrentMaterialById(id: number | undefined, injector: Injector): void {
    if (!id) {
      return;
    }

    this.getMaterialById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.showInfoMaterialModal(response, injector);
          }
        },
      });
  }

  showCreateMaterialModal(injector: Injector): void {
    const createModalConfiguration: ModalDataConfiguration<MaterialDto> = {
      type: ModalTypes.create,
      title: 'MODALS.material.create',
      titleFallback: 'Dodaj nowy materiał',
    };

    this._modalService
      .openModal(MaterialModal, createModalConfiguration, {
        injector: injector,
      })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllMaterials();
          }
        },
      });
  }

  showInfoMaterialModal(response: MaterialDto, injector: Injector): void {
    const createModalConfiguration: ModalDataConfiguration<MaterialDto> = {
      type: ModalTypes.info,
      title: 'MODALS.material.info',
      titleFallback: 'Więcej informacji',
      data: response,
    };

    this._modalService
      .openModal(MaterialModal, createModalConfiguration, { injector: injector })
      .afterClosed()
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (reloadPage: boolean) => {
          if (reloadPage) {
            this.getAllMaterials();
          }
        },
      });
  }

  showDeleteModal(id: number | undefined, injector: Injector): void {
    if (!id) {
      return;
    }

    const createModalConfiguration: ModalDataConfiguration<{ id: number; endpoint: Endpoint }> = {
      type: ModalTypes.delete,
      title: 'MODALS.material.delete',
      titleFallback: 'Usuń materiał',
      data: { id: id, endpoint: Endpoints.material },
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
            this.getAllMaterials();
          }
        },
      });
  }
}
