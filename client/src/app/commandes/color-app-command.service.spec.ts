// tslint:disable: no-string-literal
import { TestBed } from '@angular/core/testing';
import { ColorAppCommand } from './color-app-command.service';

describe('ColorAppCommand', () => {
  let service: ColorAppCommand;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ColorAppCommand],
  }));

  it('should find index of element', () => {
    service = new ColorAppCommand('stroke');
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    shapes.push(ellipse);
    service.fillIndex(rectangle, shapes);
    expect(service['index']).toEqual(0);
  });

  it('should redo Shapes', () => {
    service = new ColorAppCommand('stroke');
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttributeNS(null, 'stroke', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    service['newColor'] = '#ffffffff';
    service['index'] = 0;
    service.updateRedoShapes(shapes);
    expect(shapes[0].getAttributeNS(null, 'stroke')).toEqual('#ffffffff');
  });

  it('should undo Shapes', () => {
    service = new ColorAppCommand('stroke');
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttributeNS(null, 'stroke', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    service['oldColor'] = '#ffffffff';
    service['index'] = 0;
    service.updateUndoShapes(shapes);
    expect(shapes[0].getAttributeNS(null, 'stroke')).toEqual('#ffffffff');
  });

  it('should get new Color', () => {
    service = new ColorAppCommand('stroke');
    service['newColor'] = '#ffffffff';
    expect(service.getNewColor()).toEqual('#ffffffff');
  });

  it('should get old Color', () => {
    service = new ColorAppCommand('stroke');
    service['oldColor'] = '#ffffffff';
    expect(service.getOldColor()).toEqual('#ffffffff');
  });

  it('should get attributeSet', () => {
    service = new ColorAppCommand('stroke');
    expect(service.getAttributeSet()).toEqual('stroke');
  });
});
