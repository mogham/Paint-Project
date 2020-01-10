// tslint:disable: variable-name
import { StructSVGElement } from '../common/class/struct-svgelement';
export class SvgImage {
    _id: string;
    name: string;
    svg: string;
    shapes: StructSVGElement[];
    tags: string[];
    width: string;
    height: string;
    backgroundColor: string;

    constructor() {
        this.name = '';
        this.tags = [];
        this.svg = '';
        this.width = '';
        this.height = '';
        this.backgroundColor = '';
        this.shapes = new Array();
    }
}
