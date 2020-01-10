// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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
import { MagnetManipulationService } from './magnet-manipulation.service';
import { PaperweightManipulationService } from './paperweight-manipulation.service';
import { ScaleManipulationService } from './scale-manipulation.service';
import { TranslateManipulationService } from './translate-manipulation.service';

describe('TranslateManipulationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [FormsModule],
  }));
  const drawingView: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
  const gridService = new GridService();
  const serviceMagnet: MagnetManipulationService = new MagnetManipulationService();
  const service: TranslateManipulationService = new TranslateManipulationService(serviceMagnet, gridService);
  service['originX'] = 50;
  service['originY'] = 80;
  it('should be created', () => {
    const newService: TranslateManipulationService = TestBed.get(TranslateManipulationService);
    expect(newService).toBeTruthy();
  });

  it('should initialize parameters', () => {
    const newService: TranslateManipulationService = new TranslateManipulationService(serviceMagnet, gridService);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('transform', '');
    const shapes: Element[] = new Array();
    shapes.push(rectangle);
    newService.startTranslation(position, 10, 14, 48, 67, shapes);
    expect(newService['originX']).toEqual(10);
    expect(newService['originY']).toEqual(15);
    expect(newService['oldTranslateLenght']).toEqual(0);
  });

  it('should create translate', () => {
    service.createTranslate(40, 63);
    expect(service['newTranslate']).toEqual('translate( 40, 63) ');
  });

  it('should apply translate', () => {
    const newService: TranslateManipulationService = new TranslateManipulationService(serviceMagnet, gridService);
    newService['newTranslate'] = 'translate(50, 80) translate(-50, -80)';
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    rectangle.setAttribute('transform', '');
    newService['elementToTranslate'] = [];
    newService['elementToTranslate'].push(rectangle);
    newService.applyTranslate();
    expect(rectangle.getAttribute('transform')).toEqual('translate(50, 80) translate(-50, -80)');
    expect(newService['oldTranslateLenght']).toEqual('translate(50, 80) translate(-50, -80)'.length);
  });

  it('should translate an element', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceMagnet'].setIsActivate(false);
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -40, -65) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -40, -65) '.length);
  });

  it('should translate an element with magnet and LU as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('LU');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and MU as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('MU');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and RU as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('RU');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and LM as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('LM');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and RM as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('RM');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and LD as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('LD');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and MD as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('MD');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and RD as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('RD');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });

  it('should translate an element with magnet and C as magnet point', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    service['elementToTranslate'] = [];
    service['elementToTranslate'].push(rectangle);
    const position: MousePosition = drawingView['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['serviceGrid'].setSideLength(50);
    service['serviceMagnet'].setIsActivate(true);
    service['serviceMagnet'].setMagnetPoint('C');
    service.translate(position);
    expect(rectangle.getAttribute('transform')).toEqual('translate( -50, -50) ');
    expect(service['oldTranslateLenght']).toEqual('translate( -50, -50) '.length);
  });
});
