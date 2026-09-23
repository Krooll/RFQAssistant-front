import { Component, input, output } from '@angular/core';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ItemListAction, ItemListActions } from '@shared/model-ui/item-list-actions/item-list-actions';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-item-list',
  imports: [Button, TranslateFallbackPipe],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  public documentButtonVisibility = input<boolean>(false);

  protected infoButtonClickedOutput = output();
  protected deleteButtonClickedOutput = output();
  protected documentButtonClickedOutput = output();

  protected onButtonCLicked(actionType: ItemListAction) {
    switch (actionType) {
      case ItemListActions.info:
        this.infoButtonClickedOutput.emit();
        break;
      case ItemListActions.delete:
        this.deleteButtonClickedOutput.emit();
        break;
      case ItemListActions.document:
        this.documentButtonClickedOutput.emit();
    }
  }

  protected readonly ButtonTypes = ButtonTypes;
}
