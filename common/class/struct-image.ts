import { StructSVGElement } from './struct-svgelement';

export class StructImage extends StructSVGElement {
    href: string;
    originX: string;
    originY: string;
    width: string;
    height: string;
    constructor(elementID: string, originX: string, originY: string, width: string, height: string, transform: string, href: string) {
        super('image', elementID, ' ', ' ', ' ', transform);
        this.href = href;
        this.originX = originX;
        this.originY = originY;
        this.width = width;
        this.height = height;
    }
}
