import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTableComponent } from './lead-table.component';

describe('LeadTableComponent', () => {
  let component: LeadTableComponent;
  let fixture: ComponentFixture<LeadTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
