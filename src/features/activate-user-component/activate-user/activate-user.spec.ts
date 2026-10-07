import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateUser } from './activate-user';

describe('ActivateUser', () => {
  let component: ActivateUser;
  let fixture: ComponentFixture<ActivateUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivateUser],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivateUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
