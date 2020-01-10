// tslint:disable: no-string-literal
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialogModule, MatGridListModule, MatRadioModule,
        MatSelectModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatMenuModule} from '@angular/material/menu';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { BackgroundColorCommand } from 'src/app/commandes/background-color-command.service';
import { ColorAppCommand } from 'src/app/commandes/color-app-command.service';
import { CreateElementCommandService } from 'src/app/commandes/create-element-command.service';
import { AerosolService } from 'src/app/drawing-tools/aerosol.service';
import { EllipseService } from 'src/app/drawing-tools/ellipse.service';
import { EraserParamsService } from 'src/app/drawing-tools/eraser-params.service';
import { FountainPenParamsService } from 'src/app/drawing-tools/fountain-pen-params.service';
import { IntersectionParamsService } from 'src/app/drawing-tools/intersection-params.service';
import { PenParamsService } from 'src/app/drawing-tools/pen-params.service';
import { PolylineParamsService } from 'src/app/drawing-tools/polyline-params.service';
import { RectParamsService } from 'src/app/drawing-tools/rect-params.service';
import { SelectionParamsService } from 'src/app/drawing-tools/selection-params.service';
import { TextParamsService } from 'src/app/drawing-tools/text-params.service';
import { VelocityParamsService } from 'src/app/drawing-tools/velocity-params.service';
import { PaperweightManipulationService } from 'src/app/selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from 'src/app/selection-manipulation/rotation-manipulation.service';
import { ColorToolService } from '../../drawing-tools/color-tool.service';
import { GridComponent } from '../grid/grid.component';
import { NewDrawCreationComponent } from '../new-draw-creation/new-draw-creation.component';
import { AerosolComponent } from '../toolbar-view/aerosol/aerosol.component';
import { EllipseComponent } from '../toolbar-view/ellipse/ellipse.component';
import { EraserComponent } from '../toolbar-view/eraser/eraser.component';
import { FountainPenComponent } from '../toolbar-view/fountain-pen/fountain-pen.component';
import { LineComponent } from '../toolbar-view/line/line.component';
import { PaintBrushComponent } from '../toolbar-view/paint-brush/paint-brush.component';
import { PaintBucketComponent } from '../toolbar-view/paint-bucket/paint-bucket.component';
import { PenComponent } from '../toolbar-view/pen/pen.component';
import { PencilComponent } from '../toolbar-view/pencil/pencil.component';
import { PipetteComponent } from '../toolbar-view/pipette/pipette.component';
import { PolygonComponent } from '../toolbar-view/polygon/polygon.component';
import { RectangleComponent } from '../toolbar-view/rectangle/rectangle.component';
import { SelectComponent } from '../toolbar-view/select/select.component';
import { StampComponent } from '../toolbar-view/stamp/stamp.component';
import { TextComponent } from '../toolbar-view/text/text.component';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';
import { DrawingViewComponent } from './drawing-view.component';

describe('DrawingViewComponent', () => {
  let component: DrawingViewComponent;
  let fixture: ComponentFixture<DrawingViewComponent>;
  let renderer: Renderer2;
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
      providers : [WelcomeModalComponent],
      schemas : [CUSTOM_ELEMENTS_SCHEMA],
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [
      WelcomeModalComponent,
      NewDrawCreationComponent,
    ] } })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get mouse position', async () => {
    const event = new MouseEvent(
      'mousemove',
      {clientX: 60, clientY: 60} as MouseEventInit,
    );
    component.getMousePosition(event);
    fixture.whenRenderingDone().then();
    const pt = component.svg.nativeElement.createSVGPoint();
    pt.x = 60;
    pt.y = 60;
    expect(component['currentPosition'].x).toEqual(pt.matrixTransform(component.svg.nativeElement.getScreenCTM().inverse()).x);
    expect(component['currentPosition'].y).toEqual(pt.matrixTransform(component.svg.nativeElement.getScreenCTM().inverse()).y);
  });

  it('the code should have the name of the tool being used', () => {
    const color = new ColorToolService();
    component['tool'] = new RectParamsService(color);
    spyOn(RectParamsService.prototype, 'setheight');
    component.select('rectangle');
    expect(RectParamsService.prototype.setheight).toHaveBeenCalled();
    expect(component['drawingToolUsed']).toEqual('rectangle');
  });

  it('should fix the pen speed', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'pen';
    component.setDrawing(true);
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    component['tool'] = (new PenParamsService(color, velocity));
    const spyMathPow = spyOn(Math, 'pow');
    component.fixPenSpeed(event);
    expect(spyMathPow).toHaveBeenCalled();
    const spyMathSqrt = spyOn(Math, 'sqrt');
    component.fixPenSpeed(event);
    expect(spyMathSqrt).toHaveBeenCalled();
    expect(component['lastEventTime']).toEqual(event.timeStamp);
    const service = component['velocity'];
    const spyVelocity = spyOn(service, 'setVelocity');
    component.fixPenSpeed(event);
    expect(spyVelocity).toHaveBeenCalled();
  });

  it('should set attributes for the eraser ', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'eraser';
    component.setDrawing(true);
    const color = new ColorToolService();
    const paper = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const intersection = new IntersectionParamsService();
    const selection = new SelectionParamsService(color, intersection, paper, rotation);
    component['tool'] = (new EraserParamsService(intersection, selection));
    const spy = spyOn(component['tool'], 'onMouseMove');
    component.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
    const service = component['useEraser'];
    const spyEraser = spyOn(service, 'findIntersections');
    component.findEraserIntersections();
    expect(spyEraser).toHaveBeenCalled();
  });

  it('should set attributes for the selection tool ', () => {
    const service = component['selection'];
    const spySelection = spyOn(service, 'intersections');
    component.findSelectionIntersections();
    expect(spySelection).toHaveBeenCalled();
  });

  it('the code should call pipette', () => {
    spyOn(component, 'activatePipette');
    component.select('pipette');
    expect(component.activatePipette).toHaveBeenCalled();
    expect(component['drawingToolUsed']).toEqual('');
  });

  it('should select rectangle with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('1', {key: '1'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('rectangle');
  });

  it('should select fountain pen with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('p', {key: 'p'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('fountainPen');
  });

  it('should select pen with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('y', {key: 'y'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('pen');
  });

  it('should select pencil with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('C', {key: 'C'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('pencil');
  });

  it('should select polygon with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('3', {key: '3'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('polygon');
  });

  it('should select polygon with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('2', {key: '2'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('ellipse');
  });

  it('should select paintBrush with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('W', {key: 'W'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('paintBrush');
  });

  it('should select line with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('L', {key: 'L'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('line');
  });

  it('should select color Applicator with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('R', {key: 'R'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('');
  });

  it('should select text with keybord shortcut', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('T', {key: 'T'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('text');
  });

  it('should set back the orientation angle of the stamp 15 degrees with keybord shortcut Alt', () => {
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('Alt', {key: 'Alt'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(component['drawingToolUsed']).toEqual('');
  });

  it('should select verify Creation with keybord shortcut', () => {
    component['insertText'].isDone = true;
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'verifyCreation');
    const event = new KeyboardEvent('ctrl.o', { key: 'ctrl.o' });
    component.shortCutNewDraw(event);
    expect(component['drawingToolUsed']).toEqual('');
    expect(spy).toHaveBeenCalled();
  });

  it('should select verify Saving with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'verifySaving');
    const event = new KeyboardEvent('ctrl.s', { key: 'ctrl.s' });
    component.shortCutSaving(event);
    expect(component['drawingToolUsed']).toEqual('');
    expect(spy).toHaveBeenCalled();
  });

  it('should select verify Opening with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'verifyOpening');
    const event = new KeyboardEvent('ctrl.g', { key: 'ctrl.g' });
    component.shortCutOpen(event);
    expect(component['drawingToolUsed']).toEqual('');
    expect(spy).toHaveBeenCalled();
  });

  it('should set draw values', () => {
    component.setDrawValues('20', '40', 'RGBA(255,255,255,1)');
    expect(component['heightDraw']).toEqual('20');
    expect(component['widthDraw']).toEqual('40');
    expect(component['fillColor']).toEqual('RGBA(255,255,255,1)');
  });

  it('should have the name of the tool being used', () => {
    component.select('pencil');
    expect(component['drawingToolUsed']).toEqual('pencil');
  });

  it('should set the isDrawing to false because no paramters have been chosen', () => {
    const event = new MouseEvent('mousedown', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    const color = new ColorToolService();
    component['tool'] = (new RectParamsService(color));
    component.onMouseDown(event);
    expect(component.getDrawing()).toBeFalsy();
  });

  it('should set the isDrawing to true', () => {
    const event = new MouseEvent('mousedown', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'rectangle';
    const color = new ColorToolService();
    component['tool'] = (new RectParamsService(color));
    component['tool'].setReady = true;
    component.onMouseDown(event);
    expect(component.getDrawing()).toBeTruthy();
  });

  it('should set the isDrawing to false', () => {
    component.setDrawing(true);
    const event = new MouseEvent('mouseup', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'rectangle';
    const color = new ColorToolService();
    const rect = component['tool'] = (new RectParamsService(color));
    rect['isReady'] = true;
    component.onMouseUp(event);
    expect(component.getDrawing()).toBeFalsy();
  });

  it('should detect double click for the polyline', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const path = renderer.createElement('path', svgNS);
    const color = new ColorToolService();
    const service = new PolylineParamsService(color);
    component['tool'] = (service);
    service['strokeWidth'] = 5;
    service.setStyles();
    service.submitElement(path, 'path');
    const event = new MouseEvent('mouseup', {} as MouseEventInit);
    service['click'] = 2;
    service['svgCode'] = 'path';
    component.onMouseUp(event);
    expect(service['isLastSegment']).toBeFalsy();
  });

  it('should call the onMouseMove of the tool', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'rectangle';
    component.setDrawing(true);
    const color = new ColorToolService();
    component['tool'] = (new RectParamsService(color));
    const spy = spyOn(component['tool'], 'onMouseMove');
    component.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the onMouseMove of line', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'line';
    component.setDrawing(true);
    const color = new ColorToolService();
    component['tool'] = (new RectParamsService(color));
    const spy = spyOn(component['tool'], 'onMouseMove');
    component.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the onMouseMove when we draw with a pen', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'pen';
    component.setDrawing(true);
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    component['tool'] = (new PenParamsService(color, velocity));
    const spy = spyOn(component['tool'], 'onMouseMove');
    component.onMouseMove(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the onMouseUp when we draw with a pen', () => {
    const event = new MouseEvent('mousemove', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'pen';
    component.setDrawing(true);
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    component['tool'] = (new PenParamsService(color, velocity));
    const spy = spyOn(component['tool'], 'onMouseUp');
    component.onMouseUp(event);
    expect(spy).toHaveBeenCalled();
    expect(component['isSaved']).toBeFalsy();
    expect(component['isDrawing']).toBeFalsy();
    expect(component['drawLine'].isLastSegment).toBeFalsy();
    expect(component['insertText'].isDone).toBeFalsy();
  });

  it('should call getPrimaryColor of the color tool service for a rectangle', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    component.svg.nativeElement.appendChild(rectangle);
    rectangle.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'getPrimaryColor');
    component['isPipetteUsed'] = false;
    component['iscolorApplicatorUsed'] = true;
    component.onLeftClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getPrimaryColor of the color tool service for a pen', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const path = renderer.createElement('path', svgNS);
    path.setAttributeNS(null, 'stroke', '#00000000');
    component.svg.nativeElement.appendChild(path);
    path.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'getPrimaryColor');
    component['isPipetteUsed'] = false;
    component['iscolorApplicatorUsed'] = true;
    component.onLeftClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call getSecondColor of the color tool service for a rectangle', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'stroke', '#00000000');
    component.svg.nativeElement.appendChild(rectangle);
    rectangle.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'getSecondColor');
    component['isPipetteUsed'] = false;
    component['iscolorApplicatorUsed'] = true;
    component.onRightClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call updatePrimaryColor of the color tool service for a rectangle', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    component.svg.nativeElement.appendChild(rectangle);
    rectangle.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'updatePrimaryColorWithPipette');
    component['isPipetteUsed'] = true;
    component['iscolorApplicatorUsed'] = false;
    component.onLeftClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call updatePrimaryColor of the color tool service for a pen', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 0,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const path = renderer.createElement('path', svgNS);
    path.setAttributeNS(null, 'stroke', '#00000000');
    component.svg.nativeElement.appendChild(path);
    path.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'updatePrimaryColorWithPipette');
    component['isPipetteUsed'] = true;
    component['iscolorApplicatorUsed'] = false;
    component.onLeftClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call updateSecondColor of the color tool service for a rectangle', () => {
    const event: Event = new MouseEvent('mousedown', {
      bubbles: true,
      button: 1,
    });
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'stroke', '#00000000');
    component.svg.nativeElement.appendChild(rectangle);
    rectangle.dispatchEvent(event);
    const spy = spyOn(component['colorService'], 'updateSecondColorWithPipette');
    component['isPipetteUsed'] = true;
    component['iscolorApplicatorUsed'] = false;
    component.onRightClick(event);
    expect(spy).toHaveBeenCalled();
  });

  it ('should create the rectangle', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    const color = new ColorToolService();
    const service = new RectParamsService(color);
    component['tool'] = (service);
    service['originRectX'] = 2;
    service.setStyles();
    service.submitElement(rectangle, 'rect');
    expect(rectangle.getAttribute('x')).toEqual('2');
    expect(rectangle.getAttribute('y')).toEqual('0');
    expect(rectangle.getAttribute('height')).toEqual('0');
    expect(rectangle.getAttribute('width')).toEqual('0');
    expect(rectangle.getAttribute('stroke')).toEqual('#000000');
    expect(rectangle.getAttribute('fill')).toEqual('transparent');
    expect(rectangle.getAttribute('stroke-width')).toEqual('1');
  });

  it ('should create the ellipse', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const ellipse = renderer.createElement('ellipse', svgNS);
    const color = new ColorToolService();
    const service = new RectParamsService(color);
    component['tool'] = (service);
    service['originRectX'] = 2;
    service.setStyles();
    service.submitElement(ellipse, 'rect');
    expect(ellipse.getAttribute('x')).toEqual('2');
    expect(ellipse.getAttribute('y')).toEqual('0');
    expect(ellipse.getAttribute('height')).toEqual('0');
    expect(ellipse.getAttribute('width')).toEqual('0');
    expect(ellipse.getAttribute('stroke')).toEqual('#000000');
    expect(ellipse.getAttribute('fill')).toEqual('transparent');
    expect(ellipse.getAttribute('stroke-width')).toEqual('1');
  });

  it('should enable alt when used on scale functionnality', () => {
    component['isScale'] = true;
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('Alt', {key: 'Alt'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    component.scaleSelectionEnable('Alt');
    expect(component['drawingToolUsed']).toEqual('');
  });

  it('should stop drawing when mouse is up outside of drawing area', () => {
    const rectService: RectParamsService = new RectParamsService({} as ColorToolService);
    component.onMouseLeave();
    component.setCurrentPosition(60, 70);
    component['maxX'] = 50;
    component['maxY'] = 60;
    component.setDrawing(true);
    component['drawingToolUsed'] = 'rectangle';
    component['tool'] = (rectService);
    component.outOfDrawingSurface();
    expect(component.getDrawing()).toBeFalsy();
  });

  it('should set the isOutside boolean to true', () => {
    component.onMouseLeave();
    expect(component['isOutside']).toBeTruthy();
  });

  it('should set the isOutside boolean to false', () => {
    component.onMouseLeave();
    expect(component['isOutside']).toBeTruthy();
    component.onMouseEnter();
    expect(component['isOutside']).toBeFalsy();
  });

  it('should open and close the modal', () => {
    const spy = spyOn( component, 'openModal');
    component.welcomeModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should change Background Color', () => {
    const event = new Event('change');
    component.changeBackgroundColor(event);
    expect(component['svg'].nativeElement.style.backgroundColor).toEqual('rgb(255, 255, 255)');
  });

  it('should activate the grid', () => {
    const grid = 'true';
    component.activateGrid(grid);
    expect(component['isGrid']).toEqual(grid);
  });

  it('should open the modal', () => {
    const matDialogSpy = spyOn(component['dialog'], 'open');
    const dialogSpy: any = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy.afterClosed.and.returnValue(of(undefined));
    matDialogSpy.and.returnValue(dialogSpy);
    const spy = spyOn(component['dialog'], 'closeAll');
    component.openModal();
    expect(spy).toHaveBeenCalled();
  });

  it('should open the modal for the creation of the drawing surface', () => {
    const dialogSpy: any = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy.afterClosed.and.returnValue(of(true));
    const spy = spyOn(component['serviceStructSVGElement'], 'makeEmpty');
    component.onCreate();
    fixture.whenStable().then();
    expect(spy).toHaveBeenCalled();
  });

  it('should verify drawing surface creation', () => {
    const matDialogSpy = spyOn(component['dialog'], 'open');
    const dialogSpy: any = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogSpy.afterClosed.and.returnValue(of(true));
    matDialogSpy.and.returnValue(dialogSpy);
    const spy = spyOn(component, 'onCreate');
    component.verifyCreation();
    expect(spy).toHaveBeenCalled();
  });

  it('should activate pipette', () => {
    component['isPipetteUsed'] = false;
    component.activatePipette();
    expect(component['isPipetteUsed']).toBe(true);
  });

  it('should reset rect tool', () => {
    const color = new ColorToolService();
    component['tool'] = new RectParamsService(color);
    spyOn(RectParamsService.prototype, 'setheight');
    component.resetToolRect();
    expect(RectParamsService.prototype.setheight).toHaveBeenCalled();
  });

  it('should reset ellipse tool', () => {
    const color = new ColorToolService();
    component['tool'] = new EllipseService(color);
    spyOn(EllipseService.prototype, 'setheight');
    component.resetToolEllipse();
    expect(EllipseService.prototype.setheight).toHaveBeenCalled();
  });

  it('should undo the created shape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '0');
    const command = new CreateElementCommandService(rectangle);
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService, {} as RotationManipulationService);
    const rectangle1: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    selection['selectionShapes'].set('0', rectangle1);
    component['selection'] = selection;
    component['commandArray'].push(command);
    component['shapes'].push(rectangle);
    component['svg'].nativeElement.appendChild(rectangle);
    component['svg'].nativeElement.appendChild(rectangle1);
    expect(component['commandArray'].length).toEqual(1);
    component.undo();
    expect(component['commandArray'].length).toEqual(0);
  });

  it('should redo the created shape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'elementID', '0');
    const command = new CreateElementCommandService(rectangle);
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService, {} as RotationManipulationService);
    const rectangle1: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    selection['selectionShapes'].set('0', rectangle1);
    component['selection'] = selection;
    component['commandArray'].push(command);
    component['shapes'].push(rectangle);
    component['svg'].nativeElement.appendChild(rectangle);
    component['svg'].nativeElement.appendChild(rectangle1);
    expect(component['commandArray'].length).toEqual(1);
    expect(component['commandArray'].length).toEqual(1);
    expect(component['shapes'].length).toEqual(1);
    component.undo();
    expect(component['commandArray'].length).toEqual(0);
    expect(component['shapes'].length).toEqual(0);
    component.redo();
    expect(component['commandArray'].length).toEqual(1);
    expect(component['shapes'].length).toEqual(1);
  });

  it('should undo the color Applicator', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    component['shapes'].push(rectangle);
    const command = new ColorAppCommand('fill');
    component['commandArray'].push(command);
    command['index'] = 0;
    component.undo();
    expect(component['commandDeletedArray'].length).toEqual(1);
  });

  it('should redo the color Applicator', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = renderer.createElement('rect', svgNS);
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    component['shapes'].push(rectangle);
    const command = new ColorAppCommand('fill');
    component['commandDeletedArray'].push(command);
    command['index'] = 0;
    component.redo();
    expect(component['commandArray'].length).toEqual(1);
  });

  it('should undo the background Color', () => {
    const command = new BackgroundColorCommand('#00000000');
    component['commandArray'].push(command);
    component.undo();
    expect(component['commandDeletedArray'].length).toEqual(1);
  });

  it('should redo the background Color', () => {
    const command = new BackgroundColorCommand('#00000000');
    component['commandDeletedArray'].push(command);
    component.redo();
    expect(component['commandArray'].length).toEqual(1);
  });

  it('should be ready to draw', () => {
    const color = new ColorToolService();
    const tool = component['tool'] = new RectParamsService(color);
    tool['isReady'] = true ;
    component['drawingToolUsed'] = 'rect';
    expect(component.readyToDraw()).toBeTruthy();
    component['drawingToolUsed'] = 'line';
    component['drawLine'].click = 2;
    expect(component.readyToDraw()).toBeTruthy();
    component['drawingToolUsed'] = 'text';
    component['insertText'].isDone = true;
    expect(component.readyToDraw()).toBeTruthy();
  });

  it('should call copy function of the selection service', () => {
    const spy = spyOn(component['selection'], 'copySelection');
    component.copy();
    expect(spy).toHaveBeenCalled();
  });

  it('should call copy function with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'copy');
    const event = new KeyboardEvent('ctrl.c', { key: 'ctrl.c' });
    component.shortCutCopy(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call paste function with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'paste');
    const event = new KeyboardEvent('ctrl.v', { key: 'ctrl.v' });
    component.shortCutPaste(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call paste of the paperweightservice and call the function addShapes', () => {
    component['isEnableShortCuts'] = true;
    const spyAddShapes = spyOn(component, 'addShapes');
    const spyPaste = spyOn(component['paperweightService'], 'paste');
    component.paste();
    expect(spyAddShapes).toHaveBeenCalled();
    expect(spyPaste).toHaveBeenCalled();
  });

  it('should call duplicate function with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'duplicate');
    const event = new KeyboardEvent('ctrl.d', { key: 'ctrl.d' });
    component.shortCutDuplicate(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call selectAll function with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'selectAll');
    const event = new KeyboardEvent('ctrl.a', { key: 'ctrl.a' });
    component.shortCutSelectALL(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should call cut function with keybord shortcut', () => {
    component['isEnableShortCuts'] = true;
    const spy = spyOn(component, 'cut');
    const event = new KeyboardEvent('ctrl.x', { key: 'ctrl.x' });
    component.shortCutCut(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should append the text when we change the tool', () => {
    const objet = Array();
    const svgNS = 'http://www.w3.org/2000/svg';
    const text = renderer.createElement('text', svgNS);
    const color = new ColorToolService();
    const service = new TextParamsService(color);
    component['tool'] = (service);
    service['fontSize'] = 5;
    service.setStyles();
    service.submitElement(text, 'text');
    component['drawingToolUsed'] = 'text';
    const spy = spyOn(component, 'appendElement');
    component.select('rectangle');
    expect(spy).toHaveBeenCalled();
    expect(component['insertText'].isDone).toBeFalsy();
    expect(component['isSaved']).toBeFalsy();
    expect(component['commandDeletedArray']).toEqual(objet);
    expect(component['drawingToolUsed']).toEqual('rectangle');
  });

  it('should draw inside interval', () => {
    const event = new MouseEvent('mousedown', {} as MouseEventInit);
    fixture.whenRenderingDone().then();
    component['drawingToolUsed'] = 'aerosol';
    component.setDrawing(true);
    const color = new ColorToolService();
    const aerosol = component['tool'] = (new AerosolService(color));
    component['isOutside'] = false;
    aerosol['isReady'] = true;
    aerosol['emissionRate'] = 10;
    const spyInterval = spyOn(component, 'setAerosolInterval');
    component.onMouseDown(event);
    expect(spyInterval).toHaveBeenCalled();
  });

  it('should set boolean isAltPressed to true for the fountainPen tool ', () => {
    component['drawingToolUsed'] = 'aerosol';
    component.setDrawing(true);
    const color = new ColorToolService();
    const fountainPen = component['tool'] = (new FountainPenParamsService(color));
    component['isStartedOutside'] = false;
    fountainPen['isReady'] = true;
    component['insertText'].isDone = true;
    const event = new KeyboardEvent('Alt', {key: 'Alt'});
    component['isEnableShortCuts'] = true;
    component.shortCutsList(event);
    expect(fountainPen['isAltPressed']).toBeTruthy();
  });

});
