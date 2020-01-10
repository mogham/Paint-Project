import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ColorPickerService } from 'src/app/drawing-tools/color-picker.service';
import { ColorToolService } from '../../../drawing-tools/color-tool.service';

const HEXADECIMAL_BLACK_COLOR = '#000000';
const NBLASTCOLORS = 10;
@Component({
  selector: 'app-color-tool',
  templateUrl: './color-tool.component.html',
  styleUrls: ['./color-tool.component.scss'],
})
export class ColorToolComponent implements OnInit, OnDestroy {
  @Output() eventEmit: EventEmitter<string> = new EventEmitter<string>();
  @Input() primaryColor: string;
  @Input() secondColor: string;
  @Input() opacity: string;
  @Input() opacityInPourcent: string;
  @Input() colorInHex: string;
  private lastColorsArray: string[];
  private backgroundColor: string;
  private changePrimaryColorSubscription: Subscription;
  private changeSecondColorSubscription: Subscription;
  constructor( private colorApplicatorService: ColorToolService, private colorPickerService: ColorPickerService ) {
    this.primaryColor = HEXADECIMAL_BLACK_COLOR;
    this.secondColor = HEXADECIMAL_BLACK_COLOR;
    this.opacityInPourcent = '100';
    this.opacity = '1';
    this.colorInHex = HEXADECIMAL_BLACK_COLOR;
    this.lastColorsArray = new Array(NBLASTCOLORS);
    for (let index = 0; index < NBLASTCOLORS; index++) {
      this.lastColorsArray[index] = HEXADECIMAL_BLACK_COLOR  ;
    }
    this.backgroundColor = '#00000000';
  }

  ngOnInit() {
    this.changePrimaryColorSubscription = this.colorApplicatorService.getChangePrimaryColorSubject().subscribe(
      (arrayPrimaryColor: string[]) => {
        this.primaryColor = arrayPrimaryColor[0];
        this.updateLastColors(this.primaryColor);
      },
    );
    this.colorApplicatorService.emitPrimaryColorSubject();

    this.changeSecondColorSubscription = this.colorApplicatorService.getChangeSecondColorSubject().subscribe(
      (arraySecondColor: string[]) => {
        this.secondColor = arraySecondColor[0];
        this.updateLastColors(this.secondColor);
      },
    );
    this.colorApplicatorService.emitSecondColorSubject();
  }

  getBackgroundColor(): string {
    return this.backgroundColor;
  }

  getPrimaryColor(): string {
    return this.primaryColor;
  }

  getSecondColor(): string {
    return this.secondColor;
  }

  getOpacity(): string {
    return this.opacity;
  }
  setOpacity(opacity: string) {
    this.opacity = opacity;
  }

  getLastColor(index: number): string {
    if (index < NBLASTCOLORS) {
      return this.lastColorsArray[index];
    } else {
      return '#000000';
    }
  }

  getColorInHex(): string {
    return this.colorInHex;
  }

  setPrimaryColor(newColor: string): void {
    this.primaryColor = newColor;
  }

  setSecondColor(newColor: string): void {
    this.secondColor = newColor;
  }

  setColorInHex(newColorHex: string): void {
    this.colorInHex = newColorHex;
  }

  updateBackgroundColor(): void {
    this.backgroundColor = this.primaryColor;
    this.eventEmit.emit(this.backgroundColor);
  }

  updatePrimaryColor(): void {
    this.opacity = (parseInt(this.opacityInPourcent, 10) / 100).toString();
    this.primaryColor = this.colorPickerService.getColor() + this.opacity + ')';
    this.setPrimaryColorParams();
  }

  updateSecondColor(): void {
    this.opacity = (parseInt(this.opacityInPourcent, 10) / 100).toString();
    this.secondColor = this.colorPickerService.getColor() + this.opacity + ')';
    this.setSecondColorParams();
  }

  setPrimaryColorParams(): void {
    this.colorApplicatorService.setPrimaryColor(this.primaryColor);
    this.updateLastColors(this.primaryColor);
  }

  setSecondColorParams(): void {
    this.colorApplicatorService.setSecondColor(this.secondColor);
    this.updateLastColors(this.secondColor);
  }

  updateLastColors(lastColor: string): void {
    for (let index = NBLASTCOLORS - 1; index > 0; index--) {
      this.lastColorsArray[index] = this.lastColorsArray[index - 1];
    }
    this.lastColorsArray[0] = lastColor;
  }

  checkHexColor(): boolean {
    let isCorrect = true;
    if (this.colorInHex.length > 9) {
      this.colorInHex = this.colorInHex.substring(0, 8);
    }
    const regexp = /^[0-9a-fA-F]+$/;
    isCorrect = regexp.test(this.colorInHex.substring(1, this.colorInHex.length));
    if (!(this.colorInHex[0] === '#')) {
      isCorrect = false;
    }
    return isCorrect;
  }

  updateHexColor(isPrimaryColor: boolean): void {
    if (this.checkHexColor()) {
      if (this.colorInHex.length !== 9) {
        for (let index = this.colorInHex.length; index < 9; index++) {
          if (index === 8 || index === 7) {
            this.colorInHex += 'f';
          } else {
            this.colorInHex += '0';
          }
        }
      }
      this.opacity = (parseInt(this.colorInHex.substring(7, 9), 16) / 255).toString();
      if ( isPrimaryColor ) {
        this.primaryColor = this.hexToRGBA(this.colorInHex) + this.opacity + ')';
        this.colorApplicatorService.setPrimaryColor(this.primaryColor);
        this.updateLastColors(this.primaryColor);
      } else {
        this.secondColor = this.hexToRGBA(this.colorInHex) + this.opacity + ')';
        this.colorApplicatorService.setPrimaryColor(this.secondColor);
        this.updateLastColors(this.secondColor);
      }
    }
    this.colorInHex = '#00000000';
  }

  hexToRGBA(colorInHex: string): string {
    return 'RGBA(' + parseInt(colorInHex.substring(1, 3), 16).toString() + ',' + parseInt(colorInHex.substring(3, 5), 16).toString()
      + ',' + parseInt(colorInHex.substring(5, 7), 16).toString() + ',';
  }

  invertColors(): void {
    const temp: string = this.primaryColor;
    this.primaryColor = this.secondColor;
    this.secondColor = temp;
    this.colorApplicatorService.setPrimaryColor(this.primaryColor);
    this.colorApplicatorService.setSecondColor(this.secondColor);
  }

  takeLastColors(index: number, isPrimaryColor: boolean): void {
    if (isPrimaryColor) {
      this.primaryColor = this.lastColorsArray[index];
      this.setPrimaryColorParams();
    } else if (!isPrimaryColor) {
      this.secondColor = this.lastColorsArray[index];
      this.setSecondColorParams();
    }
  }

  ngOnDestroy() {
    this.changePrimaryColorSubscription.unsubscribe();
    this.changeSecondColorSubscription.unsubscribe();
  }
}
