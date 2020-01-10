// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {  MatCheckboxModule, MatDialogModule, MatExpansionModule,
        MatMenuModule, MatRadioModule, MatSelectModule, MatSliderModule, MatSnackBarModule } from '@angular/material';
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
import { ManipulationSelectionCommand } from './manipulation-selection-command.service';

describe('ManipulationSelectionCommand', () => {
  let fixture: ComponentFixture<DrawingViewComponent>;
  let drawingView: DrawingViewComponent;
  let renderer: Renderer2;
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
    ] } });
  }));
  beforeEach(() => {
  TestBed.configureTestingModule({});
  fixture = TestBed.createComponent(DrawingViewComponent);
  renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  drawingView = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should undo Transformation', () => {
    const transformationToDelete: Element[] = [];
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    ellipseHTMLElement.setAttribute('transform', 'translate(10, 20) rotate(30, 40, 40)');
    const rectHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    rectHTMLElement.setAttribute('id', 'rect');
    rectHTMLElement.setAttribute('elementID', '1');
    rectHTMLElement.setAttribute('transform', 'translate(10, 20) rotate(30, 40, 40)');
    transformationToDelete.push(ellipseHTMLElement);
    transformationToDelete.push(rectHTMLElement);
    const transform = 'translate(10, 20)';
    const selection = new SelectionParamsService({} as ColorToolService,
                                                  {} as IntersectionParamsService, {} as PaperweightManipulationService,
                                                  {} as RotationManipulationService);
    const rectangle1: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const rectangle2: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    selection['selectionShapes'].set('0', rectangle1);
    selection['selectionShapes'].set('1', rectangle2);
    const service = new ManipulationSelectionCommand(transform, transformationToDelete, selection);
    const shapes: Element[] = [];
    const svg = drawingView['svg'];
    svg.nativeElement.appendChild(rectHTMLElement);
    svg.nativeElement.appendChild(rectangle1);
    svg.nativeElement.appendChild(ellipseHTMLElement);
    svg.nativeElement.appendChild(rectangle2);
    shapes.push(rectHTMLElement);
    shapes.push(ellipseHTMLElement);
    service.undoSVG(shapes, svg, renderer);
    expect(service['transformationToRestore'].length).toEqual(2);
    expect(rectHTMLElement.getAttribute('transform')).toEqual(' rotate(30, 40, 40)');
  });

  it('should redo Transformation', () => {
    const transformationToRestore: Element[] = [];
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    ellipseHTMLElement.setAttribute('transform', 'translate(10, 20) rotate(30, 40, 40)');
    const rectHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    rectHTMLElement.setAttribute('id', 'rect');
    rectHTMLElement.setAttribute('elementID', '1');
    rectHTMLElement.setAttribute('transform', 'translate(10, 20) rotate(30, 40, 40)');
    transformationToRestore.push(ellipseHTMLElement);
    transformationToRestore.push(rectHTMLElement);
    const transform = 'scale(2, 2)';
    const selection = new SelectionParamsService({} as ColorToolService,
                                                  {} as IntersectionParamsService, {} as PaperweightManipulationService,
                                                  {} as RotationManipulationService);
    const rectangle1: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    const rectangle2: HTMLElement = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    selection['selectionShapes'].set('0', rectangle1);
    selection['selectionShapes'].set('1', rectangle2);
    const service = new ManipulationSelectionCommand(transform, [], selection);
    service['transformationToRestore'] = transformationToRestore;
    const shapes: Element[] = [];
    const svg = drawingView['svg'];
    svg.nativeElement.appendChild(rectHTMLElement);
    svg.nativeElement.appendChild(rectangle1);
    svg.nativeElement.appendChild(ellipseHTMLElement);
    svg.nativeElement.appendChild(rectangle2);
    shapes.push(rectHTMLElement);
    shapes.push(ellipseHTMLElement);
    service.redoSVG(shapes, svg, renderer);
    expect(service['transformationToDelete'].length).toEqual(2);
    expect(rectHTMLElement.getAttribute('transform')).toEqual('scale(2, 2) translate(10, 20) rotate(30, 40, 40)');
  });

  it('should get the Transformation elements to delete', () => {
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService,
      {} as RotationManipulationService);
    const newService: ManipulationSelectionCommand = new ManipulationSelectionCommand('translate (20, 20) ', [], selection);
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    newService['transformationToDelete'] = [ellipseHTMLElement];
    expect(newService.gettransformationToDelete()).toEqual([ellipseHTMLElement]);
  });

  it('should get the Transformation elements to restore', () => {
    const selection = new SelectionParamsService({} as ColorToolService,
      {} as IntersectionParamsService, {} as PaperweightManipulationService,
      {} as RotationManipulationService);
    const newService: ManipulationSelectionCommand = new ManipulationSelectionCommand('translate (20, 20) ', [], selection);
    const ellipseHTMLElement: Element = document.createElementNS('http://www.w3.org/1999/xhtml', 'Element');
    ellipseHTMLElement.setAttribute('id', 'ellipse');
    ellipseHTMLElement.setAttribute('elementID', '0');
    newService['transformationToRestore'] = [ellipseHTMLElement];
    expect(newService.getTransformationToRestore()).toEqual([ellipseHTMLElement]);
  });

});
