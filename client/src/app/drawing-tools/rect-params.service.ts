import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { Shapes } from '../drawing-tools/abstract-shape';
import { ColorToolService } from './color-tool.service';
import { rectAttributes } from './drawing-tool-constants';
@Injectable({
  providedIn: 'root',
})
export class RectParamsService extends Shapes {
  private isSquare: boolean;
  protected originRectX: number;
  protected originRectY: number;
  constructor(protected colorTool: ColorToolService) {
    super(colorTool);
    this.isSquare = false;
    this.originX = 0;
    this.originY = 0;
    this.originRectX = 0;
    this.originRectY = 0;
    this.width = 0;
    this.height = 0;
    this.svgCode = 'rect';
  }
  setDefault(): void {
    this.plot = 'contour';
    this.thickness = 1;
    this.setReady = true;
  }
  setSquare(isSquare: boolean): void {
    this.isSquare = isSquare;
  }
  getThickness(): number {
    return this.thickness;
  }
  setheight(height: number): void {
    this.height = height;
  }
  startDrawing(beginPosition: MousePosition): void {
    this.setStyles();
    this.originX = beginPosition.x;
    this.originY = beginPosition.y;
  }
  draw(currentPosition: MousePosition): void {
    this.width = Math.abs(currentPosition.x - this.originX);
    if (!this.isSquare) {
      this.height = Math.abs(currentPosition.y - this.originY);
    } else {
      this.height = this.width;
    }
    if (currentPosition.x < this.originX) {
      this.originRectX = currentPosition.x;
    } else {
      this.originRectX = this.originX;
    }
    if (currentPosition.y < this.originY) {
      this.originRectY = currentPosition.y;
    } else {
      this.originRectY = this.originY;
    }
  }
  onMouseDown(currentPosition: MousePosition): void {
    this.setStyles();
    this.startDrawing(currentPosition);
  }
  submitElement(shape: Element, shapeName: string): boolean {
    super.submitElement(shape, shapeName);
    shape.setAttributeNS(null, rectAttributes.id, shapeName);
    shape.setAttributeNS(null, rectAttributes.x, this.originRectX.toString());
    shape.setAttributeNS(null, rectAttributes.y, this.originRectY.toString());
    shape.setAttributeNS(null, rectAttributes.height, this.height.toString());
    shape.setAttributeNS(null, rectAttributes.width, this.width.toString());
    return this.height !== 0 || this.width !== 0;
  }
}
