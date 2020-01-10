import { Component, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { PolygonParamsService } from 'src/app/drawing-tools/polygon-params.service';

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent {
  @Input() plot: string;
  @Input() thickness: number;
  @Input() nbSides: number;

  constructor(private drawPolygon: PolygonParamsService) {
    this.plot = '';
    this.thickness = 1;
    this.nbSides = 3;
  }

  setParams(): void {
    this.drawPolygon.setPlot(this.plot);
    this.drawPolygon.setThickness(this.thickness);
    this.drawPolygon.setSlides(this.nbSides);
  }

  setParamsSides(event: MatSliderChange): void {
    this.nbSides = event.value as number;
    this.setParams();
  }

  setParamsThickness(event: MatSliderChange): void {
    this.thickness = event.value as number;
    this.setParams();
  }

  setParamsPlot(event: MatRadioChange): void {
    this.plot = event.value;
    this.setParams();
  }
}
