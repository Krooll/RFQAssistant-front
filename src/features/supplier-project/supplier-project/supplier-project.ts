import { Component, effect, inject, Injector, model } from '@angular/core';
import { SupplierDto } from '@core/dtos';
import { SupplierProjectService } from '@features/supplier-project/supplier-project-service';
import { SupplierService } from '@features/supplier-component/supplier-service';

@Component({
  selector: 'app-supplier-project',
  imports: [],
  providers: [SupplierProjectService, SupplierService],
  templateUrl: './supplier-project.html',
  styleUrl: './supplier-project.scss',
})
export class SupplierProject {
  private readonly _supplierProjectComponentService = inject(SupplierProjectService);
  private readonly _injector = inject(Injector);

  protected supplierData = model<SupplierDto>();

  constructor() {
    effect(() => {
      const supplierData = this.supplierData();
      if (supplierData?.id) {
        this.checkSupplierState();
      }
    });
  }

  private checkSupplierState(): void {
    if (this.supplierData()?.disable === true || !this.supplierData()?.processes?.length) {
      this._supplierProjectComponentService.showInfoSupplierModal(this.supplierData(), this._injector);
    }
  }
}
