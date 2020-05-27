import { TestBed } from '@angular/core/testing';

import { SpeakerGuardService } from './speaker-guard.service';

describe('SpeakerGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpeakerGuardService = TestBed.get(SpeakerGuardService);
    expect(service).toBeTruthy();
  });
});
