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

describe('TextParamsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const color = new ColorToolService();
  const service: TextParamsService = new TextParamsService(color);
  const text: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);

  it('should set font style for the text tool', () => {
    service['font'] = 'font1';
    service.setFontStyle();
    expect(service['font']).toEqual('Gill Sans');
    service['font'] = 'font2';
    service.setFontStyle();
    expect(service['font']).toEqual('Segoe UI');
    service['font'] = 'font3';
    service.setFontStyle();
    expect(service['font']).toEqual('Courier New');
  });

  it('should set default parameters to initialize text box', () => {
    const newService: TextParamsService = new TextParamsService(color);
    newService.setDefault();
    expect(newService['font']).toEqual('Gill Sans');
    expect(newService['fontAlign']).toEqual('left');
    expect(newService['isReady']).toEqual(true);
  });

  it('should align the text', () => {
    service['fontAlign'] = 'left';
    service.setTextAlign();
    expect(service['fontAlign']).toEqual('start');
    service['fontAlign'] = 'center';
    service.setTextAlign();
    expect(service['fontAlign']).toEqual('middle');
    service['fontAlign'] = 'right';
    service.setTextAlign();
    expect(service['fontAlign']).toEqual('end');
  });

  it('should set the bold and italic style', () => {
    service.setAditionalStyle(true, true);
    expect(service['fontWeight']).toEqual('bold');
    expect(service['fontStyle']).toEqual('italic');
    service.setAditionalStyle(true, false);
    expect(service['fontWeight']).toEqual('bold');
    expect(service['fontStyle']).toEqual(' ');
    service.setAditionalStyle(false, true);
    expect(service['fontWeight']).toEqual(' ');
    expect(service['fontStyle']).toEqual('italic');
    service.setAditionalStyle(false, false);
    expect(service['fontWeight']).toEqual(' ');
    expect(service['fontStyle']).toEqual(' ');
  });

  it('should set styles', () => {
    const objStyle: object = {};
    const spyFontStyle = spyOn(service, 'setFontStyle');
    service.setStyles();
    expect(spyFontStyle).toHaveBeenCalled();
    const spyFontAlign = spyOn(service, 'setTextAlign');
    service.setStyles();
    expect(spyFontAlign).toHaveBeenCalled();
    expect(service.setStyles()).not.toEqual(objStyle);
  });

  it('should create the object and resert variables with the onMouseUp function', () => {
    const position: MousePosition = text['currentPosition'];
    service.onMouseUp(position);
    expect(service.valueToWrite).toEqual('');
    expect(service.isDone).toBeTruthy();
    expect(service.lineCount).toEqual(0);
    expect(service.textArray).toEqual([]);
  });

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['getImageData', 'setAttributeNS']);
    service.submitElement(Elementpath, 'text');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

  it('should set the fill of the text', () => {
    service.setFill('red');
    expect(service.getFill()).toEqual('red');
  });

  it('should get the position when the mouse is down for a new text', () => {
    service.setValue('');
    const startDraw = spyOn(service, 'startDrawing');
    const position: MousePosition = text['currentPosition'];
    service.onMouseDown(position);
    expect(startDraw).toHaveBeenCalled();
  });

});
