import { TestBed } from '@angular/core/testing';

import { AttendeeGuardService } from './attendee-guard.service';

describe('AttendeeGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AttendeeGuardService = TestBed.get(AttendeeGuardService);
    expect(service).toBeTruthy();
  });
});
