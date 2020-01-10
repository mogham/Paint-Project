// tslint:disable: no-string-literal
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { EraserParamsService } from 'src/app/drawing-tools/eraser-params.service';
import { PaperweightManipulationService } from 'src/app/selection-manipulation/paperweight-manipulation.service';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GenerateElementService } from '../components/open-draw/generate-element.service';
import { GenerateStructSVGElementService } from '../components/save-draw/generate-structsvgelement.service';
import { NotificationService } from '../notification-service/notification-service.service';
import { ScaleManipulationService } from '../selection-manipulation/scale-manipulation.service';
import { TranslateManipulationService } from '../selection-manipulation/translate-manipulation.service';
import { ColorToolService } from './color-tool.service';
import { DrawingToolFactory } from './drawing-tool-factory';
import { ExportFileService } from './export.service';
import { FountainPenParamsService } from './fountain-pen-params.service';
import { GridService } from './grid.service';
import { PaintBucketService } from './paint-bucket.service';
import { PenParamsService } from './pen-params.service';
import { PolylineParamsService } from './polyline-params.service';
import { SelectionParamsService } from './selection-params.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('PenParamsService', () => {

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should set attributes of the pen', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const newService = new PenParamsService(color, velocity);
    newService.setStrokeLinecap('round');
    newService.setStroke('#000000');
    newService.setFill('none');
    newService.setStyles();
    expect(newService.getFill()).toEqual('none');
    expect(newService['strokeLinecap']).toEqual('round');
    expect(newService.getStroke()).toEqual('#000000');
  });

  it('should set ready to true on default call through shortcuts', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    service.setDefault();
    expect(service['isReady']).toEqual(true);
  });

  it('should start drawing', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = path['currentPosition'];

    service['isActive'] = true;
    service['isNewPath'] = false;
    service['maxStrokeWidth'] = 40;
    service['minStrokeWidth'] = 10;
    position.x = 100;
    position.y = 200;
    service.startDrawing(position);
    expect(service['currentX']).not.toEqual(0);
    expect(service['currentY']).not.toEqual(0);
    expect(service['oldXPosition']).not.toEqual(0);
    expect(service['oldYPosition']).not.toEqual(0);
    expect(service['path']).not.toEqual('');
  });

  it('should draw', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = path['currentPosition'];
    service['isActive'] = true;
    service['isNewPath'] = false;
    service['oldXPosition'] = 120;
    service['oldYPosition'] = 150;
    position.x = 100;
    position.y = 200;
    service.startDrawing(position);
    expect(service['currentX']).not.toEqual(0);
    expect(service['currentY']).not.toEqual(0);
    expect(service['oldXPosition']).not.toEqual(0);
    expect(service['oldYPosition']).not.toEqual(0);
    expect(service['path']).not.toEqual('');
  });

  it('should start drawing when the mouse is down', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = path['currentPosition'];
    service['maxStrokeWidth'] = 15;
    service['minStrokeWidth'] = 8;
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyStart).toHaveBeenCalled();
    const spyDraw = spyOn(service, 'draw');
    service.onMouseDown(position);
    expect(spyDraw).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setStyles');
    service.onMouseDown(position);
    expect(spyStyle).toHaveBeenCalled();
    expect(service['isActive']).toBeTruthy();
  });

  it('should draw when the mouse moves', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = path['currentPosition'];
    service['maxStrokeWidth'] = 15;
    service['minStrokeWidth'] = 8;
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseMove(position);
    expect(spyStart).toHaveBeenCalled();
    const spyDraw = spyOn(service, 'draw');
    service.onMouseMove(position);
    expect(spyDraw).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setStyles');
    service.onMouseMove(position);
    expect(spyStyle).toHaveBeenCalled();
  });

  it('should reset the path when the mouse is up', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    service.onMouseUp();
    expect(service['isActive']).toBeFalsy();
    expect(service['isNewPath']).toBeFalsy();
    expect(service.getPath()).toEqual('');
  });

  it('should submit element', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const Elementpath: any = jasmine.createSpyObj('Element', ['setAttributeNS']);
    service.submitElement(Elementpath,  'pen');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

  it('should set thickness if thickness < min_stroke_width', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const newService = service['velocity'];
    service['maxStrokeWidth'] = 15;
    service['minStrokeWidth'] = 8;
    newService.setVelocity(10);
    expect(service['thickness']).not.toEqual(0);
  });

  it('should set thickness if thickness > min_stroke_width', () => {
    const color = new ColorToolService();
    const velocity = new VelocityParamsService();
    const service: PenParamsService = new PenParamsService(color, velocity);
    const newService = service['velocity'];
    service['maxStrokeWidth'] = 1500;
    service['minStrokeWidth'] = 8;
    newService.setVelocity(10);
    expect(service['thickness']).not.toEqual(0);
  });

});
