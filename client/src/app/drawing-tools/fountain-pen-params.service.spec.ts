// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GenerateElementService } from '../components/open-draw/generate-element.service';
import { GenerateStructSVGElementService } from '../components/save-draw/generate-structsvgelement.service';
import { NotificationService } from '../notification-service/notification-service.service';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { ScaleManipulationService } from '../selection-manipulation/scale-manipulation.service';
import { TranslateManipulationService } from '../selection-manipulation/translate-manipulation.service';
import { ColorToolService } from './color-tool.service';
import { DrawingToolFactory } from './drawing-tool-factory';
import { EraserParamsService } from './eraser-params.service';
import { ExportFileService } from './export.service';
import { FountainPenParamsService } from './fountain-pen-params.service';
import { GridService } from './grid.service';
import { PaintBucketService } from './paint-bucket.service';
import { PolylineParamsService } from './polyline-params.service';
import { SelectionParamsService } from './selection-params.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('FountainPenParamsService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should start drawing', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const draw: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = draw['currentPosition'];

    service.setStyles();
    service.setLineLenght(10);
    service['degree'] = 10;
    position.x = 100;
    position.y = 200;
    service.startDrawing(position);
    expect(service['currentX1']).toEqual(100);
    expect(service['currentY1']).toEqual(200);
    expect(service.isMouseDown).toBeTruthy();
  });

  it('should draw with the fountain pen', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const draw: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = draw['currentPosition'];
    service.setStyles();
    service.setLineLenght(10);
    service['degree'] = 10;
    position.x = 100;
    position.y = 200;
    service.draw(position);
    expect(service['currentX1']).toEqual(100);
    expect(service['currentY1']).toEqual(200);
    expect(service.isMouseDown).toBeTruthy();
  });

  it('should submit element', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const Elementpath: any = jasmine.createSpyObj('Element', ['getImageData', 'setAttributeNS']);
    service.submitElement(Elementpath, 'fountainPen');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

  it('should set default params', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    service.setDefault();
    expect(service['isReady']).toEqual(true);
  });

  it('should start drawing when the mouse is down', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const draw: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = draw['currentPosition'];
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyStart).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setStyles');
    service.onMouseDown(position);
    expect(spyStyle).toHaveBeenCalled();
    expect(service.isMouseDown).toBeTruthy();
    expect(service.isDrawing).toBeTruthy();
  });

  it('should draw when the mouse moves', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const draw: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = draw['currentPosition'];
    const spyDraw = spyOn(service, 'draw');
    service.onMouseMove(position);
    expect(spyDraw).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setStyles');
    service.onMouseMove(position);
    expect(spyStyle).toHaveBeenCalled();
    expect(service.isDrawing).toBeFalsy();
  });

  it('should return the orientation angle between 0 and 180', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    service['degree'] = 340;
    service.getRotationDegree();
    expect(service['degree']).toEqual(160);
  });

  it('should increment by 15 the orientation angle with the mouse wheel', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    4,
  });
    service.isAltPressed  = false;
    service['degree'] = 10;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(25);
  });

  it('should add -15 to the orientation angle with the mouse wheel', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    service.isAltPressed  = false;
    service['degree'] = 100;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(85);
  });

  it('should increment by 1 the orientation angle with the mouse wheel', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    4,
  });
    service.isAltPressed  = true;
    service['degree'] = 10;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(11);
  });

  it('should set degree to 0 if degree < 0', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    service.isAltPressed  = false;
    service['degree'] = 10;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(0);
  });

  it('should decrement the orientation angle with alt key (-1)', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    service.isAltPressed  = true;
    service['degree'] = 10;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(9);
  });

  it('should decrement the orientation angle with alt key and set the degree to 0 if degree < 0', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    service.isAltPressed  = true;
    service['degree'] = 0;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(0);
  });

  it('should set isdrawing to false when the mouse is up', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    service.onMouseUp();
    expect(service['isMouseDown']).toBeFalsy();
    expect(service['isDrawing']).toBeFalsy();
  });

  it('should decrement the orientation angle with the mouse wheel', () => {
    const color = new ColorToolService();
    const service: FountainPenParamsService = new FountainPenParamsService(color);
    const event1 = new WheelEvent('wheel', {
      deltaY:   -4,
  });
    service.isAltPressed  = true;
    service['degree'] = 10;
    service.setAngleWithMouse(event1);
    expect(service['degree']).toEqual(9);
  });

});
