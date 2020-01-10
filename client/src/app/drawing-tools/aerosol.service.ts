import { Injectable } from '@angular/core';
import { DrawingTool } from 'src/app/drawing-tools/abstract-drawing-tools';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { ColorToolService } from './color-tool.service';
import { ellipseAttributes } from './drawing-tool-constants';

@Injectable({
  providedIn: 'root',
})
export class AerosolService extends DrawingTool {

  private diameter: number;
  private emissionRate: number;
  private currentX: number;
  private currentY: number;
  protected point: Element;
  protected vaporRay: number;
  protected generatedX: number;
  protected generatedY: number;

  constructor(protected colorService: ColorToolService) {
    super();
    this.svgCode = 'ellipse';
    this.diameter = 10;
    this.emissionRate = 10;
    this.vaporRay = 0;
    this.generatedX = 0;
    this.generatedY = 0;
    this.setReady = true;
  }
  setDefault() {
    this.diameter = 10;
    this.emissionRate = 10;
  }

  getDiameter(): number {
    return this.diameter;
  }

  getEmissionRate(): number {
    return this.emissionRate;
  }

  setDiameter(diameter: number) {
    this.diameter = diameter;
  }

  setEmissionRate(emissionRate: number) {
    this.emissionRate = emissionRate;
  }

  setStyles(): void {
    this.stroke = this.colorService.getPrimaryColor();
    this.fill = this.colorService.getPrimaryColor();
  }

  setCurrentPosition(position: MousePosition): void {
    this.currentX = position.x;
    this.currentY = position.y;
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.startDrawing(currentPosition);
  }

  randomOffetInRadius(): MousePosition {
    const randomOffset: MousePosition = { x: 1, y: 1 };
    while (Math.pow(randomOffset.x, 2) + Math.pow(randomOffset.y, 2) > 1) {
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      randomOffset.x = x;
      randomOffset.y = y;
    }
    return randomOffset;
  }

  setVaporRay(value: number): void {
    this.vaporRay = value;
  }

  submitElement(shape: Element, shapeName: string): boolean {
    super.submitElement(shape, shapeName);
    shape.setAttributeNS(null, ellipseAttributes.id, 'ellipse');
    const randomOffset: MousePosition = this.randomOffetInRadius();
    this.generatedY = (this.currentY + (this.diameter / 2) * randomOffset.y);
    shape.setAttributeNS(null, ellipseAttributes.cy, this.generatedY.toString());
    this.generatedX = (this.currentX + (this.diameter / 2) * randomOffset.x);
    shape.setAttributeNS(null, ellipseAttributes.cx, this.generatedX.toString());
    const vaporValue = (this.diameter / 2) * 0.08;
    this.setVaporRay(vaporValue);
    shape.setAttributeNS(null, ellipseAttributes.ry, (this.vaporRay).toString());
    shape.setAttributeNS(null, ellipseAttributes.rx, (this.vaporRay).toString());
    return true;
  }

  startDrawing(currentPosition: MousePosition): void {
    this.setStyles();
    this.setCurrentPosition(currentPosition);
  }

  draw(): void {
    return;
  }

}
