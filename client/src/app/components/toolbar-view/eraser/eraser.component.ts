import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { EraserParamsService } from 'src/app/drawing-tools/eraser-params.service';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent {
  @Input() size: number;

  constructor(private useEraser: EraserParamsService) {
    this.size = 10;
  }

  getSize(): number {
    return this.size;
  }

  setParamsSize(event: MatSliderChange): void {
    this.size = event.value as number;
    this.setParams();
  }

  setParams(): void {
    this.useEraser.setSize(this.size);
    this.useEraser.setStyles();
  }

}
