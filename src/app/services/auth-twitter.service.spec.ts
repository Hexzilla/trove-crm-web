/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AuthTwitterService } from './auth-twitter.service';

describe('Service: AuthTwitter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthTwitterService]
    });
  });

  it('should ...', inject([AuthTwitterService], (service: AuthTwitterService) => {
    expect(service).toBeTruthy();
  }));
});
