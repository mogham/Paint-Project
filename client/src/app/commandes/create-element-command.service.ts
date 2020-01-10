import { Injectable } from '@angular/core';
import { CommandeAbstractService } from './commande-abstract.service';

@Injectable({
  providedIn: 'root',
})
export class CreateElementCommandService extends CommandeAbstractService {

  protected elementAdd: Element;

  constructor(elementAdd: Element) {
    super();
    this.elementAdd = elementAdd;
  }

  getElementToAdd(): Element {
    return this.elementAdd;
  }

  setElement(element: Element): void {
    this.elementAdd = element;
  }
}
