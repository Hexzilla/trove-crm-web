import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcechartTableComponent } from './sourcechart-table.component';

describe('SourcechartTableComponent', () => {
  let component: SourcechartTableComponent;
  let fixture: ComponentFixture<SourcechartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcechartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcechartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
