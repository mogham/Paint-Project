import { StructSVGElement } from './struct-svgelement';

export class StructPencil extends StructSVGElement {
    points: string;
    strokeLinceCap: string;
    filter: string;
    strokeDasharray: string;
    markerMid: string;
    fillRule: string;
    constructor(elementID: string, stroke: string, fill: string, strokewidht: string, transform: string, points: string,
                strokeLinceCap: string, filter: string, strokeDasharray: string, markerMid: string, fillRule: string) {
        super('path', elementID, stroke, fill, strokewidht, transform);
        this.points = points;
        this.strokeLinceCap = strokeLinceCap;
        this.filter = filter;
        this.strokeDasharray = strokeDasharray;
        this.markerMid = markerMid;
        this.fillRule = fillRule;
    }
}
