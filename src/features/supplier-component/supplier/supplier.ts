import { Component, inject, Injector, OnInit } from '@angular/core';
import { SupplierService } from '@features/supplier-component/supplier-service';
import { TranslateFallbackPipe } from '@core/pipes/translate-pipe/translate-pipe';
import { ButtonTypes } from '@shared/model-ui/button-configuration/button-configuration';
import { Table } from '@shared/shared-ui/table/table';
import { Button } from '@shared/shared-ui/button/button';

@Component({
  selector: 'app-supplier-component',
  imports: [TranslateFallbackPipe, Table, Button],
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

  protected onAddButtonClicked(): void {
    this._supplierComponentService.showCreateSupplierModal(this._injector);
  }

  protected onInfoButtonClicked(id: number | undefined): void {
    this._supplierComponentService.getCurrentSupplierById(id, this._injector);
  }

  protected onDeleteButtonCLicked(id: number | undefined): void {
    this._supplierComponentService.showDeleteModal(id, this._injector);
  }

  protected readonly ButtonTypes = ButtonTypes;
}
