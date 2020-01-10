import { StructEllipseAerosol } from './struct-ellipse-aerosol';
import { StructSVGElement } from './struct-svgelement';

export class StructAerosol extends StructSVGElement {
    ellipseArray: StructEllipseAerosol[];
    constructor(elementID: string, transform: string, ellipseArray: StructEllipseAerosol[]) {
        super('aerosol', elementID, ' ', ' ', ' ', transform);
        this.ellipseArray = new Array();
        for (const currentElement of ellipseArray) {
            this.ellipseArray.push(currentElement);
        }
    }
}
