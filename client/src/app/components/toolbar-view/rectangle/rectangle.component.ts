import { Component, HostListener, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { RectParamsService } from '../../../drawing-tools/rect-params.service';
@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent {
  @Input() private plot: string;
  @Input() private thickness: number;

  constructor(private drawRectangle: RectParamsService) {
    this.plot = '';
    this.thickness = 1;
  }

  setParams(): void {
    this.drawRectangle.setPlot(this.plot);
    this.drawRectangle.setThickness(this.thickness);
  }

  setParamsThickness(event: MatSliderChange): void {
    this.thickness = event.value as number;
    this.setParams();
  }

  setParamsPlot(event: MatRadioChange): void {
    this.plot = event.value;
    this.setParams();
  }

  @HostListener('document:keydown', ['$event'])
  drawSquare(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.drawRectangle.setSquare(true);
    }
  }

  @HostListener('document:keyup', ['$event'])
  stopSquare(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.drawRectangle.setSquare(false);
    }
  }
}
