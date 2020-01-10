import { Component, HostListener, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { PenParamsService } from 'src/app/drawing-tools/pen-params.service';

@Component({
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss'],
})
export class PenComponent  {
  @Input() minStrokeWidth: number;
  @Input() maxStrokeWidth: number;

  constructor(private usePen: PenParamsService) {
    this.minStrokeWidth = 0;
    this.maxStrokeWidth = 1;
  }

  setParamsMinStrokeWidth(newThickness: MatSliderChange): void {
    this.minStrokeWidth = newThickness.value as number;
    this.setParams();
  }

  setParamsMaxStrokeWidth(newThickness: MatSliderChange): void {
    this.maxStrokeWidth = newThickness.value as number;
    this.setParams();
  }

  setParams(): void {
    this.usePen.setMinStrokeWidth(this.minStrokeWidth);
    this.usePen.setMaxStrokeWidth(this.maxStrokeWidth);
    this.usePen.setStyles();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.usePen.isNewPath = true;
  }

}
