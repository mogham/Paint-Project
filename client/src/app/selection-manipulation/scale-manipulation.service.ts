import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';

@Injectable({
  providedIn: 'root',
})
export class ScaleManipulationService {
  private elementToScale: Element[];
  private originX: number;
  private originY: number;
  private originBoxX: number;
  private originBoxY: number;
  private widthBox: number;
  private heightBox: number;
  private point: string;
  private newScale: string;
  private lastScaleLenght: number;
  private isShift: boolean;
  private isAlt: boolean;
  constructor() {
    this.elementToScale = new Array();
    this.originX = 0;
    this.originY = 0;
    this.originBoxX = 0;
    this.originBoxY = 0;
    this.widthBox = 0;
    this.heightBox = 0;
    this.point = '';
    this.newScale = '';
    this.lastScaleLenght = 0;
    this.isShift = false;
    this.isAlt = false;
  }

  startScale(currentPosition: MousePosition, originBoxX: number, originBoxY: number, widthBox: number,
             heightBox: number, point: string, shapes: Element[]): void {
    this.elementToScale = [];
    for (const currentElement of shapes) {
      this.elementToScale.push(currentElement);
    }
    this.originX = currentPosition.x;
    this.originY = currentPosition.y;
    this.originBoxX = originBoxX;
    this.originBoxY = originBoxY;
    this.widthBox = widthBox;
    this.heightBox = heightBox;
    this.point = point;
    this.newScale = '';
    this.lastScaleLenght = 0;
    this.isShift = false;
    this.isAlt = false;
  }

  getNewScale(): string {
    return this.newScale;
  }

  setShift(isShift: boolean): void {
    this.isShift = isShift;
  }

  setAlt(isAlt: boolean): void {
    this.isAlt = isAlt;
  }

  scale(currentPosition: MousePosition): void {
    switch (this.point) {
      case 'LU':
        this.scaleFromLU(currentPosition);
        break;
      case 'MU':
        this.scaleFromMU(currentPosition);
        break;
      case 'RU':
        this.scaleFromRU(currentPosition);
        break;
      case 'LM':
        this.scaleFromLM(currentPosition);
        break;
      case 'RM':
        this.scaleFromRM(currentPosition);
        break;
      case 'LD':
        this.scaleFromLD(currentPosition);
        break;
      case 'MD':
        this.scaleFromMD(currentPosition);
        break;
      case 'RD':
        this.scaleFromRD(currentPosition);
        break;
    }
  }

  applyTransform(): void {
    for (const currentElement of this.elementToScale) {
      let transform = currentElement.getAttribute('transform');
      if (transform !== null) {
        transform = transform.substring(this.lastScaleLenght, transform.length);
        transform = this.newScale + transform;
      } else {
        transform = this.newScale;
      }
      currentElement.setAttribute('transform', transform);
    }
    this.lastScaleLenght = this.newScale.length;
  }

  createScale(xTranslation: number, yTranslation: number, ratioInX: number, ratioInY: number): void {
    this.newScale = 'translate(' + xTranslation + ', ' + yTranslation + ')'
      + ' scale(' + String(ratioInX) + ', ' + String(ratioInY) + ') ' +
      'translate(' + -xTranslation + ', ' + -yTranslation + ')';
  }

  scaleFromLU(currentPosition: MousePosition): void {
    let ratioInX: number;
    let ratioInY: number;
    ratioInX = 1 + (this.originX - currentPosition.x) / this.widthBox;
    if (this.isShift) {
      ratioInY = ratioInX;
    } else {
      ratioInY = 1 + (this.originY - currentPosition.y) / this.heightBox;
    }
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX + this.widthBox;
      yTranslation = this.originBoxY + this.heightBox;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, ratioInY);
    this.applyTransform();
  }

  scaleFromRU(currentPosition: MousePosition): void {
    let ratioInX: number;
    ratioInX = 1 + (currentPosition.x - this.originX) / this.widthBox;
    let ratioInY: number;
    if (this.isShift) {
      ratioInY = ratioInX;
    } else {
      ratioInY = 1 + (this.originY - currentPosition.y) / this.heightBox;
    }
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX;
      yTranslation = this.originBoxY + this.heightBox;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, ratioInY);
    this.applyTransform();
  }

  scaleFromRD(currentPosition: MousePosition): void {
    let ratioInX: number;
    ratioInX = 1 + (currentPosition.x - this.originX) / this.widthBox;
    let ratioInY: number;
    if (this.isShift) {
      ratioInY = ratioInX;
    } else {
      ratioInY = 1 + (currentPosition.y - this.originY) / this.heightBox;
    }
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX;
      yTranslation = this.originBoxY;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, ratioInY);
    this.applyTransform();
  }

  scaleFromLD(currentPosition: MousePosition): void {
    let ratioInX: number;
    ratioInX = 1 + (this.originX - currentPosition.x) / this.widthBox;
    let ratioInY: number;
    if (this.isShift) {
      ratioInY = ratioInX;
    } else {
      ratioInY = 1 + (currentPosition.y - this.originY) / this.heightBox;
    }
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX + this.widthBox;
      yTranslation = this.originBoxY;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, ratioInY);
    this.applyTransform();
  }

  scaleFromRM(currentPosition: MousePosition): void {
    let ratioInX: number;
    ratioInX = 1 + (currentPosition.x - this.originX) / this.widthBox;
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX;
      yTranslation = this.originBoxY;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, 1.0);
    this.applyTransform();
  }

  scaleFromLM(currentPosition: MousePosition): void {
    let ratioInX: number;
    ratioInX = 1 + (this.originX - currentPosition.x) / this.widthBox;
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX + this.widthBox;
      yTranslation = this.originBoxY + this.heightBox;
    }
    this.createScale(xTranslation, yTranslation, ratioInX, 1.0);
    this.applyTransform();
  }

  scaleFromMU(currentPosition: MousePosition): void {
    let ratioInY: number;
    ratioInY = 1 + (this.originY - currentPosition.y) / this.heightBox;
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX + this.widthBox;
      yTranslation = this.originBoxY + this.heightBox;
    }
    this.createScale(xTranslation, yTranslation, 1.0, ratioInY);
    this.applyTransform();
  }

  scaleFromMD(currentPosition: MousePosition): void {
    let ratioInY: number;
    ratioInY = 1 + (currentPosition.y - this.originY) / this.heightBox;
    let xTranslation;
    let yTranslation;
    if (this.isAlt) {
      xTranslation = this.originBoxX + this.widthBox / 2;
      yTranslation = this.originBoxY + this.heightBox / 2;
    } else {
      xTranslation = this.originBoxX;
      yTranslation = this.originBoxY;
    }
    this.createScale(xTranslation, yTranslation, 1.0, ratioInY);
    this.applyTransform();
  }
}
