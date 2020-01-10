import { Injectable } from '@angular/core';
import { MousePosition } from '../components/drawing-view/drawing-view-constants';
import { Shapes } from './abstract-shape';
import { ColorToolService } from './color-tool.service';
import { EMOJIS, stampAttributes } from './drawing-tool-constants';

const filterToName: { [key: string]: EMOJIS } = {
    happy: EMOJIS.happy,
    angry: EMOJIS.angry,
    bored: EMOJIS.bored,
    confused: EMOJIS.confused,
    kissing: EMOJIS.kissing,
};

@Injectable({
    providedIn: 'root',
})

export class StampService extends Shapes {
    private orientationAngle: number;
    protected stamp: string;
    protected scale: number;
    private stampUsed: string;
    isAltPressed: boolean;
    private orientatonStamp: number;

    constructor(protected colorTool: ColorToolService) {
        super(colorTool);
        this.originX = 0;
        this.originY = 0;
        this.stamp = '';
        this.orientationAngle = 0;
        this.svgCode = 'image';
        this.scale = 1;
        this.isAltPressed = false;
        this.orientatonStamp = 0;
    }

    setDefault(): void {
        this.setReady = true;
        this.stampUsed = '';
    }

    setStampUsed(stamp: string): void {
        if (stamp !== '') {
            this.stampUsed = stamp;
            this.setReady = true;
        }
    }

    getOrientationParameter() {
        return `rotate(${this.orientationAngle},
            ${this.originX + this.scale / 2},
            ${this.originY + this.scale / 2})`;
    }

    submitElement(shape: Element, shapeName: string): boolean {
        super.submitElement(shape, shapeName);
        shape.setAttributeNS(
            null,
            stampAttributes.transform,
            this.getOrientationParameter(),
        );
        shape.setAttributeNS(
            null,
            'href',
            this.stamp,
        );
        shape.setAttributeNS(
            null,
            stampAttributes.height,
            this.scale.toString(),
        );
        shape.setAttributeNS(
            null,
            stampAttributes.width,
            this.scale.toString(),
        );
        shape.setAttributeNS(
            null,
            stampAttributes.x,
            this.originX.toString(),
        );
        shape.setAttributeNS(
            null,
            stampAttributes.y,
            this.originY.toString(),
        );
        return true;
    }

    startDrawing(beginPosition: MousePosition) {
        this.originX = beginPosition.x - this.scale / 2;
        this.originY = beginPosition.y - this.scale / 2;
    }

    onMouseDown(currentPosition: MousePosition): void {
        this.setStyles();
        this.startDrawing(currentPosition);
    }

    draw(currentPosition: MousePosition): void {
        return;
    }

    setRotation(rotation: number): void {
        this.orientationAngle = rotation % 180;
    }

    getRotationAngle(): number {
        return this.orientationAngle = this.orientationAngle % 180;
    }

    setStamp(): void {
        this.stamp = `assets/svg/${filterToName[this.stampUsed]}.svg`;
    }

    setStyles(): void {
        this.setStamp();
        super.setStyles();
    }

    setScale(scaleValue: number): void {
        this.scale = scaleValue;
    }

    setAngleWithMouse(event: WheelEvent): void {
        if (this.isToolReady()) {
            if (event.deltaY < 0 && !this.isAltPressed) {
                this.orientatonStamp = -(event.deltaY / event.deltaY) * 15  ;
              } else if (event.deltaY >= 0 && !this.isAltPressed) {
                this.orientatonStamp =  (event.deltaY / event.deltaY) * 15 ;
              } else if (event.deltaY < 0 && this.isAltPressed) {
                this.orientatonStamp = -1 ;
              } else if (event.deltaY >= 0 && this.isAltPressed) {
                this.orientatonStamp = 1;
              }
            this.orientationAngle +=  this.orientatonStamp;
            if (this.orientationAngle < 0) {
                this.orientationAngle = 0;
              }
            if (this.orientationAngle < 0) {
                  this.orientationAngle = 0;
            }
            this.setRotation(this.orientationAngle);
            }
        }
}
