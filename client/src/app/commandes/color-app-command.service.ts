import { Injectable } from '@angular/core';
import { CommandeAbstractService } from './commande-abstract.service';

@Injectable({
  providedIn: 'root',
})
export class ColorAppCommand extends CommandeAbstractService {

  protected oldColor: string;
  protected newColor: string;
  protected attributeSet: string;
  protected index: number;

  constructor(attributeSet: string) {
    super();
    this.oldColor = '';
    this.newColor = '';
    this.attributeSet = attributeSet;
    this.index = 0;
  }

  fillIndex(element: Element, shapes: Element[]) {
    this.setOldColor(element);
    for (let index = 0; index < shapes.length; index++) {
      if (shapes[index] === element) {
        this.index = index;
      }
    }
  }

  setOldColor(element: Element): void {
    const oldColor = element.getAttribute(this.attributeSet);
    if (oldColor !== null) {
      this.oldColor = oldColor;
    }
  }

  setNewColor(newColor: string): void {
    this.newColor = newColor;
  }

  getOldColor(): string {
    return this.oldColor;
  }

  getNewColor(): string {
    return this.newColor;
  }

  getAttributeSet(): string {
    return this.attributeSet;
  }

  updateUndoShapes(shapes: Element[]): void {
    shapes[this.index].setAttribute(this.attributeSet, this.oldColor);
  }

  updateRedoShapes(shapes: Element[]): void {
    shapes[this.index].setAttribute(this.attributeSet, this.newColor);
  }
}
