import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

export function customPaginatorTranslate(translate: TranslateService): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = translate.instant('TABLE.paginator');
  paginatorIntl.firstPageLabel = '';
  paginatorIntl.lastPageLabel = '';
  paginatorIntl.nextPageLabel = '';
  paginatorIntl.previousPageLabel = '';

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${translate.instant('TABLE.of')} ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;

    const ofText = translate.instant('TABLE.of');
    return `${startIndex + 1} - ${endIndex} ${ofText} ${length}`;
  };

  return paginatorIntl;
}
