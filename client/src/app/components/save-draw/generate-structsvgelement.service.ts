import { Injectable } from '@angular/core';
import { StructAerosol } from '../../../../../common/class/struct-aerosol';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructEllipseAerosol } from '../../../../../common/class/struct-ellipse-aerosol';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPathPen } from '../../../../../common/class/struct-path-pen';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructSVGElement } from '../../../../../common/class/struct-svgelement';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';

@Injectable({
  providedIn: 'root',
})
export class GenerateStructSVGElementService {
  private arrayStructSVGElement: StructSVGElement[];
  private shapes: HTMLElement[];
  constructor() {
    this.arrayStructSVGElement = new Array();
    this.shapes = new Array();
  }

  getArrayStructSVGElement(): StructSVGElement[] {
    return this.arrayStructSVGElement;
  }

  getShapes(): HTMLElement[] {
    return this.shapes;
  }

  setShapes(shapes: Element[]): void {
    this.shapes = [];
    this.arrayStructSVGElement = [];
    for (const currentElement of shapes) {
      this.shapes.push(currentElement as HTMLElement);
    }
    this.fillArrayStructSVGElement();
  }

  makeEmpty(): void {
    this.shapes = [];
  }

  fillArrayStructSVGElement(): void {
    for (const currentElement of this.shapes) {
      const idElement = currentElement.getAttribute('id');
      switch (idElement) {
        case 'rectangle':
          this.pushRectangleInArrayStructSVGElement(currentElement);
          break;
        case 'polygon':
          this.pushPolygonInArrayStructSVGElement(currentElement);
          break;
        case 'ellipse':
          this.pushEllipseInArrayStructSVGElement(currentElement);
          break;
        case 'path':
          this.pushPathInArrayStructSVGElement(currentElement);
          break;
        case 'stamp':
          this.pushStampInArrayStructSVGElement(currentElement);
          break;
        case 'text':
          this.pushTextInArrayStructSVGElement(currentElement);
          break;
        case 'pen' :
          this.pushPenInArrayStructSVGElement(currentElement);
          break;
        case 'fountainPen':
          this.pushPenInArrayStructSVGElement(currentElement);
          break;
        case 'aerosol':
          this.pushAerosolInArrayStructSVGElement(currentElement);
          break;
        default:
          break;
      }
    }
  }

  pushAerosolInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const ellipseArray: StructEllipseAerosol[] = new Array();
    const cloneElement = currentElement.cloneNode(true);
    let child = cloneElement.lastChild;
    while (cloneElement.childNodes.length > 0) {
      if (child !== null) {
        const elementChild = child as Element;
        const rx = elementChild.getAttribute('rx');
        const ry = elementChild.getAttribute('ry');
        const cx = elementChild.getAttribute('cx');
        const cy = elementChild.getAttribute('cy');
        const stroke = elementChild.getAttribute('stroke');
        const strokeWidth = elementChild.getAttribute('stroke-width');
        const fill = elementChild.getAttribute('fill');
        if (elementID !== null && rx !== null && ry !== null && cx !== null && cy !== null && stroke !== null
          && strokeWidth !== null && fill !== null) {
          ellipseArray.push(new StructEllipseAerosol(elementID, rx, ry, cx, cy, stroke, strokeWidth, fill));
        }
        cloneElement.removeChild(child);
      }
      child = cloneElement.lastChild;
    }

    if (elementID !== null && transform !== null) {
      const aerosol = new StructAerosol(elementID, transform, ellipseArray);
      this.arrayStructSVGElement.push(aerosol);
    }
  }

  pushPenInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const pathArray: StructPathPen[] = new Array();
    const cloneElement = currentElement.cloneNode(true);
    let child = cloneElement.lastChild;
    while (cloneElement.childNodes.length > 0) {
      if (child !== null) {
        const elementChild = child as Element;
        const stroke = elementChild.getAttribute('stroke');
        const strokeWidth = elementChild.getAttribute('stroke-width');
        const fill = elementChild.getAttribute('fill');
        const d = elementChild.getAttribute('d');
        let strokeLinecap = elementChild.getAttribute('stroke-linecap');
        strokeLinecap = strokeLinecap === null ? ' ' : strokeLinecap;
        let strokeLinejoin = elementChild.getAttribute('stroke-linejoin');
        strokeLinejoin = strokeLinejoin === null ? ' ' : strokeLinejoin;
        if (elementID !== null && stroke !== null && strokeWidth !== null && fill !== null && d !== null) {
          pathArray.push(new StructPathPen(elementID, stroke, strokeWidth, fill, d, strokeLinecap, strokeLinejoin));
        }
        cloneElement.removeChild(child);
      }
      child = cloneElement.lastChild;
    }

    if (elementID !== null) {
      const pen = new StructPen(elementID, transform, pathArray);
      this.arrayStructSVGElement.push(pen);
    }
  }

  pushTextInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    let stroke = currentElement.getAttribute('stroke');
    stroke = stroke === null ? ' ' : stroke;
    const fill = currentElement.getAttribute('fill');
    const strokeWidth = currentElement.getAttribute('stroke-width');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const x = currentElement.getAttribute('x');
    const y = currentElement.getAttribute('y');
    let fontSize = currentElement.getAttribute('font-size');
    fontSize = fontSize === null ? ' ' : fontSize;
    let fontFamily = currentElement.getAttribute('font-family');
    fontFamily = fontFamily === null ? ' ' : fontFamily;
    let fontWeight = currentElement.getAttribute('font-weight');
    fontWeight = fontWeight === null ? ' ' : fontWeight;
    let fontStyle = currentElement.getAttribute('font-style');
    fontStyle = fontStyle === null ? ' ' : fontStyle;
    let textAnchor = currentElement.getAttribute('text-anchor');
    textAnchor = textAnchor === null ? ' ' : textAnchor;
    const tspanArray: StructTspan[] = new Array();
    const cloneElement = currentElement.cloneNode(true);
    let child = cloneElement.lastChild;
    while (cloneElement.childNodes.length > 0) {
      if (child !== null) {
        const elementChild = child as Element;
        const xChild = elementChild.getAttribute('x');
        const yChild = elementChild.getAttribute('y');
        let text = child.textContent;
        text = text === null ? ' ' : text;
        if (elementID !== null && xChild !== null && yChild !== null) {
          tspanArray.push(new StructTspan(elementID, xChild, yChild, text));
        }
        cloneElement.removeChild(child);
      }
      child = cloneElement.lastChild;
    }
    if (elementID !== null && fill !== null && strokeWidth !== null && x !== null && y !== null) {
      const text = new StructText(elementID, stroke, fill, strokeWidth, transform, x, y,
        fontSize, fontFamily, fontWeight, fontStyle, textAnchor, tspanArray);
      this.arrayStructSVGElement.push(text);
    }
  }

  pushRectangleInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    const stroke = currentElement.getAttribute('stroke');
    const fill = currentElement.getAttribute('fill');
    const strokeWidth = currentElement.getAttribute('stroke-width');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const x = currentElement.getAttribute('x');
    const y = currentElement.getAttribute('y');
    const width = currentElement.getAttribute('width');
    const height = currentElement.getAttribute('height');
    if (elementID !== null && stroke !== null && fill !== null && strokeWidth !== null && transform !== null && x !== null
      && y !== null && width !== null && height !== null) {
      const rectangle: StructRectangle = new StructRectangle(elementID, stroke, fill, strokeWidth, transform, x, y, width, height);
      this.arrayStructSVGElement.push(rectangle);
    }
  }

  pushEllipseInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    const stroke = currentElement.getAttribute('stroke');
    const fill = currentElement.getAttribute('fill');
    const strokeWidth = currentElement.getAttribute('stroke-width');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const rx = currentElement.getAttribute('rx');
    const ry = currentElement.getAttribute('ry');
    const cx = currentElement.getAttribute('cx');
    const cy = currentElement.getAttribute('cy');
    if (elementID !== null && stroke !== null && fill !== null && strokeWidth !== null &&
      rx !== null && ry !== null && cx !== null && cy !== null) {
      const ellipse: StructEllipse = new StructEllipse(elementID, stroke, fill, strokeWidth, transform, rx, ry, cx, cy);
      this.arrayStructSVGElement.push(ellipse);
    }
  }

  pushPolygonInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    const stroke = currentElement.getAttribute('stroke');
    const fill = currentElement.getAttribute('fill');
    const strokeWidth = currentElement.getAttribute('stroke-width');
    const points = currentElement.getAttribute('points');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    if (elementID !== null && stroke !== null && fill !== null && strokeWidth !== null && points !== null) {
      const polygon: StructPolygon = new StructPolygon(elementID, stroke, fill, strokeWidth, points, transform);
      this.arrayStructSVGElement.push(polygon);
    }
  }
  pushPathInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    const stroke = currentElement.getAttribute('stroke');
    const fill = currentElement.getAttribute('fill');
    const strokeWidth = currentElement.getAttribute('stroke-width');
    let transform = currentElement.getAttribute('transform');
    transform = transform === null ? ' ' : transform;
    const strokelinecap = currentElement.getAttribute('stroke-linecap');
    const d = currentElement.getAttribute('d');
    let strokeDasharray = currentElement.getAttribute('stroke-dasharray');
    strokeDasharray = strokeDasharray === null ? ' ' : strokeDasharray;
    let markerMid = currentElement.getAttribute('marker-mid');
    markerMid = markerMid === null ? ' ' : markerMid;
    let filter = currentElement.getAttribute('filter');
    filter = filter === null ? ' ' : filter;
    let fillRule = currentElement.getAttribute('fill-rule');
    fillRule = fillRule === null ? ' ' : fillRule;
    if (elementID !== null && stroke !== null && fill !== null && strokeWidth !== null && transform !== null
      && strokelinecap !== null && d !== null) {
      const pencil: StructPencil = new StructPencil(elementID, stroke, fill, strokeWidth, transform, d,
        strokelinecap, filter, strokeDasharray, markerMid, fillRule);
      this.arrayStructSVGElement.push(pencil);
    }
  }

  pushStampInArrayStructSVGElement(currentElement: Element): void {
    const elementID = currentElement.getAttribute('elementID');
    const transform = currentElement.getAttribute('transform');
    const originX = currentElement.getAttribute('x');
    const originY = currentElement.getAttribute('y');
    const width = currentElement.getAttribute('width');
    const height = currentElement.getAttribute('height');
    const href = currentElement.getAttribute('href');
    if (elementID !== null && transform !== null && originX !== null && originY !== null
      && href !== null && width !== null && height !== null) {
      const image: StructImage = new StructImage(elementID, originX, originY, width, height, transform, href);
      this.arrayStructSVGElement.push(image);
    }
  }
}
