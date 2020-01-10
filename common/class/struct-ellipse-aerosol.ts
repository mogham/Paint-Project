export class StructEllipseAerosol {
    elementID: string;
    stroke: string;
    strokeWidth: string;
    fill: string;
    cy: string;
    cx: string;
    rx: string;
    ry: string;
    id: string;
    constructor(elementID: string, rx: string, ry: string,
                cx: string, cy: string, stroke: string,
                strokeWidth: string, fill: string) {
        this.elementID = elementID;
        this.rx = rx;
        this.ry = ry;
        this.cx = cx;
        this.cy = cy;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.fill = fill;
        this.id = 'ellipse';
    }
}
