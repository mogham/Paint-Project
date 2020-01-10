import { DrawingTool } from './abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';
import { rectAttributes } from './drawing-tool-constants';
export abstract class Shapes extends DrawingTool {
  protected plot: string;
  originX: number;
  originY: number;
  protected width: number;
  protected height: number;
  protected thickness: number;
  constructor(protected colorTool: ColorToolService) {
    super();
    this.plot = 'contour';
    this.originX = 0;
    this.originY = 0;
    this.width = 0;
    this.height = 0;
    this.thickness = 1;
  }
  getOriginX(): number {
    return this.originX;
  }
  getOriginY() {
    return this.originY;
  }
  getWidth(): number {
    return this.width;
  }
  getHeight(): number {
    return this.height;
  }
  setPlot(newPlot: string): void {
    this.plot = newPlot;
    this.setReady = true;
  }
  setThickness(newThickness: number): void {
    this.thickness = newThickness;
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
  submitElement(shape: Element, shapeName: string): boolean {
    super.submitElement(shape, shapeName);
    shape.setAttributeNS(null, rectAttributes.id, shapeName);
    return (this.width !== 0) || (this.height !== 0);
  }
}
