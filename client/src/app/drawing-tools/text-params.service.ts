import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { DrawingTool } from '../drawing-tools/abstract-drawing-tools';
import { ColorToolService } from './color-tool.service';

@Injectable({
  providedIn: 'root',
})
export class TextParamsService extends DrawingTool {
  private font: string;
  private fontAlign: string;
  fontStyle: string;
  fontWeight: string;
  private fontSize: number;
  originX: number;
  private originY: number;
  position: number;

  lineCount: number;
  isDone: boolean;
  enableShortCuts: boolean;
  isTyping: boolean;
  valueToWrite: string;
  textArray: string[];

  constructor(protected colorService: ColorToolService) {
    super();
    this.svgCode = 'text';
    this.enableShortCuts = true;
    this.fontStyle = this.fontWeight = '';
    this.valueToWrite = '';
    this.font = '';
    this.fontAlign = '';
    this.isDone = false;
    this.isTyping = false;
    this.originX = this.originY = this.position = 0;
    this.fontSize = 11;
    this.textArray = [];
    this.fontAlign = 'left';
  }

  setDefault(): void {
    this.font = 'Gill Sans';
    this.setReady = true;
  }
  getFontSize(): number {
    return this.fontSize;
  }

  getValue(): string {
    return this.valueToWrite;
  }

  setValue(newValue: string): string {
    return this.valueToWrite = newValue;
  }

  setFontSize(newFontSize: number): number {
    return this.fontSize = newFontSize;
  }

  setFill(newFill: string): string {
    return this.fill = newFill;
  }

  setFont(newFont: string): string {
    return this.font = newFont;
  }

  getFont(): string {
    return this.font;
  }

  setFontAlign(newFontAlign: string): string {
    return this.fontAlign = newFontAlign;
  }

  setTextAlign(): void {
    switch (this.fontAlign) {
      case 'left':
        this.fontAlign = 'start';
        break;
      case 'center':
        this.fontAlign = 'middle';
        break;
      case 'right':
        this.fontAlign = 'end';
        break;
    }
  }

  setAditionalStyle(isbold: boolean, isitalic: boolean): void {
    isbold ? this.fontWeight = 'bold' : this.fontWeight = ' ';
    isitalic ? this.fontStyle = 'italic' : this.fontStyle = ' ';
  }

  setFontStyle(): void {
    switch (this.font) {
      case 'font1':
        this.font = 'Gill Sans';
        break;
      case 'font2':
        this.font = this.setFont('Segoe UI');
        break;
      case 'font3':
        this.setFont('Courier New');
        break;
    }
  }

  setStyles(): object {
    this.setFontStyle();
    this.setTextAlign();
    const styles = {
      fill: this.setFill(this.colorService.getPrimaryColor()),
      'font-size': this.getFontSize(),
      'font-family': this.getFont(),
      'font-weight': this.fontWeight,
      'font-style': this.fontStyle,
      'text-anchor': this.fontAlign,
    };
    this.setReady = (this.font !== '');
    return styles;
  }

  startDrawing(startPosition: MousePosition): void {
    this.setStyles();
    this.lineCount = 0;
    this.originX = startPosition.x + 7;
    this.originY = startPosition.y + 35 ;
    this.position = this.originY;
  }

  draw(currentPosition: MousePosition): void {
    //
  }

  onMouseDown(currentPosition: MousePosition): void {
    this.isTyping = true;
    this.isDone = this.enableShortCuts = false;
    if (this.valueToWrite === '' && this.textArray.length === 0) {
      this.startDrawing(currentPosition);
    }
  }

  submitElement(myText: Element, shapeName: string): boolean {
    super.submitElement(myText, shapeName);
    myText.setAttributeNS(null, 'id', this.svgCode);
    myText.setAttributeNS(null, 'font-size', String(this.getFontSize()));
    myText.setAttributeNS(null, 'font-family', String(this.getFont()));
    myText.setAttributeNS(null, 'font-weight', this.fontWeight);
    myText.setAttributeNS(null, 'font-style', this.fontStyle);
    myText.setAttributeNS(null, 'text-anchor', this.fontAlign);
    myText.setAttributeNS(null, 'fill', String(this.getFill()));
    myText.setAttributeNS(null, 'x', String(this.originX));
    myText.setAttributeNS(null, 'y', String(this.position));
    return this.valueToWrite.length > 1;
  }

  onMouseUp(currentPosition: MousePosition): void {
    this.setValue('');
    this.lineCount = 0;
    this.startDrawing(currentPosition);
    this.textArray = [];
    this.isDone = true;
    this.enableShortCuts = true;
    this.isTyping = false;
  }
}
