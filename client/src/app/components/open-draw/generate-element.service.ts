import { Injectable } from '@angular/core';
import { StructAerosol } from '../../../../../common/class/struct-aerosol';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructSVGElement } from '../../../../../common/class/struct-svgelement';
import { StructText } from '../../../../../common/class/struct-text';

@Injectable({
  providedIn: 'root',
})
export class GenerateElementService {
  private shapes: HTMLElement[];
  constructor() {
    this.shapes = new Array();
  }

  addShapes(currentElement: StructSVGElement, element: Element, idElement: string): void {
    switch (idElement) {
      case 'rect':
        this.pushRectangleInShapes(currentElement as StructRectangle, idElement, element);
        break;
      case 'polygon':
        this.pushPolygonInShapes(currentElement as StructPolygon, idElement, element);
        break;
      case 'ellipse':
        this.pushEllipseInShapes(currentElement as StructEllipse, idElement, element);
        break;
      case 'path':
        this.pushPathInShapes(currentElement as StructPencil, idElement, element);
        break;
      case 'image':
        this.pushImageInShapes(currentElement as StructImage, idElement, element);
        break;
      case 'text':
        this.pushTextInShapes(currentElement as StructText, idElement, element);
        break;
      case 'pen' || 'fountainPen':
        this.pushPenInShapes(currentElement as StructPen, idElement, element);
        break;
      case 'aerosol':
        this.pushAerosolInShapes(currentElement as StructAerosol, idElement, element);
        break;
      default:
        break;
    }
  }

  pushAerosolInShapes(currentElement: StructAerosol, idElement: string, element: Element): void {
    element.setAttribute('id', 'aerosol');
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('elementID', currentElement.elementID);
    this.shapes.push(element as HTMLElement);
  }

  pushPenInShapes(currentElement: StructPen, idElement: string, element: Element): void {
    element.setAttribute('id', 'pen');
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    this.shapes.push(element as HTMLElement);
  }

  pushTextInShapes(currentElement: StructText, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('font-size', currentElement.fontSize);
    element.setAttribute('font-family', currentElement.fontFamily);
    element.setAttribute('font-weight', currentElement.fontWeight);
    element.setAttribute('font-style', currentElement.fontStyle);
    element.setAttribute('text-anchor', currentElement.textAnchor);
    element.setAttribute('x', currentElement.x);
    element.setAttribute('y', currentElement.y);
    this.shapes.push(element as HTMLElement);
  }

  pushRectangleInShapes(currentElement: StructRectangle, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('x', currentElement.originX);
    element.setAttribute('y', currentElement.originY);
    element.setAttribute('width', currentElement.width);
    element.setAttribute('height', currentElement.height);
    this.shapes.push(element as HTMLElement);
  }

  pushPolygonInShapes(currentElement: StructPolygon, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('points', currentElement.points);
    this.shapes.push(element as HTMLElement);
  }

  pushEllipseInShapes(currentElement: StructEllipse, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('rx', currentElement.originX);
    element.setAttribute('ry', currentElement.originY);
    element.setAttribute('cx', currentElement.width);
    element.setAttribute('cy', currentElement.height);
    this.shapes.push(element as HTMLElement);
  }

  pushPathInShapes(currentElement: StructPencil, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('stroke-linecap', currentElement.strokeLinceCap);
    element.setAttribute('d', currentElement.points);
    element.setAttribute('filter', currentElement.filter);
    element.setAttribute('stroke-dasharray', currentElement.strokeDasharray);
    element.setAttribute('marker-mid', currentElement.markerMid);
    element.setAttribute('fill-rule', currentElement.fillRule);
    this.shapes.push(element as HTMLElement);
  }

  pushImageInShapes(currentElement: StructImage, idElement: string, element: Element): void {
    element.setAttribute('id', idElement);
    element.setAttribute('elementID', currentElement.elementID);
    element.setAttribute('transform', currentElement.transform);
    element.setAttribute('stroke', currentElement.stroke);
    element.setAttribute('fill', currentElement.fill);
    element.setAttribute('stroke-width', currentElement.strokewidht);
    element.setAttribute('x', currentElement.originX);
    element.setAttribute('y', currentElement.originY);
    element.setAttribute('width', currentElement.width);
    element.setAttribute('height', currentElement.height);
    element.setAttribute('href', currentElement.href);
    this.shapes.push(element as HTMLElement);
  }
}
