import { Pageable, SortObject } from '@core/dtos';

export interface SpringPageable<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort: SortObject;
  pageable: Pageable;
}
