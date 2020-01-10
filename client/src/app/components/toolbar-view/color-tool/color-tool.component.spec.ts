// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule, MatGridListModule, MatMenuModule, MatSliderModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerService } from 'src/app/drawing-tools/color-picker.service';
import { ColorToolService } from 'src/app/drawing-tools/color-tool.service';
import { ColorPaletteComponent } from '../../color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '../../color-picker/color-picker.component';
import { ColorSliderComponent } from '../../color-picker/color-slider/color-slider.component';
import { ColorToolComponent } from './color-tool.component';

describe('ColorToolComponent', () => {
  const colorService = new ColorToolService();
  const colorPickerService = new ColorPickerService();
  let component: ColorToolComponent;
  let fixture: ComponentFixture<ColorToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatMenuModule,
        MatGridListModule,
        MatSliderModule,
        MatExpansionModule,
        BrowserAnimationsModule,
      ],
      declarations: [ColorToolComponent,
      ColorPickerComponent,
      ColorPaletteComponent,
      ColorSliderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the default value of the primaryColor the secondColor the opacity of the component', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    const primaryColor = newComponent.getPrimaryColor();
    expect(primaryColor).toEqual('#000000');
    const secondColor = newComponent.getSecondColor();
    expect(secondColor).toEqual('#000000');
    const opacity = newComponent.getOpacity();
    expect(opacity).toEqual('1');
  });

  it('should set the primaryColor and secondColor of the service', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setPrimaryColor('RGBA(255,255,255,');
    newComponent.updatePrimaryColor();
    expect(colorService.getPrimaryColor()).toEqual(newComponent.getPrimaryColor());
    newComponent.setSecondColor('RGBA(255,255,255,');
    newComponent.updateSecondColor();
    expect(colorService.getSecondColor()).toEqual(newComponent.getSecondColor());
  });

  it('should update the array lastColorsArray', () => {
    component.updateLastColors('#000000');
    component.updateLastColors('#000001');
    component.updateLastColors('#000002');
    component.updateLastColors('#000003');
    component.updateLastColors('#000004');
    component.updateLastColors('#000005');
    component.updateLastColors('#000006');
    component.updateLastColors('#000007');
    component.updateLastColors('#000008');
    component.updateLastColors('#000009');
    expect(component.getLastColor(9)).toEqual('#000000');
    expect(component.getLastColor(8)).toEqual('#000001');
    expect(component.getLastColor(7)).toEqual('#000002');
    expect(component.getLastColor(6)).toEqual('#000003');
    expect(component.getLastColor(5)).toEqual('#000004');
    expect(component.getLastColor(4)).toEqual('#000005');
    expect(component.getLastColor(3)).toEqual('#000006');
    expect(component.getLastColor(2)).toEqual('#000007');
    expect(component.getLastColor(1)).toEqual('#000008');
    expect(component.getLastColor(0)).toEqual('#000009');
  });

  it('should invert primaryColor and secondColor', () => {
    const primaryColor = component.getPrimaryColor();
    const secondColor = component.getSecondColor();
    component.invertColors();
    expect(component.getPrimaryColor()).toEqual(secondColor);
    expect(component.getSecondColor()).toEqual(primaryColor);
  });

  it('should update the primaryColor with an old color', () => {
    component.updateLastColors('#000004');
    component.updateLastColors('#000003');
    component.updateLastColors('#000002');
    component.updateLastColors('#000001');
    component.updateLastColors('#000000');
    component.takeLastColors(4, true);
    expect(component.getPrimaryColor()).toEqual('#000004');
  });

  it('should update the secondColor with an old color', () => {
    component.updateLastColors('#000004');
    component.updateLastColors('#000003');
    component.updateLastColors('#000002');
    component.updateLastColors('#000001');
    component.updateLastColors('#000000');
    component.takeLastColors(4, false);
    expect(component.getSecondColor()).toEqual('#000004');
  });

  it('should return default color : #000000', () => {
    component.getLastColor(10);
    expect(component.getPrimaryColor()).toEqual('#000000');
    component.getLastColor(15);
    expect(component.getPrimaryColor()).toEqual('#000000');
    component.getLastColor(100);
    expect(component.getPrimaryColor()).toEqual('#000000');
  });

  it('should accept hexadecimal value', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#00ffAA22');
    const isCorrect = newComponent.checkHexColor();
    expect(isCorrect).toEqual(true);
  });

  it('should not accept hexadecimal value', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#GGVVZZKK');
    const isCorrect = newComponent.checkHexColor();
    expect(isCorrect).toEqual(false);
  });

  it('should complete hexadecimal value update primary color with a complete value and giv a default value to ColorInHex', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#ff');
    newComponent.updateHexColor(true);
    const colorInHex = newComponent.getColorInHex();
    expect(colorInHex).toEqual('#00000000');
    const primaryColor = newComponent.getPrimaryColor();
    expect(primaryColor).toEqual('RGBA(255,0,0,1)');
  });

  it('should update primaryColor with an hexadecimal value', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#ffffffff');
    newComponent.updateHexColor(true);
    const primaryColor = newComponent.getPrimaryColor();
    expect(primaryColor).toEqual('RGBA(255,255,255,1)');
  });

  it('should update secondColor with an hexadecimal value', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#ffffffff');
    newComponent.updateHexColor(false);
    const secondColor = newComponent.getSecondColor();
    expect(secondColor).toEqual('RGBA(255,255,255,1)');
  });

  it('should not update secondColor', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    const secondColor = newComponent.getSecondColor();
    newComponent.setColorInHex('#ffvvggaa');
    newComponent.updateHexColor(false);
    expect(secondColor).toEqual(newComponent.getSecondColor());
  });

  it('should change the background color', () => {
    const spy = spyOn(component.eventEmit, 'emit');
    component.setPrimaryColor('RGBA(255,255,255,1)');
    component.updateBackgroundColor();
    expect(spy).toHaveBeenCalledWith(component.getBackgroundColor());
    expect(component.getBackgroundColor()).toEqual(component.getPrimaryColor());
  });

  it('should set opacity', () => {
    component.setOpacity('1');
    expect(component['opacity']).toEqual('1');
  });

  it('should not accept hexadecimal value because string does not start with #', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('540ffAA22');
    const isCorrect = newComponent.checkHexColor();
    expect(isCorrect).toEqual(false);
  });

  it('should not accept hexadecimal value because string len is > 9', () => {
    const newComponent = new ColorToolComponent(colorService, colorPickerService);
    newComponent.setColorInHex('#1540ffAA232');
    newComponent.checkHexColor();
    expect(newComponent.colorInHex).toEqual('#1540ffAA232'.substring(0, 8));
  });

});
