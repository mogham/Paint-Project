// tslint:disable: no-string-literal
import { TestBed } from '@angular/core/testing';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructSVGElement } from '../../../../../common/class/struct-svgelement';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';
import { SvgImage } from '../../../../../common/SvgImage';
import { GenerateElementService } from './generate-element.service';

describe('GenerateElementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenerateElementService = TestBed.get(GenerateElementService);
    expect(service).toBeTruthy();
  });

  it('should call pushRectangleInShapes when we set ArrayStructSVGElement with a rectangle', () => {
    const component = new GenerateElementService();
    const spy = spyOn(component, 'pushRectangleInShapes');
    const rectangleHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const rectangle: StructRectangle = new StructRectangle('1', '#ffffffff', '#000000ff', '5', '30', '45', '63', '18', ' ');
    rectangleHTMLElement.setAttribute('id', 'rectangle');
    component.addShapes(rectangle, rectangleHTMLElement, 'rect');
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushPolygonInShapes when we set ArrayStructSVGElement with a polygon', () => {
    const component = new GenerateElementService();
    const spy = spyOn(component, 'pushPolygonInShapes');
    const polygonHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const polygon: StructPolygon = new StructPolygon('1', '#ffffffff', '#000000ff', '5', '30', '45');
    polygonHTMLElement.setAttribute('id', 'polygon');
    component.addShapes(polygon, polygonHTMLElement, 'polygon');
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushPathInShapes when we set ArrayStructSVGElement with a path', () => {
    const component = new GenerateElementService();
    const spy = spyOn(component, 'pushPathInShapes');
    const pathHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const polygon: StructPencil = new StructPencil('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', 'points', ' ', ' ', ' ');
    pathHTMLElement.setAttribute('id', 'path');
    component.addShapes(polygon, pathHTMLElement, 'path');
    expect(spy).toHaveBeenCalled();
  });

  it('should call pushImageInShapes when we set ArrayStructSVGElement with an image', () => {
    const component = new GenerateElementService();
    const spy = spyOn(component, 'pushImageInShapes');
    const imageHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const image: StructImage = new StructImage('1', '#ffffffff', '#000000ff', '5', '30', '45', 'href');
    imageHTMLElement.setAttribute('id', 'image');
    component.addShapes(image, imageHTMLElement, 'image');
    expect(spy).toHaveBeenCalled();
  });

  it('should add shapes', () => {
    const component = new GenerateElementService();
    spyOn(component, 'pushRectangleInShapes');
    component.addShapes({} as StructSVGElement, {} as Element, 'rect');
    expect(component.pushRectangleInShapes).toHaveBeenCalled();

    spyOn(component, 'pushPolygonInShapes');
    component.addShapes({} as StructSVGElement, {} as Element, 'polygon');
    expect(component.pushPolygonInShapes).toHaveBeenCalled();

    spyOn(component, 'pushEllipseInShapes');
    component.addShapes({} as StructSVGElement, {} as Element, 'ellipse');
    expect(component.pushEllipseInShapes).toHaveBeenCalled();

    spyOn(component, 'pushPathInShapes');
    component.addShapes({} as StructSVGElement, {} as Element, 'path');
    expect(component.pushPathInShapes).toHaveBeenCalled();

    spyOn(component, 'pushTextInShapes');
    component.addShapes({} as StructSVGElement, {} as Element, 'test');
    expect(component.pushTextInShapes).not.toHaveBeenCalled();

    component.addShapes({} as StructSVGElement, {} as Element, 'text');
    expect(component.pushTextInShapes).toHaveBeenCalled();

  });

  it('should fill shapes with a text', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const svgImage: SvgImage = new SvgImage();
    const tspan: StructTspan[] = new Array();
    tspan.push(new StructTspan('1', '10', '10', 'allo'));
    const text: StructText = new StructText('1', '#ffffffff', '#000000ff', '5', 'translate(10,10)', '5', '30',
      '45', 'comic', '18', 'italic', 'start', []);
    svgImage['shapes'] = shapes;
    const TextHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Text');
    TextHTMLElement.setAttribute('id', 'text');
    TextHTMLElement.setAttribute('elementID', '1');
    TextHTMLElement.setAttribute('transform', 'translate(10,10)');
    TextHTMLElement.setAttribute('stroke', '#ffffffff');
    TextHTMLElement.setAttribute('fill', '#000000ff');
    TextHTMLElement.setAttribute('stroke-width', '5');
    TextHTMLElement.setAttribute('font-size', '45');
    TextHTMLElement.setAttribute('font-family', 'comic');
    TextHTMLElement.setAttribute('font-weight', '18');
    TextHTMLElement.setAttribute('font-style', 'italic');
    TextHTMLElement.setAttribute('text-anchor', 'start');
    TextHTMLElement.setAttribute('x', '5');
    TextHTMLElement.setAttribute('y', '30');

    shapes.push(text);
    const textElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'text');
    component.pushTextInShapes(text, 'text', textElement);
    expect(component['shapes'][0].getAttribute('x')).toEqual(TextHTMLElement.getAttribute('x'));
    expect(component['shapes'][0].getAttribute('y')).toEqual(TextHTMLElement.getAttribute('y'));
    expect(component['shapes'][0].getAttribute('font-family')).toEqual(TextHTMLElement.getAttribute('font-family'));
    expect(component['shapes'][0].getAttribute('text-anchor')).toEqual(TextHTMLElement.getAttribute('text-anchor'));
    expect(component['shapes'][0].getAttribute('elementID')).toEqual(TextHTMLElement.getAttribute('elementID'));
  });

  it('should fill shapes with a pen', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const svgImage: SvgImage = new SvgImage();
    const pen: StructPen = new StructPen('1', 'translate(10,10)', []);
    svgImage['shapes'] = shapes;
    const TextHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'g');
    TextHTMLElement.setAttribute('id', 'pen');
    TextHTMLElement.setAttribute('elementID', '1');
    TextHTMLElement.setAttribute('transform', 'translate(10,10)');

    shapes.push(pen);
    const textElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'text');
    component.pushPenInShapes(pen, 'pen', textElement);
    expect(component['shapes'][0].getAttribute('id')).toEqual(TextHTMLElement.getAttribute('id'));
    expect(component['shapes'][0].getAttribute('elementID')).toEqual(TextHTMLElement.getAttribute('elementID'));
    expect(component['shapes'][0].getAttribute('transform')).toEqual(TextHTMLElement.getAttribute('transform'));
  });

  it('should fill shapes with an ellipse', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const svgImage: SvgImage = new SvgImage();
    const ellipse: StructEllipse = new StructEllipse('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', '63', '18');
    shapes.push(ellipse);
    svgImage['shapes'] = shapes;
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '1');
    ellipseHTMLElement.setAttribute('transform', ' ');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    const ellipseElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    component.pushEllipseInShapes(ellipse, 'ellipse', ellipseElement);
    expect(component['shapes'][0]).toEqual(ellipseHTMLElement);
  });

  it('should fill shapes with a polygon', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const svgImage: SvgImage = new SvgImage();
    const polygon: StructPolygon = new StructPolygon('1', '#ffffffff', '#000000ff', '5', '30', '45');
    shapes.push(polygon);
    svgImage['shapes'] = shapes;
    const polygonHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    polygonHTMLElement.setAttribute('id', 'polygon');
    polygonHTMLElement.setAttribute('elementID', '1');
    polygonHTMLElement.setAttribute('stroke', '#ffffffff');
    polygonHTMLElement.setAttribute('fill', '#000000ff');
    polygonHTMLElement.setAttribute('stroke-width', '5');
    polygonHTMLElement.setAttribute('points', '30');
    polygonHTMLElement.setAttribute('transform', '45');
    const polygonElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    component.pushPolygonInShapes(polygon, 'polygon', polygonElement);
    expect(component['shapes'][0]).toEqual(polygonHTMLElement);
  });

  it('should fill shapes with a path', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const svgImage: SvgImage = new SvgImage();
    const pencil: StructPencil = new StructPencil('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', 'M32', ' ', ' ', ' ');
    shapes.push(pencil);
    svgImage['shapes'] = shapes;
    const PathHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    PathHTMLElement.setAttribute('id', 'path');
    PathHTMLElement.setAttribute('elementID', '1');
    PathHTMLElement.setAttribute('transform', ' ');
    PathHTMLElement.setAttribute('stroke', '#ffffffff');
    PathHTMLElement.setAttribute('fill', '#000000ff');
    PathHTMLElement.setAttribute('stroke-width', '5');
    PathHTMLElement.setAttribute('d', '30');
    PathHTMLElement.setAttribute('stroke-linecap', '45');
    PathHTMLElement.setAttribute('filter', 'M32');
    PathHTMLElement.setAttribute('stroke-dasharray', ' ');
    PathHTMLElement.setAttribute('marker-mid', ' ');
    PathHTMLElement.setAttribute('fill-rule', ' ');
    const pathElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    component.pushPathInShapes(pencil, 'path', pathElement);
    expect(component['shapes'][0]).toEqual(PathHTMLElement);
  });

  it('should fill shapes with a rectangle', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const rectangle: StructRectangle = new StructRectangle('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', '63', '18');
    shapes.push(rectangle);
    const rectangleHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    rectangleHTMLElement.setAttribute('id', 'rectangle');
    rectangleHTMLElement.setAttribute('elementID', '1');
    rectangleHTMLElement.setAttribute('stroke', '#ffffffff');
    rectangleHTMLElement.setAttribute('fill', '#000000ff');
    rectangleHTMLElement.setAttribute('stroke-width', '5');
    rectangleHTMLElement.setAttribute('x', '30');
    rectangleHTMLElement.setAttribute('y', '45');
    rectangleHTMLElement.setAttribute('width', '63');
    rectangleHTMLElement.setAttribute('transform', ' ');
    rectangleHTMLElement.setAttribute('height', '18');
    const rectangleElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    component.pushRectangleInShapes(rectangle, 'rectangle', rectangleElement);
    expect(component['shapes'][0]).toEqual(rectangleHTMLElement as HTMLElement);
  });

  it('should fill shapes with a Image', () => {
    const component = new GenerateElementService();
    const shapes: StructSVGElement[] = new Array();
    const image: StructImage = new StructImage('1', '5', '10', '30', '45', '63', '18');
    shapes.push(image);
    const imageHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    imageHTMLElement.setAttribute('id', 'image');
    imageHTMLElement.setAttribute('elementID', '1');
    imageHTMLElement.setAttribute('transform', '63');
    imageHTMLElement.setAttribute('stroke', ' ');
    imageHTMLElement.setAttribute('fill', ' ');
    imageHTMLElement.setAttribute('stroke-width', ' ');
    imageHTMLElement.setAttribute('x', '5');
    imageHTMLElement.setAttribute('y', '10');
    imageHTMLElement.setAttribute('width', '30');
    imageHTMLElement.setAttribute('height', '45');
    imageHTMLElement.setAttribute('href', '18');
    const imageElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    component.pushImageInShapes(image, 'image', imageElement);
    expect(component['shapes'][0]).toEqual(imageHTMLElement as HTMLElement);
  });

});
