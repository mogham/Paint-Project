// tslint:disable: no-string-literal
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
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
import { PaintBrushParamsService } from './paint-brush-params.service';
import { PaintBucketService } from './paint-bucket.service';
import { PolylineParamsService } from './polyline-params.service';
import { SelectionParamsService } from './selection-params.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('PaintBrushParamsService', () => {
  const color = new ColorToolService();
  const service: PaintBrushParamsService = new PaintBrushParamsService(color);
  const path: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
  const position: MousePosition = path['currentPosition'];

  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const brushService: PaintBrushParamsService = TestBed.get(PaintBrushParamsService);
    expect(brushService).toBeTruthy();
  });

  it('should set the styles attributes of the paint brush', () => {
    service['texture'] = 'texture 1';
    service.setStyles();
    expect(service['fill']).toEqual('none');
    expect(service['strokeLinecap']).toEqual('round');
    expect(service['thickness']).toEqual(1);
    expect(service['stroke']).toEqual('#000000');
    expect(service['strokeWidth']).toEqual(1);
    expect(service['filter']).toEqual('url(#f1)');
  });

  it('should set default values for essential params', () => {
    const newService: PaintBrushParamsService = new PaintBrushParamsService(color);
    newService.setDefault();
    expect(newService['texture']).toEqual('texture 1');
    expect(newService['isReady']).toEqual(true);
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

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['setAttributeNS']);
    service.submitElement(Elementpath, 'pencil');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

});
