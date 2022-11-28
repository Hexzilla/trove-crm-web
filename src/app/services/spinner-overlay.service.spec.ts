/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpinnerOverlayService } from './spinner-overlay.service';

describe('Service: SpinnerOverlay', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpinnerOverlayService]
    });
  });

  it('should ...', inject([SpinnerOverlayService], (service: SpinnerOverlayService) => {
    expect(service).toBeTruthy();
  }));
});
