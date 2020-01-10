import { Injectable, Renderer2 } from '@angular/core';
const IMAGEFORMAT = 'data:image/svg+xml;base64,';
@Injectable({
  providedIn: 'root',
})
export class ExportFileService {

  render: Renderer2;
  svg: SVGElement;
  image: HTMLImageElement;
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;
  format: string;
  name: string;
  width: string;
  height: string;

  constructor() {/* */}

  svgToBase64(): string {
    return (IMAGEFORMAT + btoa(new XMLSerializer().serializeToString(this.svg as Node)));
  }

  encodImage() {
    const image = new Image();
    image.width = this.transformDimensionToNumber(this.width);
    image.height = this.transformDimensionToNumber(this.height);
    image.src = this.svgToBase64();
    return image;
  }
  transformDimensionToNumber(value: string): number {
    const indexOfPInDimension = value.indexOf('p');
    return Number(value.substring(0, indexOfPInDimension));
  }

  drawImageOnCanvas() {
    const canvasElement = this.render.createElement('canvas');
    canvasElement.width = this.transformDimensionToNumber(this.width);
    canvasElement.height = this.transformDimensionToNumber(this.height);
    this.render.appendChild(canvasElement, this.svg);
    const ctx = canvasElement.getContext('2d');
    if (ctx) {
      const image = this.encodImage();
      image.decode().then(() => {
        if (ctx) {
          ctx.drawImage(image, 0, 0);
          this.canvasElement = ctx.canvas;
          this.downloadImage();
        }
      })
        .catch((error) => {
          throw error;
        });
    }
  }

  loadImage(format: string, name: string) {
    this.format = format;
    this.name = name;
    this.drawImageOnCanvas();
  }

  downloadImage() {
    const downloadLink = this.render.createElement('a');
    this.render.appendChild(this.svg, downloadLink);
    downloadLink.href = (this.format === 'SVG' ? this.svgToBase64() : this.canvasElement.toDataURL('image/' + this.format));
    downloadLink.download = this.name + '.' + this.format.toLocaleLowerCase();
    downloadLink.click();
    this.render.removeChild(this.svg, downloadLink);
  }

  setCurrentRenderAndSVG(render: Renderer2, svg: SVGElement, width: string, height: string) {
    this.render = render;
    this.svg = svg;
    this.width = width;
    this.height = height;
  }
}
