import { Injectable } from '@angular/core';
import { delay } from 'q';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from '../drawing-tools/abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';

const DELAY = 100;

@Injectable({
  providedIn: 'root',
})

export class PolylineParamsService extends DrawingTool {

  private thickness: number;
  private pointsDiameter: number;
  private linePattern: string;
  private junctionType: string;
  private marker: string;
  private strokeLinecap: string;

  private bufferPath1: string;
  private bufferPath2: string;
  private isTempLine: boolean;

  private startX: number;
  private startY: number;

  private currentX: number;
  private currentY: number;

  private tempX: number;
  private tempY: number;

  startPathX: number;
  startPathY: number;

  isFirstSegment: boolean;
  isLastSegment: boolean;

  click: number;
  points: string;
  temporaryPath: string;
  isMouseDown: boolean;
  pointToAdd: string;
  isCanceled: boolean;
  isClosedWithShift: boolean;
  isClosedWithDblClick: boolean;
  diameterMarker: string;

  constructor(protected colorService: ColorToolService) {
    super();
    this.svgCode = 'path';
    this.points = this.fill = this.stroke = this.temporaryPath = this.pointToAdd = '';
    this.currentX = this.currentY = this.click = 0;
    this.linePattern = '';
    this.marker = '';
    this.bufferPath2 = this.bufferPath1 = '';
    this.diameterMarker = '1%';
    this.junctionType = this.strokeLinecap = '';
    this.strokeWidth = this.thickness = this.pointsDiameter = 1;
    this.isFirstSegment = true;
    this.isTempLine = this.isLastSegment =
      this.isClosedWithDblClick = this.isClosedWithShift =
      this.isMouseDown = this.isCanceled = false;
  }

  setDefault(): void {
    this.setReady = true;
    this.thickness = 1;
    this.strokeWidth = 1;
    this.pointsDiameter = 1;
  }
  setPath(newPath: string): string {
    return this.points = newPath;
  }

  getLinePattern(): string {
    return this.linePattern;
  }

  getPointsDiameter(): number {
    return this.pointsDiameter;
  }

  setStroke(newStroke: string): string {
    return this.stroke = newStroke;
  }

  getJunctionType(): string {
    return this.junctionType;
  }

  setStrokeLinecap(newStrokeLinecap: string): void {
    this.strokeLinecap = newStrokeLinecap;
  }

  setThickness(thicknessValue: number): void {
    this.thickness = thicknessValue;
  }

  setJunctionType(newJunctionType: string): string {
    return this.junctionType = newJunctionType;
  }

  setPointsDiameter(newPointsDiameter: number): number {
    return this.pointsDiameter = newPointsDiameter;
  }

  setLinePattern(newLinePattern: string): string {
    return this.linePattern = newLinePattern;
  }

  setMarker(): string {
    if (this.junctionType === 'with-points') {
      return this.marker = 'url(#j1)';
    } else {
      return this.marker = '';
    }
  }

  setJunctionStyle(): void {
    this.setReady = this.junctionType !== '';
    if (this.junctionType === 'angle') {
      this.setJunctionType('');
    }
    if (this.junctionType === 'round') {
      this.setJunctionType('round');
    }
  }

  getMarker(): string {
    return this.marker;
  }

  setMarkerStyle(): void {
    this.diameterMarker = this.getPointsDiameter() + '%';
  }

  async startDrawing(startPosition: MousePosition): Promise<void> {
    this.startX = startPosition.x;
    this.startY = startPosition.y;
    this.setStyles();
    if (this.isFirstSegment) {
      this.setPath('');
      this.startPathX = this.currentX = this.tempX = this.startX;
      this.startPathY = this.currentY = this.tempY = this.startY;
      this.isMouseDown = true;
      this.isFirstSegment = false;
    }
    if (!this.isFirstSegment && (this.startX === this.currentX)) {
      this.points += 'M' + this.startX + ',' + this.startY + ' ';
      this.points += 'L' + this.tempX + ',' + this.tempY + ' ';
      await delay(DELAY);
      if (this.isClosedWithShift && this.isClosedWithDblClick) {
        this.points += 'M' + startPosition.x + ',' + startPosition.y + ' ';
        this.points += 'L' + this.startPathX + ',' + this.startPathY + ' ';
        this.isClosedWithShift = false;
        this.isLastSegment = true;
      }
    } else {
      this.points += 'M' + this.startX + ',' + this.startY + ' ';
      this.points += 'L' + this.currentX + ',' + this.currentY + ' ';
    }
  }

  draw(currentPosition: MousePosition): void {
    this.tempX = this.currentX;
    this.tempY = this.currentY;
    this.bufferPath2 = this.currentX + ',' + this.currentY + ' ';
    this.currentX = currentPosition.x;
    this.currentY = currentPosition.y;
    this.bufferPath1 = this.currentX + ',' + this.currentY + ' ';
    this.removeDraw();
  }

  removeDraw(): void {
    if (this.isCanceled) {
      this.points = this.points.replace('M' + this.bufferPath1 + 'L' + this.bufferPath2, '');
      this.currentX = this.tempX;
      this.currentY = this.tempY;
      this.isCanceled = false;
    }
  }

  onMouseMove(currentPosition: MousePosition) {
    if (this.isMouseDown && !this.isLastSegment) {
      if (this.isTempLine) {
        this.points = this.temporaryPath;
      }
      this.temporaryPath = this.points;
      this.pointToAdd = 'M' + currentPosition.x + ',' + currentPosition.y + ' '
        + 'L' + this.currentX + ',' + this.currentY + ' ';
      this.points = this.temporaryPath + this.pointToAdd;
      this.isTempLine = true;
    }
  }

  onMouseUp(): void {
    this.setPath('');
  }

  onMouseDown(currentPosition: MousePosition) {
    this.isTempLine = false;
    this.points = this.temporaryPath;
    this.startDrawing(currentPosition);
    this.draw(currentPosition);
    this.click++;
  }

  setPatternStyle(): void {
    if (this.linePattern === 'dotted-traits') {
      this.setStrokeLinecap('round');
      this.setLinePattern(String(this.thickness + this.thickness));
    } else if (this.linePattern === 'dotted-points') {
      this.setStrokeLinecap('');
      this.setLinePattern(String(this.thickness + ',' + this.thickness));
    } else if (this.linePattern === 'continu') {
      this.setStrokeLinecap('round');
      this.setLinePattern('0');
    }
    this.setReady = this.linePattern !== '';
  }

  setStyles(): object {
    this.setPatternStyle();
    this.setMarkerStyle();
    this.setMarker();
    const styles = {
      fill: 'none',
      stroke: this.setStroke(this.colorService.getPrimaryColor()),
      'stroke-width': this.thickness,
      'stroke-linecap': this.strokeLinecap,
      'stroke-dasharray': this.getLinePattern(),
      'marker-mid': this.getMarker(),
    };
    return styles;
  }

  submitElement(myPath: Element, shapeName: string): boolean {
    super.submitElement(myPath, shapeName);
    myPath.setAttributeNS(null, 'id', 'path');
    myPath.setAttributeNS(null, 'd', this.points);
    myPath.setAttributeNS(null, 'stroke', String(this.getStroke()));
    myPath.setAttributeNS(null, 'stroke-width', String(this.thickness));
    myPath.setAttributeNS(null, 'stroke-dasharray', this.getLinePattern());
    myPath.setAttributeNS(null, 'stroke-linecap', this.strokeLinecap);
    myPath.setAttributeNS(null, 'marker-mid', this.getMarker());
    myPath.setAttributeNS(null, 'markerWidth', this.diameterMarker);
    myPath.setAttributeNS(null, 'markerHeight', this.diameterMarker);
    myPath.setAttributeNS(null, 'markerUnits', 'userSpaceOnUse');
    return this.bufferPath1.length > 3;
  }

}
