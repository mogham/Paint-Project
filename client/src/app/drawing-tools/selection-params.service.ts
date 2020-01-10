import { ElementRef, Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from '../selection-manipulation/rotation-manipulation.service';
import { ColorToolService } from './color-tool.service';
import { drawingSpecifics } from './drawing-tool-constants';
import { IntersectionParamsService } from './intersection-params.service';
import { PenParamsService } from './pen-params.service';
import { RectParamsService } from './rect-params.service';
import { VelocityParamsService } from './velocity-params.service';
const HALF_WIDTH_HEIGHT = 2;
const MARGE_ERR_FIVE = 5;
const MARGE_ERR_THREE = 3;
const MARGE_ERR_BOX = 54;
const PADDING_TOP = 42;
const MARGE_POLYGON_X_Y = 0.94;
const MARGE_POLYGON_WIDTH = 1.85;
const MARGE_POLYGON_HEIGHT = 1.70;
@Injectable({
  providedIn: 'root',
})
export class SelectionParamsService extends RectParamsService {
  private strokeDasharray: string;
  private widthBox: number;
  private heightBox: number;
  private originXBox: number;
  private originYBox: number;
  private shiftEnabled: boolean;
  protected transform: string;
  private orientationAngleOfShapes: Map<Element, number>;
  private isControlPointsShape: boolean;
  private isControlPointsGroup: boolean;
  private selectionShapes: Map<string, HTMLElement>;
  private selectionRectOfShapes: Map<Element, Element>;
  private selectedShape: Set<number>;
  private leftClickSelection: Set<number>;
  private rightClickSelection: Set<number>;
  protected strokeLinecap: string;
  protected rightClick: boolean;
  protected widthGroupBox = 0;
  protected heightGroupBox = 0;
  protected originXGroupBox = 0;
  protected originYGroupBox = 0;
  isAlt: boolean;
  constructor(protected color: ColorToolService,
              protected intersection: IntersectionParamsService,
              private paperweightService: PaperweightManipulationService,
              private rotation: RotationManipulationService) {
    super(color);
    this.setReady = true;
    this.resetAll();
  }
  getRotation(): RotationManipulationService {
    return this.rotation;
  }
  getRotationAngle(element: Element): number {
    return this.orientationAngleOfShapes.get(element) as number;
  }
  getStrokeDasharray(): string {
    return this.strokeDasharray;
  }
  getOriginX(): number {
    return this.originRectX;
  }
  getOriginY(): number {
    return this.originRectY;
  }
  getSelectionRectOfShapes(): Map<Element, Element> {
    return this.selectionRectOfShapes;
  }
  getSelectionShapes(): Map<string, HTMLElement> {
    return this.selectionShapes;
  }
  onMouseUp(): void {
    if (this.selectedShape.size > 0) {
      this.drawGroupSelectionBox();
    }
    this.rightClickSelection.clear();
    this.leftClickSelection.clear();
  }
  resetAll(): void {
    this.fill = 'none';
    this.strokeLinecap = this.stroke = '';
    this.strokeDasharray = '0';
    this.widthBox = this.heightBox = this.originXBox = this.originYBox = 0;
    this.rightClick = false;
    this.selectionShapes = new Map<string, HTMLElement>();
    this.selectionRectOfShapes = new Map<Element, Element>();
    this.orientationAngleOfShapes = new Map<Element, number>();
    this.selectedShape = new Set<number>();
    this.rightClickSelection = new Set<number>();
    this.leftClickSelection = new Set<number>();
    this.transform = '';
    this.isControlPointsShape = false;
    this.isControlPointsGroup = false;
    this.isAlt = false;
  }

  enableShift(): void {
    this.shiftEnabled = true;
  }

  disableShift(): void {
    this.shiftEnabled = false;
  }

  setRotationAngle(element: Element, angle: number) {
    this.orientationAngleOfShapes.set(element, angle);
  }
  setControlPointsShape(ControlPointsShape: boolean) {
    this.isControlPointsShape = ControlPointsShape;
  }
  setControlPointsGroup(ControlPointsGroup: boolean) {
    this.isControlPointsGroup = ControlPointsGroup;
  }
  setStrokeLinecap(newLinecap: string): string {
    return this.strokeLinecap = newLinecap;
  }
  setStrokeDasharray(newDasharray: string): string {
    return this.strokeDasharray = newDasharray;
  }
  setRightClick(bool: boolean): void {
    this.rightClick = bool;
  }
  startDrawing(beginPosition: MousePosition): void {
    this.setStyles();
    this.originX = beginPosition.x;
    this.originY = beginPosition.y;
    this.height = this.width = 0;
  }

  rotate(angle: number) {
    const orientationAngle: number[] = [];
    if (this.isAlt) {
      angle = angle / 15;
    }
    if (this.shiftEnabled) {
      this.rotateSeperately(angle);
    }
    this.rotateShape(this.selectedShape, angle, orientationAngle);
  }

  rotateSeperately(angle: number): void {
    this.rotateShape(this.selectedShape, angle, []);
  }

  oneShape(): boolean {
    return this.isControlPointsShape
      || (this.isControlPointsGroup && this.shiftEnabled);
  }

  rotateShapeAroudItself(selectedShapeIDs: Set<number>): any[] {
    const attributes: { group: boolean; originXBox: number; originYBox: number; widthBox: number; heightBox: number; }[] = [];
    selectedShapeIDs.forEach((selectedShapeID) => {
      const selectionElement = this.selectionShapes.get(String(selectedShapeID)) as HTMLElement;
      attributes.push({
        group: false,
        originXBox: +(selectionElement.getAttribute('x') as string),
        originYBox: +(selectionElement.getAttribute('y') as string),
        widthBox: +(selectionElement.getAttribute('width') as string),
        heightBox: +(selectionElement.getAttribute('height') as string),
      });
    });
    return attributes;
  }

  rotateGroup(): boolean {
    return this.isControlPointsGroup && !this.shiftEnabled;
  }

  rotateShape(selectedShapeIDs: Set<number>, angle: number, orientationAngle: number[]) {
    let attributes: { group: boolean; originXGroupBox: number; originYGroupBox: number;
      widthGroupBox: number; heightGroupBox: number; }[] = [];
    if (this.oneShape()) {
      attributes = this.rotateShapeAroudItself(selectedShapeIDs);
    } else if (this.rotateGroup()) {
      attributes.push({
        group: true,
        originXGroupBox: this.originXGroupBox,
        originYGroupBox: this.originYGroupBox,
        widthGroupBox: this.widthGroupBox,
        heightGroupBox: this.heightGroupBox,
      });
    }
    const selectionShape: HTMLElement[] = [];
    const shape: Element[] = [];
    let index = 0;
    selectedShapeIDs.forEach((selectedShapeID) => {
      selectionShape.push(this.selectionShapes.get(String(selectedShapeID)) as HTMLElement);
      shape.push(this.selectionRectOfShapes.get(selectionShape[index]) as Element);
      orientationAngle.push(angle + this.getRotationAngle(selectionShape[index++]));
    });
    this.rotation.applyRotate(shape, attributes, orientationAngle);
    this.transform = this.rotation.getNewRotation();
    index = 0;
    selectionShape.forEach((selection) => {
      selection.setAttributeNS(null, 'transform', this.transform);
      this.setRotationAngle(selection, orientationAngle[index++]);
    });
  }

  setStyles(): void {
    this.stroke = 'black';
    this.strokeDasharray = this.setStrokeDasharray('4 4');
    this.strokeLinecap = this.setStrokeLinecap('round');
    this.strokeWidth = 1;
  }
  onMouseDown(currentPosition: MousePosition): void {
    this.setStyles();
    this.startDrawing(currentPosition);
  }
  selectionClick(event: Event): void {
    this.unselect();
    this.select(event);
  }
  removeSelectionRectangle(): void {
    this.height = this.width = 0;
  }
  resetRotationFeatures() {
    for (const item of this.selectedShape.values()) {
      const selectionShape = this.selectionShapes.get(item.toString());
      if (selectionShape) {
        this.rotation.setLastRotateShape(new Map());
        this.orientationAngleOfShapes.set(selectionShape, 0);
      }
    }
  }
  updateParamsAfterRotation(selectionShape: HTMLElement) {
    const shape = this.selectionRectOfShapes.get(selectionShape) as Element;
    this.rotation.setLastRotateShape(new Map());
    this.orientationAngleOfShapes.set(selectionShape, 0);
    this.deleteSelectionShape(shape, shape.parentElement as Element);
    this.setBoxSelection(shape as HTMLElement, true);
    selectionShape.setAttributeNS(null, 'transform', '');
    selectionShape.removeAttribute('transform');
    this.appendSelectionRectangle(selectionShape, shape.parentElement as HTMLElement, shape);
  }
  updateBBox(): void {
    for (const item of this.selectedShape.values()) {
      const selectionShape = this.selectionShapes.get(item.toString());
      if (selectionShape) {
        const shape = this.selectionRectOfShapes.get(selectionShape) as HTMLElement;
        selectionShape.setAttributeNS(null, 'stroke-opacity', '0');
        this.deleteSelectionShape(shape, shape.parentElement as Element);
        this.setBoxSelection(shape as HTMLElement, true);
        selectionShape.setAttributeNS(null, 'transform', '');
        selectionShape.removeAttribute('transform');
        this.appendSelectionRectangle(selectionShape, shape.parentElement as HTMLElement, shape);
      }
    }
  }
  select(event: Event) {
    if (this.clickedOnAnElement(event)) {
      const target = event.target as HTMLElement;
      const elementID = target.getAttribute('elementID');
      const strokeOpacity = target.getAttribute('stroke-opacity');
      if (elementID) {
        this.selectShape(elementID);
      } else if (strokeOpacity !== null) {
        this.addToSelectedShape(target);
      }
    }
  }

  clickedOnAnElement(event: Event): boolean {
    return event != null && event.target != null;
  }

  selectShape(elementID: string | null): void {
    const selectionShape = elementID ? this.selectionShapes.get(elementID) : null;
    if (selectionShape) {
      this.selectedShape.add(+(elementID as string));
      selectionShape.setAttributeNS(null, 'stroke-opacity', '1');
    }
  }

  addToSelectedShape(target: HTMLElement): void {
    const child = this.selectionRectOfShapes.get(target) as Element;
    this.selectedShape.add(+(child.getAttribute('elementID') as string));
    target.setAttributeNS(null, 'stroke-opacity', '1');
  }

  updateParams(): void {
    for (const item of this.selectedShape.values()) {
      const selectionShape = this.selectionShapes.get(item.toString());
      if (selectionShape) {
        selectionShape.setAttributeNS(null, 'stroke-opacity', '0');
        if (this.transform.includes('rotate')) {
          this.updateParamsAfterRotation(selectionShape);
        }
      }
    }
  }
  unselect(): void {
    this.updateParams();
    this.isControlPointsGroup = false;
    this.isControlPointsShape = false;
    this.originXGroupBox = 0;
    this.widthGroupBox = 0;
    this.originYGroupBox = 0;
    this.heightGroupBox = 0;
    this.selectedShape.clear();
  }
  rightSelect(event: Event) {
    if (event != null && event.target != null) {
      const target = event.target as HTMLElement;
      let elementID = target.getAttribute('elementID');
      if (elementID === null && target.tagName !== 'svg') {
        const elementTempID = (this.selectionRectOfShapes.get(target as Element) as HTMLElement).getAttribute('elementID');
        elementID = elementTempID ? elementTempID : null;
      }
      const selectionShape = elementID ? this.selectionShapes.get(elementID) : null;
      if (selectionShape) {
        if (this.selectedShape.has(+(elementID as string)) && this.isControlPointsGroup) {
          this.removeFromGroup(elementID as string);
        } else {
          const visible = selectionShape.getAttribute('stroke-opacity') === '1';
          const visibility = !visible ? '1' : '0';
          this.handleSelectedShape(elementID, visible);
          selectionShape.setAttributeNS(null, 'stroke-opacity', visibility);
        }
      }
    }
  }
  private handleSelectedShape(elementID: string | null, visible: boolean): void {
    if (elementID && !visible) {
      this.isControlPointsShape = true;
      this.selectedShape.add(+elementID);
    } else if (elementID && visible) {
      this.isControlPointsShape = false;
      this.selectedShape.delete(+elementID);
    }
  }
  removeFromGroup(elementID: string): void {
    this.selectedShape.delete(+elementID);
    this.drawGroupSelectionBox();
  }
  addSelectionRect(drawingElement: Element, canvas: ElementRef): void {
    const child = canvas.nativeElement.lastElementChild;
    let isTransformed = false;
    if (child.getAttribute('transform') !== null) {
      isTransformed = true;
    }
    this.setBoxSelection(child, isTransformed);
    if (child.getAttribute('elementID') !== null) {
      this.orientationAngleOfShapes.set(drawingElement, 0);
      this.appendSelectionRectangle(drawingElement, canvas.nativeElement, child);
    }
  }

  private setBoxSelection(child: HTMLElement, isTransformed: boolean) {
    switch (child.tagName) {
      case 'rect':
        this.setBoxSelectionForRect(child, isTransformed);
        break;
      case 'path':
        this.setBoxSelectionForPath(child);
        break;
      case 'ellipse':
        this.setBoxSelectionForEllipse(child, isTransformed);
        break;
      case 'polygon':
        this.setBoxSelectionForPolygon(child);
        break;
      case 'image':
        this.setBoxSelectionForImage(child, isTransformed);
        break;
      case 'text':
        this.setBoxSelectionForText(child);
        break;
      case 'g' || 'pen':
        this.setBoxSelectionForG(child, isTransformed);
    }
  }
  private setSelectionShape(drawingElement: Element) {
    drawingElement.setAttributeNS(null, drawingSpecifics.stroke, '#000000');
    drawingElement.setAttributeNS(null, drawingSpecifics.strokeWidth, '1');
    drawingElement.setAttributeNS(null, drawingSpecifics.fill, this.fill);
    drawingElement.setAttributeNS(null, 'x', this.originXBox.toString());
    drawingElement.setAttributeNS(null, 'y', this.originYBox.toString());
    drawingElement.setAttributeNS(null, 'height', this.heightBox.toString());
    drawingElement.setAttributeNS(null, 'width', this.widthBox.toString());
    drawingElement.setAttributeNS(null, 'stroke-opacity', '0');
    drawingElement.setAttributeNS(null, 'pointer-events', 'visible');
  }
  private appendSelectionRectangle(drawingElement: Element, canvas: Element, child: any): void {
    this.setSelectionShape(drawingElement);
    if (!this.selectionShapes.has(child.getAttribute('elementID'))) {
      canvas.appendChild(drawingElement);
    }
    this.selectionRectOfShapes.set(drawingElement, child);
    this.selectionShapes.set(child.getAttribute('elementID'), canvas.lastElementChild as HTMLElement);
  }
  setAllSelectionEvents(visibility: string) {
    this.selectionShapes.forEach((selectionShape) => {
      selectionShape.setAttributeNS(null, 'pointer-events', visibility);
    });
  }
  // Function that calculates the new bbox after the TRANSLATE.
  // Inspired By https://greensock.com/forums/topic/13681-svg-gotchas/page/2/?tab=comments#comment-72060
  getBBox(element: SVGSVGElement) {
    const bbox = element.getBBox();
    const point = (element.ownerSVGElement as SVGSVGElement).createSVGPoint();
    const matrix = ((element.ownerSVGElement as SVGSVGElement).getScreenCTM() as DOMMatrix)
      .inverse().multiply((element.getScreenCTM()) as DOMMatrix);
    point.x = bbox.x;
    point.y = bbox.y;
    const transformMatxA = point.matrixTransform(matrix);
    point.x = bbox.x + bbox.width;
    point.y = bbox.y;
    const transformMatxB = point.matrixTransform(matrix);
    point.x = bbox.x + bbox.width;
    point.y = bbox.y + bbox.height;
    const transformMatxC = point.matrixTransform(matrix);
    point.x = bbox.x;
    point.y = bbox.y + bbox.height;
    const transformMatxD = point.matrixTransform(matrix);
    const minX = Math.min(transformMatxA.x, transformMatxB.x, transformMatxC.x, transformMatxD.x);
    const maxX = Math.max(transformMatxA.x, transformMatxB.x, transformMatxC.x, transformMatxD.x);
    const minY = Math.min(transformMatxA.y, transformMatxB.y, transformMatxC.y, transformMatxD.y);
    const maxY = Math.max(transformMatxA.y, transformMatxB.y, transformMatxC.y, transformMatxD.y);
    const width = maxX - minX;
    const height = maxY - minY;
    this.originYBox = minY;
    this.originXBox = minX;
    this.widthBox = width;
    this.heightBox = height;
  }
  setBoxSelectionForG(target: Element, isTransformed: boolean) {
    const penService = new PenParamsService({} as ColorToolService, {} as VelocityParamsService);
    if (isTransformed) {
      this.getBBox(target as SVGSVGElement);
      this.widthBox += penService.getMaxStrokeWidth();
      this.heightBox += penService.getMaxStrokeWidth();
      this.originXBox -= penService.getMaxStrokeWidth() / HALF_WIDTH_HEIGHT;
      this.originYBox -= penService.getMaxStrokeWidth() / HALF_WIDTH_HEIGHT;
    } else {
      const bbox = (target as SVGSVGElement).getBBox();
      this.widthBox = bbox.width + penService.getMaxStrokeWidth();
      this.heightBox = bbox.height + penService.getMaxStrokeWidth();
      this.originXBox = bbox.x - penService.getMaxStrokeWidth() / HALF_WIDTH_HEIGHT;
      this.originYBox = bbox.y - penService.getMaxStrokeWidth() / HALF_WIDTH_HEIGHT;
    }
  }
  setBoxSelectionForImage(target: Element, isTransformed: boolean) {
    if (isTransformed) {
      this.getBBox(target as SVGSVGElement);
    } else {
      this.widthBox = target.getBoundingClientRect().width + MARGE_ERR_FIVE;
      this.heightBox = target.getBoundingClientRect().height + MARGE_ERR_FIVE;
      this.originXBox = Number(target.getAttribute('x')) - MARGE_ERR_THREE;
      this.originYBox = Number(target.getAttribute('y')) - MARGE_ERR_THREE;
    }
  }
  setBoxSelectionForText(target: HTMLElement) {
    this.widthBox = target.getBoundingClientRect().width;
    this.heightBox = target.getBoundingClientRect().height;
    this.originXBox = target.getBoundingClientRect().left - MARGE_ERR_BOX;
    this.originYBox = target.getBoundingClientRect().top - PADDING_TOP;
  }
  setBoxSelectionForPolygon(target: any) {
    this.getBBox(target);
    this.originXBox -= MARGE_POLYGON_X_Y * Number(target.getAttribute('stroke-width'));
    this.originYBox -= MARGE_POLYGON_X_Y * Number(target.getAttribute('stroke-width'));
    this.widthBox += MARGE_POLYGON_WIDTH * Number(target.getAttribute('stroke-width'));
    this.heightBox += MARGE_POLYGON_HEIGHT * Number(target.getAttribute('stroke-width'));
  }
  setBoxSelectionForRect(target: Element, isTransformed: boolean): void {
    if (isTransformed) {
      this.getBBox(target as SVGSVGElement);
      this.widthBox += MARGE_ERR_FIVE + Number(target.getAttribute('stroke-width'));
      this.heightBox += MARGE_ERR_FIVE + Number(target.getAttribute('stroke-width'));
      this.originXBox -= MARGE_ERR_THREE - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
      this.originYBox -= MARGE_ERR_THREE - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
    } else {
      this.widthBox = target.getBoundingClientRect().width + MARGE_ERR_FIVE + Number(target.getAttribute('stroke-width'));
      this.heightBox = target.getBoundingClientRect().height + MARGE_ERR_FIVE + Number(target.getAttribute('stroke-width'));
      this.originXBox = Number(target.getAttribute('x')) - MARGE_ERR_THREE -
        Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
      this.originYBox = Number(target.getAttribute('y')) - MARGE_ERR_THREE -
        Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
    }
  }
  setBoxSelectionForEllipse(target: Element, isTransformed: boolean): void {
    if (isTransformed) {
      this.getBBox(target as SVGSVGElement);
      this.widthBox += Number(target.getAttribute('stroke-width'));
      this.heightBox += Number(target.getAttribute('stroke-width'));
      this.originXBox -= Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
      this.originYBox -= Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
    } else {
      this.widthBox = target.getBoundingClientRect().width + Number(target.getAttribute('stroke-width'));
      this.heightBox = target.getBoundingClientRect().height + Number(target.getAttribute('stroke-width'));
      this.originXBox = Number(target.getAttribute('cx')) - Number(target.getAttribute('rx'))
        - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
      this.originYBox = Number(target.getAttribute('cy')) - Number(target.getAttribute('ry'))
        - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
    }
  }
  setBoxSelectionForPath(target: HTMLElement): void {
    this.widthBox = target.getBoundingClientRect().width + Number(target.getAttribute('stroke-width'));
    this.heightBox = target.getBoundingClientRect().height + Number(target.getAttribute('stroke-width'));
    this.originXBox = target.getBoundingClientRect().left - MARGE_ERR_BOX - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
    this.originYBox = target.getBoundingClientRect().top - PADDING_TOP - Number(target.getAttribute('stroke-width')) / HALF_WIDTH_HEIGHT;
  }
  onMouseMove(currentPosition: MousePosition) {
    this.width = Math.abs(currentPosition.x - this.originX);
    this.height = Math.abs(currentPosition.y - this.originY);
    this.originRectX = currentPosition.x < this.originX ? currentPosition.x : this.originX;
    this.originRectY = currentPosition.y < this.originY ? currentPosition.y : this.originY;
  }
  intersections(area: any, canvas: ElementRef): void {
    const count: number = canvas.nativeElement.children.length;
    for (let i = 0; i < count; i++) {
      const child = canvas.nativeElement.children[i];
      const childID = child.getAttribute('elementID');
      const selectionShape = this.selectionShapes.get(childID);
      const visible = child.getAttribute('stroke-opacity') === '1';
      let intersect = false;
      if (selectionShape) {
        intersect = this.intersection.intersection(area, selectionShape as Element);
        this.evaluateIntersection(childID, selectionShape, intersect, visible);
      }
    }
  }
  private evaluateIntersection(childID: any, selectionShape: HTMLElement, intersect: boolean, visible: boolean): void {
    if (this.rightCLickOnSelectedShape(+childID)) {
      this.rightIntersection(childID, selectionShape, intersect);
    } else if (!this.rightClickSelection.has(+childID)) {
      this.leftIntersection(childID, selectionShape, intersect, visible);
    }
  }

  private rightCLickOnSelectedShape(childID: number): boolean {
    return this.selectedShape.has(childID)
      && this.rightClick
      && !this.leftClickSelection.has(childID);
  }

  rightIntersection(childID: any, selectionShape: HTMLElement, intersect: boolean): void {
    if (intersect) {
      this.rightClickSelection.add(+childID);
      if (this.isControlPointsGroup) {
        this.removeFromGroup(childID);
      } else if (this.isControlPointsShape) {
        selectionShape.setAttributeNS(null, 'stroke-opacity', '0');
        this.selectedShape.delete(+childID);
        this.isControlPointsShape = false;
      }
    }
  }

  leftIntersection(childID: any, selectionShape: HTMLElement, intersect: boolean, visible: boolean): void {
    const visibility = intersect ? '1' : '0';
    if (intersect) {
      this.leftClickSelection.add(+childID);
      selectionShape.setAttributeNS(null, 'stroke-opacity', visibility);
    }
    if (intersect && !visible) {
      this.selectedShape.add(+childID);
    } else if (intersect && visible) {
      this.selectedShape.delete(+childID);
    }
  }
  drawGroupSelectionBox(): void {
    let minX = 9999;
    let maxX = 0;
    let minY = 9999;
    let maxY = 0;
    for (const item of this.selectedShape.values()) {
      const selectionShape = this.selectionShapes.get(item.toString());
      if (selectionShape) {
        const x = selectionShape.getAttribute('x');
        const y = selectionShape.getAttribute('y');
        const height = selectionShape.getAttribute('height');
        const width = selectionShape.getAttribute('width');
        if (x && width) {
          minX = +x < minX ? +x : minX;
          maxX = (+x + +width) > maxX ? (+x + +width) : maxX;
        }
        if (y && height) {
          minY = +y < minY ? +y : minY;
          maxY = (+y + +height) > maxY ? (+y + +height) : maxY;
        }
        this.handleOneObjectSelected(selectionShape);
      }
      this.setParamsOneObjectSelected(minX, maxX, maxY, minY);
      this.drawSelectionRectangleForMultipleSelection(minX, maxX, maxY, minY);
    }
  }
  private drawSelectionRectangleForMultipleSelection(minX: number, maxX: number, maxY: number, minY: number): void {
    if (this.selectedShape.size > 1) {
      this.isControlPointsShape = false;
      this.isControlPointsGroup = true;
      this.originXGroupBox = minX;
      this.widthGroupBox = maxX - minX;
      this.originYGroupBox = minY;
      this.heightGroupBox = maxY - minY;
    }
  }
  private handleOneObjectSelected(selectionShape: HTMLElement): void {
    if (this.selectedShape.size === 1) {
      this.transformSelection(selectionShape);
      selectionShape.setAttributeNS(null, 'stroke-opacity', '1');
    } else {
      selectionShape.setAttributeNS(null, 'stroke-opacity', '0');
      this.transform = '';
    }
  }
  private transformSelection(selectionShape: HTMLElement): void {
    this.transform = (selectionShape.getAttribute('transform') === null)
      ? ''
      : selectionShape.getAttribute('transform') as string;
  }

  private updateShapeSelectionRectangle(): boolean {
    return this.selectedShape.size === 1 || this.shiftEnabled;
  }

  private setParamsOneObjectSelected(minX: number, maxX: number, maxY: number, minY: number): void {
    if (this.updateShapeSelectionRectangle()) {
      this.isControlPointsGroup = false;
      this.isControlPointsShape = true;
      this.originXBox = minX;
      this.widthBox = maxX - minX;
      this.originYBox = minY;
      this.heightBox = maxY - minY;
      this.originXGroupBox = 0;
      this.originYGroupBox = 0;
      this.widthGroupBox = 0;
      this.heightGroupBox = 0;
    }
  }

  copySelection(shapes: Element[]): Element[] | undefined {
    let selected: Element[] | undefined;
    if (this.controlPointsVisible()) {
      const shapesSelected: Element[] = this.takeSelection(shapes);
      switch (shapesSelected.length) {
        case 0:
          break;
        case 1:
          this.paperweightService.copy(shapesSelected, this.originXBox, this.originYBox, this.widthBox, this.heightBox);
          selected = shapesSelected;
          break;
        default:
          this.paperweightService.copy(shapesSelected, this.originXGroupBox, this.originYGroupBox, this.widthGroupBox, this.heightGroupBox);
          selected = shapesSelected;
          break;
      }
      this.unselect();
    }
    return selected;
  }
  duplicateSelection(shapes: Element[]): boolean {
    let duplicate = false;
    if (this.controlPointsVisible()) {
      const shapesSelected: Element[] = this.takeSelection(shapes);
      if (shapesSelected.length > 0) {
        this.paperweightService.duplicate(shapesSelected);
        duplicate = true;
      }
    }
    this.unselect();
    return duplicate;
  }
  private controlPointsVisible(): boolean {
    return this.isControlPointsShape || this.isControlPointsGroup;
  }
  takeSelection(shapes: Element[]): Element[] {
    const shapesSelected: Element[] = new Array();
    for (const currentElement of shapes) {
      for (const currentID of this.selectedShape) {
        if (currentElement.getAttribute('elementID') === String(currentID)) {
          shapesSelected.push(currentElement);
        }
      }
    }
    return shapesSelected;
  }
  selectShapes(shapes: Element[]): void {
    this.unselect();
    for (const currentElement of shapes) {
      const currentID = currentElement.getAttribute('elementID');
      if (currentID !== null) {
        this.selectedShape.add(parseFloat(currentID));
      }
    }
    this.drawGroupSelectionBox();
  }
  deleteSelectionShape(currentElement: Element, svg: Element) {
    const selectionShape = this.selectionShapes.get((currentElement as Element).getAttribute('elementID') as string);
    svg.removeChild(selectionShape as Element);
    this.selectionShapes.delete((currentElement as Element).getAttribute('elementID') as string);
  }
  isCircleOfSelection(targetId: string | null): boolean {
    targetId = targetId === null ? ' ' : targetId;
    return targetId === 'LU' || targetId === 'RU' || targetId === 'LD' || targetId === 'RD' ||
      targetId === 'MU' || targetId === 'RM' || targetId === 'MD' || targetId === 'LM';
  }
  getBoxCaracteristics(): [number, number, number, number] {
    const dimension = new Array<number>();
    switch (this.selectedShape.size) {
      case 0:
        dimension.push(0);
        dimension.push(0);
        dimension.push(0);
        dimension.push(0);
        break;
      case 1:
        dimension.push(this.originXBox);
        dimension.push(this.originYBox);
        dimension.push(this.widthBox);
        dimension.push(this.heightBox);
        break;
      default:
        dimension.push(this.originXGroupBox);
        dimension.push(this.originYGroupBox);
        dimension.push(this.widthGroupBox);
        dimension.push(this.heightGroupBox);
        break;
    }
    return [dimension[0], dimension[1], dimension[2], dimension[3]];
  }

  isInSelectionBox(currentPosition: MousePosition): boolean {
    let isInSelectionBox = false;
    switch (this.selectedShape.size) {
      case 0:
        isInSelectionBox = false;
        break;
      case 1:
        if (this.originXBox <= currentPosition.x && currentPosition.x <= this.originXBox + this.widthBox) {
          if (this.originYBox <= currentPosition.y && currentPosition.y <= this.originYBox + this.heightBox) {
            isInSelectionBox = true;
          }
        }
        break;
      default:
        if (this.originXGroupBox <= currentPosition.x && currentPosition.x <= this.originXGroupBox + this.widthGroupBox) {
          if (this.originYGroupBox <= currentPosition.y && currentPosition.y <= this.originYGroupBox + this.heightGroupBox) {
            isInSelectionBox = true;
          }
        }
    }
    return isInSelectionBox;
  }
}
