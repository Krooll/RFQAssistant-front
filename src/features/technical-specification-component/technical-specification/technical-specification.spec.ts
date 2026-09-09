import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpecification } from './technical-specification';

describe('TechnicalSpecification', () => {
  let component: TechnicalSpecification;
  let fixture: ComponentFixture<TechnicalSpecification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpecification],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalSpecification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
