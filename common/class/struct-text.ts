import { StructSVGElement } from './struct-svgelement';
import { StructTspan } from './struct-tspan';

export class StructText extends StructSVGElement {
    fontSize: string;
    fontFamily: string;
    fontWeight: string;
    fontStyle: string;
    textAnchor: string;
    x: string;
    y: string;
    tspanArray: StructTspan[];
    constructor(elementID: string, stroke: string, fill: string, strokewidht: string, transform: string, x: string, y: string,
                fontSize: string, fontFamily: string, fontWeight: string,
                fontStyle: string, textAnchor: string, tspanArray: StructTspan[]) {
        super('text', elementID, stroke, fill, strokewidht, transform);
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.fontWeight = fontWeight;
        this.fontStyle = fontStyle;
        this.textAnchor = textAnchor;
        this.x = x;
        this.y = y;
        this.tspanArray = new Array();
        for (const currentElement of tspanArray) {
            this.tspanArray.push(currentElement);
        }
    }
}
