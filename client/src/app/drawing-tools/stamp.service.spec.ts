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
import { StampService } from './stamp.service';
import { TextParamsService } from './text-params.service';
import { VelocityParamsService } from './velocity-params.service';

describe('stampservice', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [Renderer2, StampService, WelcomeModalComponent,
        { provide: MatDialogRef, useValue: {} }, ColorToolService],
    })
      .compileComponents();
  }));

  it('should be created', () => {
    const stampService: StampService = TestBed.get(StampService);
    expect(stampService).toBeTruthy();
  });

  it('should set the position of the stamp through its x and y coordinates', () => {
    const color = new ColorToolService();
    const service: StampService = new StampService(color);
    const stamp: DrawingViewComponent = new DrawingViewComponent({} as Renderer2, {} as DrawingToolFactory, {} as MatDialog,
      {} as ColorToolService, {} as GridService, {} as PolylineParamsService,
      {} as NotificationService, {} as GenerateStructSVGElementService, {} as GenerateElementService,
      {} as SelectionParamsService, {} as TextParamsService, {} as VelocityParamsService,
      {} as PaperweightManipulationService, {} as EraserParamsService, {} as ExportFileService, {} as ScaleManipulationService,
      {} as TranslateManipulationService, {} as PaintBucketService, {} as FountainPenParamsService);
    const position: MousePosition = stamp['currentPosition'];
    position.x = 10;
    position.y = 15;
    const positionAfterCenterX = position.x - service['scale'] / 2;
    const positionAfterCenterY = position.y - service['scale'] / 2;

    service.startDrawing(position);
    expect(service.getOriginX()).toEqual(positionAfterCenterX);
    expect(service.getOriginY()).toEqual(positionAfterCenterY);
  });

  it('should set default values when shortcuts are used', () => {
    const color = new ColorToolService();
    const service: StampService = new StampService(color);
    service.setDefault();
    expect(service['isReady']).toEqual(true);
    expect(service['stampUsed']).toEqual('');
  });

  it('should get rotation angle', () => {
    const color = new ColorToolService();
    const service: StampService = new StampService(color);
    service['orientationAngle'] = 15;
    const value = service.getRotationAngle();
    expect(value).toEqual(15);
  });

  it('should set the stamp to the link to chosen stamp', () => {
    const color = new ColorToolService();
    const service: StampService = new StampService(color);
    service['stampUsed'] = 'happy';
    service.setStamp();
    expect(service['stamp']).toEqual('assets/svg/happy.svg');
  });

  it('should submit element', () => {
    const color = new ColorToolService();
    const service: StampService = new StampService(color);
    const Elementpath: any = jasmine.createSpyObj('Element', ['setAttributeNS']);
    service.submitElement(Elementpath, 'image');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

  it('should return the orientation angle between 0 and 180', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    serviceTool['orientationAngle'] = 340;
    serviceTool.getRotationAngle();
    expect(serviceTool['orientationAngle']).toEqual(160);
  });

  it('should increment by 15 the orientation angle with the mouse wheel', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    4,
  });
    serviceTool.isAltPressed  = false;
    serviceTool['orientationAngle'] = 10;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(25);
  });

  it('should add -15 to the orientation angle with the mouse wheel', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    serviceTool.isAltPressed  = false;
    serviceTool['orientationAngle'] = 100;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(85);
  });

  it('should increment by 1 the orientation angle with the mouse wheel', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    4,
  });
    serviceTool.isAltPressed  = true;
    serviceTool['orientationAngle'] = 10;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(11);
  });

  it('should set degree to 0 if degree < 0', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    serviceTool.isAltPressed  = false;
    serviceTool['orientationAngle'] = 10;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(0);
  });

  it('should decrement the orientation angle with alt key (-1)', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    serviceTool.isAltPressed  = true;
    serviceTool['orientationAngle'] = 10;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(9);
  });

  it('should decrement the orientation angle with alt key and set the degree to 0 if degree < 0', () => {
    const colorTool = new ColorToolService();
    const serviceTool: StampService = new StampService(colorTool);
    serviceTool['isReady'] = true;
    const event1 = new WheelEvent('wheel', {
      deltaY:    -4,
  });
    serviceTool.isAltPressed  = true;
    serviceTool['orientationAngle'] = 0;
    serviceTool.setAngleWithMouse(event1);
    expect(serviceTool['orientationAngle']).toEqual(0);
  });
});
