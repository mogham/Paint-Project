import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from '../drawing-tools/abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';

@Injectable({
  providedIn: 'root',
})

export class PencilParamsService extends DrawingTool {

  currentX: number;
  currentY: number;
  protected path: string;

  private thickness: number;
  private strokeLinecap: string;

  constructor(protected colorService: ColorToolService) {
    super();
    this.path = this.fill = this.stroke = '';
    this.currentX = this.currentY = 0;
    this.strokeWidth = this.thickness = 1;
    this.svgCode = 'path';
    this.setReady = true;
  }

  setDefault() {
    this.strokeWidth = 1;
    this.thickness = 1;
  }

  getThickness(): number {
    return this.thickness;
  }

  getStrokeWidth(): number {
    return this.strokeWidth;
  }

  setThickness(newThickness: number): number {
    return this.thickness = newThickness;
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
      'stroke-width': this.getThickness(),
      'stroke-linecap': this.setStrokeLinecap('round'),
    };
    return styles;
  }

  startDrawing(startPosition: MousePosition): void {
    this.setStyles();
    this.currentX = startPosition.x;
    this.currentY = startPosition.y;
    this.path = 'M' + this.currentX + ',' + this.currentY + ' ';
  }

  draw(currentPosition: MousePosition): void {
    this.currentX = currentPosition.x;
    this.currentY = currentPosition.y;
    this.path += 'L' + this.currentX + ',' + this.currentY + ' ';
    this.path += 'M' + this.currentX + ',' + this.currentY + ' ';
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.startDrawing(currentPosition);
    this.draw(currentPosition);
  }

  submitElement(myPath: Element, shapeName: string): boolean {
    super.submitElement(myPath, 'pencil');
    myPath.setAttributeNS(null, 'id', this.svgCode);
    myPath.setAttributeNS(null, 'd', this.path);
    myPath.setAttributeNS(null, 'stroke-width', String(this.getThickness()));
    myPath.setAttributeNS(null, 'stroke-linecap', this.strokeLinecap);
    return true;
  }

  onMouseUp(): void {
    this.setPath('');
  }
}
