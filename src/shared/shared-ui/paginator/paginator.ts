import { Component, input, output } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Button } from '@shared/shared-ui/button/button';
import { PageRequestParams } from '@core/core-dtos/page-request-params/page-request-params';

@Component({
  selector: 'app-paginator',
  imports: [MatPaginator, Button],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  public pageParams = input.required<PageRequestParams>();
  public totalElements = input<number>(0);
  public pageSizeOptions = input<number[]>([5, 10, 25, 50, 100]);

  public pageChange = output<PageRequestParams>();

  protected onPageChange(event: PageEvent): void {
    this.pageChange.emit({
      ...this.pageParams(),
      page: event.pageIndex,
      size: event.pageSize,
    });
  }

  protected onSortPageChange(sort: string) {
    this.pageChange.emit({
      ...this.pageParams(),
      page: 0,
      sort: sort,
    });
  }
}
