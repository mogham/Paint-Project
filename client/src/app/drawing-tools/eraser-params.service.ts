import { ElementRef, Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from './abstract-drawing-tools';
import { IntersectionParamsService } from './intersection-params.service';
import { SelectionParamsService } from './selection-params.service';

const COUNTOUR_SIZE = 8;
@Injectable({
  providedIn: 'root',
})
export class EraserParamsService extends DrawingTool {
  private size: number;
  elementToErase: Element[];
  elementToSignal: Element[];
  strokeElementSignal: string[];
  strokewidthElementSignal: string[];
  isActivated: boolean;
  isMouseDown: boolean;
  originX: number;
  originY: number;
  indexMin: number;
  constructor(private intersection: IntersectionParamsService, private selection: SelectionParamsService) {
    super();
    this.size = 10;
    this.fill = '';
    this.isActivated = this.isMouseDown = false;
    this.originX = this.originY = 0;
    this.elementToErase = new Array();
    this.elementToSignal = new Array();
    this.strokeElementSignal = new Array();
    this.strokewidthElementSignal = new Array();
    this.indexMin = 0;
    this.setReady = true;
  }

  getSize(): number {
    return this.size;
  }

  getElementToErase(): Element[] {
    return this.elementToErase;
  }

  getOriginX(): number {
    return this.originX;
  }

  getOriginY(): number {
    return this.originY;
  }

  setSize(newSize: number): void {
    this.size = newSize;
  }

  getFill(): string {
    return this.fill;
  }

  setElementToErase(element: Element): void {
    this.elementToErase.push(element);
  }

  setStyles(): void {
    this.fill = 'white';
    this.stroke = 'black';
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.isMouseDown = true;
    this.resetElement();
  }

  resetElement(): void {
    this.unsignalElement();
    this.elementToErase = [];
    this.elementToSignal = [];
    this.strokeElementSignal = [];
    this.strokewidthElementSignal = [];
    this.indexMin = 0;
  }

  onMouseUp(): void {
    this.resetElement();
    this.isMouseDown = false;
  }

  findIntersections(eraser: Element, canvas: ElementRef): void {
    this.unsignalElement();
    for (const currentElement of canvas.nativeElement.children) {
      if (currentElement.getAttribute('elementID') !== 'eraser' && currentElement.getAttribute('stroke-opacity') !== null) {
        if (this.intersection.intersection(eraser, currentElement)) {
          const element = this.selection.getSelectionRectOfShapes().get(currentElement) as Element;
          if (!this.elementToSignal.includes(element)) {
            this.elementToSignal.push(element);
            if (!this.elementToErase.includes(element) && this.isMouseDown) {
              this.elementToErase.push(element);
            }
          }
        }
      }
    }
    this.signalElement();
  }

  onMouseMove(currentPosition: MousePosition): void {
    this.setStyles();
    this.originX = currentPosition.x;
    this.originY = currentPosition.y;
    this.isActivated = true;
  }
  draw(): void {/* */ }

  startDrawing(): void {
    this.resetElement();
  }

  signalElement(): void {
    if (this.elementToSignal.length > 0) {
      for (const currentElement of this.elementToSignal) {
        const stroke = currentElement.getAttribute('stroke');
        const strokeWidth = currentElement.getAttribute('stroke-width');
        if (stroke !== null && strokeWidth !== null) {
          this.strokeElementSignal.push(stroke);
          this.strokewidthElementSignal.push(strokeWidth);
          currentElement.setAttribute('stroke', 'red');
          let newStrokeWidth = COUNTOUR_SIZE;
          newStrokeWidth += parseFloat(strokeWidth);
          currentElement.setAttribute('stroke-width', String(newStrokeWidth) + 'px');
        }
      }
    }
  }

  unsignalElement(): void {
    for (let index = 0; index < this.elementToSignal.length; index++) {
      this.elementToSignal[index].setAttribute('stroke', this.strokeElementSignal[index]);
      this.elementToSignal[index].setAttribute('stroke-width', this.strokewidthElementSignal[index]);
    }
    this.strokeElementSignal = [];
    this.strokewidthElementSignal = [];
    this.elementToSignal = [];
  }

}
