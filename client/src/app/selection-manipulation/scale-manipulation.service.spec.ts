// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GenerateElementService } from '../components/open-draw/generate-element.service';
import { GenerateStructSVGElementService } from '../components/save-draw/generate-structsvgelement.service';
import { ColorToolService } from '../drawing-tools/color-tool.service';
import { DrawingToolFactory } from '../drawing-tools/drawing-tool-factory';
import { EraserParamsService } from '../drawing-tools/eraser-params.service';
import { ExportFileService } from '../drawing-tools/export.service';
import { FountainPenParamsService } from '../drawing-tools/fountain-pen-params.service';
import { GridService } from '../drawing-tools/grid.service';
import { PaintBucketService } from '../drawing-tools/paint-bucket.service';
import { PolylineParamsService } from '../drawing-tools/polyline-params.service';
import { SelectionParamsService } from '../drawing-tools/selection-params.service';
import { TextParamsService } from '../drawing-tools/text-params.service';
import { VelocityParamsService } from '../drawing-tools/velocity-params.service';
import { NotificationService } from '../notification-service/notification-service.service';
import { PaperweightManipulationService } from './paperweight-manipulation.service';
import { ScaleManipulationService } from './scale-manipulation.service';
import { TranslateManipulationService } from './translate-manipulation.service';

describe('ScaleManipulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const drawingView: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
  const service: ScaleManipulationService = new ScaleManipulationService();
  service['originBoxX'] = 50;
  service['originBoxY'] = 80;
  service['heightBox'] = 100;
  service['widthBox'] = 40;
  it('should be created', () => {
    const newService: ScaleManipulationService = TestBed.get(ScaleManipulationService);
    expect(newService).toBeTruthy();
  });

  it('should call scaleFromLU when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromLU');
    newService['point'] = 'LU';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromMU when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromMU');
    newService['point'] = 'MU';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromRU when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromRU');
    newService['point'] = 'RU';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromLM when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromLM');
    newService['point'] = 'LM';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromRM when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromRM');
    newService['point'] = 'RM';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromLD when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromLD');
    newService['point'] = 'LD';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromMD when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromMD');
    newService['point'] = 'MD';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should call scaleFromRD when we click on the point in upper left corner', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const spy = spyOn(newService, 'scaleFromRD');
    newService['point'] = 'RD';
    newService.scale(position);
    expect(spy).toHaveBeenCalled();
  });

  it('should create a correct scale', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    newService.createScale(140, 120, 1.3, 0.9);
    expect(newService['newScale']).toEqual('translate(140, 120) scale(1.3, 0.9) translate(-140, -120)');
  });

  it('should scale From LU without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLU(position);
    expect(service['newScale']).toEqual('translate(90, 180) scale(-0.5, 0.25) translate(-90, -180)');
  });

  it('should scale From MU without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromMU(position);
    expect(service['newScale']).toEqual('translate(90, 180) scale(1, 0.25) translate(-90, -180)');
  });

  it('should scale From RU without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRU(position);
    expect(service['newScale']).toEqual('translate(50, 180) scale(2.5, 0.25) translate(-50, -180)');
  });

  it('should scale From LM without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLM(position);
    expect(service['newScale']).toEqual('translate(90, 180) scale(-0.5, 1) translate(-90, -180)');
  });

  it('should scale From RM without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRM(position);
    expect(service['newScale']).toEqual('translate(50, 80) scale(2.5, 1) translate(-50, -80)');
  });

  it('should scale From LD without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLD(position);
    expect(service['newScale']).toEqual('translate(90, 80) scale(-0.5, 1.75) translate(-90, -80)');
  });

  it('should scale From MD without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromMD(position);
    expect(service['newScale']).toEqual('translate(50, 80) scale(1, 1.75) translate(-50, -80)');
  });

  it('should scale From RD without keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRD(position);
    expect(service['newScale']).toEqual('translate(50, 80) scale(2.5, 1.75) translate(-50, -80)');
  });

  it('should initialize parameters', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    newService.startScale(position, 60, 75, 32, 57, 'LD', []);
    expect(newService['originX']).toEqual(10);
    expect(newService['originY']).toEqual(15);
    expect(newService['originBoxX']).toEqual(60);
    expect(newService['originBoxY']).toEqual(75);
    expect(newService['heightBox']).toEqual(57);
    expect(newService['point']).toEqual('LD');
    expect(newService['newScale']).toEqual('');
    expect(newService['lastScaleLenght']).toEqual(0);
    expect(newService['isShift']).toEqual(false);
    expect(newService['isAlt']).toEqual(false);
  });

  it('should apply scale', () => {
    const newService: ScaleManipulationService = new ScaleManipulationService();
    newService['newScale'] = 'translate(50, 80) scale(1, 1.75) translate(-50, -80)';
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('transform', '');
    newService['elementToScale'] = [];
    newService['elementToScale'].push(rectangle);
    newService.applyTransform();
    expect(rectangle.getAttribute('transform')).toEqual('translate(50, 80) scale(1, 1.75) translate(-50, -80)');
    expect(newService['lastScaleLenght']).toEqual('translate(50, 80) scale(1, 1.75) translate(-50, -80)'.length);
  });

  it('should scale since the middle of the box From LU without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLU(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(-0.5, 0.25) translate(-70, -130)');
  });

  it('should scale since the middle of the box From MU without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromMU(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(1, 0.25) translate(-70, -130)');
  });

  it('should scale since the middle of the box From RU without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRU(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(2.5, 0.25) translate(-70, -130)');
  });

  it('should scale since the middle of the box From LM without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLM(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(-0.5, 1) translate(-70, -130)');
  });

  it('should scale since the middle of the box From RM without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRM(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(2.5, 1) translate(-70, -130)');
  });

  it('should scale since the middle of the box From LD without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLD(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(-0.5, 1.75) translate(-70, -130)');
  });

  it('should scale since the middle of the box From MD without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromMD(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(1, 1.75) translate(-70, -130)');
  });

  it('should scale since the middle of the box From RD without keep rapport', () => {
    service['isAlt'] = true;
    service['isShift'] = false;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRD(position);
    expect(service['newScale']).toEqual('translate(70, 130) scale(2.5, 1.75) translate(-70, -130)');
  });

  it('should scale from LU and keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = true;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLU(position);
    expect(service['newScale']).toEqual('translate(90, 180) scale(-0.5, -0.5) translate(-90, -180)');
  });

  it('should scale from RU and keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = true;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRU(position);
    expect(service['newScale']).toEqual('translate(50, 180) scale(2.5, 2.5) translate(-50, -180)');
  });

  it('should scale from LD and keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = true;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromLD(position);
    expect(service['newScale']).toEqual('translate(90, 80) scale(-0.5, -0.5) translate(-90, -80)');
  });

  it('should scale from RD and keep rapport', () => {
    service['isAlt'] = false;
    service['isShift'] = true;
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 60;
    position.y = 75;
    service.scaleFromRD(position);
    expect(service['newScale']).toEqual('translate(50, 80) scale(2.5, 2.5) translate(-50, -80)');
  });
});
