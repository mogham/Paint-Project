import { TestBed } from '@angular/core/testing';

import { CommandeAbstractService } from './commande-abstract.service';

describe('CommandeAbstractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommandeAbstractService = TestBed.get(CommandeAbstractService);
    expect(service).toBeTruthy();
  });
});
