import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { FountainPenParamsService } from 'src/app/drawing-tools/fountain-pen-params.service';

@Component({
  selector: 'app-fountain-pen',
  templateUrl: './fountain-pen.component.html',
  styleUrls: ['./fountain-pen.component.scss'],
})
export class FountainPenComponent {
  @ViewChild('degree', { static: true}) sliderDegree: any;
  @Input() length: number;
  @Input() degree: number;

  constructor(private fountainPenInUse: FountainPenParamsService) {
    this.length = 1;
    this.degree = 1;
  }

  setParams(): void {
    this.fountainPenInUse.orientationPen = 0;
    this.fountainPenInUse.setLineLenght(this.length);
    this.fountainPenInUse.setRotationDegree(this.degree);
  }

  setParamsLength(event: MatSliderChange) {
    this.length = event.value as number;
    this.setParams();
  }

  setParamsDegree(event: MatSliderChange) {
    this.degree = event.value as number;
    this.setParams();
  }

  @HostListener('document:mouseup')
  onMouseUp() {
      this.fountainPenInUse.onMouseUp();
  }

  @HostListener('document:mousewheel')
  onMousewheel() {
    this.sliderDegree.value = this.fountainPenInUse.getRotationDegree();
  }

}
