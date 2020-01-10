// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatCheckboxModule, MatDialogModule, MatMenuModule, MatRadioModule, MatSelectModule,
  MatSliderModule, MatSnackBarModule } from '@angular/material';
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
import { PaperweightManipulationService } from './paperweight-manipulation.service';

describe('PaperweightManipulationService', () => {
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
    fixture.detectChanges();
  });
  it('should be created', () => {
    const service: PaperweightManipulationService = TestBed.get(PaperweightManipulationService);
    expect(service).toBeTruthy();
  });

  it('should copy selection into paperweight and set some attributes', () => {
    const service: PaperweightManipulationService = new PaperweightManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    shapes.push(ellipse);
    service.copy(shapes, 15, 20, 50, 40);
    expect(service['paperweight']).toEqual(shapes);
    expect(service['isDuplication']).toEqual(false);
    expect(service['numberOfPast']).toEqual(1);
  });

  it('should copy selection into paperweight and set some attributes', () => {
    const service: PaperweightManipulationService = new PaperweightManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    shapes.push(ellipse);
    service.copy(shapes, 15, 20, 50, 40);
    expect(service['paperweight']).toEqual(shapes);
    expect(service['isDuplication']).toEqual(false);
    expect(service['numberOfPast']).toEqual(1);
  });

  it('should duplicate selection into paperweightForDuplication and set some attributes', () => {
    const service: PaperweightManipulationService = new PaperweightManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const shapes = new Array<Element>();
    shapes.push(rectangle);
    shapes.push(ellipse);
    service.duplicate(shapes);
    expect(service['paperweightForDuplication']).toEqual(shapes);
    expect(service['isDuplication']).toEqual(true);
    expect(service['numberOfPast']).toEqual(1);
  });

  it('should duplicate selection into paperweightForDuplication without change paperweight', () => {
    const service: PaperweightManipulationService = new PaperweightManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const ellipse = document.createElementNS(svgNS, 'ellipse');
    ellipse.setAttributeNS(null, 'fill', '#00000000');
    rectangle.setAttributeNS(null, 'fill', '#00000000');
    const shapesToCopy = new Array<Element>();
    const shapesToDuplicate = new Array<Element>();
    shapesToDuplicate.push(rectangle);
    shapesToCopy.push(ellipse);
    service.copy(shapesToCopy, 15, 20, 50, 40);
    service.duplicate(shapesToDuplicate);
    expect(service['paperweightForDuplication']).toEqual(shapesToDuplicate);
    expect(service['paperweight']).toEqual(shapesToCopy);
  });

  it('should return a selection copy to paste it', () => {
    const service: PaperweightManipulationService = new PaperweightManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const ellipse = renderer.createElement('ellipse', svgNS);
    ellipse.setAttributeNS(null, 'cx', '#00000000');
    ellipse.setAttributeNS(null, 'id', 'ellipse');
    const rectangle = renderer.createElement('rectangle', svgNS);
    rectangle.setAttributeNS(null, 'x', '#00000000');
    rectangle.setAttributeNS(null, 'id', 'rectangle');
    const image = renderer.createElement('image', svgNS);
    image.setAttributeNS(null, 'href', '#angry');
    image.setAttributeNS(null, 'id', 'stamp');
    const polygon = renderer.createElement('rectangle', svgNS);
    polygon.setAttributeNS(null, 'points', '(00 00 00 1 1 1 3 3 3)');
    polygon.setAttributeNS(null, 'id', 'polygon');

    const path = renderer.createElement('path', svgNS);
    path.setAttributeNS(null, 'd', 'M10 20 L34');
    path.setAttributeNS(null, 'id', 'path');
    const text = renderer.createElement('text', svgNS);
    text.setAttributeNS(null, 'id', 'text');

    const shapes = new Array();
    shapes.push(ellipse);
    shapes.push(rectangle);
    shapes.push(image);
    shapes.push(polygon);
    shapes.push(path);
    shapes.push(text);
    service.copy(shapes, 15, 20, 50, 40);
    const shapesToCopy = service.paste(renderer, 1000, 1000);
    expect(shapesToCopy[0].getAttribute('rx')).toEqual(ellipse.getAttribute('rx'));
    expect(shapesToCopy[0].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[0].getAttribute('id')).toEqual('ellipse');
    expect(shapesToCopy[1].getAttribute('x')).toEqual(rectangle.getAttribute('x'));
    expect(shapesToCopy[1].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[1].getAttribute('id')).toEqual('rectangle');
    expect(shapesToCopy[2].getAttribute('href')).toEqual(image.getAttribute('href'));
    expect(shapesToCopy[2].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[2].getAttribute('id')).toEqual('stamp');
    expect(shapesToCopy[3].getAttribute('points')).toEqual(polygon.getAttribute('points'));
    expect(shapesToCopy[3].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[3].getAttribute('id')).toEqual('polygon');
    expect(shapesToCopy[4].getAttribute('d')).toEqual(path.getAttribute('d'));
    expect(shapesToCopy[4].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[4].getAttribute('id')).toEqual('path');
    expect(shapesToCopy[5].getAttribute('transform')).toEqual('translate(10,10)');
    expect(shapesToCopy[5].getAttribute('id')).toEqual('text');
  });
});
