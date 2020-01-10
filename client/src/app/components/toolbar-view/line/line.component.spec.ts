// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { delay } from 'q';
import { LineComponent } from './line.component';

describe('LineComponent', () => {
  let component: LineComponent;
  let fixture: ComponentFixture<LineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [LineComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsThickness(event);
    const service = component['drawLine'];
    expect(service['thickness']).toEqual(5);
  });

  it('should set the junctionType', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsJunctionType(event);
    const service = component['drawLine'];
    expect(service['junctionType']).toEqual('5');
  });

  it('should set the linePattern', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsLinePattern(event);
    const service = component['drawLine'];
    expect(service['linePattern']).toEqual('5');
  });

  it('should set the pointsDiameter', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsPointsDiameter(event);
    const service = component['drawLine'];
    expect(service['pointsDiameter']).toEqual(5);
  });

  it('should call setStyles() when we call setParams()', () => {
    const service = component['drawLine'];
    const spyStyles = spyOn(service, 'setStyles');
    component.setParams();
    expect(spyStyles).toHaveBeenCalled();
  });

  it('should remove the last segment with backspace key', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    component.removeSegment(keyEvent);
    const service = component['drawLine'];
    const spyDraw = spyOn(service, 'removeDraw');
    component.removeSegment(keyEvent);
    expect(spyDraw).toHaveBeenCalled();
  });

  it('should close the path with Shift key', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.removeSegment(keyEvent);
    const service = component['drawLine'];
    expect(service['isClosedWithShift']).toBeTruthy();
  });

  it('should set drawlin closed with shift to salse', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Shift' });
    component.shiftSegment(keyEvent);
    const service = component['drawLine'];
    expect(service['isClosedWithShift']).toEqual(false);
  });

  it('should delete temp segment with escape key', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    component.removeSegment(keyEvent);
    const service = component['drawLine'];
    const spyDraw = spyOn(service, 'setPath');
    component.removeSegment(keyEvent);
    expect(spyDraw).toHaveBeenCalled();
    expect(service['isFirstSegment']).toBeTruthy();
  });

  it('should close the path with double click', () => {
    const service = component['drawLine'];
    service['click'] = 2;
    component.onDblClick();
    expect(service['isClosedWithDblClick']).toBeTruthy();
    expect(service['isFirstSegment']).toBeTruthy();
    expect(service['isLastSegment']).toBeTruthy();
  });

  it('should reset variable click when timeout > 250 (dblclick)', async () => {
    const service = component['drawLine'];
    service['click'] = 1;
    component.onDblClick();
    await delay(251);
    expect(service['click']).toEqual(0);
  });

  it('should not reset variable click when timeout < 250 (dblclick)', () => {
    const service = component['drawLine'];
    service['click'] = 1;
    component.onDblClick();
    delay(100);
    expect(service['click']).toEqual(1);
  });

  it('should set isClosedWithShift to false', () => {
    const keyEvent = new KeyboardEvent('keyup', { key: 'Shift' });
    component.shiftSegment(keyEvent);
    expect(component['drawLine'].isClosedWithShift).toBe(false);
  });

});
