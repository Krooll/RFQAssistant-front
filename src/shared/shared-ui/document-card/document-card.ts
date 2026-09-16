import { Component, input, output } from '@angular/core';
import { DocumentDto } from '@core/dtos';
import { Button } from '@shared/shared-ui/button/button';

@Component({
  selector: 'app-document-card',
  imports: [Button],
  templateUrl: './document-card.html',
  styleUrl: './document-card.scss',
})
export class DocumentCard {
  documentData = input.required<DocumentDto>();

  downloadActionOutput = output<number>();

  protected onDownloadClick(id: number) {
    this.downloadActionOutput.emit(id);
  }
}
