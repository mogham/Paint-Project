/*
* On s'est inspiré du tutorial dans le lien suivant:
* https://malcoded.com/posts/angular-color-picker/
*
*/
import {
  AfterViewInit, Component, ElementRef, EventEmitter, HostListener,
  Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';

const WHITE_COLOR_RGBA_WITH_TOTAL_OPACITY = 'RGBA(255,255,255,1)';
const WHITE_COLOR_RGBA = 'RGBA(255,255,255,0)';
const BLACK_COLOR_RGBA_WITH_TOTAL_OPACITY = 'RGBA(0,0,0,1)';
const BLACK_COLOR_RGBA = 'RGBA(0,0,0,0)';
const WHITE = 'white';

@Component({
  selector: 'app-color-palette',
  templateUrl: './color-palette.component.html',
  styleUrls: ['./color-palette.component.scss'],
})
export class ColorPaletteComponent implements AfterViewInit, OnChanges {
  @Input()
  hue: string;

  @Output()
  color: EventEmitter<string> = new EventEmitter(true);

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null;

  private mousedown = false;

  selectedPosition: { x: number; y: number };

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

      this.ctx.fillStyle = this.hue || WHITE_COLOR_RGBA_WITH_TOTAL_OPACITY;
      this.ctx.fillRect(0, 0, width, height);

      const whiteGrad = this.ctx.createLinearGradient(0, 0, width, 0);
      whiteGrad.addColorStop(0, WHITE_COLOR_RGBA_WITH_TOTAL_OPACITY);
      whiteGrad.addColorStop(1, WHITE_COLOR_RGBA);

      this.ctx.fillStyle = whiteGrad;
      this.ctx.fillRect(0, 0, width, height);

      const blackGrad = this.ctx.createLinearGradient(0, 0, 0, height);
      blackGrad.addColorStop(0, BLACK_COLOR_RGBA);
      blackGrad.addColorStop(1, BLACK_COLOR_RGBA_WITH_TOTAL_OPACITY);

      this.ctx.fillStyle = blackGrad;
      this.ctx.fillRect(0, 0, width, height);

      if (this.selectedPosition) {
        this.ctx.strokeStyle = WHITE;
        this.ctx.fillStyle = WHITE;
        this.ctx.beginPath();
        this.ctx.arc(this.selectedPosition.x, this.selectedPosition.y, 10, 0, 2 * Math.PI);
        this.ctx.lineWidth = 5;
        this.ctx.stroke();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hue) {
      this.draw();
      const pos = this.selectedPosition;
      if (pos) {
        this.color.emit(this.getColorAtPosition(pos.x, pos.y));
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
    this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
    this.draw();
    this.color.emit(this.getColorAtPosition(evt.offsetX, evt.offsetY));
  }

  onMouseMove(evt: MouseEvent): void {
    if (this.mousedown) {
      this.selectedPosition = { x: evt.offsetX, y: evt.offsetY };
      this.draw();
      this.emitColor(evt.offsetX, evt.offsetY);
    }
  }

  emitColor(x: number, y: number): void {
    const rgbaColor = this.getColorAtPosition(x, y);
    this.color.emit(rgbaColor);
  }

  setCtx(newCtx: CanvasRenderingContext2D | null): void {
    this.ctx = newCtx;
  }

  getColorAtPosition(x: number, y: number): string {
    if (this.ctx != null) {
      const imageData = this.ctx.getImageData(x, y, 1, 1).data;
      return 'RGBA(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
    }
    return WHITE_COLOR_RGBA_WITH_TOTAL_OPACITY;
  }
}
