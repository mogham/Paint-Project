import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from '../drawing-tools/abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';
import { VelocityParamsService } from './velocity-params.service';
@Injectable({
  providedIn: 'root',
})
export class PenParamsService extends DrawingTool {

  private currentX: number;
  private currentY: number;
  private path: string;
  private isActive: boolean;
  private oldXPosition: number;
  private oldYPosition: number;
  private maxStrokeWidth: number;
  private minStrokeWidth: number;
  private thickness: number;
  private strokeLinecap: string;

  isNewPath: boolean;

  constructor(protected colorService: ColorToolService,
              private velocity: VelocityParamsService) {
    super();
    this.path = this.fill = this.stroke = '';
    this.currentX = this.currentY = 0;
    this.strokeWidth = this.thickness = 1;
    this.svgCode = 'path';
    this.setReady = true;
    this.maxStrokeWidth = 1;
    this.minStrokeWidth = 0;
    this.isActive = false;
    this.isNewPath = false;
  }
  setDefault() {
    this.maxStrokeWidth = 1;
    this.minStrokeWidth = 0;
  }

  getStrokeWidth(): number {
    this.thickness = this.maxStrokeWidth +
      this.velocity.getVelocity() * ((this.minStrokeWidth - this.maxStrokeWidth) / 2);
    if (this.thickness < this.minStrokeWidth) {
      this.thickness = this.minStrokeWidth;
    }
    if (this.thickness > this.maxStrokeWidth) {
      this.thickness = this.maxStrokeWidth;
    }
    return this.thickness;
  }

  getMaxStrokeWidth(): number {
    return this.maxStrokeWidth;
  }
  getMinStrokeWidth(): number {
    return this.minStrokeWidth;
  }

  getPath(): string {
    return this.path;
  }

  getStrokeLinecap(): string {
    return this.strokeLinecap;
  }

  setThickness(newThickness: number): number {
    return this.thickness = newThickness;
  }

  setMinStrokeWidth(newThickness: number): number {
    return this.minStrokeWidth = newThickness;
  }

  setMaxStrokeWidth(newThickness: number): number {
    return this.maxStrokeWidth = newThickness;
  }

  setFill(newFill: string): string {
    return this.fill = newFill;
  }

  setStrokeWidth(newStrokeWidth: number): number {
    return this.strokeWidth = newStrokeWidth;
  }

  setStroke(newStroke: string): string {
    return this.stroke = newStroke;
  }

  setPath(newPath: string): string {
    return this.path = newPath;
  }

  setStrokeLinecap(newStrokeLinecap: string): string {
    return this.strokeLinecap = newStrokeLinecap;
  }

  setStyles(): object {
    const styles = {
      fill: this.setFill('none'),
      stroke: this.setStroke(this.colorService.getPrimaryColor()),
      'stroke-width': String(this.getStrokeWidth()),
      'stroke-linecap': this.setStrokeLinecap('round'),
      'stroke-linejoin': 'round',
    };
    return styles;
  }

  startDrawing(startPosition: MousePosition): void {
    if (this.isActive) {
      this.currentX = startPosition.x;
      this.currentY = startPosition.y;
      this.path += 'M' + this.currentX + ',' + this.currentY + ' ';
      if (!this.isNewPath) {
        this.path += 'L' + this.oldXPosition + ',' + this.oldYPosition + ' ';
      }
      this.oldXPosition = this.currentX;
      this.oldYPosition = this.currentY;
    }
  }

  draw(currentPosition: MousePosition): void {
    if (this.isActive) {
      this.currentX = currentPosition.x;
      this.currentY = currentPosition.y;
      this.path += 'L' + this.oldXPosition + ',' + this.oldYPosition + ' ';
      this.path += 'M' + this.currentX + ',' + this.currentY + ' ';
    }
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.isActive = true;
    this.setStyles();
    this.startDrawing(currentPosition);
    this.draw(currentPosition);
  }

  onMouseMove(currentPosition: MousePosition): void {
    if (this.getMaxStrokeWidth() > 0 && this.getMinStrokeWidth() > 0) {
      this.setStyles();
      this.startDrawing(currentPosition);
      this.draw(currentPosition);
    }
  }

  submitElement(myPath: Element, shapeName: string): boolean {
    myPath.setAttributeNS(null, 'stroke', this.stroke);
    myPath.setAttributeNS(null, 'strokeWidth', this.strokeWidth.toString());
    myPath.setAttributeNS(null, 'fill', this.fill);
    myPath.setAttributeNS(null, 'id', this.svgCode);
    myPath.setAttributeNS(null, 'd', this.getPath());
    myPath.setAttributeNS(null, 'stroke-linecap', this.getStrokeLinecap());
    myPath.setAttributeNS(null, 'stroke-width', String(this.getStrokeWidth()));
    myPath.setAttributeNS(null, 'stroke-linejoin', 'round');
    return true;
  }

  onMouseUp(): void {
    this.isActive = false;
    this.setPath('');
    this.isNewPath = false;
  }
}
