import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectMetrics } from './project-metrics';

describe('ProjectMetrics', () => {
  let component: ProjectMetrics;
  let fixture: ComponentFixture<ProjectMetrics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectMetrics],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectMetrics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
