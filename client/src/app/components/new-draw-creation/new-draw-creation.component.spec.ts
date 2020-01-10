// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components

import {CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

import { NewDrawCreationComponent } from './new-draw-creation.component';

const RANDOM_COLOR_FOR_TESTS = 'RGBA(100,100,100,1)';
const HEXADECIMAL_RANDOM_COLOR = '#ABCD12';
const RANDOM_NUMBER_FOR_TESTS = 100;

describe('NewDrawCreationComponent', () => {
  let dialogSpy: jasmine.Spy;
  let component: NewDrawCreationComponent;
  let fixture: ComponentFixture<NewDrawCreationComponent>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ NewDrawCreationComponent ],
      schemas : [CUSTOM_ELEMENTS_SCHEMA],
      imports : [ReactiveFormsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
    ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should choose hexadecimal', () => {
    component.chooseHexadecimal();
    expect(component['showPalette']).toEqual(false);
    expect(component['showRGBA']).toEqual(false);
  });

  it('should choose palette', () => {
    component.choosePalette();
    expect(component['showHexadecimal']).toEqual(false);
    expect(component['showRGBA']).toEqual(false);
  });

  it('should choose RGBA', () => {
    component.chooseRGBA();
    expect(component['showHexadecimal']).toEqual(false);
    expect(component['showPalette']).toEqual(false);
  });

  it('should set color', () => {
    component.setColor(RANDOM_COLOR_FOR_TESTS);
    expect(component.getColor()).toEqual(RANDOM_COLOR_FOR_TESTS);
  });

  it('should return height', () => {
    const form: FormGroup = new FormGroup({height: new FormControl(1000)});
    const formSpy: any = jasmine.createSpyObj('FormGroup', ['value']);
    formSpy.value.and.returnValue(form);
    expect(component.getHeight()).toEqual(1000);
  });

  it('should return width', () => {
    const form: FormGroup = new FormGroup({width: new FormControl(1000)});
    const formSpy: any = jasmine.createSpyObj('FormGroup', ['value']);
    formSpy.value.and.returnValue(form);
    expect(component.getWidth()).toEqual(1000);
  });

  it('should set Color From Palette value', () => {
    spyOn(component , 'getRGBA');
    spyOn(component , 'setValueInForm');
    component.setColorFromPalette();
    expect(component.getRGBA).toHaveBeenCalled();
    expect(component.setValueInForm).toHaveBeenCalled();
  });

  it('should convert hexadecimal value To Rgba', () => {
    spyOn(component , 'setValueInForm');
    component.hexToRgba();
    expect(component.setValueInForm).toHaveBeenCalled();
  });

  it('should get RGBA', () => {
    component.setColor(RANDOM_COLOR_FOR_TESTS);
    component.getRGBA();
    expect(component['redColorPicker']).toEqual(RANDOM_NUMBER_FOR_TESTS);
  });

  it('should insert form group', () => {
    spyOn(component.form , 'setValue');
    component.insertFormGroup(RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS,
            RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS);
    expect(component.form.setValue).toHaveBeenCalled();
  });

  it('should submit form value with hexadecimal', () => {
    component['showHexadecimal'] = true;
    component['showPalette'] = false;
    spyOn(component , 'hexToRgba');
    component.onSubmit();
    expect(component.hexToRgba).toHaveBeenCalled();
  });

  it('should submit form value with palette', () => {
    component['showHexadecimal'] = false;
    component['showPalette'] = true;
    spyOn(component , 'setColorFromPalette');
    component.onSubmit();
    expect(component.setColorFromPalette).toHaveBeenCalled();
  });

  it('should close Dialog Ref', () => {
    spyOn(component.form, 'reset');
    component.close();
    expect(component.form.reset).toHaveBeenCalled();
  });

  it('should set value in form', () => {
    spyOn(component.form, 'setValue');
    component.setValueInForm(RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS
                              , RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, HEXADECIMAL_RANDOM_COLOR );
    expect(component.form.setValue).toHaveBeenCalled();
  });

  it('should activate color in paletee', () => {
    component['showPalette'] = true ;

    component['color'] = 'rgba(255,255,255,1)';
    component.activateColorInPalette();
    expect(component['colorChoosed']).toEqual(true);

    component['color'] = '';
    component.activateColorInPalette();
    expect(component['colorChoosed']).toEqual(false);
  });

  it('should activate color in RGBA', () => {
    component['showRGBA'] = true ;

    component.setValueInForm(RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS
      , RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, 1, HEXADECIMAL_RANDOM_COLOR );
    component.activateColorInRGBA();
    expect(component['colorChoosed']).toEqual(true);

    component.setValueInForm(RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS
      , RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, HEXADECIMAL_RANDOM_COLOR );
    component.activateColorInRGBA();
    expect(component['colorChoosed']).toEqual(false);
  });

  it('should activate color in hexa', () => {
    component['showHexadecimal'] = true ;

    component.setValueInForm(RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS
      , RANDOM_NUMBER_FOR_TESTS, RANDOM_NUMBER_FOR_TESTS, 1, 'null' );
    component.activateColorInHex();
    expect(component['colorChoosed']).toEqual(false);

  });

  it('should activate Width', () => {
    spyOn(component, 'getWidth').and.returnValue(RANDOM_NUMBER_FOR_TESTS) ;
    component.activateWidth();
    expect(component['widthChoosed']).toEqual(true);

  });

  it('should activate Height', () => {
    spyOn(component, 'getHeight').and.returnValue(RANDOM_NUMBER_FOR_TESTS) ;
    component.activateHeight();
    expect(component['heightChoosed']).toEqual(true);

  });

});
