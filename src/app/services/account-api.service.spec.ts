/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AccountApiService } from './account-api.service';

describe('Service: AccountApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccountApiService]
    });
  });

  it('should ...', inject([AccountApiService], (service: AccountApiService) => {
    expect(service).toBeTruthy();
  }));
});
