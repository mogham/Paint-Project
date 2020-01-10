import { StructSVGElement } from './struct-svgelement';

export abstract class ShapesSVGElement extends StructSVGElement {
    originX: string;
    originY: string;
    width: string;
    height: string;

    constructor(id: string, elementID: string, stroke: string, fill: string, strokewidht: string, transform: string, originX: string,
                originY: string, width: string, height: string) {
        super(id, elementID, stroke, fill, strokewidht, transform);
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
    }
}
