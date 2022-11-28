import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsservicesComponent } from './termsservices.component';

describe('TermsservicesComponent', () => {
  let component: TermsservicesComponent;
  let fixture: ComponentFixture<TermsservicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsservicesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsservicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
