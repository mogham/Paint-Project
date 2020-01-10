// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
// tslint:disable:max-line-length because the content of the file can be more than 140 characters
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatChipsModule, MatDialogModule, MatDialogRef, MatIconModule } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaveService } from 'src/app/server-services/save.service';
import { HttpClientSpy } from 'src/app/test-files.spec';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPathPen } from '../../../../../common/class/struct-path-pen';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructSVGElement } from '../../../../../common/class/struct-svgelement';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';
import { SaveDrawComponent } from './save-draw.component';

describe('SaveDrawComponent', () => {
  let fixture: ComponentFixture<SaveDrawComponent>;
  let dialogSpy: jasmine.Spy;
  const nativeELementfake = {
    innerHTML: 'test',
  };
  const svgElementFake = {
    nativeElement: nativeELementfake,
  };
  let component: SaveDrawComponent;
  let httpClientSpy: HttpClientSpy;
  const data = {
    elements: 'svgElements',
    width: '10px',
    height: '10px',
    tags: ['hello'],
    svg: svgElementFake,
    backgroundColor: '#000000',
  };
  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [SaveDrawComponent, MatAutocomplete],
      imports: [ReactiveFormsModule, MatChipsModule, MatDialogModule, HttpClientTestingModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
        MatIconModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'delete']);
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SaveDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get name', () => {
    expect(component.getName()).toEqual(component.form.value.name);
  });

  it('should close', () => {
    const spy = spyOn(component.form, 'reset');
    component.close();
    expect(spy).toHaveBeenCalled();
  });

  it('should save on server', () => {
    const service = new SaveService(httpClientSpy);
    component['saveService'] = service;
    expect(component['saveService']).toEqual(service);
    component.createObject();
    const spy = spyOn(component, 'saveOnDataBase');
    component.saveOnDataBase();
    expect(spy).toHaveBeenCalled();
  });

  it('should save on cloud', () => {
    const service = new SaveService(httpClientSpy);
    component['saveService'] = service;
    expect(component['saveService']).toEqual(service);
    // component.createObject();
    const spy = spyOn(component, 'saveOnCloud');
    component.saveOnCloud();
    expect(spy).toHaveBeenCalled();
  });

  it('should create object', () => {
    const svgElements: StructSVGElement[] = [];
    svgElements.push(new StructRectangle('1', 'rect', 'black', 'yellow', ' ', '3', '10', '10', '50'));
    const dataTest = {
      elements: 'svgElements',
      width: '10px',
      height: '10px',
      tags: ['hello'],
      backgroundColor: '#000000',
    };
    component['data'] = dataTest;
    expect(component['obj'].height).toEqual('');
    expect(component['obj'].backgroundColor).toEqual('');
    expect(component['obj'].width).toEqual('');
    component.createObject();
    expect(component['obj'].height).toEqual('10px');
    expect(component['obj'].backgroundColor).toEqual('#000000');
    expect(component['obj'].width).toEqual('10px');
  });

  it('should remove', () => {
    component.tags = ['Tests'];
    expect(component.tags.length).not.toEqual(0);
    component.remove('Tests');
    expect(component.tags.length).toEqual(0);
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the rectangle of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const rectangle: StructRectangle = new StructRectangle('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', '63', '18');
    component['obj'].shapes.push(rectangle);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\nrect\n1\n#ffffffff\n#000000ff\n5\n \n30\n45\n63\n18\n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the ellipse of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const ellipse: StructEllipse = new StructEllipse('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', '63', '18');
    component['obj'].shapes.push(ellipse);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\nellipse\n1\n#ffffffff\n#000000ff\n5\n \n30\n45\n63\n18\n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the path of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const pencil: StructPencil = new StructPencil('1', '#ffffffff', '#000000ff', '5', ' ', '30', '45', 'M32', ' ', ' ', ' ');
    component['obj'].shapes.push(pencil);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\npath\n1\n#ffffffff\n#000000ff\n5\n \n30\n45\nM32\n \n \n \n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the polygon of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const polygon: StructPolygon = new StructPolygon('1', '#ffffffff', '#000000ff', '5', '30', '45');
    component['obj'].shapes.push(polygon);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\npolygon\n1\n#ffffffff\n#000000ff\n5\n45\n30\n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the image of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const image: StructImage = new StructImage('1', '5', '45', '5', '30', '45', 'M32');
    component['obj'].shapes.push(image);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\nimage\n1\n \n \n \n45\n5\n45\n5\n30\nM32\n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the text and tspan of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const tspan: StructTspan[] = new Array();
    tspan.push(new StructTspan('1', '10', '10', 'allo'));
    const image: StructText = new StructText('1', '1', '5', '45', 'translate(10,10)', '5', '30',
      '45', 'comic', '18', 'italic', 'start', tspan);
    component['obj'].shapes.push(image);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\ntext\n1\n1\n5\n45\ntranslate(10,10)\n5\n30\n45\ncomic\n18\nitalic\nstart\n1\n10\n10\nallo\n');
  });

  it('should fill drawAsString with width, height, backgroundcolor, and the pen and its path of its obj', () => {
    component['obj'].width = '1000px';
    component['obj'].height = '500px';
    component['obj'].backgroundColor = 'RGBA(255,23,32)';
    component['obj'].shapes = [];
    const pathArray: StructPathPen[] = new Array();
    pathArray.push(new StructPathPen('1', '1', '10', '10', 'alM32lo', 'round', 'round'));
    const image: StructPen = new StructPen('1', ' ', pathArray);
    component['obj'].shapes.push(image);
    component.svgImageToString();
    expect(component['drawAsString']).toEqual('1000px\n500px\nRGBA(255,23,32)\npen\n1\n \n1\n1\n10\n10\nalM32lo\nround\nround\n');
  });

  it('should call svgImageToString', () => {
    component['isLocal'] = true;
    const spy = spyOn(component, 'svgImageToString');
    component.saveLocal();
    expect(spy).toHaveBeenCalled();
  });
  it('should add tag', () => {
    const spy = spyOn(component['tagCtrl'], 'setValue');
    component.add({} as MatChipInputEvent);
    expect(spy).toHaveBeenCalled();
  });

});
