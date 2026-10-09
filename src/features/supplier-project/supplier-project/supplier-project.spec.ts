import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProject } from './supplier-project';

describe('SupplierProject', () => {
  let component: SupplierProject;
  let fixture: ComponentFixture<SupplierProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProject],
    }).compileComponents();

    fixture = TestBed.createComponent(SupplierProject);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
