import { Component, input, output } from '@angular/core';
import { DocumentDto } from '@core/dtos';
import { Button } from '@shared/shared-ui/button/button';
import {
  ButtonConfiguration,
  ButtonSizes,
  ButtonVariants,
} from '@shared/model-ui/button-configuration/button-configuration';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { DocumentCardAction, documentCardActions } from '@shared/model-ui/document-card-actions/document-card-actions';

@Component({
  selector: 'app-document-card',
  imports: [Button, TranslateFallbackPipe],
  templateUrl: './document-card.html',
  styleUrl: './document-card.scss',
})
export class DocumentCard {
  public documentData = input.required<DocumentDto>();

  protected downloadActionOutput = output<number>();
  protected deleteActionOutput = output<number>();
  protected previewActionOutput = output<number>();

  protected buttonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.primary,
    size: ButtonSizes.small,
  };

  protected closeButtonConfiguration: ButtonConfiguration = {
    variant: ButtonVariants.transparent,
    size: ButtonSizes.small,
  };

  protected onActionButtonClick(type: DocumentCardAction, id: number | undefined): void {
    if (!id) return;

    switch (type) {
      case documentCardActions.download:
        this.downloadActionOutput.emit(id);
        break;
      case documentCardActions.delete:
        this.deleteActionOutput.emit(id);
        break;
      case documentCardActions.preview:
        this.previewActionOutput.emit(id);
        break;
    }
  }

  protected readonly documentCardActions = documentCardActions;
}
