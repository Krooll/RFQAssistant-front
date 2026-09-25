import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetricsModal } from './project-metrics-modal';

describe('ProjectMetricsModal', () => {
  let component: ProjectMetricsModal;
  let fixture: ComponentFixture<ProjectMetricsModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetricsModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetricsModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
