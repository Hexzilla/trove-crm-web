import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanspricingComponent } from './planspricing.component';

describe('PlanspricingComponent', () => {
  let component: PlanspricingComponent;
  let fixture: ComponentFixture<PlanspricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanspricingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanspricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
