import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersrolesComponent } from './usersroles.component';

describe('UsersrolesComponent', () => {
  let component: UsersrolesComponent;
  let fixture: ComponentFixture<UsersrolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersrolesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersrolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
