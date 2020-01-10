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
import { AerosolService } from './aerosol.service';
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

describe('AerosolService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const color = new ColorToolService();
  const service: AerosolService = new AerosolService(color);
  const aerosol: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
    {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
    {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
    {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
    {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
    {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
  let position: MousePosition = aerosol['currentPosition'];

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the current position', () => {
    position.x = 10;
    position.y = 20;
    service.setCurrentPosition(position);
    expect(service['currentX']).toEqual(10);
    expect(service['currentY']).toEqual(20);
  });

  it('should start drawing', () => {
    position.x = 10;
    position.y = 20;
    const spyDraw = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyDraw).toHaveBeenCalled();
  });

  it('should generate random offset by calling random function', () => {
    const spyDraw = spyOn(Math, 'random');
    service.randomOffetInRadius();
    expect(spyDraw).toHaveBeenCalled();
  });

  it('should generate random offset', () => {
    position = service.randomOffetInRadius();
    expect(position.x).not.toEqual(0);
    expect(position.y).not.toEqual(0);
  });

  it('should set the vapor ray', () => {
    service.setVaporRay(25);
    expect(service['vaporRay']).toEqual(25);
  });

  it('should set the stroke of the tool', () => {
    const spyPrimaryColor = spyOn(color, 'getPrimaryColor');
    service.setStyles();
    expect(spyPrimaryColor).toHaveBeenCalled();
  });

  it('should set the fill of the tool', () => {
    const spyPrimaryColor = spyOn(color, 'getPrimaryColor');
    service.setStyles();
    expect(spyPrimaryColor).toHaveBeenCalled();
  });

  it('should call setStyles and setCurrentposition when we start drawing', () => {
    const spyStyle = spyOn(service, 'setStyles');
    service.startDrawing(position);
    expect(spyStyle).toHaveBeenCalled();
    const spyPosition = spyOn(service, 'setCurrentPosition');
    service.startDrawing(position);
    expect(spyPosition).toHaveBeenCalled();
  });

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['getImageData', 'setAttributeNS']);
    service.submitElement(Elementpath, 'ellipse');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

});
