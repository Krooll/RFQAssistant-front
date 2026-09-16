import { Component, inject, Injector, OnInit } from '@angular/core';
import { SupplierService } from '@features/supplier-component/supplier-service';
import { Button } from '@shared/shared-ui/button/button';
import { Paginator } from '@shared/shared-ui/paginator/paginator';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ItemList } from '@shared/shared-ui/item-list/item-list';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';

@Component({
  selector: 'app-supplier-component',
  imports: [Button, Paginator, TranslateFallbackPipe, ItemList],
  providers: [SupplierService],
  templateUrl: './supplier.html',
  styleUrl: './supplier.scss',
})
export class Supplier implements OnInit {
  readonly _supplierComponentService = inject(SupplierService);
  private readonly _injector = inject(Injector);

  ngOnInit() {
    this._supplierComponentService.getAllSuppliers();
  }

  protected onAddButtonClicked() {
    this._supplierComponentService.showCreateSupplierModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined) {
    this._supplierComponentService.getCurrentSupplierById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined) {
    this._supplierComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
