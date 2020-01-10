// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { TextParamsService } from 'src/app/drawing-tools/text-params.service';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GenerateElementService } from '../components/open-draw/generate-element.service';
import { GenerateStructSVGElementService } from '../components/save-draw/generate-structsvgelement.service';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { ScaleManipulationService } from '../selection-manipulation/scale-manipulation.service';
import { TranslateManipulationService } from '../selection-manipulation/translate-manipulation.service';
import { NotificationService } from './../notification-service/notification-service.service';
import { ColorToolService } from './color-tool.service';
import { DrawingToolFactory } from './drawing-tool-factory';
import { EraserParamsService } from './eraser-params.service';
import { ExportFileService } from './export.service';
import { FountainPenParamsService } from './fountain-pen-params.service';
import { GridService } from './grid.service';
import { PaintBucketService } from './paint-bucket.service';
import { PencilParamsService } from './pencil-params.service';
import { PolylineParamsService } from './polyline-params.service';
import { SelectionParamsService } from './selection-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('PencilParamsService', () => {
  const color = new ColorToolService();
  const service: PencilParamsService = new PencilParamsService(color);
  const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
  const position: MousePosition = path['currentPosition'];

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should set attributes of the pencil', () => {
    const newService = new PencilParamsService(color);
    newService.setStyles();
    expect(newService.getFill()).toEqual('none');
    expect(newService['strokeLinecap']).toEqual('round');
    expect(newService.getStroke()).toEqual('#000000');
    expect(newService.getStrokeWidth()).toEqual(1);
  });

  it('should set ready to true on default call through shortcuts', () => {
    service.setDefault();
    expect(service['isReady']).toEqual(true);
  });

  it('should start drawing', () => {
    service.setStyles();
    position.x = 100;
    position.y = 200;
    service.startDrawing(position);
    expect(service['path']).toEqual('M100,200 ');
  });

  it('should continue drawing', () => {
    position.x = 200;
    position.y = 300;
    service.draw(position);
    expect(service['path']).not.toEqual('');

  });

  it('should start drawing when the mouse is down', () => {
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyStart).toHaveBeenCalled();
    const spyDraw = spyOn(service, 'draw');
    service.onMouseDown(position);
    expect(spyDraw).toHaveBeenCalled();
  });

  it('should reset the path if the mouse is up', () => {
    service.onMouseUp();
    expect(service['path']).toEqual('');
  });

  it('should set Stroke width', () => {
    service.setStrokeWidth(10);
    expect(service['strokeWidth']).toEqual(10);
  });

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['getImageData', 'setAttributeNS']);
    service.submitElement(Elementpath, 'pencil');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

});
