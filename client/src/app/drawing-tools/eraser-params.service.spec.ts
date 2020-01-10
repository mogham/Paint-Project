// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialogModule, MatMenuModule, MatRadioModule,
        MatSelectModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { GridComponent } from '../components/grid/grid.component';
import { NewDrawCreationComponent } from '../components/new-draw-creation/new-draw-creation.component';
import { AerosolComponent } from '../components/toolbar-view/aerosol/aerosol.component';
import { EllipseComponent } from '../components/toolbar-view/ellipse/ellipse.component';
import { EraserComponent } from '../components/toolbar-view/eraser/eraser.component';
import { FountainPenComponent } from '../components/toolbar-view/fountain-pen/fountain-pen.component';
import { LineComponent } from '../components/toolbar-view/line/line.component';
import { PaintBrushComponent } from '../components/toolbar-view/paint-brush/paint-brush.component';
import { PaintBucketComponent } from '../components/toolbar-view/paint-bucket/paint-bucket.component';
import { PenComponent } from '../components/toolbar-view/pen/pen.component';
import { PencilComponent } from '../components/toolbar-view/pencil/pencil.component';
import { PipetteComponent } from '../components/toolbar-view/pipette/pipette.component';
import { PolygonComponent } from '../components/toolbar-view/polygon/polygon.component';
import { RectangleComponent } from '../components/toolbar-view/rectangle/rectangle.component';
import { SelectComponent } from '../components/toolbar-view/select/select.component';
import { StampComponent } from '../components/toolbar-view/stamp/stamp.component';
import { TextComponent } from '../components/toolbar-view/text/text.component';
import { WelcomeModalComponent } from '../components/welcome-modal/welcome-modal.component';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from '../selection-manipulation/rotation-manipulation.service';
import { ColorToolService } from './color-tool.service';
import { EraserParamsService } from './eraser-params.service';
import { IntersectionParamsService } from './intersection-params.service';
import { SelectionParamsService } from './selection-params.service';

describe('EraserParamsService', () => {
  let component: DrawingViewComponent;
  let fixture: ComponentFixture<DrawingViewComponent>;
  let renderer: Renderer2;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatMenuModule,
        MatDialogModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatSelectModule,
        MatRadioModule,
        MatCheckboxModule,
      ],
      declarations: [
        DrawingViewComponent,
        AerosolComponent,
        EllipseComponent,
        EraserComponent,
        FountainPenComponent,
        LineComponent,
        PaintBrushComponent,
        PaintBucketComponent,
        PenComponent,
        PencilComponent,
        PipetteComponent,
        PolygonComponent,
        RectangleComponent,
        SelectComponent,
        StampComponent,
        TextComponent,
        WelcomeModalComponent,
        GridComponent,
        NewDrawCreationComponent,
      ],
      providers: [WelcomeModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .overrideModule(BrowserDynamicTestingModule, {
        set: {
          entryComponents: [
            WelcomeModalComponent,
            NewDrawCreationComponent,
          ],
        },
      })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should reset attributes when we have a mouse down', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const position: MousePosition = {} as MousePosition;
    position.x = 32;
    position.y = 52;
    service.onMouseDown(position);
    expect(service['elementToErase']).toEqual([]);
    expect(service['elementToSignal']).toEqual([]);
    expect(service['strokeElementSignal']).toEqual([]);
    expect(service['strokewidthElementSignal']).toEqual([]);
    expect(service['isMouseDown']).toEqual(true);
  });

  it('should set attributes when we have a mouse mouve', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const position: MousePosition = {} as MousePosition;
    position.x = 32;
    position.y = 52;
    service.onMouseMove(position);
    expect(service['fill']).toEqual('white');
    expect(service['stroke']).toEqual('black');
    expect(service['originX']).toEqual(position.x);
    expect(service['originY']).toEqual(position.y);
    expect(service['isActivated']).toEqual(true);
  });

  it('should set attributes when we start drawing', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    service.startDrawing();
    expect(service['elementToErase']).toEqual([]);
  });

  it('should set attributes when we start drawing', () => {
    // tslint:disable-next-line:no-unused-expression
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const svgNS = 'http://www.w3.org/2000/svg';
    const eraser: Element = renderer.createElement('rect', svgNS);
    eraser.setAttribute('x', '0');
    eraser.setAttribute('y', '0');
    eraser.setAttribute('width', '20');
    eraser.setAttribute('height', '20');
    eraser.setAttribute('elementID', 'eraser');
    const rectIntersect: Element = renderer.createElement('rect', svgNS);
    rectIntersect.setAttribute('x', '10');
    rectIntersect.setAttribute('y', '10');
    rectIntersect.setAttribute('width', '20');
    rectIntersect.setAttribute('height', '20');
    eraser.setAttribute('elementID', '20');
    component['svg'].nativeElement.appendChild(rectIntersect);
    service.findIntersections(eraser, component['svg']);
    expect(service['elementToErase']).toEqual([]);
  });

  it('should set attributes of the elements to signal', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectToSignal: Element = document.createElementNS(svgNS, 'rect');
    rectToSignal.setAttribute('x', '10');
    rectToSignal.setAttribute('y', '10');
    rectToSignal.setAttribute('width', '20');
    rectToSignal.setAttribute('height', '20');
    service['elementToSignal'] = [];
    service['elementToSignal'].push(rectToSignal);
    service.signalElement();
    rectToSignal.setAttribute('stroke', 'red');
    rectToSignal.setAttribute('stroke-width', '8px');
    expect(service['elementToSignal'][0]).toEqual(rectToSignal);
  });

  it('should restore attributes of the elements to signal', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectToSignal: Element = document.createElementNS(svgNS, 'rect');
    rectToSignal.setAttribute('x', '10');
    rectToSignal.setAttribute('y', '10');
    rectToSignal.setAttribute('width', '20');
    rectToSignal.setAttribute('height', '20');
    const rectToSignal2: Element = rectToSignal;
    service['elementToSignal'].push(rectToSignal);
    service.signalElement();
    service['strokewidthElementSignal'] = new Array();
    service['strokewidthElementSignal'].push('2px');
    service['strokeElementSignal'] = new Array();
    service['strokeElementSignal'].push('blue');
    service.unsignalElement();
    rectToSignal2.setAttribute('stroke', 'blue');
    rectToSignal2.setAttribute('stroke-width', '2px');
    expect(rectToSignal2).toEqual(rectToSignal);
  });

  it('should signal elements', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectToSignal: Element = document.createElementNS(svgNS, 'rect');
    rectToSignal.setAttribute('x', '10');
    rectToSignal.setAttribute('y', '10');
    rectToSignal.setAttribute('width', '20');
    rectToSignal.setAttribute('height', '20');
    rectToSignal.setAttribute('stroke', 'blue');
    rectToSignal.setAttribute('stroke-width', '20');
    const rectToSignal2: Element = rectToSignal;
    service['elementToSignal'].push(rectToSignal);
    service.signalElement();
    rectToSignal2.setAttribute('stroke', 'red');
    rectToSignal2.setAttribute('stroke-width', '10px');
    expect(rectToSignal2).toEqual(rectToSignal);
  });
});
