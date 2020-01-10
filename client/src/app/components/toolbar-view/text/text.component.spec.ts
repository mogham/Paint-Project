// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {  MatCheckboxModule, MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule,
          MatSliderChange, MatSliderModule } from '@angular/material';
import { TextComponent } from './text.component';

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
        MatCheckboxModule,
      ],
      declarations: [TextComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set font and alignment to default values', () => {
    component.setDefault();
    expect(component['font']).toEqual('font 1');
    expect(component['textAlign']).toEqual('left');
  });

  it('should set the FontSize', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsFontSize(event);
    const service = component['insertText'];
    expect(service['fontSize']).toEqual(5);
  });

  it('should set the font', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsFont(event);
    const service = component['insertText'];
    expect(service['font']).toEqual('5');
  });

  it('should add a space between words when the space key is down', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: ' ' });
    const service = component['insertText'];
    service['isTyping'] = true;
    service['valueToWrite'] = 'abc';
    component.displayText(keyEvent);
    expect(service['valueToWrite']).toEqual('abc ');
  });

  it('should deleted last char when the backspace key is down', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Backspace' });
    const service = component['insertText'];
    service['isTyping'] = true;
    service['valueToWrite'] = 'abc';
    component.displayText(keyEvent);
    expect(service['valueToWrite']).toEqual('ab');
  });

  it('should add the key down', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'k' });
    const service = component['insertText'];
    service['isTyping'] = true;
    service['valueToWrite'] = 'abc';
    component.displayText(keyEvent);
    expect(service['valueToWrite']).toEqual('abck');
  });

  it('should go to a new line when we press Enter', () => {
    const keyEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    const service = component['insertText'];
    service['isTyping'] = true;
    service['valueToWrite'] = 'abc';
    component.displayText(keyEvent);
    expect(service['textArray'].length).not.toEqual(0);
    expect(service['lineCount']).toEqual(2);
    expect(service['valueToWrite']).toEqual('        ');
  });

  it('should go to a new line when we press Enter', () => {
    const service = component['insertText'];
    service['valueToWrite'] = 'abc';
    service['isTyping'] = true;
    service['textArray'] = ['allo', 'hello'];
    component.onMouseDown();
    expect(service['textArray'].length).not.toEqual(0);
    expect(service['isDone']).toBeTruthy();
  });

});
