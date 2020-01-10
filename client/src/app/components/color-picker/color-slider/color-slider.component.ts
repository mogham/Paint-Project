/*
* On s'est inspiré du tutorial dans le lien suivant:
* https://malcoded.com/posts/angular-color-picker/
*
*/
import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { COLORS } from './color-slider-constants';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.scss'],
})

export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false })
  canvas: ElementRef<HTMLCanvasElement>;

  @Output()
  color: EventEmitter<string> = new EventEmitter();

  private ctx: CanvasRenderingContext2D | null;
  private mousedown = false;
  private selectedHeight: number;

  ngAfterViewInit() {
    this.draw();
  }

  draw(): void {
    if (!this.ctx) {
      this.ctx = this.canvas.nativeElement.getContext('2d');
    }

    if (this.ctx != null) {
      const width = this.canvas.nativeElement.width;
      const height = this.canvas.nativeElement.height;

      this.ctx.clearRect(0, 0, width, height);

      const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, COLORS.RED);
      gradient.addColorStop(0.17, COLORS.YELLOW);
      gradient.addColorStop(0.34, COLORS.GREEN);
      gradient.addColorStop(0.51, COLORS.TURQUOISE);
      gradient.addColorStop(0.68, COLORS.BLUE);
      gradient.addColorStop(0.85, COLORS.PURPLE);

      this.ctx.beginPath();
      this.ctx.rect(0, 0, width, height);

      this.ctx.fillStyle = gradient;
      this.ctx.fill();
      this.ctx.closePath();

      if (this.selectedHeight) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 5;
        this.ctx.rect(0, this.selectedHeight - 5, width, 10);
        this.ctx.stroke();
        this.ctx.closePath();
      }
    }

  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(evt: MouseEvent) {
    this.mousedown = false;
  }

  getMouseStatus(): boolean {
    return this.mousedown;
  }

  onMouseDown(evt: MouseEvent): void {
    this.mousedown = true;
    this.selectedHeight = evt.offsetY;
    this.draw();
    this.emitColor(evt.offsetX, evt.offsetY);
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY;
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  setCtx(newCtx: CanvasRenderingContext2D | null): void {
    this.ctx = newCtx;
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  getColorAtPosition(x: number, y: number): string {
    if (this.ctx != null) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      return `RGBA(${imageData[0]},${imageData[1]},${imageData[2]},1)`;
    }
    return COLORS.WHITE;
  }
}
