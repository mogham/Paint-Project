import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from './abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';
@Injectable({
  providedIn: 'root',
})
export class FountainPenParamsService extends DrawingTool {
  private lenght: number;
  private degree: number;
  private currentX1: number;
  private currentY1: number;
  private currentX2: number;
  private currentY2: number;
  private path: string;
  orientationPen: number;
  isMouseDown: boolean;
  isDrawing: boolean;
  isAltPressed: boolean;

  constructor(protected colorService: ColorToolService) {
    super();
    this.lenght = 1;
    this.degree = 0;
    this.svgCode = 'path';
    this.isMouseDown = this.isDrawing = this.isAltPressed = false;
    this.orientationPen = 0;
    this.path = '';
    this.setReady = true;
  }

  setDefault() {
    this.lenght = 1;
    this.degree = 0;
  }

  getLineLenght(): number {
    return this.lenght;
  }

  setLineLenght(newLenght: number): number {
    return this.lenght = newLenght;
  }

  getRotationDegree(): number {
    return  this.degree = this.degree % 180;
  }

  setRotationDegree(newdegree: number): number {
    return this.degree = newdegree % 180;
  }

  setStroke(newStroke: string): string {
    return this.stroke = newStroke;
  }

  setStyles(): object {
    const styles = {
      fill: this.setStroke(this.colorService.getPrimaryColor()),
      stroke: this.setStroke(this.colorService.getPrimaryColor()),
      'stroke-width': '2',
    };
    return styles;
  }

  startDrawing(startPosition: MousePosition): void {
    this.isMouseDown = true;
    this.currentX1 = startPosition.x ;
    this.currentY1 = startPosition.y  ;
    this.currentX2 = this.currentX1 + this.getLineLenght()  * Math.cos(this.degree * Math.PI / 180.0);
    this.currentY2 = this.currentY1 - this.getLineLenght()  * Math.sin(this.degree * Math.PI / 180.0);
  }

  draw(currentPosition: MousePosition): void {
    this.isMouseDown = true;
    this.path = 'M' + this.currentX1 + ',' + this.currentY1 + ' ' +
    'L' + this.currentX2 + ',' + this.currentY2 + ' ' ;
    this.currentX1 = currentPosition.x ;
    this.currentY1 = currentPosition.y;
    this.currentX2 = this.currentX1 + this.getLineLenght()  * Math.cos(this.degree * Math.PI / 180.0);
    this.currentY2 = this.currentY1 - this.getLineLenght()  * Math.sin(this.degree * Math.PI / 180.0);
    this.path += 'L' + this.currentX2 + ',' + this.currentY2 + ' ' +
    'L' + this.currentX1 + ',' + this.currentY1 + ' Z';
  }

  submitElement(myPath: Element, shapeName: string): boolean {
    super.submitElement(myPath, 'fountainPen');
    myPath.setAttributeNS(null, 'd', this.path);
    myPath.setAttributeNS(null, 'stroke-width', '2');
    myPath.setAttributeNS(null, 'stroke', 'transparent');
    myPath.setAttributeNS(null, 'fill', String(this.getStroke()));
    return true;
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.setStyles();
    this.isMouseDown = this.isDrawing = true;
    this.startDrawing(currentPosition);
  }

  onMouseMove(currentPosition: MousePosition): void {
    this.setStyles();
    this.isDrawing = false;
    this.draw(currentPosition);
  }

  onMouseUp(): void {
    this.isMouseDown = this.isDrawing = false;
  }

  setAngleWithMouse(event: WheelEvent): void {
    if (event.deltaY < 0 && !this.isAltPressed) {
      this.orientationPen = -(event.deltaY / event.deltaY) * 15  ;
    } else if (event.deltaY >= 0 && !this.isAltPressed) {
      this.orientationPen =  (event.deltaY / event.deltaY) * 15 ;
    } else if (event.deltaY < 0 && this.isAltPressed) {
      this.orientationPen = -1 ;
    } else if (event.deltaY >= 0 && this.isAltPressed) {
      this.orientationPen = 1;
    }
    this.degree +=  this.orientationPen;
    if (this.degree < 0) {
      this.degree = 0;
    }
    this.setRotationDegree(this.degree);
  }
}
