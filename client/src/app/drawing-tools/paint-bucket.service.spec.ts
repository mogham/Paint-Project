// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
// tslint:disable: max-line-length
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule, MatDialogModule, MatMenuModule,
MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
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
import { ColorToolService } from './color-tool.service';
import { PaintBucketService } from './paint-bucket.service';

describe('PaintBucketService', () => {
  const colorSrvice = new ColorToolService();
  const paintService: PaintBucketService = new PaintBucketService(colorSrvice);
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
      providers : [WelcomeModalComponent],
      schemas : [CUSTOM_ELEMENTS_SCHEMA],
    })
    .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [
      WelcomeModalComponent,
      NewDrawCreationComponent,
    ] } })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingViewComponent);
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should be created', () => {
    const service: PaintBucketService = TestBed.get(PaintBucketService);
    expect(service).toBeTruthy();
  });

  it('should have svgToBase64', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    paintService.svg = svg;
    const expectedValue = 'data:image/svg+xml;base64,' + btoa(new XMLSerializer().serializeToString(svg as Node));
    expect(paintService.svgToBase64()).toEqual(expectedValue);
  });

  it('should have encodedImage', () => {
    paintService.width = '10px';
    paintService.height = '10px';
    const spy = spyOn(paintService, 'svgToBase64');
    paintService.encodImage();
    expect(spy).toHaveBeenCalled();
  });

  it('should create small path', async () => {
    // const SVG_NS = 'http://www.w3.org/2000/svg';
    colorSrvice.setPrimaryColor('blue');
    colorSrvice.setSecondColor('red');
    component['widthDraw'] = '10px';
    component['heightDraw'] = '10px';
    component.onCreate();
    const rectangleHTMLElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectangleHTMLElement.setAttribute('id', 'rectangle');
    rectangleHTMLElement.setAttribute('elementID', '1');
    rectangleHTMLElement.setAttribute('stroke', '#ffffffff');
    rectangleHTMLElement.setAttribute('fill', '#000000ff');
    rectangleHTMLElement.setAttribute('stroke-width', '2');
    rectangleHTMLElement.setAttribute('x', '2');
    rectangleHTMLElement.setAttribute('y', '2');
    rectangleHTMLElement.setAttribute('width', '5');
    rectangleHTMLElement.setAttribute('transform', ' ');
    rectangleHTMLElement.setAttribute('height', '5');
    component['svg'].nativeElement.appendChild(rectangleHTMLElement);
    const position: MousePosition = {} as MousePosition;
    position.x = 5;
    position.y = 5;
    paintService['plot'] = 'contour';
    paintService.setRendererAndSVG(renderer, component['svg'].nativeElement.cloneNode(true),
    component['widthDraw'], component['heightDraw']);
    await paintService.drawImageOnCanvas().then(() => {
      let pathBucket = paintService.createPath(position);
      pathBucket = pathBucket === undefined ? {} as HTMLElement : pathBucket;
      expect(pathBucket.getAttribute('d')).toEqual('M 5 5 L 5 4 L 5 3 L 4 3 L 3 3 L 3 4 L 3 5 L 4 5 Z');
    });
  }, 10000);
});
