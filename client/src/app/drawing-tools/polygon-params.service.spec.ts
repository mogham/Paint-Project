// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatExpansionModule, MatMenuModule, MatSnackBarModule } from '@angular/material';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { dot } from 'mathjs';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingViewComponent } from '../components/drawing-view/drawing-view.component';
import { NewDrawCreationComponent } from '../components/new-draw-creation/new-draw-creation.component';
import { PolygonComponent } from '../components/toolbar-view/polygon/polygon.component';
import { WelcomeModalComponent } from '../components/welcome-modal/welcome-modal.component';
import { ColorToolService } from './color-tool.service';
import { PolygonParamsService } from './polygon-params.service';

describe('PolygonParamsService', () => {
  let fixture: ComponentFixture<DrawingViewComponent>;
  let service: PolygonParamsService;
  let renderer: Renderer2;
  let color: ColorToolService;
  let polygon: DrawingViewComponent;
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
      ],
      declarations: [
        DrawingViewComponent,
        PolygonComponent,
        WelcomeModalComponent,
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
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(DrawingViewComponent);
    color = new ColorToolService();
    polygon = fixture.componentInstance;
    renderer = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
    service = new PolygonParamsService(color);
    fixture.detectChanges();
  });

  it('should calculate the vertices coordinates', () => {
    service = new PolygonParamsService(color);
    const slides = service['slides'] = 1;
    const originX = service['originX'] = 0;
    const originY = service['originY'] = 2;
    const radius = service['radius'] = 10;
    const angle = 2 * Math.PI / slides;
    const x = Math.round(originX + radius * Math.cos(angle - Math.PI / 2));
    const y = Math.round(originY + radius * Math.sin(angle - Math.PI / 2));
    const vertices = x + ' ' + y + ' ';
    service.calculateVertices();
    expect(vertices).toEqual(service['vertices']);
  });

  it('should set arrayX', () => {
    const array = [1, 2, 3];
    service.setArrayX(array);
    expect(service['arrayX']).toEqual(array);
  });

  it('should set arrayY', () => {
    const array = [1, 2, 3];
    service.setArrayY(array);
    expect(service['arrayY']).toEqual(array);
  });

  it('should set default values to essential parameters', () => {
    const newService = new PolygonParamsService(color);
    newService.setDefault();
    expect(newService['isReady']).toEqual(true);
    expect(newService['plot']).toEqual('contour');
  });

  it('should start drawing the polygon by setting the cx and cy of the circle', () => {
    service = new PolygonParamsService(color);
    const position: MousePosition = polygon['currentPosition'];
    service = new PolygonParamsService(color);
    position.x = 10;
    position.y = 15;
    service.startDrawing(position);
    expect(service.getOriginX()).toEqual(position.x);
    expect(service.getOriginY()).toEqual(position.y);
  });

  it('should draw the polygon by setting the radius of the cicrle', () => {
    const position: MousePosition = polygon['currentPosition'];
    service = new PolygonParamsService(color);
    position.x = 10;
    service.draw(position);
    expect(service['radius']).toEqual(position.x - service.getOriginX());

  });

  it('should submit element', () => {
    const Elementpath: any = jasmine.createSpyObj('Element', ['setAttributeNS']);
    service = new PolygonParamsService(color);
    service.submitElement(Elementpath, 'polygon');
    expect(Elementpath.setAttributeNS).toHaveBeenCalled();
  });

  it('should set slides', () => {
    const slides = 5;
    service = new PolygonParamsService(color);
    service.setSlides(slides);
    expect(service['slides']).toEqual(slides);
  });

  it('should calculate angleRotation', () => {
    const position: MousePosition = polygon['currentPosition'];
    service = new PolygonParamsService(color);
    position.x = 10;
    position.y = 15;
    service['originX'] = 0;
    service['originY'] = 20;
    service['radius'] = 10;
    const vector1 = [service['radius'], 0];
    const vector2 = [position.x - service['originX'], position.y - service['originY']];
    let angleRotation = Math.acos((dot(vector1, vector2)) /
      (Math.sqrt(Math.pow(vector1[0], 2)) * (Math.sqrt(Math.pow(vector2[0], 2) + Math.pow(vector2[1], 2)))));
    angleRotation = angleRotation * (180 / Math.PI) * -1;
    service.calculateAngle(position);
    expect(angleRotation).toEqual(service['angleRotation']);
  });

  it('should set the angleRotation to zero', () => {
    const position: MousePosition = polygon['currentPosition'];
    service = new PolygonParamsService(color);
    position.x = 10;
    position.y = 15;
    service['radius'] = 0;
    service.calculateAngle(position);
    expect(service['angleRotation']).toEqual(0);
  });

  it('should update polygon points', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const poly = renderer.createElement('polygon', svgNS);
    poly.setAttributeNS(null, 'fill', '#00000000');
    polygon.svg.nativeElement.appendChild(poly);
    service = new PolygonParamsService(color);
    service['arrayX'] = [1, 3, 5];
    service['arrayY'] = [2, 4, 6];
    const vertices = service['vertices'] = '1 2 3 4 5 6';
    poly.setAttributeNS(null, 'points', service['vertices']);
    expect(poly.getAttribute('points')).toEqual(service['vertices']);
    service.updatePolygonPoints(poly);
    expect(vertices).not.toEqual(service['vertices']);
  });

});
