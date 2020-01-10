import { TestBed } from '@angular/core/testing';

import { MagnetManipulationService } from './magnet-manipulation.service';

describe('MagnetManipulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MagnetManipulationService = TestBed.get(MagnetManipulationService);
    expect(service).toBeTruthy();
  });
});
