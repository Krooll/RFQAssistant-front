import { Component, effect, model } from '@angular/core';
import { SupplierDto } from '@core/dtos';

@Component({
  selector: 'app-supplier-project',
  imports: [],
  templateUrl: './supplier-project.html',
  styleUrl: './supplier-project.scss',
})
export class SupplierProject {
  protected supplierData = model<SupplierDto>();

  constructor() {
    effect(() => {
      const supplierData = this.supplierData();
      if (supplierData?.id) {
        this.checkSupplierState();
      }
    });
  }

  checkSupplierState(): void {
    if (this.supplierData()?.disable === true && !this.supplierData()?.processes?.length) {
      console.log('konto trzeba aktywowac ');
    }
  }
}
