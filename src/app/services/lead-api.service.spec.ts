/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { LeadApiService } from './lead-api.service';

describe('Service: LeadApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LeadApiService]
    });
  });

  it('should ...', inject([LeadApiService], (service: LeadApiService) => {
    expect(service).toBeTruthy();
  }));
});
