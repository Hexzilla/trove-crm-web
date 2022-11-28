import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlychartTableComponent } from './monthlychart-table.component';

describe('MonthlychartTableComponent', () => {
  let component: MonthlychartTableComponent;
  let fixture: ComponentFixture<MonthlychartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlychartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlychartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
