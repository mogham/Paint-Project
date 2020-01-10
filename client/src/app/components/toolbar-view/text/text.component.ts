import { Component, HostListener, Input } from '@angular/core';
import { MatCheckboxChange, MatRadioChange, MatSliderChange } from '@angular/material';
import { TextParamsService } from 'src/app/drawing-tools/text-params.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent {
  @Input() font: string;
  @Input() fontSize: number;
  @Input() textAlign: string;
  @Input() isBoldActivated: boolean;
  @Input() isItalicActivated: boolean;

  constructor(private insertText: TextParamsService) {
    this.font = '';
    this.fontSize = 1;
    this.textAlign = '';
    this.isBoldActivated = this.isItalicActivated = false;
    this.insertText.lineCount = 1;
  }

  setDefault(): void {
    this.textAlign = 'left';
    this.font = 'font 1';
  }

  setFontSize(newFontSize: number): number {
    return this.fontSize = newFontSize;
  }

  setFont(newFont: string): string {
    return this.font = newFont;
  }

  setParams(): void {
    this.insertText.setFontSize(this.fontSize);
    this.insertText.setFontAlign(this.textAlign);
    this.insertText.setFont(this.font);
    this.insertText.setStyles();
  }

  setParamsFont(event: MatRadioChange): void {
    this.font = event.value;
    this.setParams();
  }

  setParamsTextAlign(event: MatRadioChange): void {
    this.textAlign = event.value;
    this.setParams();
  }

  setParamsFontSize(event: MatSliderChange): void {
    this.fontSize = event.value as number;
    this.setParams();
  }

  setParamsBold(event: MatCheckboxChange): void {
    this.insertText.setAditionalStyle(event.checked, this.isItalicActivated);
    if (event.checked) {
      this.insertText.fontWeight = 'bold';
    } else {
      this.insertText.fontWeight = '';
    }
    this.setParams();
  }

  setParamsItalic(event: MatCheckboxChange): void {
    this.insertText.setAditionalStyle(this.isBoldActivated, event.checked);
    if (event.checked) {
      this.insertText.fontStyle = 'italic';
    } else {
      this.insertText.fontStyle = '';
    }
    this.setParams();
  }

  setItalicStyle(): void {
    this.isItalicActivated = !this.isItalicActivated;
    this.setParams();
  }

  setBoldStyle(): void {
    this.isBoldActivated = !this.isBoldActivated;
    this.setParams();
  }

  @HostListener('document:keydown', ['$event'])
  displayText(event: KeyboardEvent): void {
    if (this.insertText.isTyping) {
      switch (event.key) {
        case 'Backspace':
          if (this.insertText.valueToWrite !== '') {
            this.insertText.setValue(
              this.insertText.valueToWrite.substr(0, this.insertText.valueToWrite.length - 1));
          }
          break;
        case ' ':
          event.preventDefault();
          this.insertText.valueToWrite += ' ';
          break;
        case 'Enter':
          this.insertText.textArray.push(this.insertText.valueToWrite);
          this.insertText.lineCount++;
          this.insertText.valueToWrite = '        ';
          break;
        default:
          if (this.keyBoardDown(event)) {
            if (this.insertText.valueToWrite === '        ') {
              this.insertText.valueToWrite = '';
            }
            this.insertText.valueToWrite += event.key;
          }
      }
    }
  }

  keyBoardDown(event: KeyboardEvent): boolean {
    return event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'ArrowUp' && event.key !== 'ArrowDown'
      && event.key !== 'Meta' && event.key !== 'Shift' && event.key !== 'Alt' && event.key !== 'CapsLock'
      && event.key !== 'Tab' && event.key !== 'Control' && event.key !== 'Dead' && event.key !== 'Enter';
  }

  @HostListener('document:mousedown')
  onMouseDown() {
    if (this.insertText.getValue() !== '' && this.insertText.isTyping) {
      if (this.insertText.textArray[this.insertText.textArray.length] !== this.insertText.getValue()) {
        this.insertText.textArray.push(this.insertText.valueToWrite);
        this.insertText.isDone = true;
        this.insertText.valueToWrite = '   ';
      }
    }
  }

}
