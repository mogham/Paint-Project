// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { Renderer2 } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GenerateElementService } from '../components/open-draw/generate-element.service';
import { GenerateStructSVGElementService } from '../components/save-draw/generate-structsvgelement.service';
import { WelcomeModalComponent } from '../components/welcome-modal/welcome-modal.component';
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
import { RectParamsService } from './rect-params.service';
import { SelectionParamsService } from './selection-params.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('RectParamsService', () => {
  const color = new ColorToolService();
  const service: RectParamsService = new RectParamsService(color);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [Renderer2, RectParamsService, WelcomeModalComponent,
        { provide: MatDialogRef, useValue: {} }, ColorToolService],
    })
      .compileComponents();
  }));

  it('should set default values for essential params', () => {
    const newService: RectParamsService = new RectParamsService(color);
    newService.setDefault();
    expect(newService['plot']).toEqual('contour');
    expect(newService['isReady']).toEqual(true);
  });

  it('should start drawing the rectangle by setting the x and y of the rectangle', () => {
    const rect: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = rect['currentPosition'];
    position.x = 10;
    position.y = 15;
    service.startDrawing(position);
    expect(service.getOriginX()).toEqual(position.x);
    expect(service.getOriginY()).toEqual(position.y);
  });
  it('should draw the rectangle by setting the width and height', () => {
    const rect: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = rect['currentPosition'];
    position.x = 10;
    position.y = 15;
    service['isSquare'] = false;
    service.draw(position);
    expect(service.getWidth()).toEqual(position.x - service.getOriginX());
    expect(service.getHeight()).toEqual(position.y - service.getOriginY());
  });
  it('should draw the square by setting the width and height', () => {
    const rect: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = rect['currentPosition'];
    position.x = 10;
    position.y = 15;
    service.setSquare(true);
    service.draw(position);
    expect(service.getHeight()).toEqual(service.getWidth());
  });
  it('should draw the rectangle if currentPosition.x < originX', () => {
    const rect: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = rect['currentPosition'];
    service['originX'] = 10;
    position.x = 5;
    service.draw(position);
    expect(service.getWidth()).toEqual(5);
  });
  it('should set attributes', () => {
    service.setPlot('contour');
    service['thickness'] = 1;
    service.setStyles();
    expect(service.getFill()).toEqual('transparent');
    expect(service.getStroke()).toEqual('#000000');
    service.setPlot('full');
    service.setStyles();
    expect(service.getFill()).toEqual('#000000');
    expect(service.getStroke()).toEqual('transparent');
    service.setPlot('');
    service.setStyles();
    expect(service.getFill()).toEqual('#000000');
    expect(service.getStroke()).toEqual('#000000');
    expect(service.getStrokeWidth()).toEqual(1);
  });
  it('should set height', () => {
    service.setheight(10);
    expect(service['height']).toEqual(10);
  });
});
