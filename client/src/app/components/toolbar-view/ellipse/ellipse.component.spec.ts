// tslint:disable: no-string-literal
import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { ColorToolService } from 'src/app/drawing-tools/color-tool.service';
import { EllipseService } from '../../../drawing-tools/ellipse.service';
import { EllipseComponent } from './ellipse.component';

describe('EllipseComponent', () => {
  const ellipseService = new EllipseService({} as ColorToolService);
  let component: EllipseComponent = new EllipseComponent(ellipseService);
  let fixture: ComponentFixture<EllipseComponent>;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [EllipseComponent],
      providers: [Renderer2],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the function drawCircle', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    spy = spyOn(component, 'drawCircle');
    document.dispatchEvent(keyEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the function stopCircle', () => {
    const keyEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    spy = spyOn(component, 'stopCirlce');
    document.dispatchEvent(keyEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should set the isCircle to true', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.drawCircle(keyEvent);
    const service = component['drawEllipse'];
    expect(service['isCircle']).toBeTruthy();
  });

  it('should set the isCircle to false', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.stopCirlce(keyEvent);
    const service = component['drawEllipse'];
    expect(service['isCircle']).toBeFalsy();
  });

  it('should get the thickness attribute', () => {
    const thickness = component['thickness'];
    expect(thickness).toEqual(1);
  });

  it('should set the thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsThickness(event);
    const service = component['drawEllipse'];
    expect(service['getThickness']()).toEqual(5);
  });

  it('should set the plot', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsPlot(event);
    const service = component['drawEllipse'];
    expect(service['plot']).toEqual('5');
  });
});
