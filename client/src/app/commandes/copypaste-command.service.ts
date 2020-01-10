import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SelectionParamsService } from '../drawing-tools/selection-params.service';
import { CommandeAbstractService } from './commande-abstract.service';

@Injectable({
  providedIn: 'root',
})
export class CopyPasteCommand extends CommandeAbstractService {
  private shapesToPaste: Element[];
  private shapesToErase: Element[];
  constructor(shapes: Element[], private selection: SelectionParamsService) {
    super();
    this.shapesToErase = shapes;
    this.shapesToPaste = [];
  }

  getshapesToErase(): Element[] {
    return this.shapesToErase;
  }
  getshapesToPaste(): Element[] {
    return this.shapesToPaste;
  }

  undoSVG(shapes: Element[], svg: Element) {
    for (const shapesToErase of this.shapesToErase) {
      const index = shapes.indexOf(shapesToErase);
      shapes.splice(index, 1);
      svg.removeChild(shapesToErase);
      this.shapesToPaste.push(shapesToErase);
      this.selection.deleteSelectionShape(shapesToErase, svg);
    }
    this.shapesToErase.length > 1 ? this.selection.setControlPointsGroup(false) : this.selection.setControlPointsShape(false);
    this.shapesToErase = [];
  }

  redoSVG(shapes: Element[], svg: ElementRef, renderer: Renderer2) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    for (const shapesToPaste of this.shapesToPaste) {
      const selectionElement: Element = renderer.createElement(
        'rect',
        SVG_NS,
      );
      shapes.push(shapesToPaste);
      svg.nativeElement.appendChild(shapesToPaste);
      this.shapesToErase.push(shapesToPaste);
      this.selection.addSelectionRect(selectionElement, svg);
    }
    this.shapesToPaste = [];
  }
}
