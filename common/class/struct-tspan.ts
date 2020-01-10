import { StructSVGElement } from './struct-svgelement';

export class StructTspan extends StructSVGElement {
    x: string;
    y: string;
    text: string;
    constructor(elementID: string, x: string, y: string, text: string) {
        super('tspan', elementID, ' ', ' ', ' ', ' ');
        this.x = x;
        this.y = y;
        this.text = text;
    }
}
