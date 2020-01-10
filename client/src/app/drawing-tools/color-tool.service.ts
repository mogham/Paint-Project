import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorToolService {
  private primaryColor: string;
  private secondColor: string;
  private changePrimaryColorSubject = new Subject<string[]>();
  private changeSecondColorSubject = new Subject<string[]>();
  constructor() {
    this.primaryColor = '#000000';
    this.secondColor = '#000000';
  }

  emitPrimaryColorSubject() {
    this.changePrimaryColorSubject.next([this.primaryColor]);
  }

  getChangePrimaryColorSubject(): Subject<string[]> {
    return this.changePrimaryColorSubject;
  }

  emitSecondColorSubject() {
    this.changeSecondColorSubject.next([this.secondColor]);
  }

  getChangeSecondColorSubject(): Subject<string[]> {
    return this.changeSecondColorSubject;
  }

  getPrimaryColor(): string {
    return this.primaryColor;
  }

  getSecondColor(): string {
    return this.secondColor;
  }

  setPrimaryColor(newColor: string): void {
    this.primaryColor = newColor;
  }

  setSecondColor(newColor: string): void {
    this.secondColor = newColor;
  }

  updatePrimaryColorWithPipette(newColor: string) {
    this.setPrimaryColor(newColor);
    this.emitPrimaryColorSubject();
  }

  updateSecondColorWithPipette(newColor: string) {
    this.setSecondColor(newColor);
    this.emitSecondColorSubject();
  }
}
