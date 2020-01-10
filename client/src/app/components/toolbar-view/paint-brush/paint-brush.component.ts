import { Component, Input } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { PaintBrushParamsService } from 'src/app/drawing-tools/paint-brush-params.service';

@Component({
  selector: 'app-paint-brush',
  templateUrl: './paint-brush.component.html',
  styleUrls: ['./paint-brush.component.scss'],
})
export class PaintBrushComponent {
  @Input() thickness = 1;
  @Input() texture = 'Texture 1';

  constructor(private paintBrushInUse: PaintBrushParamsService) {
    this.thickness = 1;
  }

  getPaintBrushInUse() {
    return this.paintBrushInUse;
  }

  getThickness(): number {
    return this.thickness;
  }

  setThickness(newThickness: number): void {
    this.thickness = newThickness;
  }

  getTexture(): string {
    return this.texture;
  }

  setTexture(newTexture: string): void {
    this.texture = newTexture;
  }

  setParams(): void {
    this.paintBrushInUse.setThickness(this.thickness);
    this.paintBrushInUse.setTexture(this.texture);
    this.paintBrushInUse.setStyles();
  }

  setParamsThickness(event: MatSliderChange) {
    this.thickness = event.value as number;
    this.setParams();
  }

  setParamsTexture(event: MatRadioChange): void {
    this.texture = event.value;
    this.setParams();
  }
}
