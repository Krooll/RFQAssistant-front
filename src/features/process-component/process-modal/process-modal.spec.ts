import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessModal } from './process-modal';

describe('ProcessModal', () => {
  let component: ProcessModal;
  let fixture: ComponentFixture<ProcessModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProcessModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
