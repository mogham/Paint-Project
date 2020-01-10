import { StructPathPen } from './struct-path-pen';
import { StructSVGElement } from './struct-svgelement';

export class StructPen extends StructSVGElement {
    pathArray: StructPathPen[];
    constructor(elementID: string, transform: string, pathArray: StructPathPen[]) {
        super('pen', elementID, ' ', ' ', ' ', transform);
        this.pathArray = new Array();
        for (const currentElement of pathArray) {
            this.pathArray.push(currentElement);
        }
    }
}
