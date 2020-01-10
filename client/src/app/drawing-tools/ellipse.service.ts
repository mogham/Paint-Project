import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { Shapes } from '../drawing-tools/abstract-shape';
import { ColorToolService } from './color-tool.service';
import { ellipseAttributes } from './drawing-tool-constants';

@Injectable({
  providedIn: 'root',
})
export class EllipseService extends Shapes {
  private isCircle: boolean;
  private centerXEllipse: number;
  private centerYEllipse: number;

  constructor(protected colorTool: ColorToolService) {
    super(colorTool);
    this.plot = 'contour';
    this.thickness = 1;
    this.isCircle = false;
    this.originX = 0;
    this.originY = 0;
    this.width = 0;
    this.height = 0;
    this.svgCode = 'ellipse';
    this.centerXEllipse = 0;
    this.centerYEllipse = 0;
  }

  setDefault(): void {
    this.plot = 'contour';
    this.setReady = true;
    this.thickness = 1;
  }
  setCirlce(isCircle: boolean): void {
    this.isCircle = isCircle;
  }

  getThickness(): number {
    return this.thickness;
  }

  setThickness(newThickness: number): void {
    this.thickness = newThickness;
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
    this.width = Math.abs(currentPosition.x - this.originX) / 2;
    if (!this.isCircle) {
      this.height = Math.abs(currentPosition.y - this.originY) / 2;
    } else {
      this.height = this.width;
    }
    if (currentPosition.x > this.originX) {
      this.centerXEllipse = this.originX + this.width;
    } else {
      this.centerXEllipse = this.originX - this.width;
    }
    if (currentPosition.y > this.originY) {
      this.centerYEllipse = this.originY + this.height;
    } else {
      this.centerYEllipse = this.originY - this.height;
    }
  }

  setStyles(): void {
    if (this.plot === 'contour') {
      this.fill = 'transparent';
      this.stroke = this.colorTool.getSecondColor();
    } else if (this.plot === 'full') {
      this.stroke = 'transparent';
      this.fill = this.colorTool.getPrimaryColor();
    } else {
      this.fill = this.colorTool.getPrimaryColor();
      this.stroke = this.colorTool.getSecondColor();
    }
    this.height = 0;
    this.width = 0;
    this.strokeWidth = this.thickness;
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.setStyles();
    this.startDrawing(currentPosition);
  }

  submitElement(shape: Element, shapeName: string): boolean {
    super.submitElement(shape, shapeName);
    shape.setAttributeNS(null, ellipseAttributes.id, 'ellipse');
    shape.setAttributeNS(null, ellipseAttributes.cx, this.centerXEllipse.toString());
    shape.setAttributeNS(null, ellipseAttributes.cy, this.centerYEllipse.toString());
    shape.setAttributeNS(null, ellipseAttributes.ry, this.height.toString());
    shape.setAttributeNS(null, ellipseAttributes.rx, this.width.toString());
    return (this.width !== 0) || (this.height !== 0);
  }
}
