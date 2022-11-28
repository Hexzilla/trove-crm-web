import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PipelinestagesComponent } from './pipelinestages.component';

describe('PipelinestagesComponent', () => {
  let component: PipelinestagesComponent;
  let fixture: ComponentFixture<PipelinestagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PipelinestagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PipelinestagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
