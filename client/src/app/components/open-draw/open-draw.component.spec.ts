// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
// tslint:disable:max-line-length the length of the save draw could be more longuer than 140 characters
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef, MatFormFieldModule, MatIconModule, MatInputModule,
  MatOptionModule, MatPaginatorModule, MatSelectModule, MatSnackBarModule,
  MatTableModule, MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectFilterModule } from 'mat-select-filter';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPathPen } from '../../../../../common/class/struct-path-pen';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';
import { SvgImage } from '../../../../../common/SvgImage';
import { OpenDrawComponent } from './open-draw.component';

describe('OpenDrawComponent', () => {
  let component: OpenDrawComponent;
  let dialogSpy: jasmine.Spy;
  let fixture: ComponentFixture<OpenDrawComponent>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [OpenDrawComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        MatIconModule,
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatToolbarModule,
        MatFormFieldModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        HttpClientTestingModule,
        MatOptionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSelectFilterModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngOnInt on Initialization', () => {
    const spy = spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should get all saved Svg', () => {
    const spy = spyOn(component, 'getSavedSvg');
    component.getSavedSvg();
    expect(spy).toHaveBeenCalled();
  });

  it('should get all saved Svg from cloud', () => {
    const spy = spyOn(component, 'getSavedSvgfromCloud');
    component.getSavedSvgfromCloud();
    expect(spy).toHaveBeenCalled();
  });

  it('should close window and send null', () => {
    const SVG_IMAGE = new SvgImage();
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith(null);
    component.openDraw(SVG_IMAGE);
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

  it('should return a correct svgImage with a shapes wich contains a pen', () => {
    component['localDrawLaod'] = '1000px\n1000px\nrgb(255, 255, 255)\npen\n0\n \n1\n#000000\n26.45490698998229\nnone\nM597,314 L605,378 L597,314 M597,314\nround\nround\n';
    const svgImage = new SvgImage();
    svgImage.width = '1000px';
    svgImage.height = '1000px';
    svgImage.backgroundColor = 'rgb(255, 255, 255)';
    const shapeArray: StructPathPen[] = new Array();
    shapeArray.push(new StructPathPen('0', '#000000', '26.45490698998229', 'none', 'M597,314 L605,378 L597,314 M597,314', 'round', 'round'));
    svgImage.shapes.push(new StructPen('0', ' ', shapeArray));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains a text', () => {
    component['localDrawLaod'] = '1000px\n1000px\nrgb(255, 255, 255)\ntext\n0\n\n#000000\n0\n \n346\n384\n57\nCourier New\nbold\n \nstart\n1\n346\n384\nALLO\n';
    const svgImage = new SvgImage();
    svgImage.width = '1000px';
    svgImage.height = '1000px';
    svgImage.backgroundColor = 'rgb(255, 255, 255)';
    const tspanArray: StructTspan[] = new Array();
    tspanArray.push(new StructTspan('0', '346', '384', 'ALLO'));
    svgImage.shapes.push(new StructText('0', '', '#000000', '0', ' ', '346', '384', '57', 'Courier New', 'bold', ' ', 'start', tspanArray));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains a rectangle', () => {
    component['localDrawLaod'] = '1000px\n500px\nrgb(25, 132, 255)\nrect\n1\nRGBA(41,243,38,1)\nRGBA(156,24,156,1)\n17\n \n211\n163\n612\n214\n';
    const svgImage = new SvgImage();
    svgImage.width = '1000px';
    svgImage.height = '500px';
    svgImage.backgroundColor = 'rgb(25, 132, 255)';
    svgImage.shapes.push(new StructRectangle('1', 'RGBA(41,243,38,1)', 'RGBA(156,24,156,1)', '17', ' ', '211', '163', '612', '214'));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains a ellipse', () => {
    component['localDrawLaod'] = '837px\n1000px\nrgb(25, 220, 145)\nellipse\n1\n#000000\ntransparent\n12\n \n177\n59\n203\n141\n';
    const svgImage = new SvgImage();
    svgImage.width = '837px';
    svgImage.height = '1000px';
    svgImage.backgroundColor = 'rgb(25, 220, 145)';
    svgImage.shapes.push(new StructEllipse('1', '#000000', 'transparent', '12', ' ', '177', '59', '203', '141'));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains a polygon', () => {
    component['localDrawLaod'] = '874px\n100px\nrgb(255, 255, 255)\npolygon\n1\ntransparent\nRGBA(32,215,20,1)\n59\nrotate(49.398705354995535,303,35)\n303, -1 337, 24 324, 64 282, 64 269, 24 \n';
    const svgImage = new SvgImage();
    svgImage.width = '874px';
    svgImage.height = '100px';
    svgImage.backgroundColor = 'rgb(255, 255, 255)';
    svgImage.shapes.push(new StructPolygon('1', 'transparent', 'RGBA(32,215,20,1)', '59', '303, -1 337, 24 324, 64 282, 64 269, 24 ', 'rotate(49.398705354995535,303,35)'));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains a path', () => {
    component['localDrawLaod'] = '1000px\n1000px\nrgb(255, 255, 255)\npath\n1\n#000000\nnone\n1\n \nM170,153 L170,153 M170,153 L171,153 M171,153 L171,153 M171,153 L172,154 M172,154 L177,157 M177,157 L180,160 M180,160 L187,165 M187,165 L197,171 M197,171 L209,177 M209,177 L223,185 M223,185 L241,193 M241,193 L264,202 M264,202 L289,213 M289,213 L309,220 M309,220 L340,232 M340,232 L362,240 M362,240 L385,251 M385,251 L407,256 M407,256 L423,261 M423,261 L435,265 M435,265 L444,268 M444,268 L450,270 M450,270 L454,271 M454,271 L456,272 M456,272 L459,273 M459,273 L459,273 M459,273 L460,273 M460,273 \nround\n \n \n \n \n';
    const svgImage = new SvgImage();
    svgImage.width = '1000px';
    svgImage.height = '1000px';
    svgImage.backgroundColor = 'rgb(255, 255, 255)';
    svgImage.shapes.push(new StructPencil('1', '#000000', 'none', '1', ' ', 'M170,153 L170,153 M170,153 L171,153 M171,153 L171,153 M171,153 L172,154 M172,154 L177,157 M177,157 L180,160 M180,160 L187,165 M187,165 L197,171 M197,171 L209,177 M209,177 L223,185 M223,185 L241,193 M241,193 L264,202 M264,202 L289,213 M289,213 L309,220 M309,220 L340,232 M340,232 L362,240 M362,240 L385,251 M385,251 L407,256 M407,256 L423,261 M423,261 L435,265 M435,265 L444,268 M444,268 L450,270 M450,270 L454,271 M454,271 L456,272 M456,272 L459,273 M459,273 L459,273 M459,273 L460,273 M460,273 ', 'round', ' ', ' ', ' ', ' '));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

  it('should return a correct svgImage with a shapes wich contains an image', () => {
    component['localDrawLaod'] = '1000px\n1000px\nrgb(255, 255, 255)\nimage\n1\n\n\n\nrotate(0, 465,301.79998779296875)\n415\n251.79998779296875\n100\n100\nassets/svg/angry.svg\n';
    const svgImage = new SvgImage();
    svgImage.width = '1000px';
    svgImage.height = '1000px';
    svgImage.backgroundColor = 'rgb(255, 255, 255)';
    svgImage.shapes.push(new StructImage('1', '415', '251.79998779296875', '100', '100', 'rotate(0, 465,301.79998779296875)', 'assets/svg/angry.svg'));
    expect(component.createSVGImageFromString()[0]).toEqual(svgImage);
  });

});
