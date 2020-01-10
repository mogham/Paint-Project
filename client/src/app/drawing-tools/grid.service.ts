import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  protected sideLength: number;
  protected opacity: number;
  protected isActivate: boolean;
  private changeActivteSubject = new Subject<boolean[]>();
  constructor() {
    this.sideLength = 10;
    this.opacity = 0.2;
    this.isActivate = false;
  }

  setOpacity(opacity: number): void {
    this.opacity = opacity;
  }

  setSideLength(sideLength: number): void {
    if (sideLength < 6) {
      this.sideLength = 5;
    } else if (sideLength > 100) {
      this.sideLength = 100;
    } else {
      this.sideLength = sideLength;
    }
  }

  getSideLenght(): number {
    return this.sideLength;
  }

  emitIsActivatedSubject() {
    this.changeActivteSubject.next([this.isActivate]);
  }

  getChangeIsActivate(): Subject<boolean[]> {
    return this.changeActivteSubject;
  }

  updateIsActivateWithShortcuts() {
    this.isActivate = !this.isActivate;
    this.emitIsActivatedSubject();
  }
}
