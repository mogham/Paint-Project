import { Component, Input } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { AerosolService } from './../../../drawing-tools/aerosol.service';

@Component({
  selector: 'app-aerosol',
  templateUrl: './aerosol.component.html',
  styleUrls: ['./aerosol.component.scss'],
})
export class AerosolComponent {
  @Input() emissionRate: number;
  @Input() diameter: number;

  constructor(private useAerosol: AerosolService) {
    this.emissionRate = 10;
    this.diameter = 10;
    this.setParams();
  }

  getuseAerosol() {
    return this.useAerosol;
  }

  getDiameter(): number {
    return this.diameter;
  }

  setParamsDiameter(diameter: MatSliderChange): void {
    this.diameter = diameter.value as number;
    this.setParams();
  }

  setParamsEmissionRate(emissionRate: MatSliderChange) {
    this.emissionRate = emissionRate.value as number;
    this.setParams();
  }

  getEmissionRate(): number {
    return this.emissionRate;
  }

  setParams(): void {
    this.useAerosol.setDiameter(this.diameter);
    this.useAerosol.setEmissionRate(this.emissionRate);
    this.useAerosol.setStyles();
  }

}
