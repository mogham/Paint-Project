import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SelectionParamsService } from '../drawing-tools/selection-params.service';
import { CommandeAbstractService } from './commande-abstract.service';

const SVG_NS = 'http://www.w3.org/2000/svg';
@Injectable({
  providedIn: 'root',
})
export class CutDeleteCommand extends CommandeAbstractService {
  private shapesToRestore: Element[];
  private shapesToDelete: Element[];
  constructor(shapes: Element[], private selection: SelectionParamsService) {
    super();
    this.shapesToDelete = [];
    this.shapesToRestore = shapes;
  }

  getshapesToDelete(): Element[] {
    return this.shapesToDelete;
  }
  getshapesToRestore(): Element[] {
    return this.shapesToRestore;
  }

  redoSVG(shapes: Element[], svg: Element) {
    for (const shapesToDelete of this.shapesToDelete) {
      const index = shapes.indexOf(shapesToDelete);
      shapes.splice(index, 1);
      svg.removeChild(shapesToDelete);
      this.shapesToRestore.push(shapesToDelete);
      this.selection.deleteSelectionShape(shapesToDelete, svg);
    }
    this.shapesToDelete.length > 1 ? this.selection.setControlPointsGroup(false) : this.selection.setControlPointsShape(false);
    this.shapesToDelete = [];
  }

  undoSVG(shapes: Element[], svg: ElementRef, renderer: Renderer2) {
    for (const shapesToRestore of this.shapesToRestore) {
      const selectionElement: Element = renderer.createElement(
        'rect',
        SVG_NS,
      );
      shapes.push(shapesToRestore);
      svg.nativeElement.appendChild(shapesToRestore);
      this.shapesToDelete.push(shapesToRestore);
      this.selection.addSelectionRect(selectionElement, svg);
    }
    this.shapesToRestore = [];
  }
}
