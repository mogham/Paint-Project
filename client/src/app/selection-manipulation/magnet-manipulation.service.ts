import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MagnetManipulationService {
  private magnetPoint: string;
  private isActivate: boolean;
  constructor() {
    this.magnetPoint = 'LU';
    this.isActivate = false;
  }

  setMagnetPoint(magnetPoint: string): void {
    this.magnetPoint = magnetPoint;
  }

  setIsActivate(isActivate: boolean): void {
    this.isActivate = isActivate;
  }

  getMagnetPoint(): string {
    return this.magnetPoint;
  }

  getIsActivate(): boolean {
    return this.isActivate;
  }
}
