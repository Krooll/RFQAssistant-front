import { Injectable, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormListService {
  public addSelectedItemToCurrentList<T extends { id?: number }>(currentList: WritableSignal<T[]>, item: T): void {
    if (item?.id == null) {
      return;
    }

    currentList.update((list) => {
      if (item.id && list.some((listItem) => listItem?.id === item?.id)) {
        return list;
      }
      return [...list, item];
    });
  }

  public removeSelectedItemFromCurrentList<T extends { id?: number }>(
    currentList: WritableSignal<T[]>,
    id: number,
  ): void {
    if (!id) return;
    currentList.update((currentList) => currentList.filter((item) => item.id !== id));
  }

  public extractItemsIdFromCurrentList<T extends { id?: number }>(
    currentList: WritableSignal<T[]>,
  ): number[] | undefined {
    return currentList()
      ?.map((item) => item.id)
      .filter((id) => id !== undefined);
  }
}
