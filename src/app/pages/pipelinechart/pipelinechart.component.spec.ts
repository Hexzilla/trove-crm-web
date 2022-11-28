import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinechartComponent } from './pipelinechart.component';

describe('PipelinechartComponent', () => {
  let component: PipelinechartComponent;
  let fixture: ComponentFixture<PipelinechartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelinechartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinechartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
