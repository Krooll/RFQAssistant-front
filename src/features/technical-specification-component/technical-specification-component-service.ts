import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { BaseHttpService } from '@core/services/base-http-service/base-http';
import { Observable } from 'rxjs';
import { ComponentDto, CreateComponentRequest, MaterialDto, ProcessDto, UpdateComponentRequest } from '@core/dtos';
import { Endpoints } from '@env/endpoints';
import { ModalService } from '@core/services/modal-service/modal-service';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { HttpParams } from '@angular/common/http';
import { SpringPageable } from '@core/core-dtos/pageable/pageable';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormListService } from '@core/services/form-list-service/form-list-service';

@Injectable()
export class TechnicalSpecificationComponentService {
  private readonly _baseHttpService = inject(BaseHttpService);
  private readonly _formListService = inject(FormListService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);

  public processList = signal<ProcessDto[] | undefined>(undefined);
  public selectedProcessList = signal<ProcessDto[]>([]);

  public materialList = signal<MaterialDto[] | undefined>(undefined);
  public selectedMaterialList = signal<MaterialDto[]>([]);

  public processPageParams = signal<PageRequestParams>({ page: 0, size: 100 });
  public materialPageParams = signal<PageRequestParams>({ page: 0, size: 100 });

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

  public getAllProcesses(): void {
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

  private getMaterials(
    pageParamsService: PageRequestParams,
    extraPageParams: HttpParams,
  ): Observable<SpringPageable<MaterialDto>> {
    return this._baseHttpService.getPageData(Endpoints.material, pageParamsService, extraPageParams);
  }

  public getAllMaterials(): void {
    this.getMaterials(this.materialPageParams(), new HttpParams())
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (response) => {
          if (response) {
            this.materialList.set(response.content);
          }
        },
      });
  }

  public addSelectedProcessToList(item: ProcessDto): void {
    if (!item?.id) {
      return;
    }

    this._formListService.addSelectedItemToCurrentList(this.selectedProcessList, item);
  }

  public removeSelectedProcessFromList(id: number | undefined): void {
    if (!id) return;

    this._formListService.removeSelectedItemFromCurrentList(this.selectedProcessList, id);
  }

  public addSelectedMaterialToList(item: MaterialDto): void {
    if (!item?.id) {
      return;
    }

    this._formListService.addSelectedItemToCurrentList(this.selectedMaterialList, item);
  }

  public removeSelectedMaterialFromList(id: number | undefined): void {
    if (!id) return;

    this._formListService.removeSelectedItemFromCurrentList(this.selectedMaterialList, id);
  }

  public closeCurrentModal(reloadPage?: boolean): void {
    this._modalService.closeCurrentModal(reloadPage);
  }
}
