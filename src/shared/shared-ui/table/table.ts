import { Component, effect, inject, input, output, signal } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';
import { MatSort, MatSortHeader, Sort } from '@angular/material/sort';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonTypes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { Roles } from '@core/core-dtos/roles/roles';
import { customPaginatorTranslate } from '@shared/shared-ui/table/fn/custom-paginator-translate';
import { Button } from '@shared/shared-ui/button/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { ProjectStatuses } from '@features/project/types/project-status/project-status';
import { TableActionButtons } from '@shared/model-ui/table-action-buttons/table-action-buttons';
import { DateService } from '@core/services/date-service/date-service';

@Component({
  selector: 'app-table',
  imports: [
    MatTable,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatColumnDef,
    MatCellDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatPaginator,
    MatSortHeader,
    MatSort,
    TranslateFallbackPipe,
    Button,
    MatCheckbox,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorTranslate, deps: [TranslateService] }],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table<T> {
  private readonly _dateService = inject(DateService);

  public dataSource = input.required<T[]>();
  public pageParams = input.required<PageRequestParams>();
  public totalElements = input.required<number>();
  public pageSizeOptions = input<number[]>([5, 10, 15, 20, 25, 50, 100]);

  protected displayedColumns = signal<string[] | []>([]);

  public pageChange = output<PageRequestParams>();
  public infoClick = output<number>();
  public deleteClick = output<number>();
  public previewClick = output<number>();
  public downloadClick = output<number>();
  public uploadClick = output<number>();
  public deleteDocumentClick = output<number>();

  protected actionButtons: TableActionButtons<T>[] = [
    {
      icon: 'bi bi-info-circle',
      onClick: (element) => this.onInfoButtonClick(element),
    },
    {
      icon: 'bi bi-trash3',
      onClick: (element) => this.onDeleteClick(element),
    },
  ];

  protected actionDocumentButtons: TableActionButtons<T>[] = [
    {
      icon: 'bi bi-box-arrow-in-down',
      onClick: (id) => this.onUploadDocument(Number(id)),
    },
    {
      icon: 'bi bi-eye',
      onClick: (id) => this.onPreviewDocument(Number(id)),
    },
    {
      icon: 'bi bi-download',
      onClick: (id) => this.onDownloadDocument(Number(id)),
    },
    {
      icon: 'bi bi-trash3',
      onClick: (id) => this.onDeleteDocument(Number(id)),
    },
  ];

  actionButtonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  constructor() {
    effect(() => {
      const dataSource = this.dataSource();

      if (dataSource) {
        this.getDisplayColumnKeys(dataSource);
      }
    });
  }

  private getDisplayColumnKeys(dataSource: T[]): void {
    if (dataSource && dataSource.length > 0) {
      const keys = Object.keys(dataSource[0] as string[]);

      if (!keys.includes('actions')) {
        keys.push('actions');
      }

      this.displayedColumns.set(keys);
    }
  }

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      ...this.pageParams(),
      page: event.pageIndex,
      size: event.pageSize,
    });
  }

  protected onSortPageChange(sort: Sort) {
    const sortParam = sort.direction ? `${sort.active},${sort.direction}` : undefined;

    this.pageChange.emit({
      ...this.pageParams(),
      page: 0,
      sort: sortParam,
    });
  }

  protected onInfoButtonClick(element: T): void {
    const id = Number((element as Record<string, any>)['id']);
    this.infoClick.emit(id);
  }

  protected onPreviewDocument(id: number): void {
    this.previewClick.emit(id);
  }

  protected onDownloadDocument(id: number): void {
    this.downloadClick.emit(id);
  }

  protected onUploadDocument(id: number): void {
    this.uploadClick.emit(id);
  }

  protected onDeleteDocument(id: number): void {
    this.deleteDocumentClick.emit(id);
  }

  protected onDeleteClick(element: T): void {
    const id = Number((element as Record<string, any>)['id']);
    this.deleteClick.emit(id);
  }

  protected dropColumn(event: CdkDragDrop<string>): void {
    const currentColumns = [...this.displayedColumns()];

    const previousIndex = currentColumns.indexOf(event.item.data);
    const currentIndex = currentColumns.indexOf(event.container.data); // lub event.currentIndex

    if (previousIndex !== -1 && currentIndex !== -1) {
      moveItemInArray(currentColumns, previousIndex, currentIndex);
      this.displayedColumns.set(currentColumns);
    }
  }

  protected getCellContent(element: T, column: string): any {
    const value = (element as Record<string, any>)[column];

    switch (true) {
      case column === 'documents':
        return Array.isArray(value) ? value : [];
      case Array.isArray(value):
        return value.map((v) => v.name || v).join(', ');
      case this.isDateString(value):
        return this._dateService.formatIsoToInputDate(value);
      case Boolean(this.getEnumTranslationKey(value)):
        return this.getEnumTranslationKey(value);
      default:
        return value;
    }
  }

  protected getColumnTranslationKey(column: string): string {
    if (column === 'actions') {
      return 'TABLE.actions';
    }

    return `TABLE.${column}`;
  }

  protected getEnumTranslationKey(column: string): string {
    switch (column) {
      case Roles.admin:
        return 'TABLE.admin';
      case Roles.manager:
        return 'TABLE.manager';
      case Roles.employee:
        return 'TABLE.employee';
      case Roles.supplier:
        return 'TABLE.supplier';
      case ProjectStatuses.active:
        return 'TABLE.active';
      case ProjectStatuses.inactive:
        return 'TABLE.inactive';
      case ProjectStatuses.suspended:
        return 'TABLE.suspended';
      default:
        return '';
    }
  }

  protected isDateString(value: any): boolean {
    if (typeof value !== 'string') return false;

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return isoDateRegex.test(value);
  }

  protected isBoolean(value: any): boolean {
    return typeof value === 'boolean';
  }

  protected isColumnSortable(column: string): boolean {
    if (column === 'actions') {
      return false;
    }

    const dataSource = this.dataSource();
    if (dataSource && dataSource.length > 0) {
      const sampleItem = dataSource[0] as Record<string, any>;
      const value = sampleItem[column];

      if (Array.isArray(value)) {
        return false;
      }
    }

    return true;
  }

  protected readonly ButtonTypes = ButtonTypes;
}
