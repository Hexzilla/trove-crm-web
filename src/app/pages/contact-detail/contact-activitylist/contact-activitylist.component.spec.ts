import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactActivitylistComponent } from './contact-activitylist.component';

describe('ContactActivitylistComponent', () => {
  let component: ContactActivitylistComponent;
  let fixture: ComponentFixture<ContactActivitylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactActivitylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactActivitylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
