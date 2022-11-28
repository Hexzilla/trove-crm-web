import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcechartComponent } from './sourcechart.component';

describe('SourcechartComponent', () => {
  let component: SourcechartComponent;
  let fixture: ComponentFixture<SourcechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SourcechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SourcechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
