import { Component, HostListener, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { PolylineParamsService } from 'src/app/drawing-tools/polyline-params.service';

const DELAY_DBLCLICK = 250;
const DBL_CLICK = 2;
const ONE_CLICK = 1;
@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent {
  @Input() thickness: number;
  @Input() junctionType: string;
  @Input() pointsDiameter: number;
  @Input() linePattern: string;

  constructor(private drawLine: PolylineParamsService) {
    this.thickness = this.pointsDiameter = 1;
    this.junctionType = this.linePattern = '';
  }

  setThickness(newThickness: number): number {
    return this.thickness = newThickness;
  }

  setJunctionType(newJunction: string): string {
    return this.junctionType = newJunction;
  }

  setParamsPointsDiameter(event: MatSliderChange): void {
    this.pointsDiameter = event.value as number;
    this.setParams();
  }

  setParamsThickness(event: MatSliderChange): void {
    this.thickness = event.value as number;
    this.setParams();
  }

  setLinePattern(newLinePattern: string): string {
    return this.linePattern = newLinePattern;
  }

  setParams(): void {
    this.drawLine.setThickness(this.thickness);
    this.drawLine.setPointsDiameter(this.pointsDiameter);
    this.drawLine.setJunctionType(this.junctionType);
    this.drawLine.setLinePattern(this.linePattern);
    this.drawLine.setStyles();
  }

  setParamsLinePattern(event: MatRadioChange): void {
    this.linePattern = event.value;
    this.setParams();
  }

  setParamsJunctionType(event: MatRadioChange): void {
    this.junctionType = event.value;
    this.setParams();
  }

  @HostListener('document:keydown', ['$event'])
  removeSegment(event: KeyboardEvent): void {
    if (event.key === 'Backspace') {
      this.drawLine.isCanceled = true;
      this.drawLine.removeDraw();
    }
    if (event.key === 'Shift') {
      this.drawLine.isClosedWithShift = true;
    }
    if (event.key === 'Escape') {
      this.drawLine.isFirstSegment = this.drawLine.isLastSegment = true;
      this.drawLine.setPath('');
    }
  }

  @HostListener('document:keyup', ['$event'])
  shiftSegment(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.drawLine.isClosedWithShift = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onDblClick() {
    if (this.drawLine.click === ONE_CLICK) {
      setTimeout(() => {
        this.drawLine.click = 0;
        this.drawLine.isClosedWithDblClick = false;
      }, DELAY_DBLCLICK);
    } else if (this.drawLine.click === DBL_CLICK) {
      this.drawLine.isClosedWithDblClick = true;
      this.drawLine.isFirstSegment = this.drawLine.isLastSegment = true;
    }
  }
}
