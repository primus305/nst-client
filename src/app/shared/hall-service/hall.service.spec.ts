import { TestBed } from '@angular/core/testing';

import { HallService } from './hall.service';

describe('HallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HallService = TestBed.get(HallService);
    expect(service).toBeTruthy();
  });
});
