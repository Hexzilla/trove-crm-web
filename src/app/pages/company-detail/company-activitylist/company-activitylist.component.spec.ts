import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyActivitylistComponent } from './company-activitylist.component';

describe('CompanyActivitylistComponent', () => {
  let component: CompanyActivitylistComponent;
  let fixture: ComponentFixture<CompanyActivitylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompanyActivitylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyActivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
