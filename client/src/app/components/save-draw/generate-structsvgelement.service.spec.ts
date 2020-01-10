// tslint:disable: no-string-literal
import { TestBed } from '@angular/core/testing';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';
import { GenerateStructSVGElementService } from './generate-structsvgelement.service';

describe('GenerateStructSVGElementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should call fillArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'fillArrayStructSVGElement');
    const shapes: Element[] = new Array();
    component.setShapes(shapes);
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushRectangleInArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'pushRectangleInArrayStructSVGElement');
    const rectangleHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HTMLElement');
    rectangleHTMLElement.setAttribute('id', 'rectangle');
    component['shapes'].push(rectangleHTMLElement);
    component.fillArrayStructSVGElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushPolygonInArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'pushPolygonInArrayStructSVGElement');
    const polygonHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HTMLElement');
    polygonHTMLElement.setAttribute('id', 'polygon');
    component['shapes'].push(polygonHTMLElement);
    component.fillArrayStructSVGElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushEllipseInArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'pushEllipseInArrayStructSVGElement');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HTMLElement');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    component['shapes'].push(ellipseHTMLElement);
    component.fillArrayStructSVGElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushPathInArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'pushPathInArrayStructSVGElement');
    const pathHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HTMLElement');
    pathHTMLElement.setAttribute('id', 'path');
    component['shapes'].push(pathHTMLElement);
    component.fillArrayStructSVGElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushStampInArrayStructSVGElement when we set ArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const spy = spyOn(component, 'pushStampInArrayStructSVGElement');
    const pathHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HTMLElement');
    pathHTMLElement.setAttribute('id', 'stamp');
    component['shapes'].push(pathHTMLElement);
    component.fillArrayStructSVGElement();
    expect(spy).toHaveBeenCalled();
  });

  it('should fill arrayStructSVGElement with a text after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const tspan: StructTspan[] = new Array();
    tspan.push(new StructTspan('1', '10', '10', 'allo'));
    const image: StructText = new StructText('1', '#ffffffff', '#000000ff', '5', 'translate(10,10)', '5', '30',
      '45', 'comic', '18', 'italic', 'start', []);
    const TextHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Text');
    TextHTMLElement.setAttribute('id', 'text');
    TextHTMLElement.setAttribute('elementID', '1');
    TextHTMLElement.setAttribute('stroke', '#ffffffff');
    TextHTMLElement.setAttribute('fill', '#000000ff');
    TextHTMLElement.setAttribute('stroke-width', '5');
    TextHTMLElement.setAttribute('x', '5');
    TextHTMLElement.setAttribute('y', '30');
    TextHTMLElement.setAttribute('font-size', '45');
    TextHTMLElement.setAttribute('transform', 'translate(10,10)');
    TextHTMLElement.setAttribute('font-family', 'comic');
    TextHTMLElement.setAttribute('font-weight', '18');
    TextHTMLElement.setAttribute('font-style', 'italic');
    TextHTMLElement.setAttribute('text-anchor', 'start');
    shapes.push(TextHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(image);
  });

  it('should fill arrayStructSVGElement with a pen after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const pen: StructPen = new StructPen('1', 'translate(10,10)', []);
    const penHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'g');
    penHTMLElement.setAttribute('id', 'pen');
    penHTMLElement.setAttribute('elementID', '1');
    penHTMLElement.setAttribute('transform', 'translate(10,10)');
    shapes.push(penHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(pen);
  });

  it('should fill arrayStructSVGElement with a rectangle after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const rectangle: StructRectangle = new StructRectangle('1', '#ffffffff', '#000000ff', '5', '30', '45', '63', '18', ' ');
    const rectangleHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HMTLElement');
    rectangleHTMLElement.setAttribute('id', 'rectangle');
    rectangleHTMLElement.setAttribute('elementID', '1');
    rectangleHTMLElement.setAttribute('stroke', '#ffffffff');
    rectangleHTMLElement.setAttribute('fill', '#000000ff');
    rectangleHTMLElement.setAttribute('stroke-width', '5');
    rectangleHTMLElement.setAttribute('x', '45');
    rectangleHTMLElement.setAttribute('y', '63');
    rectangleHTMLElement.setAttribute('width', '18');
    rectangleHTMLElement.setAttribute('transform', '30');
    rectangleHTMLElement.setAttribute('height', ' ');
    shapes.push(rectangleHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(rectangle);
  });

  it('should fill arrayStructSVGElement with a ellipse after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const ellipse: StructEllipse = new StructEllipse('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', '63', '18');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HMTLElement');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '1');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttribute('transform', ' ');
    shapes.push(ellipseHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(ellipse);
  });

  it('should fill arrayStructSVGElement with a polygon after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const polygon: StructPolygon = new StructPolygon('1', '#ffffffff', '#000000ff', '5', '30', '45');
    const polygonHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HMTLElement');
    polygonHTMLElement.setAttribute('id', 'polygon');
    polygonHTMLElement.setAttribute('elementID', '1');
    polygonHTMLElement.setAttribute('stroke', '#ffffffff');
    polygonHTMLElement.setAttribute('fill', '#000000ff');
    polygonHTMLElement.setAttribute('stroke-width', '5');
    polygonHTMLElement.setAttribute('points', '30');
    polygonHTMLElement.setAttribute('transform', '45');
    shapes.push(polygonHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(polygon);
  });

  it('should fill arrayStructSVGElement with a path after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const pencil: StructPencil = new StructPencil('1', '#ffffffff', '#000000ff', '5', '30', '45', 'M32', ' ', ' ', ' ', ' ');
    const pencilHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HMTLElement');
    pencilHTMLElement.setAttribute('id', 'path');
    pencilHTMLElement.setAttribute('elementID', '1');
    pencilHTMLElement.setAttribute('transform', '30');
    pencilHTMLElement.setAttribute('stroke', '#ffffffff');
    pencilHTMLElement.setAttribute('fill', '#000000ff');
    pencilHTMLElement.setAttribute('stroke-width', '5');
    pencilHTMLElement.setAttribute('stroke-linecap', 'M32');
    pencilHTMLElement.setAttribute('d', '45');
    pencilHTMLElement.setAttribute('filter', ' ');
    pencilHTMLElement.setAttribute('stroke-dasharray', ' ');
    pencilHTMLElement.setAttribute('marker-mid', ' ');
    shapes.push(pencilHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(pencil);
  });

  it('should fill arrayStructSVGElement with an image after call setArrayStructSVGElement', () => {
    const component = new GenerateStructSVGElementService();
    const shapes: Element[] = new Array();
    const image: StructImage = new StructImage('1', '5', '45', '5', '30', '45', 'M32');
    const imageHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'HMTLElement');
    imageHTMLElement.setAttribute('id', 'stamp');
    imageHTMLElement.setAttribute('elementID', '1');
    imageHTMLElement.setAttribute('width', '5');
    imageHTMLElement.setAttribute('height', '30');
    imageHTMLElement.setAttribute('x', '5');
    imageHTMLElement.setAttribute('y', '45');
    imageHTMLElement.setAttribute('transform', '45');
    imageHTMLElement.setAttribute('href', 'M32');
    shapes.push(imageHTMLElement);
    component.setShapes(shapes);
    expect(component['arrayStructSVGElement'][0]).toEqual(image);
  });

  it('should get shapes', () => {
    const component = new GenerateStructSVGElementService();
    expect(component.getShapes()).toEqual(component['shapes']);
  });

});
