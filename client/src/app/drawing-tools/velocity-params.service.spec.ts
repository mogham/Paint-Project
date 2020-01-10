import { TestBed } from '@angular/core/testing';

import { VelocityParamsService } from './velocity-params.service';

describe('VelocityParamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VelocityParamsService = TestBed.get(VelocityParamsService);
    expect(service).toBeTruthy();
  });
});
