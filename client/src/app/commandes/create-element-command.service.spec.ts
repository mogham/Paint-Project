// tslint:disable: no-string-literal
import { TestBed } from '@angular/core/testing';
import { CreateElementCommandService } from './create-element-command.service';

describe('AddElementCommandService', () => {
  let service: CreateElementCommandService;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [CreateElementCommandService],
  }));

  it('should set element', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttributeNS(null, 'stroke', '#00000000');
    service = new CreateElementCommandService(rectangle);
    expect(service['elementAdd']).toEqual(rectangle);
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    service.setElement(ellipse);
    expect(service['elementAdd']).toEqual(ellipse);
  });
});
