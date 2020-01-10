// tslint:disable: no-string-literal
import { Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { RectangleComponent } from './rectangle.component';

describe('RectParamsService', () => {
  let component: RectangleComponent;
  let fixture: ComponentFixture<RectangleComponent>;
  let spy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [ RectangleComponent],
      providers: [Renderer2],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RectangleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the function drawSquare', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    spy = spyOn(component, 'drawSquare');
    document.dispatchEvent(keyEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the function stopSquare', () => {
    const keyEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    spy = spyOn(component, 'stopSquare');
    document.dispatchEvent(keyEvent);
    expect(spy).toHaveBeenCalled();
  });

  it('should set the isSquare to true', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.drawSquare(keyEvent);
    const service = component['drawRectangle'];
    expect(service['isSquare']).toBeTruthy();
  });

  it('should set the isSquare to false', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.stopSquare(keyEvent);
    const service = component['drawRectangle'];
    expect(service['isSquare']).toBeFalsy();
  });

  it('should get the thickness attribute', () => {
    const thickness = component['thickness'];
    expect(thickness).toEqual(1);
  });

  it('should set the plot', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsPlot(event);
    const service = component['drawRectangle'];
    expect(service['plot']).toEqual('5');
  });

  it('should set the thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsThickness(event);
    const service = component['drawRectangle'];
    expect(service['getThickness']()).toEqual(5);
  });
});
