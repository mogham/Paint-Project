import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { GridService } from '../drawing-tools/grid.service';
import { MagnetManipulationService } from './magnet-manipulation.service';

@Injectable({
  providedIn: 'root',
})
export class TranslateManipulationService {
  private elementToTranslate: Element[];
  private originX: number;
  private originY: number;
  private newTranslate: string;
  private oldTranslateLenght: number;
  private originBoxX: number;
  private originBoxY: number;
  private widthBox: number;
  private heightBox: number;
  constructor(private serviceMagnet: MagnetManipulationService, private serviceGrid: GridService) {
    this.originX = 0;
    this.originY = 0;
    this.elementToTranslate = new Array();
    this.newTranslate = '';
    this.oldTranslateLenght = 0;
    this.originBoxX = 0;
    this.originBoxY = 0;
    this.widthBox = 0;
    this.heightBox = 0;
  }

  getNewTranslate(): string {
    return this.newTranslate;
  }

  startTranslation(currentPosition: MousePosition, originBoxX: number, originBoxY: number, widthBox: number,
                   heightBox: number, shapes: Element[]) {
    this.elementToTranslate = [];
    for (const currentElement of shapes) {
      this.elementToTranslate.push(currentElement);
    }
    this.originX = currentPosition.x;
    this.originY = currentPosition.y;
    this.newTranslate = '';
    this.oldTranslateLenght = 0;
    this.originBoxX = originBoxX;
    this.originBoxY = originBoxY;
    this.widthBox = widthBox;
    this.heightBox = heightBox;
  }

  translate(currentPosition: MousePosition) {
    if (this.serviceMagnet.getIsActivate()) {
      this.translateWithMagnet(currentPosition);
    } else {
      this.translateWithoutMagnet(currentPosition);
    }
  }

  createTranslate(translateX: number, translateY: number) {
    this.newTranslate = 'translate( ' + translateX + ', ' + translateY + ') ';
  }

  applyTranslate() {
    for (const currentElement of this.elementToTranslate) {
      let transform = currentElement.getAttribute('transform');
      if (transform !== null) {
        transform = transform.substring(this.oldTranslateLenght, transform.length);
        transform = this.newTranslate + transform;
      } else {
        transform = this.newTranslate;
      }
      currentElement.setAttribute('transform', transform);
    }
    this.oldTranslateLenght = this.newTranslate.length;
  }

  translateWithoutMagnet(currentPosition: MousePosition): void {
    const translateX = currentPosition.x - this.originX;
    const translateY = currentPosition.y - this.originY;
    this.createTranslate(translateX, translateY);
    this.applyTranslate();
  }

  translateWithMagnet(currentPosition: MousePosition): void {
    const numberOfGridX = Math.round((currentPosition.x - this.originX) / this.serviceGrid.getSideLenght());
    const numberOfGridY = Math.round((currentPosition.y - this.originY) / this.serviceGrid.getSideLenght());
    const delta: number[] = this.getDelta();
    const translateX = (numberOfGridX * this.serviceGrid.getSideLenght()) - delta[0];
    const translateY = (numberOfGridY * this.serviceGrid.getSideLenght()) - delta[1];
    this.createTranslate(translateX, translateY);
    this.applyTranslate();
  }

  getDelta(): number[] {
    const delta: number[] = new Array();
    let deltaX = 0;
    let deltaY = 0;
    switch (this.serviceMagnet.getMagnetPoint()) {
      case 'LU':
        deltaX = Math.round(this.originBoxX) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY) % this.serviceGrid.getSideLenght();
        break;
      case 'MU':
        deltaX = Math.round(this.originBoxX + this.widthBox / 2) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY) % this.serviceGrid.getSideLenght();
        break;
      case 'RU':
        deltaX = Math.round(this.originBoxX + this.widthBox) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY) % this.serviceGrid.getSideLenght();
        break;
      case 'LM':
        deltaX = Math.round(this.originBoxX) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox / 2) % this.serviceGrid.getSideLenght();
        break;
      case 'RM':
        deltaX = Math.round(this.originBoxX + this.widthBox) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox / 2) % this.serviceGrid.getSideLenght();
        break;
      case 'LD':
        deltaX = Math.round(this.originBoxX) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox) % this.serviceGrid.getSideLenght();
        break;
      case 'MD':
        deltaX = Math.round(this.originBoxX + this.widthBox / 2) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox) % this.serviceGrid.getSideLenght();
        break;
      case 'RD':
        deltaX = Math.round(this.originBoxX + this.widthBox) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox) % this.serviceGrid.getSideLenght();
        break;
      case 'C':
        deltaX = Math.round(this.originBoxX + this.widthBox / 2) % this.serviceGrid.getSideLenght();
        deltaY = Math.round(this.originBoxY + this.heightBox / 2) % this.serviceGrid.getSideLenght();
        break;
    }
    delta.push(deltaX);
    delta.push(deltaY);
    return delta;
  }
}
