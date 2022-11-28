import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinechartFilterComponent } from './pipelinechart-filter.component';

describe('PipelinechartFilterComponent', () => {
  let component: PipelinechartFilterComponent;
  let fixture: ComponentFixture<PipelinechartFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelinechartFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinechartFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
