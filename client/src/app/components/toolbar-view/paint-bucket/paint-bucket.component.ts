import { Component, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { PaintBucketService } from 'src/app/drawing-tools/paint-bucket.service';

@Component({
  selector: 'app-paint-bucket',
  templateUrl: './paint-bucket.component.html',
  styleUrls: ['./paint-bucket.component.scss'],
})
export class PaintBucketComponent {
  @Input() private plot: string;
  @Input() private thickness: number;
  @Input() private tolerance: number;

  constructor(private servicePaintBucket: PaintBucketService) {
    this.plot = '';
    this.thickness = 1;
    this.tolerance = 0;
  }

  setParamsPlot(event: MatRadioChange): void {
    this.plot = event.value;
    this.setParams();
  }

  setParamsThickness(event: MatSliderChange): void {
    this.thickness = event.value as number;
    this.setParams();
  }

  setParamsTolerance(event: MatSliderChange): void {
    this.tolerance = event.value as number;
    this.setParams();
  }

  setParams(): void {
    this.servicePaintBucket.setPlot(this.plot);
    this.servicePaintBucket.setThickness(this.thickness);
    this.servicePaintBucket.setTolerance(this.tolerance);
  }
}
