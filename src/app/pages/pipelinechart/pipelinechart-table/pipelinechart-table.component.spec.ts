import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinechartTableComponent } from './pipelinechart-table.component';

describe('PipelinechartTableComponent', () => {
  let component: PipelinechartTableComponent;
  let fixture: ComponentFixture<PipelinechartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelinechartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinechartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
