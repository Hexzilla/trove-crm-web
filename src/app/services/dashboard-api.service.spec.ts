import { TestBed } from '@angular/core/testing';

import { DashboardApiService } from './dashboard-api.service';

describe('Service: DashboardApiService', () => {
  let service: DashboardApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
