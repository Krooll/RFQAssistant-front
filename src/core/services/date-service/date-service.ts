import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  public formatIsoToInputDate(isoString: string | null | undefined): string {
    if (!isoString) return '';

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  public changeDateToISOString(date: string): string {
    return new Date(date).toISOString();
  }
}
