import { Component, input, output } from '@angular/core';
import { MatDialogActions, MatDialogContent } from '@angular/material/dialog';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ModalTypes } from '@shared/model-ui/modal-configuration/modal-types/modal-types';

@Component({
  selector: 'app-modal-base',
  imports: [Button, MatDialogContent, MatDialogActions, TranslateFallbackPipe],
  templateUrl: './modal-base.html',
  styleUrl: './modal-base.scss',
})
export class ModalBase {
  public modalType = input.required<ModalTypes | undefined>();
  public modalTitle = input.required<{ title: string; titleFallback: string }>();
  public buttonDisabled = input.required<boolean | undefined>();

  submitOutput = output<void>();
  closeOutput = output<void>();
  deleteOutput = output<void>();
  updateOutput = output<void>();

  protected submitButtonClicked() {
    this.submitOutput.emit();
  }

  protected updateButtonClicked() {
    this.updateOutput.emit();
  }

  protected closeButtonClicked() {
    this.closeOutput.emit();
  }

  protected deleteButtonClicked() {
    this.deleteOutput.emit();
  }
}
