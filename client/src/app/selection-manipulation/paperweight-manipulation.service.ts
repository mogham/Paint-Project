import { Injectable, Renderer2 } from '@angular/core';
import { ShapeCounter } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from '../drawing-tools/abstract-drawing-tools';

const TRANSLATE = 10;
const SVG_NS = 'http://www.w3.org/2000/svg';
@Injectable({
  providedIn: 'root',
})

export class PaperweightManipulationService extends DrawingTool {
  private paperweight: Element[];
  private paperweightForDuplication: Element[];
  private isDuplication: boolean;
  protected numberOfPast: number;
  private element: Element;
  private originXGroupBox: number;
  private originYGroupBox: number;
  private widthGroupBox: number;
  private heightGroupBox: number;
  constructor() {
    super();
    this.paperweight = new Array();
    this.paperweightForDuplication = new Array();
    this.numberOfPast = 1;
    this.isDuplication = false;
    this.originXGroupBox = 0;
    this.originYGroupBox = 0;
    this.widthGroupBox = 0;
    this.heightGroupBox = 0;
  }
  draw(currentPosition: import('../components/drawing-view/drawing-view-constants').MousePosition): void {
    throw new Error('Method not implemented.');
  }
  startDrawing(currentPosition: import('../components/drawing-view/drawing-view-constants').MousePosition): void {
    throw new Error('Method not implemented.');
  }
  setStyles() {
    throw new Error('Method not implemented.');
  }
  copy(selectedShapes: Element[], originXGroupBox: number, originYGroupBox: number, widthGroupBox: number, heightGroupBox: number): void {
    this.isDuplication = false;
    this.numberOfPast = 1;
    this.originXGroupBox = originXGroupBox;
    this.originYGroupBox = originYGroupBox;
    this.widthGroupBox = widthGroupBox;
    this.heightGroupBox = heightGroupBox;
    this.paperweight = [];
    for (const currentElelement of selectedShapes) {
      this.paperweight.push(currentElelement);
    }
  }

  duplicate(selectedShapes: Element[]): void {
    this.isDuplication = true;
    this.paperweightForDuplication = [];
    for (const currentElelement of selectedShapes) {
      this.paperweightForDuplication.push(currentElelement);
    }
  }

  checkOverflow(widthDraw: number, heightDraw: number): void {
    let isOverflow = false;
    if (this.originXGroupBox + this.widthGroupBox + this.numberOfPast * TRANSLATE > widthDraw) {
      isOverflow = true;
    } else if (this.originYGroupBox + this.heightGroupBox + this.numberOfPast * TRANSLATE > heightDraw) {
      isOverflow = true;
    }
    if (isOverflow) {
      this.numberOfPast = 1;
    }
  }

  paste(renderer: Renderer2, widthDraw: number, heightDraw: number): Element[] {
    const addedShapes: Element[] = new Array();
    const shapesToPaste = this.isDuplication ? this.paperweightForDuplication : this.paperweight;
    if (!this.isDuplication) {
      this.checkOverflow(widthDraw, heightDraw);
    }
    for (const currentElelement of shapesToPaste) {
      const id = currentElelement.getAttribute('id');
      if (id !== null) {
        switch (id) {
          case 'rectangle':
            this.element = renderer.createElement('rect', SVG_NS);
            this.createRect(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'ellipse':
            this.element = renderer.createElement('ellipse', SVG_NS);
            this.createEllipse(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'polygon':
            this.element = renderer.createElement(
              'polygon',
              SVG_NS);
            this.createPolygon(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'path':
            this.element = renderer.createElement('path', SVG_NS);
            this.createPath(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'stamp' || 'image':
            this.element = renderer.createElement('image', SVG_NS);
            this.createImage(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'text':
            this.element = renderer.createElement('text', SVG_NS);
            this.createText(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'pen' || 'g':
            this.element = renderer.createElement('pen', SVG_NS);
            this.createPenOrAerosolOrFountainPen(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'aerosol':
            this.element = renderer.createElement('pen', SVG_NS);
            this.createPenOrAerosolOrFountainPen(currentElelement);
            addedShapes.push(this.element);
            break;
          case 'fountainPen':
            this.element = renderer.createElement('pen', SVG_NS);
            this.createPenOrAerosolOrFountainPen(currentElelement);
            addedShapes.push(this.element);
            break;
          default:
            break;
        }
      }

    }
    this.numberOfPast = this.isDuplication ? this.numberOfPast : this.numberOfPast + 1;
    this.isDuplication = false;
    return addedShapes;
  }

  createTranslate(): string {
    const valueTranslate = this.isDuplication ? String(TRANSLATE) : String(this.numberOfPast * TRANSLATE);
    return 'translate(' + valueTranslate + ',' + valueTranslate + ')';
  }

  createRect(currentElelement: Element) {
    this.setAttribute('x', currentElelement);
    this.setAttribute('y', currentElelement);
    this.setAttribute('stroke', currentElelement);
    this.setAttribute('stroke-width', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('width', currentElelement);
    this.setAttribute('height', currentElelement);
    this.setAttribute('id', currentElelement);
    this.addTranslation(currentElelement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
  }

  createEllipse(currentElelement: Element): void {
    this.setAttribute('cx', currentElelement);
    this.setAttribute('cy', currentElelement);
    this.setAttribute('rx', currentElelement);
    this.setAttribute('ry', currentElelement);
    this.setAttribute('stroke', currentElelement);
    this.setAttribute('stroke-width', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('id', currentElelement);
    this.addTranslation(currentElelement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
  }

  createPolygon(currentElelement: Element): void {
    this.setAttribute('points', currentElelement);
    this.setAttribute('stroke', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('stroke-width', currentElelement);
    this.setAttribute('stroke-linecap', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('id', currentElelement);
    this.addTranslation(currentElelement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
  }

  createPath(currentElelement: Element): void {
    this.setAttribute('d', currentElelement);
    this.setAttribute('stroke', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('stroke-width', currentElelement);
    this.setAttribute('stroke-linecap', currentElelement);
    this.setAttribute('filter', currentElelement);
    this.setAttribute('id', currentElelement);
    this.addTranslation(currentElelement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
  }

  createImage(currentElelement: Element): void {
    this.setAttribute('href', currentElelement);
    this.setAttribute('stroke', currentElelement);
    this.setAttribute('fill', currentElelement);
    this.setAttribute('stroke-width', currentElelement);
    this.setAttribute('height', currentElelement);
    this.setAttribute('width', currentElelement);
    this.setAttribute('x', currentElelement);
    this.setAttribute('y', currentElelement);
    this.setAttribute('id', currentElelement);
    this.addTranslation(currentElelement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
  }

  createText(currentElement: Element): void {
    this.element = (currentElement.cloneNode(true) as Element);
    this.addTranslation(currentElement);
    ShapeCounter.drawElementCounter++;
    this.element.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
    const count: number = this.element.children.length;
    for (let i = 0; i < count; i++) {
      const child = this.element.children[i];
      child.setAttributeNS(null, 'elementID', this.element.getAttribute('elementID') as string);
    }
  }

  createPenOrAerosolOrFountainPen(currentElelement: Element): void {
    this.element = (currentElelement.cloneNode(true) as Element);
    this.addTranslation(currentElelement);
    ShapeCounter.gCounter++;
    this.element.setAttributeNS(null, 'elementID', String(ShapeCounter.gCounter));
    const count: number = this.element.children.length;
    for (let i = 0; i < count; i++) {
      const child = this.element.children[i];
      child.setAttributeNS(null, 'elementID', this.element.getAttribute('elementID') as string);
    }
  }

  setAttribute(attributeName: string, currentElelement: Element): void {
    const attribute = currentElelement.getAttribute(attributeName);
    if (attribute !== null) {
      this.element.setAttributeNS(null, attributeName, attribute);
    }
  }

  addTranslation(currentElelement: Element) {
    const currentTransform = currentElelement.getAttribute('transform');
    let translate = this.createTranslate();
    if (currentTransform !== null) {
      translate += currentTransform;
      this.element.setAttributeNS(null, 'transform', translate);
    } else {
      this.element.setAttributeNS(null, 'transform', translate);
    }
  }
}
