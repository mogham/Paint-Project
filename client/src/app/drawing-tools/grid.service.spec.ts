import { async, TestBed } from '@angular/core/testing';
import { GridService } from './grid.service';

describe('GridService', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    })
      .compileComponents();
  }));
  it('should be created', () => {
    const service1: GridService = TestBed.get(GridService);
    expect(service1).toBeTruthy();
  });
});
