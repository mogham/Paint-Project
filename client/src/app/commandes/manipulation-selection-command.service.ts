import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { SelectionParamsService } from '../drawing-tools/selection-params.service';
import { CommandeAbstractService } from './commande-abstract.service';

@Injectable({
  providedIn: 'root',
})
export class ManipulationSelectionCommand extends CommandeAbstractService {
  private transformationToDelete: Element[];
  private transformationToRestore: Element[];
  private previousTransformation: string;
  constructor(transformation: string, shapes: Element[], private selection: SelectionParamsService) {
    super();
    this.transformationToDelete = shapes;
    this.transformationToRestore = [];
    this.previousTransformation = transformation;
  }

  gettransformationToDelete(): Element[] {
    return this.transformationToDelete;
  }

  getTransformationToRestore(): Element[] {
    return this.transformationToRestore;
  }

  redoSVG(shapes: Element[], svg: ElementRef, renderer: Renderer2) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    for (const transformShape of this.transformationToRestore) {
      const index = shapes.indexOf(transformShape);
      shapes.splice(index, 1);
      svg.nativeElement.removeChild(transformShape);
      this.selection.deleteSelectionShape(transformShape, svg.nativeElement);
      const selectionElement: Element = renderer.createElement(
        'rect',
        SVG_NS,
      );
      const currentTransformation = transformShape.getAttribute('transform');
      transformShape.setAttributeNS(null, 'transform', this.previousTransformation + ' ' + currentTransformation);
      this.transformationToDelete.push(transformShape);
      shapes.push(transformShape);
      svg.nativeElement.appendChild(transformShape);
      this.selection.addSelectionRect(selectionElement, svg);
    }
    this.transformationToRestore = [];
  }

  undoSVG(shapes: Element[], svg: ElementRef, renderer: Renderer2) {
    const SVG_NS = 'http://www.w3.org/2000/svg';
    for (const transformShape of this.transformationToDelete) {
      const index = shapes.indexOf(transformShape);
      shapes.splice(index, 1);
      svg.nativeElement.removeChild(transformShape);
      this.selection.deleteSelectionShape(transformShape, svg.nativeElement);
      const selectionElement: Element = renderer.createElement(
        'rect',
        SVG_NS,
      );
      let currentTransformation = transformShape.getAttribute('transform');
      if (currentTransformation) {
          currentTransformation = currentTransformation.replace(this.previousTransformation, '');
          transformShape.setAttributeNS(null, 'transform', currentTransformation);
          this.transformationToRestore.push(transformShape);
          shapes.push(transformShape);
          svg.nativeElement.appendChild(transformShape);
          this.selection.addSelectionRect(selectionElement, svg);
      }
    }
    this.transformationToDelete.length > 1 ? this.selection.setControlPointsGroup(false) : this.selection.setControlPointsShape(false);
    this.transformationToDelete = [];
  }
}
