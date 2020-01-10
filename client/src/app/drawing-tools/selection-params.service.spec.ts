// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule, MatDialogModule, MatExpansionModule,
  MatGridListModule, MatMenuModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBarModule
} from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GridComponent } from '../components/grid/grid.component';
import { NewDrawCreationComponent } from '../components/new-draw-creation/new-draw-creation.component';
import { AerosolComponent } from '../components/toolbar-view/aerosol/aerosol.component';
import { EllipseComponent } from '../components/toolbar-view/ellipse/ellipse.component';
import { EraserComponent } from '../components/toolbar-view/eraser/eraser.component';
import { FountainPenComponent } from '../components/toolbar-view/fountain-pen/fountain-pen.component';
import { LineComponent } from '../components/toolbar-view/line/line.component';
import { PaintBrushComponent } from '../components/toolbar-view/paint-brush/paint-brush.component';
import { PaintBucketComponent } from '../components/toolbar-view/paint-bucket/paint-bucket.component';
import { PenComponent } from '../components/toolbar-view/pen/pen.component';
import { PencilComponent } from '../components/toolbar-view/pencil/pencil.component';
import { PipetteComponent } from '../components/toolbar-view/pipette/pipette.component';
import { PolygonComponent } from '../components/toolbar-view/polygon/polygon.component';
import { RectangleComponent } from '../components/toolbar-view/rectangle/rectangle.component';
import { SelectComponent } from '../components/toolbar-view/select/select.component';
import { StampComponent } from '../components/toolbar-view/stamp/stamp.component';
import { TextComponent } from '../components/toolbar-view/text/text.component';
import { WelcomeModalComponent } from '../components/welcome-modal/welcome-modal.component';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from '../selection-manipulation/rotation-manipulation.service';
import { ColorToolService } from './color-tool.service';
import { IntersectionParamsService } from './intersection-params.service';
import { SelectionParamsService } from './selection-params.service';

describe('SelectionParamsService', () => {
  let fixture: ComponentFixture<DrawingViewComponent>;
  let service: SelectionParamsService;
  let renderer: Renderer2;
  let color: ColorToolService;
  let position: MousePosition;
  let selection: DrawingViewComponent;
  let intersection: IntersectionParamsService;
  let paper: PaperweightManipulationService;
  let rotation: RotationManipulationService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatExpansionModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatGridListModule,
        MatSliderModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
      ],
      declarations: [
        DrawingViewComponent,
        AerosolComponent,
        EllipseComponent,
        EraserComponent,
        FountainPenComponent,
        LineComponent,
        PaintBrushComponent,
        PaintBucketComponent,
        PenComponent,
        PencilComponent,
        PipetteComponent,
        PolygonComponent,
        RectangleComponent,
        SelectComponent,
        StampComponent,
        TextComponent,
        WelcomeModalComponent,
        GridComponent,
        NewDrawCreationComponent,
      ],
      providers: [WelcomeModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            WelcomeModalComponent,
            NewDrawCreationComponent,
          ],
        },
      })
      .compileComponents();
  }));
  beforeEach(() => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DrawingViewComponent);
    color = new ColorToolService();
    intersection = new IntersectionParamsService();
    rotation = new RotationManipulationService();
    paper = new PaperweightManipulationService();
    service = new SelectionParamsService(color, intersection, paper, rotation);
    selection = fixture.componentInstance;
    position = selection['currentPosition'];
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    fixture.detectChanges();
  });
  it('should set attributes', () => {
    service.setStyles();
    expect(service['stroke']).toEqual('black');
    expect(service['strokeDasharray']).toEqual('4 4');
    expect(service['strokeLinecap']).toEqual('round');
    expect(service['strokeWidth']).toEqual(1);
  });

  it('should call setStyles and startDrawing if the mouse is down', () => {
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyStart).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setStyles');
    service.onMouseDown(position);
    expect(spyStyle).toHaveBeenCalled();
  });
  it('should delete the rectangle if the mouse is up', () => {
    service.onMouseUp();
    expect(service['width']).toEqual(0);
    expect(service['height']).toEqual(0);
  });
  it('should start drawing', () => {
    position.x = 11;
    position.y = 15;
    service.startDrawing(position);
    expect(service['originX']).toEqual(position.x);
    expect(service['originY']).toEqual(position.y);
  });

  it('should return the conditionnal for right click', () => {
    service['rightClick'] = true;
    const verifiedCondition = service['rightCLickOnSelectedShape'](1);
    expect(verifiedCondition).toEqual(false);
  });

  it('should return the conditionnal for right click', () => {
    const spy = spyOn(service, 'leftIntersection');
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    service.select(event);
    service['evaluateIntersection'](rectangle, ellipseHTMLElement, true, false);
    expect(spy).toHaveBeenCalled();
  });

  it('should draw the selection rectangle', () => {
    service['originX'] = 9;
    service['originY'] = 10;
    position.x = 11;
    position.y = 15;
    service.draw(position);
    expect(service['width']).toEqual(Math.abs(2));
    expect(service['height']).toEqual(Math.abs(5));
  });

  it('should call select and unselect', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const spySelect = spyOn(service, 'select');
    const spyUnselect = spyOn(service, 'unselect');
    service.selectionClick(event);
    expect(spySelect).toHaveBeenCalled();
    expect(spyUnselect).toHaveBeenCalled();
  });

  it('should call the rectangle selection box for rectangles', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const rectangleHTML: Element = document.createElementNS(svgNS, 'rect');
    rectangleHTML.setAttribute('id', 'ellipse');
    rectangleHTML.setAttribute('stroke', '#ffffffff');
    rectangleHTML.setAttribute('fill', '#000000ff');
    rectangleHTML.setAttribute('stroke-width', '5');
    rectangleHTML.setAttribute('rx', '30');
    rectangleHTML.setAttribute('ry', '45');
    rectangleHTML.setAttribute('cx', '63');
    rectangleHTML.setAttribute('cy', '18');
    rectangleHTML.setAttributeNS(null, 'elementID', '1');
    rectangleHTML.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(rectangleHTML);
    const spy = spyOn<any>(service, 'setBoxSelectionForRect');
    const spy2 = spyOn<any>(service, 'appendSelectionRectangle');
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should call the rectangle selection box for pens having as svg code path', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const pathElement: Element = document.createElementNS(svgNS, 'path');
    pathElement.setAttribute('id', 'ellipse');
    pathElement.setAttribute('stroke', '#ffffffff');
    pathElement.setAttribute('fill', '#000000ff');
    pathElement.setAttribute('stroke-width', '5');
    pathElement.setAttribute('rx', '30');
    pathElement.setAttribute('ry', '45');
    pathElement.setAttribute('cx', '63');
    pathElement.setAttribute('cy', '18');
    pathElement.setAttributeNS(null, 'elementID', '1');
    pathElement.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(pathElement);
    const spy = spyOn<any>(service, 'setBoxSelectionForPath');
    const spy2 = spyOn<any>(service, 'appendSelectionRectangle');
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should call the rectangle selection box for ellipse', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: Element = document.createElementNS(svgNS, 'ellipse');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    ellipseHTMLElement.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(ellipseHTMLElement);
    const spy = spyOn<any>(service, 'setBoxSelectionForEllipse');
    const spy2 = spyOn<any>(service, 'appendSelectionRectangle');
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should call the rectangle selection box for polygon', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: Element = document.createElementNS(svgNS, 'polygon');
    ellipseHTMLElement.setAttribute('id', 'polygon');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    const spy = spyOn<any>(service, 'setBoxSelectionForPolygon');
    const spy2 = spyOn<any>(service, 'appendSelectionRectangle');
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    const canvas = selection.svg;
    service.addSelectionRect(selectionElement, canvas);
    expect(spy).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
  });
  it('should add the selected object to selectedShapes', async(() => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    service.select(event);
    expect(service['selectedShape'].has(1)).toEqual(true);
  }));
  it('should set the visibility of the selected object`s selection rectangle to visible', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    service.rightSelect(event);
    const selectedShape = service['selectionShapes'].get('1');
    expect((selectedShape as HTMLElement).getAttribute('stroke-opacity')).toEqual('1');
  });
  it('should set the visibility of the selected object`s selection rectangle to hidden', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'stroke-opacity', '1');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.setAttributeNS(null, 'stroke-opacity', '1');
    rectangle.dispatchEvent(event);
    service.rightSelect(event);
    const selectedShape = service['selectionShapes'].get('1');
    expect((selectedShape as HTMLElement).getAttribute('stroke-opacity')).toEqual('0');
  });
  it('should add the ID of the selected shape if its selection rectangle wasnt visible before the click', () => {
    const element = '3';
    const wasVisible = false;
    service['handleSelectedShape'](element, wasVisible);
    expect(service['selectedShape'].has(3)).toEqual(true);
  });
  it('should remove the ID of the selected shape if its selection rectangle was visible before the click', () => {
    const element = '3';
    const wasVisible = true;
    service['handleSelectedShape'](element, wasVisible);
    expect(service['selectedShape'].has(3)).toEqual(false);
  });
  it('should unselect the object by removing it from the set selectedShape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    service.unselect();
    expect(service['selectedShape'].has(1)).toEqual(false);
  });

  it('should call the left intersection function the object by removing it from the set selectedShape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    const childID = 1;
    const selectedShape = service['selectionShapes'].get('1');
    const intersect = true;
    const visible = true;
    service['leftIntersection'](childID, selectedShape as HTMLElement, intersect, visible);
    expect(service['selectedShape'].has(1)).toEqual(false);
  });

  it('should call copy of the paperweigthService', () => {
    const spyStart = spyOn(service['paperweightService'], 'copy');
    service['isControlPointsShape'] = true;
    const svgNS = 'http://www.w3.org/2000/svg';
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('elementID', '1');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttribute('elementID', '2');
    service['selectedShape'].add(1);
    const shapeArray: Element[] = new Array();
    shapeArray.push(rect);
    shapeArray.push(ellipse);
    service.copySelection(shapeArray);
    expect(spyStart).toHaveBeenCalled();
  });

  it('should return undefined', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    service['isControlPointsShape'] = true;

    const copy = service.copySelection(selection['shapes']);
    expect((copy as Element[]).length).toEqual(1);
  });

  it('should return shapes selected array', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['selectedShape'].add(1);
    const rectangle2 = renderer.createElement('rect', svgNS);
    rectangle2.setAttributeNS(null, 'fill', '#00000000');
    rectangle2.setAttributeNS(null, 'elementID', '2');
    service['selectedShape'].add(2);
    selection['shapes'].push(rectangle);
    selection['shapes'].push(rectangle2);
    service['isControlPointsGroup'] = true;
    const copy = service.copySelection(selection['shapes']);
    expect((copy as Element[]).length).toBeGreaterThan(1);
  });

  it('should return undefined because nothing is selected', () => {
    service['isControlPointsShape'] = false;
    service['isControlPointsGroup'] = false;
    const copy = service.copySelection(selection['shapes']);
    expect(copy).toEqual(undefined);
  });

  it('should remove child from group selection', () => {
    const spy = spyOn(service, 'drawGroupSelectionBox');
    const svgNS = 'http://www.w3.org/2000/svg';
    service['isControlPointsGroup'] = true;
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '2');
    service.rightIntersection('2', rectangle, true);
    expect(service['selectedShape'].has(2)).toEqual(false);
    expect(spy).toHaveBeenCalled();
  });

  it('should return undefined if length is 0', () => {
    service['isControlPointsShape'] = true;
    service['isControlPointsGroup'] = false;
    const copy = service.copySelection(selection['shapes']);
    expect(copy).toEqual(undefined);
  });

  it('should return true and call duplicate of paperweight', () => {
    const spyStart = spyOn(service['paperweightService'], 'duplicate');
    service['isControlPointsShape'] = false;
    service['isControlPointsGroup'] = true;
    const svgNS = 'http://www.w3.org/2000/svg';
    const rect = document.createElementNS(svgNS, 'rect');
    rect.setAttribute('elementID', '1');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttribute('elementID', '2');
    service['selectedShape'].add(1);
    service['selectedShape'].add(2);
    const shapeArray: Element[] = new Array();
    shapeArray.push(rect);
    shapeArray.push(ellipse);
    expect(service.duplicateSelection(shapeArray)).toEqual(true);
    expect(spyStart).toHaveBeenCalled();
  });
  it('should create the selection box for path', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const pathElement: Element = document.createElementNS(svgNS, 'path');
    pathElement.setAttribute('id', 'ellipse');
    pathElement.setAttribute('stroke', '#ffffffff');
    pathElement.setAttribute('fill', '#000000ff');
    pathElement.setAttribute('stroke-width', '5');
    pathElement.setAttribute('rx', '30');
    pathElement.setAttribute('ry', '45');
    pathElement.setAttribute('cx', '63');
    pathElement.setAttribute('cy', '18');
    pathElement.setAttributeNS(null, 'elementID', '1');
    pathElement.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(pathElement);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service['heightBox'] = 0;
    service['widthBox'] = 0;

    service.addSelectionRect(selectionElement, selection.svg);
    expect(service['heightBox']).not.toEqual(0);
    expect(service['widthBox']).not.toEqual(0);
    expect(service['originXBox']).not.toEqual(0);
    expect(service['originYBox']).not.toEqual(0);
  });

  it('should create the selection box for rectangle', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const rectangleHTML: Element = document.createElementNS(svgNS, 'rect');
    rectangleHTML.setAttribute('id', 'ellipse');
    rectangleHTML.setAttribute('stroke', '#ffffffff');
    rectangleHTML.setAttribute('fill', '#000000ff');
    rectangleHTML.setAttribute('stroke-width', '5');
    rectangleHTML.setAttribute('rx', '30');
    rectangleHTML.setAttribute('ry', '45');
    rectangleHTML.setAttribute('cx', '63');
    rectangleHTML.setAttribute('cy', '18');
    rectangleHTML.setAttributeNS(null, 'elementID', '1');
    rectangleHTML.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(rectangleHTML);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);

    expect(service['heightBox']).not.toEqual(0);
    expect(service['widthBox']).not.toEqual(0);
    expect(service['originXBox']).not.toEqual(0);
    expect(service['originYBox']).not.toEqual(0);
  });

  it('should create the selection box for ellipse', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: Element = document.createElementNS(svgNS, 'ellipse');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    ellipseHTMLElement.setAttributeNS(null, 'transform', 'Translate(20, 19, 18)');
    selection.svg.nativeElement.appendChild(ellipseHTMLElement);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);

    expect(service['heightBox']).not.toEqual(0);
    expect(service['widthBox']).not.toEqual(0);
    expect(service['originXBox']).not.toEqual(0);
    expect(service['originYBox']).not.toEqual(0);
  });

  it('should create the selection box for polygon', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'polygon');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);

    expect(service['heightBox']).not.toEqual(0);
    expect(service['widthBox']).not.toEqual(0);
    expect(service['originXBox']).not.toEqual(0);
    expect(service['originYBox']).not.toEqual(0);
  });

  it('should create the selection box for image', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const event: MouseEvent = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'image');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectionShapes'].set('1', ellipseHTMLElement);
    rectangle.dispatchEvent(event);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);

    expect(service['heightBox']).not.toEqual(0);
    expect(service['widthBox']).not.toEqual(0);
    expect(service['originXBox']).not.toEqual(0);
    expect(service['originYBox']).not.toEqual(0);
  });

  it('should return true if there is a shape selected', () => {
    service['isControlPointsGroup'] = true;
    service['isControlPointsShape'] = false;
    expect(service['controlPointsVisible']).toBeTruthy();
  });

  it('should return false if nothing is selected', () => {
    service['isControlPointsGroup'] = false;
    service['isControlPointsShape'] = false;
    const bool = service['controlPointsVisible']();
    expect(bool).toEqual(false);
  });

  it('should select shapes', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection['shapes'].push(rectangle);
    service.selectShapes(selection['shapes']);
    expect(service['selectedShape'].has(1)).toEqual(true);
  });

  it('should take selection and store it in shapesSelected', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    const shapesSelected = service.takeSelection(selection['shapes']);
    expect(shapesSelected.length).toBeGreaterThan(0);
  });

  it('should return true if the control points of selected items are visible', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['isControlPointsGroup'] = true;
    service['isControlPointsShape'] = true;
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    const duplicate = service.duplicateSelection(selection['shapes']);
    expect(duplicate).toEqual(true);
  });

  it('should return true and call unselect', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    service['isControlPointsGroup'] = true;
    service['isControlPointsShape'] = true;
    const unselect = spyOn(service, 'unselect');
    const paperSpy = spyOn(paper, 'duplicate');

    const duplicate = service.duplicateSelection(selection['shapes']);

    expect(unselect).toHaveBeenCalled();
    expect(paperSpy).toHaveBeenCalled();

    expect(duplicate).toEqual(true);
  });

  it('should return false and call unselect', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['isControlPointsGroup'] = false;
    service['isControlPointsShape'] = false;
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    service.duplicateSelection(selection['shapes']);
    const unselect = spyOn(service, 'unselect');
    const duplicate = service.duplicateSelection(selection['shapes']);
    expect(unselect).toHaveBeenCalled();
    expect(duplicate).toEqual(false);
  });

  it('should call delete selection shape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: Element = document.createElementNS(svgNS, 'ellipse');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');

    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(ellipseHTMLElement);
    service.addSelectionRect(rectangle, selection.svg);
    service.deleteSelectionShape(ellipseHTMLElement, selection.svg.nativeElement);
    expect(service['selectionShapes'].has('1')).toEqual(false);
  });

  it('should reset selection params', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectedShape'].add(rectangle);
    service['setParamsOneObjectSelected'](0, 1, 1, 0);
    expect(service['isControlPointsGroup']).toEqual(false);
    expect(service['isControlPointsShape']).toEqual(true);
    expect(service['originXBox']).toEqual(0);
    expect(service['widthBox']).toEqual(1);
    expect(service['originYBox']).toEqual(0);
    expect(service['heightBox']).toEqual(1);
    expect(service['originXGroupBox']).toEqual(0);
    expect(service['originYGroupBox']).toEqual(0);
    expect(service['widthGroupBox']).toEqual(0);
    expect(service['heightGroupBox']).toEqual(0);
  });

  it('should copy selection for one objeect', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    service['selectedShape'].add(1);
    selection['shapes'].push(rectangle);
    service['isControlPointsShape'] = true;
    const spyUnselect = spyOn(service, 'unselect');
    const spy = spyOn(service['paperweightService'], 'copy');
    service.copySelection(selection['shapes']);
    expect(spyUnselect).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('should set allSelectionEvents to hidden', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'image');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(ellipseHTMLElement);
    service.addSelectionRect(rectangle, selection.svg);
    rectangle.setAttributeNS(null, 'pointer-events', 'none');
    service['selectionShapes'].set('1', rectangle);
    service.setAllSelectionEvents('visible');
    expect(rectangle.getAttribute('pointer-events')).toEqual('visible');
  });

  it('should transform selected object', () => {
    const spy = spyOn<any>(service, 'transformSelection');
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'elementID', '1');
    const ellipseHTMLElement: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('stroke', '#ffffffff');
    ellipseHTMLElement.setAttribute('fill', '#000000ff');
    ellipseHTMLElement.setAttribute('stroke-width', '5');
    ellipseHTMLElement.setAttribute('rx', '30');
    ellipseHTMLElement.setAttribute('ry', '45');
    ellipseHTMLElement.setAttribute('cx', '63');
    ellipseHTMLElement.setAttribute('cy', '18');
    ellipseHTMLElement.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectedShape'].add(1);

    service['handleOneObjectSelected'](ellipseHTMLElement);
    expect(spy).toHaveBeenCalled();
  });

  it('should transform selected object', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    service['selectedShape'].add(1);

    const rectangle2 = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '2');
    selection.svg.nativeElement.appendChild(rectangle2);
    service['selectedShape'].add(2);

    service['handleOneObjectSelected'](rectangle);
    expect(service['transform']).toEqual('');
  });

  it('should execute left intersection with intersection and already visible', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '2');
    service.leftIntersection('2', rectangle, true, true);
    expect(service['leftClickSelection'].has(2)).toEqual(true);
  });

  it('should execute left intersection with intersection and not visible', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '2');
    service.leftIntersection('2', rectangle, true, false);
    expect(service['leftClickSelection'].has(2)).toEqual(true);
    expect(service['selectedShape'].has(2)).toEqual(true);
  });

  it('should execute right intersection with group', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    service['isControlPointsGroup'] = true;
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '2');
    service.rightIntersection('2', rectangle, true);
    expect(service['selectedShape'].has(2)).toEqual(false);
  });

  // it('should rotate element', () => {
  //   const svgNS = 'http://www.w3.org/2000/svg';
  //   const rectangle = renderer.createElement('rect', svgNS);
  //   rectangle.setAttributeNS(null, 'fill', '#00000000');
  //   rectangle.setAttributeNS(null, 'elementID', '1');
  //   selection.svg.nativeElement.appendChild(rectangle);
  //   const selectionElement: Element = renderer.createElement(
  //     'rect',
  //     svgNS,
  //   );
  //   service.addSelectionRect(selectionElement, selection.svg);
  //   service['selectedShape'].add(1);
  //   service['originXBox'] = 2;
  //   service['originYBox'] = 2;
  //   service['widthBox'] = 4;
  //   service['heightBox'] = 4;
  //   service.rotateShape(1, 15, 0);
  //   expect(rectangle.getAttribute('transform')).toEqual(service['rotation'].getNewRotation());
  // });

  it('should execute rotateSeperately of rotate', () => {
    service['shiftEnabled'] = true;
    const spy = spyOn<any>(service, 'rotateSeperately');
    service.rotate(15);
    expect(spy).toHaveBeenCalled();
  });

  it('should enable shift', () => {
    service.enableShift();
    expect(service['shiftEnabled']).toEqual(true);
  });

  it('should disable shift', () => {
    service.disableShift();
    expect(service['shiftEnabled']).toEqual(false);
  });

  // it('should rotate group of elements', () => {
  //   const svgNS = 'http://www.w3.org/2000/svg';
  //   const rectangle = renderer.createElement('rect', svgNS);
  //   rectangle.setAttributeNS(null, 'fill', '#00000000');
  //   rectangle.setAttributeNS(null, 'elementID', '1');
  //   selection.svg.nativeElement.appendChild(rectangle);
  //   const selectionElement: Element = renderer.createElement(
  //     'rect',
  //     svgNS,
  //   );
  //   service.addSelectionRect(selectionElement, selection.svg);
  //   const ellipse = renderer.createElement('ellipse', svgNS);
  //   ellipse.setAttributeNS(null, 'fill', '#00000000');
  //   ellipse.setAttributeNS(null, 'elementID', '2');
  //   selection.svg.nativeElement.appendChild(ellipse);
  //   const selectionElement2: Element = renderer.createElement(
  //     'rect',
  //     svgNS,
  //   );
  //   service.addSelectionRect(selectionElement2, selection.svg);
  //   service['selectedShape'].add(1);
  //   service['selectedShape'].add(2);
  //   service['isControlPointsGroup'] = true;
  //   service['originXGroupBox'] = 2;
  //   service['originYGroupBox'] = 2;
  //   service['widthGroupBox'] = 4;
  //   service['heightGroupBox'] = 4;
  //   service.rotateGroup(15, 0);
  //   expect(rectangle.getAttribute('transform')).toEqual(service['rotation'].getNewRotation());
  //   expect(ellipse.getAttribute('transform')).toEqual(service['rotation'].getNewRotation());
  // });

  it('should test if the mouse position is in the selection box of a shape', () => {
    const pos: MousePosition = selection['currentPosition'];
    pos.x = 10;
    pos.y = 15;
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    service['originXBox'] = 2;
    service['originYBox'] = 2;
    service['widthBox'] = 16;
    service['heightBox'] = 16;
    const isInSelectionBox = service['isInSelectionBox'](pos);
    expect(isInSelectionBox).toEqual(true);
  });

  it('should test if the mouse position is in the selection box of a group', () => {
    const pos: MousePosition = selection['currentPosition'];
    pos.x = 10;
    pos.y = 15;
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    const ellipse = renderer.createElement('ellipse', svgNS);
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    ellipse.setAttributeNS(null, 'elementID', '2');
    const selectionEllipse: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionEllipse, selection.svg);
    service['selectedShape'].add(1);
    service['selectedShape'].add(2);
    service['originXGroupBox'] = 2;
    service['originYGroupBox'] = 2;
    service['widthGroupBox'] = 16;
    service['heightGroupBox'] = 16;
    const isInSelectionBox = service['isInSelectionBox'](pos);
    expect(isInSelectionBox).toEqual(true);
  });

  it('should test if the mouse position is not inside the selection box', () => {
    const pos: MousePosition = selection['currentPosition'];
    pos.x = 10;
    pos.y = 15;
    const isInSelectionBox = service['isInSelectionBox'](pos);
    expect(isInSelectionBox).toEqual(false);
  });

  it('should return array of the selectionBox parameters when one shape is selected', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    service['originXBox'] = 2;
    service['originYBox'] = 2;
    service['widthBox'] = 16;
    service['heightBox'] = 16;
    const boxParams = service.getBoxCaracteristics();
    expect(boxParams[0]).toEqual(service['originXBox']);
    expect(boxParams[1]).toEqual(service['originYBox']);
    expect(boxParams[2]).toEqual(service['widthBox']);
    expect(boxParams[3]).toEqual(service['heightBox']);
  });

  it('should return array of the selectionBox parameters when a group of shapes is selected', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    const ellipse = renderer.createElement('ellipse', svgNS);
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    ellipse.setAttributeNS(null, 'elementID', '2');
    selection.svg.nativeElement.appendChild(ellipse);
    const selectionEllipse: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionEllipse, selection.svg);
    service['selectedShape'].add(1);
    service['selectedShape'].add(2);
    service['originXGroupBox'] = 2;
    service['originYGroupBox'] = 2;
    service['widthGroupBox'] = 16;
    service['heightGroupBox'] = 16;
    const boxParams = service.getBoxCaracteristics();
    expect(boxParams[0]).toEqual(service['originXGroupBox']);
    expect(boxParams[1]).toEqual(service['originYGroupBox']);
    expect(boxParams[2]).toEqual(service['widthGroupBox']);
    expect(boxParams[3]).toEqual(service['heightGroupBox']);
  });

  it('should return array of null when no shape is selected', () => {
    const boxParams = service.getBoxCaracteristics();
    expect(boxParams[0]).toEqual(0);
    expect(boxParams[1]).toEqual(0);
    expect(boxParams[2]).toEqual(0);
    expect(boxParams[3]).toEqual(0);
  });

  it('should return true when we click on a selection circle', () => {
    const isClicked = service.isCircleOfSelection('LU');
    expect(isClicked).toEqual(true);
  });

  it('should return false when we click on a null', () => {
    const isClicked = service.isCircleOfSelection(null);
    expect(isClicked).toEqual(false);
  });

  it(' draw selection box for one shape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'x', '10');
    rectangle.setAttributeNS(null, 'y', '10');
    rectangle.setAttributeNS(null, 'width', '25');
    rectangle.setAttributeNS(null, 'height', '15');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    service.drawGroupSelectionBox();
    expect(selectionElement.getAttribute('stroke-opacity')).toEqual('1');
    expect(service['isControlPointsShape']).toEqual(true);
    expect(service['originXBox']).toEqual(+(selectionElement.getAttribute('x') as string));
    expect(service['originYBox']).toEqual(+(selectionElement.getAttribute('y') as string));
    expect(service['widthBox']).toEqual(+(selectionElement.getAttribute('width') as string));
    expect(service['heightBox']).toEqual(+(selectionElement.getAttribute('height') as string));
  });

  it(' draw selection box for group of shapes', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'x', '10');
    rectangle.setAttributeNS(null, 'y', '10');
    rectangle.setAttributeNS(null, 'width', '25');
    rectangle.setAttributeNS(null, 'height', '15');
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    const rectangle1 = renderer.createElement('rect', svgNS);
    rectangle1.setAttributeNS(null, 'x', '10');
    rectangle1.setAttributeNS(null, 'y', '10');
    rectangle1.setAttributeNS(null, 'width', '25');
    rectangle1.setAttributeNS(null, 'height', '15');
    rectangle1.setAttributeNS(null, 'elementID', '2');
    selection.svg.nativeElement.appendChild(rectangle1);
    const selectionElement1: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement1, selection.svg);
    service['selectedShape'].add(2);
    service.drawGroupSelectionBox();
    expect(selectionElement1.getAttribute('stroke-opacity')).toEqual('0');
    expect(selectionElement.getAttribute('stroke-opacity')).toEqual('0');
    expect(service['isControlPointsGroup']).toEqual(true);
    expect(service['originXGroupBox']).toEqual(+(selectionElement1.getAttribute('x') as string));
    expect(service['originYGroupBox']).toEqual(+(selectionElement1.getAttribute('y') as string));
    expect(service['widthGroupBox']).toEqual(+(selectionElement1.getAttribute('width') as string));
    expect(service['heightGroupBox']).toEqual(+(selectionElement1.getAttribute('height') as string));
  });

  it('should test right intersection', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'elementID', '1');
    selection.svg.nativeElement.appendChild(rectangle);
    const selectionElement: Element = renderer.createElement(
      'rect',
      svgNS,
    );
    service.addSelectionRect(selectionElement, selection.svg);
    service['selectedShape'].add(1);
    service['isControlPointsShape'] = true;
    service['rightIntersection'](1, selectionElement as HTMLElement, true);
    expect(service['selectedShape'].size).toEqual(0);
    expect(service['isControlPointsShape']).toEqual(false);
  });

});
