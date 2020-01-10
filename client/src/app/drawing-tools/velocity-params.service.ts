import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VelocityParamsService {

  private velocityValue: number;
  constructor() {
    this.velocityValue = 0;
  }
  getVelocity(): number {
    return this.velocityValue;
  }
  setVelocity(velocity: number) {
    this.velocityValue = velocity;
  }

}
