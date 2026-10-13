import { Component, inject, Injector, OnInit } from '@angular/core';
import { ProcessService } from '@features/process-component/process-service';
import { Button } from '@shared/shared-ui/button/button';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';
import { Table } from '@shared/shared-ui/table/table';

@Component({
  selector: 'app-process-component',
  imports: [Button, TranslateFallbackPipe, Table],
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

  protected onAddButtonClicked(): void {
    this._processComponentService.showCreateProcessModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined): void {
    this._processComponentService.getCurrentProcessById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined): void {
    this._processComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
