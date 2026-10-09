import { Component, inject, signal } from '@angular/core';
import { ModalDataConfiguration } from '@shared/model-ui/modal-configuration/modal-data-configuration/modal-data-configuration';
import { UserDto } from '@core/dtos';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalService } from '@core/services/modal-service/modal-service';
import { Translate } from '@core/services/translate-service/translate';
import { ButtonLangConfiguration } from '@shared/model-ui/button-lang-configuration/button-lang-configuration';
import { ModalBase } from '@shared/shared-ui/modal-base/modal-base';
import { ModalType } from '@shared/model-ui/modal-configuration/modal-types/modal-types';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';

@Component({
  selector: 'app-language-modal',
  imports: [ModalBase, Button, TranslateFallbackPipe],
  templateUrl: './language-modal.html',
  styleUrl: './language-modal.scss',
})
export class LanguageModal {
  private readonly _modalData = inject<ModalDataConfiguration<UserDto>>(MAT_DIALOG_DATA);
  private readonly _modalService = inject(ModalService);
  private readonly _translateService = inject(Translate);

  protected langButtonList: ButtonLangConfiguration[] = [
    {
      id: 'pl',
      label: 'BUTTONS.pl',
      labelFallback: 'Polski',
    },
    {
      id: 'en',
      label: 'BUTTONS.en',
      labelFallback: 'Angielski',
    },
  ];

  protected data = signal<UserDto | undefined>(undefined);
  protected type = signal<ModalType | undefined>(undefined);
  protected title = signal<{ title: string; titleFallback: string }>({
    title: '',
    titleFallback: '',
  });

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.type.set(this._modalData.type);
    this.title.set({
      title: this._modalData.title,
      titleFallback: this._modalData.titleFallback,
    });
    this.data.set(this._modalData.data);
  }

  protected setCurrentLanguage(lang: string): void {
    this._translateService.onChangeLang(lang);
  }

  protected closeCurrentModal(reloadPage?: boolean): void {
    this._modalService.closeCurrentModal(reloadPage ? reloadPage : false);
  }
}
