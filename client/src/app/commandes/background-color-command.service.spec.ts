// tslint:disable: no-string-literal
import { TestBed } from '@angular/core/testing';
import { BackgroundColorCommand } from './background-color-command.service';

describe('BackgroundColorCommand', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should set the new to the old', () => {
    const service: BackgroundColorCommand = new BackgroundColorCommand('#000000');
    expect(service['oldColor']).toEqual('');
    service.newToOldColor();
    expect(service['oldColor']).toEqual(service['newColor']);
  });
});
