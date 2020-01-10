export class StructPathPen {
    elementID: string;
    stroke: string;
    strokeWidth: string;
    fill: string;
    d: string;
    strokeLinecap: string;
    strokeLinejoin: string;
    constructor(elementID: string, stroke: string,
                strokeWidth: string, fill: string, d: string, strokeLinecap: string, strokeLinejoin: string) {
        this.elementID = elementID;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.fill = fill;
        this.d = d;
        this.strokeLinecap = strokeLinecap;
        this.strokeLinejoin = strokeLinejoin;
    }
}
