import { Component, input, output } from '@angular/core';
import { DocumentDto } from '@core/dtos';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-document-card',
  imports: [Button, TranslateFallbackPipe],
  templateUrl: './document-card.html',
  styleUrl: './document-card.scss',
})
export class DocumentCard {
  documentData = input.required<DocumentDto>();

  downloadActionOutput = output<number>();
  deleteActionOutput = output<number>();

  protected buttonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.primary,
    size: ButtonSizes.small,
  };

  protected closeButtonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  protected onDownloadClick(id: number | undefined) {
    if (!id) return;
    this.downloadActionOutput.emit(id);
  }

  protected onDeleteClick(id: number | undefined) {
    if (!id) return;
    this.deleteActionOutput.emit(id);
  }
}
