import { Component, inject, Injector, OnInit } from '@angular/core';
import { ProcessService } from '@features/process-component/process-service';
import { Button } from '@shared/shared-ui/button/button';
import { Paginator } from '@shared/shared-ui/paginator/paginator';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-process-component',
  imports: [Button, Paginator, TranslateFallbackPipe, ItemList],
  providers: [ProcessService],
  templateUrl: './process.html',
  styleUrl: './process.scss',
})
export class Process implements OnInit {
  readonly _processComponentService = inject(ProcessService);
  private readonly _injector = inject(Injector);

  ngOnInit() {
    this._processComponentService.getAllProcess();
  }

  protected onAddButtonClicked() {
    this._processComponentService.showCreateProcessModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined) {
    this._processComponentService.getCurrentProcessById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined) {
    this._processComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
