import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlychartFilterComponent } from './monthlychart-filter.component';

describe('MonthlychartFilterComponent', () => {
  let component: MonthlychartFilterComponent;
  let fixture: ComponentFixture<MonthlychartFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthlychartFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlychartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
