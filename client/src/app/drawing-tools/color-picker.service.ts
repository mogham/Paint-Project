import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ColorPickerService {
  private color: string;
  constructor() {
    this.color = '#000000';
  }

  setColor(newColor: string): void {
    this.color = newColor.substring(0, newColor.length - 2);
  }

  getColor(): string {
    return this.color;
  }
}
