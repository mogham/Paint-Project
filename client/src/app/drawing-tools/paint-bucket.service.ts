import { Injectable, Renderer2 } from '@angular/core';
import { MousePosition, ShapeCounter } from '../components/drawing-view/drawing-view-constants';
import { ColorToolService } from './color-tool.service';
const IMAGEFORMAT = 'data:image/svg+xml;base64,';
interface Position {
  x: number;
  y: number;
}
@Injectable({
  providedIn: 'root',
})
export class PaintBucketService {
  render: Renderer2;
  svg: SVGElement;
  image: HTMLImageElement;
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  format: string;
  name: string;
  width: string;
  height: string;
  private correctArray: any;
  private points: string;
  private shapes: HTMLElement[];
  protected plot: string;
  protected thickness: number;
  private fill: string;
  private stroke: string;
  private maxLength: number;
  private tolerance: number;
  private redReference: number;
  private greenReference: number;
  private blueReference: number;
  private stack: Position[];
  private oldLenghtStack: number;
  constructor(protected colorTool: ColorToolService) {
    this.correctArray = [[]];
    this.points = '';
    this.shapes = new Array();
    this.fill = '';
    this.stroke = '';
    this.maxLength = 0;
    this.tolerance = 0;
    this.redReference = 0;
    this.greenReference = 0;
    this.blueReference = 0;
    this.stack = new Array();
    this.oldLenghtStack = 0;
  }
  setDefault() {
    this.thickness = 1;
    this.tolerance = 0;
  }

  svgToBase64(): string {
    return (IMAGEFORMAT + btoa(new XMLSerializer().serializeToString(this.svg as Node)));
  }

  encodImage(): HTMLImageElement {
    const image = new Image();
    image.width = this.transformDimensionToNumber(this.width);
    image.height = this.transformDimensionToNumber(this.height);
    image.src = this.svgToBase64();
    return image;
  }

  transformDimensionToNumber(value: string): number {
    const indexOfPInDimension = value.indexOf('p');
    return Number(value.substring(0, indexOfPInDimension));
  }

  async drawImageOnCanvas(): Promise<void> {
    const canvasElement = this.render.createElement('canvas');
    canvasElement.width = this.transformDimensionToNumber(this.width);
    canvasElement.height = this.transformDimensionToNumber(this.height);
    this.render.appendChild(canvasElement, this.svg);
    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      const image = this.encodImage();
      await image.decode().then(() => {
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          this.canvasElement = ctx.canvas;
        }
      })
        .catch((error) => {
          throw error;
        });
    }
  }

  setRendererAndSVG(render: Renderer2, svg: SVGElement, width: string, height: string): void {
    this.render = render;
    this.svg = svg;
    this.width = width;
    this.height = height;
  }

  setPlot(plot: string): void {
    this.plot = plot;
  }

  setThickness(thickness: number): void {
    this.thickness = thickness;
  }

  setTolerance(tolerance: number): void {
    this.tolerance = tolerance;
  }

  createPath(currentPosition: MousePosition): HTMLElement | undefined {
    const ctx = this.canvasElement.getContext('2d');
    this.points = '';
    this.maxLength = 0;
    if (ctx !== null) {
      ShapeCounter.drawElementCounter++;
      this.shapes = [];
      const width = parseInt(this.width.substring(0, this.width.length - 2), 10);
      const height = parseInt(this.height.substring(0, this.height.length - 2), 10);
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      this.getReferenceColors(data, Math.floor((currentPosition.x + currentPosition.y * width) * 4));
      this.createArray(data, width, height);
      this.findBorder(Math.round(currentPosition.x), Math.round(currentPosition.y));
      this.makePath();
      ShapeCounter.drawElementCounter++;
      return this.shapes[0];
    }
    return undefined;
  }

  getReferenceColors(data: Uint8ClampedArray, redPosition: number): void {
    this.redReference = data[redPosition + 0];
    this.greenReference = data[redPosition + 1];
    this.blueReference = data[redPosition + 2];
  }

  createArray(data: Uint8ClampedArray, width: number, height: number): void {
    this.correctArray = new Array();
    let isCorrectLine = new Array();
    for (let indexY = 0; indexY < height; indexY++) {
      for (let indexX = 0; indexX < width * 4; indexX += 4) {
        if (this.isCorrectPixel(data[indexX + indexY * width * 4], data[indexX + indexY * width * 4 + 1],
          data[indexX + indexY * width * 4 + 2])) {
          isCorrectLine.push(1);
        } else {
          isCorrectLine.push(0);
        }
      }
      this.correctArray.push(isCorrectLine);
      isCorrectLine = [];
    }
  }

  isCorrectPixel(red: number, green: number, blue: number): boolean {
    return (this.isAcceptColor(this.redReference, red) &&
      this.isAcceptColor(this.greenReference, green) && this.isAcceptColor(this.blueReference, blue)) || (this.tolerance === 100);
  }

  isAcceptColor(referenceColor: number, colorToCompare: number): boolean {
    const min = referenceColor - 255 * this.tolerance / 100;
    const max = referenceColor + 255 * this.tolerance / 100;
    return this.isBetween(min, max, colorToCompare);
  }

  isBetween(min: number, max: number, toCompare: number): boolean {
    return min <= toCompare && toCompare <= max;
  }

  isCorrectIndex(x: number, y: number): boolean {
    return (this.correctArray[y] !== undefined && this.correctArray[y][x] !== undefined);
  }

  visit(x: number, y: number) {
    if (this.isBorder(x, y) && this.correctArray[y][x] === 4) {
      this.completeBorder(x, y, true);
    } else {
      this.correctArray[y][x] = 2;
    }
  }

  addToStack(x: number, y: number) {
    if (this.isCorrectIndex(x, y) && this.correctArray[y][x] === 1) {
      const pos: Position = {} as Position;
      pos.x = x;
      pos.y = y;
      this.stack.push(pos);
      this.correctArray[y][x] = 4;
    }
  }

  visitChildren(x: number, y: number) {
    this.addToStack(x, y - 1);
    this.addToStack(x, y + 1);
    this.addToStack(x + 1, y);
    this.addToStack(x + 1, y);
    this.addToStack(x - 1, y - 1);
    this.addToStack(x - 1, y + 1);
    this.addToStack(x + 1, y - 1);
    this.addToStack(x + 1, y + 1);
  }

  findBorder(x: number, y: number): void {
    this.points = '';
    this.oldLenghtStack = 0;
    this.stack = new Array();
    if (this.correctArray[y][x] === 1) {
      const pos: Position = {} as Position;
      pos.x = x;
      pos.y = y;
      this.stack.push(pos);
      this.correctArray[y][x] = 4;
    }
    do {
      const lastIndex = this.oldLenghtStack;
      this.oldLenghtStack = this.stack.length;
      for (let index = lastIndex; index < this.stack.length; index++) {
        this.visitChildren(this.stack[index].x, this.stack[index].y);
      }
    } while (this.oldLenghtStack !== this.stack.length);

    for (const currentPosition of this.stack) {
      this.visit(currentPosition.x, currentPosition.y);
    }
  }

  makePath(): void {
    const svgNS = 'http://www.w3.org/2000/svg';
    const path = this.render.createElement('path', svgNS) as HTMLElement;
    path.setAttribute('d', this.points);
    this.maxLength = this.maxLength < this.points.length ? this.points.length : this.maxLength;
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
    path.setAttribute('id', 'path');
    path.setAttribute('fill', this.fill);
    path.setAttribute('stroke', this.stroke);
    path.setAttribute('stroke-width', String(this.thickness));
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('fill-rule', 'evenodd');
    path.setAttributeNS(null, 'elementID', (ShapeCounter.drawElementCounter).toString());
    this.shapes.push(path);
  }

  findAt(x: number, y: number, findWhat: number): boolean {
    if (this.correctArray[y] !== undefined && this.correctArray[y][x] !== undefined && this.correctArray[y][x] === findWhat) {
      return true;
    }
    return false;
  }

  isBorder(x: number, y: number): boolean {
    let counter = 0;
    if (this.correctArray[y] === undefined || this.correctArray[y][x] === undefined) {
      return false;
    }
    if ((x === 0 || y === 0 || x === parseInt(this.width, 10) - 1 || y === parseInt(this.height, 10) - 1)) {
      return true;
    }
    if (this.findAt(x - 1, y - 1, 0)) {
      counter++;
    }
    if (this.findAt(x, y - 1, 0)) {
      counter++;
    }
    if (this.findAt(x + 1, y - 1, 0)) {
      counter++;
    }
    if (this.findAt(x - 1, y, 0)) {
      counter++;
    }
    if (this.findAt(x + 1, y, 0)) {
      counter++;
    }
    if (this.findAt(x - 1, y + 1, 0)) {
      counter++;
    }
    if (this.findAt(x, y + 1, 0)) {
      counter++;
    }
    if (this.findAt(x + 1, y + 1, 0)) {
      counter++;
    }
    return counter > 1;
  }

  completeBorder(x: number, y: number, isFirstPoint: boolean) {
    y = y < 0 ? 0 : y;
    y = y >= parseInt(this.height, 10) ? parseInt(this.height, 10) - 1 : y;
    x = x < 0 ? 0 : x;
    x = x >= parseInt(this.width, 10) ? parseInt(this.width, 10) - 1 : x;
    if (isFirstPoint) {
      this.correctArray[y][x] = 5;
      this.points += 'M ' + x + ' ' + y + ' ';
    } else {
      this.correctArray[y][x] = 3;
    }
    if (this.isBorder(x, y - 1) && this.correctArray[y - 1][x] === 4) {
      this.points += 'L ' + x + ' ' + String(y - 1) + ' ';
      this.completeBorder(x, y - 1, false);
    }
    if (this.isBorder(x - 1, y) && this.correctArray[y][x - 1] === 4) {
      this.points += 'L ' + String(x - 1) + ' ' + y + ' ';
      this.completeBorder(x - 1, y, false);
    }
    if (this.isBorder(x, y + 1) && this.correctArray[y + 1][x] === 4) {
      this.points += 'L ' + x + ' ' + String(y + 1) + ' ';
      this.completeBorder(x, y + 1, false);
    }
    if (this.isBorder(x + 1, y) && this.correctArray[y][x + 1] === 4) {
      this.points += 'L ' + String(x + 1) + ' ' + y + ' ';
      this.completeBorder(x + 1, y, false);
    }
    if (this.isBorder(x - 1, y - 1) && this.correctArray[y - 1][x - 1] === 4) {
      this.points += 'L ' + String(x - 1) + ' ' + String(y - 1) + ' ';
      this.completeBorder(x - 1, y - 1, false);
    }
    if (this.isBorder(x - 1, y + 1) && this.correctArray[y + 1][x - 1] === 4) {
      this.points += 'L ' + String(x - 1) + ' ' + String(y + 1) + ' ';
      this.completeBorder(x - 1, y + 1, false);
    }
    if (this.isBorder(x + 1, y + 1) && this.correctArray[y + 1][x + 1] === 4) {
      this.points += 'L ' + String(x + 1) + ' ' + String(y + 1) + ' ';
      this.completeBorder(x + 1, y + 1, false);
    }
    if (this.isBorder(x + 1, y - 1) && this.correctArray[y - 1][x + 1] === 4) {
      this.points += 'L ' + String(x + 1) + ' ' + String(y - 1) + ' ';
      this.completeBorder(x + 1, y - 1, false);
    }
    if (isFirstPoint) {
      this.points += 'Z';
    }
  }
}
