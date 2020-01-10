import { StructSVGElement } from './struct-svgelement';

export class StructPolygon extends StructSVGElement {
    points: string;
    constructor(elementID: string, stroke: string, fill: string, strokewidht: string, points: string, transform: string) {
        super('polygon', elementID, stroke, fill, strokewidht, transform);
        this.points = points;
    }
}
