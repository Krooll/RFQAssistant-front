import { Component, effect, input, output, signal } from '@angular/core';
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
import { Role, Roles } from '@core/core-dtos/roles/roles';
import { customPaginatorTranslate } from '@shared/shared-ui/table/custom-paginator-translate';
import { Button } from '@shared/shared-ui/button/button';
import { DatePipe } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';

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
    DatePipe,
    MatCheckbox,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: customPaginatorTranslate, deps: [TranslateService] }],
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table<T> {
  public dataSource = input.required<T[]>();
  public pageParams = input.required<PageRequestParams>();
  public totalElements = input.required<number>();
  public pageSizeOptions = input<number[]>([5, 10, 15, 20, 25, 50, 100]);

  displayedColumns = signal<string[] | []>([]);

  public pageChange = output<PageRequestParams>();
  public infoClick = output<number>();
  public deleteClick = output<number>();

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

  protected getSubArray(element: T, column: string): any[] {
    const value = (element as Record<string, any>)[column];
    return Array.isArray(value) ? value : [];
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

  protected getColumnTranslationKey(column: string): string {
    if (column === 'actions') {
      return 'TABLE.actions';
    }

    return `TABLE.${column}`;
  }

  protected getEnumTranslationKey(column: Role): string {
    switch (column) {
      case Roles.admin:
        return 'TABLE.admin';
      case Roles.manager:
        return 'TABLE.manager';
      case Roles.employee:
        return 'TABLE.employee';
      case Roles.supplier:
        return 'TABLE.supplier';
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

  protected readonly ButtonTypes = ButtonTypes;
  protected readonly Array = Array;
}
