import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitylogComponent } from './activitylog.component';

describe('ActivitylogComponent', () => {
  let component: ActivitylogComponent;
  let fixture: ComponentFixture<ActivitylogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitylogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivitylogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
