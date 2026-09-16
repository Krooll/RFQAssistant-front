import { Component, output } from '@angular/core';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ItemListActions } from '@shared/model-ui/item-list-actions/item-list-actions';

@Component({
  selector: 'app-item-list',
  imports: [Button, TranslateFallbackPipe],
  templateUrl: './item-list.html',
  styleUrl: './item-list.scss',
})
export class ItemList {
  infoButtonClickedOutput = output();
  deleteButtonClickedOutput = output();

  onButtonCLicked(actionType: ItemListActions) {
    switch (actionType) {
      case 'info':
        this.infoButtonClickedOutput.emit();
        break;
      case 'delete':
        this.deleteButtonClickedOutput.emit();
        break;
    }
  }
}
