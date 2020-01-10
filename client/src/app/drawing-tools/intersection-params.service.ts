import { Injectable } from '@angular/core';

const STRING_TYPE = '1';
@Injectable({
  providedIn: 'root',
})
export class IntersectionParamsService {
  shapeSelected: HTMLElement;
  testShape: any;
  isIntersect = false;
  isSelection = false;
  constructor() { /*  */ }
  intersection(area: any, child: any): boolean {
    const leftAreaX: number = parseFloat(area.getAttribute('x'));
    const rightAreaX: number = leftAreaX + parseFloat(area.getAttribute('width'));
    const upperAreaY: number = parseFloat(area.getAttribute('y'));
    const downAreaY: number = upperAreaY + parseFloat(area.getAttribute('height'));
    const areaAtt = {
      left: leftAreaX,
      right: rightAreaX,
      upper: upperAreaY,
      down: downAreaY,
    };
    if (child !== null && area !== child) {
      this.checkIntersection(areaAtt, child);
    }
    return this.isIntersect;
  }

  predicatBetween(leftElement: number, centerElement: number, rightElement: number): boolean {
    return ((leftElement < centerElement) && (centerElement < rightElement));
  }

  checkIntersection(area: any, child: Element): void {
    this.isIntersect = false;
    let leftElementX = 0;
    let RightElementX = 0;
    let upperElementY = 0;
    let downElementY = 0;
    if (typeof (child.getAttribute('x') as string) === typeof STRING_TYPE) {
      leftElementX = parseFloat(child.getAttribute('x') as string);
      RightElementX = leftElementX + parseFloat(child.getAttribute('width') as string);
    } else {
      leftElementX = parseFloat(child.getAttribute('x') as string);
      RightElementX = leftElementX + parseFloat(child.getAttribute('width') as string);
    }
    if (this.predicatBetween(area.left, leftElementX, area.right)
      || (this.predicatBetween(area.left, RightElementX, area.right))) {
      if (typeof (child.getAttribute('y') as string) === typeof STRING_TYPE) {
        upperElementY = parseFloat(child.getAttribute('y') as string);
        downElementY = upperElementY + parseFloat(child.getAttribute('height') as string);
      } else {
        upperElementY = parseFloat(child.getAttribute('y') as string);
        downElementY = upperElementY + parseFloat(child.getAttribute('height') as string);
      }
      if (this.predicatBetween(upperElementY, area.upper, downElementY)) {
        this.isIntersect = true;
      } else if (this.predicatBetween(upperElementY, area.down, downElementY)) {
        this.isIntersect = true;
      } else if (this.predicatBetween(leftElementX, area.left, RightElementX)
        && (this.predicatBetween(area.upper, upperElementY, downElementY))
        && (this.predicatBetween(upperElementY, downElementY, area.down))) {
        this.isIntersect = true;
      } else if (this.predicatBetween(leftElementX, area.right, RightElementX)
        && (this.predicatBetween(area.upper, upperElementY, downElementY))
        && (this.predicatBetween(upperElementY, downElementY, area.down))) {
        this.isIntersect = true;
      }
    } else if ((this.predicatBetween(leftElementX, area.left, RightElementX))
      || (this.predicatBetween(leftElementX, area.right, RightElementX))) {
      if (typeof (child.getAttribute('y') as string) === typeof STRING_TYPE) {
        upperElementY = parseFloat(child.getAttribute('y') as string);
        downElementY = upperElementY + parseFloat(child.getAttribute('height') as string);
      } else {
        upperElementY = parseFloat(child.getAttribute('y') as string);
        downElementY = upperElementY + parseFloat(child.getAttribute('height') as string);
      }
      if ((this.predicatBetween(area.upper, upperElementY, area.down))
        || (this.predicatBetween(area.upper, downElementY, area.down))) {
        this.isIntersect = true;
      }
    }
  }
}
