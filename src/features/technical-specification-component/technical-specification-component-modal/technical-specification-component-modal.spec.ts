import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecificationComponentModal } from './technical-specification-component-modal';

describe('TechnicalSpecificationComponentModal', () => {
  let component: TechnicalSpecificationComponentModal;
  let fixture: ComponentFixture<TechnicalSpecificationComponentModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpecificationComponentModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalSpecificationComponentModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
