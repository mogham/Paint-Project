// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatCheckboxModule, MatDialogModule, MatExpansionModule, MatMenuModule,
          MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { ColorToolService } from '../drawing-tools/color-tool.service';
import { IntersectionParamsService } from '../drawing-tools/intersection-params.service';
import { SelectionParamsService } from '../drawing-tools/selection-params.service';
import { PaperweightManipulationService } from '../selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from '../selection-manipulation/rotation-manipulation.service';
import { CopyPasteCommand } from './copypaste-command.service';
describe('CopyPasteParamsService', () => {
  let fixture: ComponentFixture<DrawingViewComponent>;
  let drawingView: DrawingViewComponent;
  let renderer: Renderer2;
  let service: CopyPasteCommand;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        BrowserAnimationsModule,
        FormsModule,
        MatExpansionModule,
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
  TestBed.configureTestingModule({});
  fixture = TestBed.createComponent(DrawingViewComponent);
  renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  drawingView = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should undoSVG', () => {
    const elementErased: Element[] = [];
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    const rectHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    rectHTMLElement.setAttribute('id', 'rect');
    rectHTMLElement.setAttribute('elementID', '1');
    const rectangle1: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const rectangle2: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    elementErased.push(ellipseHTMLElement);
    elementErased.push(rectHTMLElement);
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService,
      {} as RotationManipulationService);
    selection['selectionShapes'].set('0', rectangle1);
    selection['selectionShapes'].set('1', rectangle2);
    service = new CopyPasteCommand(elementErased, selection);
    const shapes: Element[] = [];
    const svg: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    svg.appendChild(rectHTMLElement);
    svg.appendChild(rectangle1);
    svg.appendChild(rectangle2);
    svg.appendChild(ellipseHTMLElement);
    shapes.push(rectHTMLElement);
    shapes.push(ellipseHTMLElement);
    service.undoSVG(shapes, svg);
    expect(service['shapesToPaste'].length).toEqual(2);
    expect(shapes.length).toEqual(0);
  });

  it('should redoSVG', () => {
    const elementToPaste: Element[] = [];
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    const rectHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    rectHTMLElement.setAttribute('id', 'rect');
    rectHTMLElement.setAttribute('elementID', '1');
    elementToPaste.push(ellipseHTMLElement);
    elementToPaste.push(rectHTMLElement);
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService,
      {} as RotationManipulationService);
    service = new CopyPasteCommand([], selection);
    service['shapesToPaste'] = elementToPaste;
    const shapes: Element[] = [];
    const svg = drawingView['svg'];
    service.redoSVG(shapes, svg, renderer);
    expect(service['shapesToErase'].length).toEqual(2);
    expect(shapes.length).toEqual(2);
  });

});
