import { Component, HostListener, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { EllipseService } from 'src/app/drawing-tools/ellipse.service';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent {

  @Input() private plot: string;
  @Input() private thickness: number;

  constructor(private drawEllipse: EllipseService) {
    this.plot = '';
    this.thickness = 1;
  }

  setParams(): void {
    this.drawEllipse.setPlot(this.plot);
    this.drawEllipse.setThickness(this.thickness);
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
  drawCircle(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.drawEllipse.setCirlce(true);
    }
  }

  @HostListener('document:keyup', ['$event'])
  stopCirlce(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.drawEllipse.setCirlce(false);
    }
  }
}
