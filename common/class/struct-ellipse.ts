import { ShapesSVGElement } from './shapes-svgelement';

export class StructEllipse extends ShapesSVGElement {
    constructor(elementID: string, stroke: string, fill: string, strokewidht: string, transform: string,
                originX: string, originY: string, width: string, height: string) {
        super('ellipse', elementID, stroke, fill, strokewidht, transform, originX, originY, width, height);
    }
}
