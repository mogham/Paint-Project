import { Injectable } from '@angular/core';
import { dot } from 'mathjs';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { Shapes } from '../drawing-tools/abstract-shape';
import { ColorToolService } from './color-tool.service';
import { polygonAttributes } from './drawing-tool-constants';

const POW = 2;
const TO_DEGREES = 180;
const SWITCH_ANGLE_SIDE = -1;
@Injectable({
  providedIn: 'root',
})
export class PolygonParamsService extends Shapes {
  private slides: number;
  private vertices: string;
  protected radius: number;
  private arrayX: number[];
  protected minArrayX: number;
  protected maxArrayX: number;
  private arrayY: number[];
  protected minArrayY: number;
  protected maxArrayY: number;
  private angleRotation: number;

  constructor(protected colorTool: ColorToolService) {
    super(colorTool);
    this.plot = 'contour';
    this.thickness = 1;
    this.originX = 0;
    this.originY = 0;
    this.width = 0;
    this.height = 0;
    this.svgCode = 'polygon';
    this.slides = 3;
    this.vertices = '';
    this.radius = 0;
    this.arrayX = new Array();
    this.minArrayX = 0;
    this.maxArrayX = 0;
    this.arrayY = new Array();
    this.minArrayY = 0;
    this.maxArrayY = 0;
    this.angleRotation = 0;
  }

  setDefault(): void {
    this.setReady = true;
    this.slides = 3;
    this.plot = 'contour';
    this.thickness = 1;
  }

  setArrayX(array: number[]) {
    this.arrayX = array;
  }

  setArrayY(array: number[]) {
    this.arrayY = array;
  }

  getArrayY(): number[] {
    return this.arrayY;
  }

  setSlides(slides: number): void {
    this.slides = slides;
  }

  calculateVertices(): void {
    const angle = 2 * Math.PI / this.slides;
    let x = 0;
    let y = 0;
    this.arrayX = [];
    this.arrayY = [];
    for (let i = 0; i < this.slides; i++) {
      x = Math.round(this.originX + this.radius * Math.cos(angle * i - Math.PI / 2));
      y = Math.round(this.originY + this.radius * Math.sin(angle * i - Math.PI / 2));
      this.vertices += x + ' ' + y + ' ';
      this.arrayX.push(x);
      this.arrayY.push(y);
    }
    this.minArrayX = this.getMinX();
    this.maxArrayX = this.getMaxX();
    this.minArrayY = this.getMinY();
    this.maxArrayY = this.getMaxY();
  }

  calculateAngle(currentPosition: MousePosition) {
    const vector1 = [this.radius, 0];
    const vector2 = [currentPosition.x - this.originX, currentPosition.y - this.originY];
    if (this.radius === 0) {
      this.angleRotation = 0;
    } else {
      this.angleRotation = Math.acos((dot(vector1, vector2)) /
        (Math.sqrt(Math.pow(vector1[0], POW)) * (Math.sqrt(Math.pow(vector2[0], POW) + Math.pow(vector2[1], POW)))));
      this.angleRotation = this.angleRotation * (TO_DEGREES / Math.PI);
      if (vector2[1] - vector1[1] < 0) {
        this.angleRotation = this.angleRotation * SWITCH_ANGLE_SIDE;
      }
    }
  }

  startDrawing(beginPosition: MousePosition): void {
    this.arrayX = [];
    this.arrayY = [];
    this.vertices = '';
    this.radius = 0;
    this.setStyles();
    this.originX = beginPosition.x;
    this.originY = beginPosition.y;
    this.calculateVertices();
  }

  draw(currentPosition: MousePosition): void {
    this.vertices = '';
    this.radius = Math.abs(currentPosition.x - this.originX);
    this.calculateVertices();
    this.calculateAngle(currentPosition);
  }

  submitElement(shape: Element, shapeName: string): boolean {
    super.submitElement(shape, shapeName);
    shape.setAttributeNS(null, polygonAttributes.points, this.vertices);
    shape.setAttributeNS(null, polygonAttributes.transform, 'rotate(' + this.angleRotation + ',' + this.originX + ',' + this.originY + ')');
    return true;
  }

  updatePolygonPoints(element: SVGPolygonElement) {
    this.vertices = '';
    const sCTM = element.getCTM();
    for (let i = 0; i < this.arrayX.length; i++) {
      const mySVGPoint = (element.ownerSVGElement as SVGSVGElement).createSVGPoint();
      mySVGPoint.x = this.arrayX[i];
      mySVGPoint.y = this.arrayY[i];
      const mySVGPointTrans = mySVGPoint.matrixTransform(sCTM as DOMMatrix);
      this.arrayX[i] = mySVGPointTrans.x;
      this.arrayY[i] = mySVGPointTrans.y;
      this.vertices += this.arrayX[i] + ' ' + this.arrayY[i] + ' ';
    }
    element.setAttribute('transform', '');
    element.removeAttribute('transform');
    element.setAttributeNS(null, polygonAttributes.points, this.vertices);
  }

  getMinX(): number {
    return Math.min(...this.arrayX);
  }

  getMaxX(): number {
    return Math.max(...this.arrayX);
  }

  getMinY(): number {
    return Math.min(...this.arrayY);
  }

  getMaxY(): number {
    return Math.max(...this.arrayY);
  }

}
