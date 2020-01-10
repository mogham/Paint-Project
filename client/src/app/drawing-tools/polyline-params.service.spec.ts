// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
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
import { PaintBucketService } from './paint-bucket.service';
import { PolylineParamsService } from './polyline-params.service';
import { SelectionParamsService } from './selection-params.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('PolylineParamsService', () => {
  const color = new ColorToolService();
  const service: PolylineParamsService = new PolylineParamsService(color);

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should set the marker if the circle jonction is selected', () => {
    service.setJunctionType('with-points');
    service.setMarker();
    expect(service.getMarker()).toEqual('url(#j1)');
    service.setJunctionType('round');
    service.setMarker();
    expect(service.getMarker()).toEqual('');
  });

  it('should start drawing', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    position.x = 200;
    position.y = 300;
    service.isFirstSegment = true;
    service.startDrawing(position);
    expect(service.isMouseDown).toBeTruthy();
    expect(service['points']).not.toEqual('');
  });

  it('should reset the path after onMouseUp ', () => {
    service.onMouseUp();
    expect(service['points']).toEqual('');
  });

  it('should add normal point when it s not a double click or shift', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.isFirstSegment = false;
    service['currentX'] = 200;
    service['startX'] = 300;
    service.startDrawing(position);
    expect(service['points']).not.toEqual('');
  });

  it('should start drawing and draw', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    const spyStart = spyOn(service, 'startDrawing');
    service.onMouseDown(position);
    expect(spyStart).toHaveBeenCalled();
    const spyDraw = spyOn(service, 'draw');
    service.onMouseDown(position);
    expect(spyDraw).toHaveBeenCalled();
  });

  it('should remove the draw', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    const spyRemoveDraw = spyOn(service, 'removeDraw');
    service.draw(position);
    expect(spyRemoveDraw).toHaveBeenCalled();
  });

  it('should set styles', () => {
    const spyStylePattern = spyOn(service, 'setPatternStyle');
    service.setStyles();
    expect(spyStylePattern).toHaveBeenCalled();
    const spyStyleMarker = spyOn(service, 'setMarkerStyle');
    service.setStyles();
    expect(spyStyleMarker).toHaveBeenCalled();
    const spyStyle = spyOn(service, 'setMarker');
    service.setStyles();
    expect(spyStyle).toHaveBeenCalled();
  });

  it('should make the difference between a line and a tempLine', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.onMouseDown(position);
    expect(service.click).not.toEqual(0);
  });

  it('should add tempLine to the path of the polyline', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.isMouseDown = true;
    service.isLastSegment = false;
    service['currentX'] = 100;
    service['currentY'] = 200;
    service.onMouseMove(position);
    expect(service['pointToAdd']).not.toEqual('');
    expect(service['points']).toEqual(service['temporaryPath'] + service['pointToAdd']);
  });

  it('should add tempLine and delete it if move the mouse', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.isMouseDown = service['isTempLine'] = true;
    service.isLastSegment = false;
    service.onMouseMove(position);
    expect(service['temporaryPath']).not.toEqual(service['points']);
  });

  it('should set jonction style', () => {
    service.setJunctionType('angle');
    service.setJunctionStyle();
    expect(service.getJunctionType()).toEqual('');
    service.setJunctionType('round');
    service.setJunctionStyle();
    expect(service.getJunctionType()).toEqual('round');
  });

  it('should set point diameter', () => {
    service.setPointsDiameter(10);
    service.setMarkerStyle();
    expect(service.diameterMarker).toEqual('10%');
  });

  it('should set pattern style when the pattern style is : dotted-traits', () => {
    service.setLinePattern('dotted-traits');
    service.setPatternStyle();
    expect(service['strokeLinecap']).toEqual('round');
    expect(service['linePattern']).not.toEqual('');
  });

  it('should set pattern style when the pattern style is : dotted-points', () => {
    service.setLinePattern('dotted-points');
    service.setPatternStyle();
    expect(service['strokeLinecap']).toEqual('');
    expect(service['linePattern']).not.toEqual('');
  });

  it('should set pattern style when the pattern style is : dotted-points', () => {
    service.setLinePattern('dotted-points');
    service.setPatternStyle();
    expect(service['strokeLinecap']).toEqual('');
    expect(service['linePattern']).not.toEqual('');
  });

  it('should set pattern style when the pattern style is : continu', () => {
    service.setLinePattern('continu');
    service.setPatternStyle();
    expect(service['strokeLinecap']).toEqual('round');
    expect(service['linePattern']).toEqual('0');
  });

  it('should draw the last point if we double click', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.isFirstSegment = false;
    service['currentX'] = 200;
    service['startX'] = service['currentX'];
    service.isClosedWithDblClick = service.isClosedWithShift = true;
    service.startDrawing(position);
    expect(service['points']).not.toEqual('');
  });

  it('should draw the current point if we double click', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    service.isFirstSegment = false;
    service['currentX'] = 200;
    service['startX'] = 0;
    service.isFirstSegment = false;
    service.startDrawing(position);
    expect(service.points).not.toEqual('');
  });

  it('should set default parameter', () => {
    service.setDefault();
    expect(service['isReady']).toEqual(true);
    expect(service['thickness']).toEqual(1);
    expect(service['strokeWidth']).toEqual(1);
  });

  it('should remove last point to remove last segment', () => {
    const polyline: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = polyline['currentPosition'];
    position.x = 200;
    position.y = 300;
    service.startDrawing(position);
    service.isCanceled = true;
    service.removeDraw();
    expect(service['points']).not.toEqual('');
  });

  it('should set thickness ofthe polyline', () => {
    service['thickness'] = 10;
    expect(service['thickness']).toEqual(10);
  });

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['getImageData', 'setAttributeNS']);
    service.submitElement(Elementpath, 'line');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

});
