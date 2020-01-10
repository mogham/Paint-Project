import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RotationManipulationService {

  private lastRotateShape: Map<Element, number> = new Map<Element, number>();
  private newRotation = '';

  setLastRotateShape(length: Map<Element, number>) {
    this.lastRotateShape = length;
  }

  getNewRotation(): string {
    return this.newRotation;
  }

  ShapeRotation(orientationAngle: number, selection: any) {
    this.newRotation = `rotate(${orientationAngle}, ${selection.originXBox +
      selection.widthBox / 2},${selection.originYBox + selection.heightBox / 2}) `;
  }

  GroupRotation(orientationAngle: number, selection: any) {
    this.newRotation = `rotate(${orientationAngle}, ${selection.originXGroupBox +
      selection.widthGroupBox / 2},${selection.originYGroupBox + selection.heightGroupBox / 2}) `;
  }

  applyRotate(shape: Element[], attributes: any[], orientationAngle: number[]) {
    let lastLength;
    for (let i = 0; i < shape.length; i++) {
      attributes[0].group ? this.GroupRotation(orientationAngle[i], attributes[0]) : this.ShapeRotation(orientationAngle[i], attributes[i]);
      let transform = shape[i].getAttribute('transform');
      if (transform !== null) {
        lastLength = this.lastRotateShape.get(shape[i]);
        if (lastLength) {
          transform = transform.substring(lastLength, transform.length);
        } else {
          transform = transform.substring(0, transform.length);
        }
        transform = this.newRotation + transform;
      } else {
        transform = this.newRotation;
      }
      lastLength = this.newRotation.length;
      shape[i].setAttributeNS(null, 'transform', transform);
      this.lastRotateShape.set(shape[i], lastLength);
    }
  }
}
