export abstract class StructSVGElement {
    id: string;
    elementID: string;
    stroke: string;
    fill: string;
    strokewidht: string;
    transform: string;
    constructor(id: string, elementID: string, stroke: string, fill: string, strokewidht: string, transform: string) {
        this.id = id;
        this.elementID = elementID;
        this.stroke = stroke;
        this.fill = fill;
        this.strokewidht = strokewidht;
        this.transform = transform;
    }
}
