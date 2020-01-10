import { Injectable } from '@angular/core';
import { ColorToolService } from './color-tool.service';
import { TEXTURES_ID } from './drawing-tool-constants';
import { PencilParamsService } from './pencil-params.service';

const filterToName: { [key: string]: TEXTURES_ID } = {
  'texture 1': TEXTURES_ID.texture1,
  'texture 2': TEXTURES_ID.texture2,
  'texture 3': TEXTURES_ID.texture3,
  'texture 4': TEXTURES_ID.texture4,
  'texture 5': TEXTURES_ID.texture5,
};

@Injectable({
  providedIn: 'root',
})

export class PaintBrushParamsService extends PencilParamsService {
  private texture: string;
  private filter: string;

  constructor(protected colorService: ColorToolService) {
    super(colorService);
    this.filter = '';
    this.texture = '';
  }

  setDefault(): void {
    this.texture = 'texture 1';
    this.setReady = true;
    this.setThickness(1);
  }

  getFilter(): string {
    return this.filter;
  }

  setTexture(texture: string): void {
    this.texture = texture;
  }

  getTexture(): string {
    return this.texture;
  }

  setFilter(): void {
    this.filter = `url(#${filterToName[this.texture]})`;
    this.setReady = true;
  }

  setStyles(): object {
    this.setFilter();
    const styles = {
      fill: this.setFill('none'),
      stroke: this.setStroke(this.colorService.getPrimaryColor()),
      filter: this.filter,
      'stroke-width': this.getThickness(),
      'stroke-linecap': this.setStrokeLinecap('round'),
      'stroke-line-join': 'round',
    };
    return styles;
  }

  submitElement(myPath: Element, shapeName: string): boolean {
    super.submitElement(myPath, shapeName);
    myPath.setAttributeNS(null, 'filter', this.getFilter());
    return this.path.length !== 0;
  }
}
