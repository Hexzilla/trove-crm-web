/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NoteApiService } from './note-api.service';

describe('Service: NoteApi', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoteApiService]
    });
  });

  it('should ...', inject([NoteApiService], (service: NoteApiService) => {
    expect(service).toBeTruthy();
  }));
});
