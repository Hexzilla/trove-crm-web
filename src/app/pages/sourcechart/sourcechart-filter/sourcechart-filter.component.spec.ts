import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcechartFilterComponent } from './sourcechart-filter.component';

describe('SourcechartFilterComponent', () => {
  let component: SourcechartFilterComponent;
  let fixture: ComponentFixture<SourcechartFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcechartFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcechartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
