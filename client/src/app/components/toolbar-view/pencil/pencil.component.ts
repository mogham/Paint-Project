import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { PencilParamsService } from '../../../drawing-tools/pencil-params.service';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent {
  @Input() thickness: number;

  constructor(private usePencil: PencilParamsService) {
    this.thickness = 1;
  }

  setThickness(newThickness: number): number {
    return this.thickness = newThickness;
  }

  setParams(event: MatSliderChange): void {
    this.thickness = event.value as number;
    this.usePencil.setThickness(this.thickness);
    this.usePencil.setStyles();
  }
}
