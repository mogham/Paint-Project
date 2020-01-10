import { Component, HostListener, Input, ViewChild } from '@angular/core';
import { MatRadioChange, MatSliderChange } from '@angular/material';
import { StampService } from 'src/app/drawing-tools/stamp.service';

@Component({
  selector: 'app-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})

export class StampComponent {
  @ViewChild('orientationAngle', { static: true}) sliderDegree: any;
  @Input() scale: number;
  @Input() orientationAngle: number;
  @Input() stamp: string;
  @Input() stampUsed = '';
  eventRadio: MatRadioChange;

  constructor(private stampInUse: StampService) {
    this.scale = 100;
    this.orientationAngle = 0;
    this.stamp = '';
  }

  setParams(): void {
    this.stampInUse.setRotation(this.orientationAngle);
    this.stampInUse.setStampUsed(this.stampUsed);
    this.stampInUse.setScale(this.scale);
    this.stampInUse.setStyles();
  }

  setParamsOrientationAngle(event: MatSliderChange): void {
    this.orientationAngle = event.value as number;
    this.setParams();
  }

  setParamsScale(event: MatSliderChange): void {
    this.scale = event.value as number;
    this.setParams();
  }

  setParamsStampUsed(event: MatRadioChange): void {
    this.stampUsed = event.value;
    this.setParams();
  }

  @HostListener('document:mousewheel')
  onMousewheel() {
      this.sliderDegree.value = this.stampInUse.getRotationAngle();
  }

}
