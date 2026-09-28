import { Component, inject, Injector, OnInit } from '@angular/core';
import { MaterialService } from '@features/material-component/material-service';
import { Button } from '@shared/shared-ui/button/button';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { Paginator } from '@shared/shared-ui/paginator/paginator';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-material',
  imports: [Button, ItemList, Paginator, TranslateFallbackPipe],
  providers: [MaterialService],
  templateUrl: './material.html',
  styleUrl: './material.scss',
})
export class Material implements OnInit {
  readonly _materialComponentService = inject(MaterialService);
  private readonly _injector = inject(Injector);

  ngOnInit() {
    this._materialComponentService.getAllMaterials();
  }

  protected onAddButtonClicked(): void {
    this._materialComponentService.showCreateMaterialModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined): void {
    this._materialComponentService.getCurrentMaterialById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined): void {
    this._materialComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
