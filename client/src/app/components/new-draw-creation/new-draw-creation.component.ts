import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

const HEXADECIMAL_REGEX = /^#+([a-fA-F0-9]{8})$/;
const HEXADECIMAL_WHITE_COLOR = '#FFFFFFFF';
const WHITE_COLOR_RGBA = 'rgba(255,255,255,1)';
@Component({
  selector: 'app-new-draw-creation',
  templateUrl: './new-draw-creation.component.html',
  styleUrls: ['./new-draw-creation.component.scss'],
})
export class NewDrawCreationComponent {
  private redColorPicker: number;
  private greenColorPicker: number;
  private blueColorPicker: number;
  private color: string = WHITE_COLOR_RGBA;

  private showRGBA: boolean;
  private showHexadecimal: boolean;
  private showPalette: boolean;
  private heightChoosed: boolean;
  private widthChoosed: boolean;
  private colorChoosed: boolean;

  constructor(private dialogRef: MatDialogRef<NewDrawCreationComponent>) {
    this.showRGBA = true;
    this.showHexadecimal = false;
    this.showPalette = false;
    this.heightChoosed = true;
    this.widthChoosed = true;
    this.colorChoosed = true;
  }

  form: FormGroup = new FormGroup({
    height: new FormControl(1000, [Validators.required,
    Validators.min(1)]),

    width: new FormControl(1000, [Validators.required,
    Validators.min(1)]),
    redColor: new FormControl(255, [Validators.required,
    Validators.min(0),
    Validators.max(255)]),

    greenColor: new FormControl(255, [Validators.required, Validators.min(0),
    Validators.max(255)]),

    blueColor: new FormControl(255, [Validators.required, Validators.min(0),
    Validators.max(255)]),

    opacity: new FormControl(1, [Validators.required, Validators.min(0),
    Validators.max(1)]),

    hexadecimalColor: new FormControl(HEXADECIMAL_WHITE_COLOR, [Validators.required,
    Validators.pattern(HEXADECIMAL_REGEX)]),
  });

  getHeight(): number {
    return this.form.value.height;
  }

  getWidth(): number {
    return this.form.value.width;
  }

  insertFormGroup(newHeight: number, newWidth: number, newRedColor: number, newGreenColor: number,
                  newBlueColor: number, newOpacity: number): void {
    this.form.setValue({
      height: newHeight,
      width: newWidth,
      redColor: newRedColor,
      greenColor: newGreenColor,
      blueColor: newBlueColor,
      opacity: newOpacity,
      hexadecimalColor: HEXADECIMAL_WHITE_COLOR,
    });
  }

  close(): void {
    this.form.reset();
    this.dialogRef.close(null);
  }

  activateHeight() {
    if (this.getHeight() === null || this.getHeight() <= 0) {
      this.heightChoosed = false;
    } else {
      this.heightChoosed = true;
    }
  }

  activateWidth() {
    if (this.getWidth() === null || this.getWidth() <= 0) {
      this.widthChoosed = false;
    } else {
      this.widthChoosed = true;
    }
  }

  getShowRGBA() {
    return this.showRGBA;
  }

  getShowHex() {
    return this.showHexadecimal;
  }

  getShowPalette() {
    return this.showPalette;
  }

  activateColorInHex() {
    if (this.showHexadecimal) {
      if (this.form.value.hexadecimalColor !== null
        && HEXADECIMAL_REGEX.test(this.form.value.hexadecimalColor)) {
        this.colorChoosed = true;
      } else {
        this.colorChoosed = false;
      }
    }
    return;
  }

  activateColorInRGBA() {
    if (this.showRGBA) {
      if (this.form.value.redColor !== null && this.form.value.redColor >= 0 && this.form.value.redColor < 256
        && this.form.value.greenColor !== null && this.form.value.greenColor >= 0 && this.form.value.greenColor < 256
        && this.form.value.blueColor !== null && this.form.value.blueColor >= 0 && this.form.value.blueColor < 256
        && this.form.value.opacity !== null && this.form.value.opacity >= 0 && this.form.value.opacity <= 1) {
        this.colorChoosed = true;
      } else if (this.form.value.redColor == null || this.form.value.redColor > 255 || this.form.value.greenColor == null
        || this.form.value.greenColor > 255 || this.form.value.blueColor > 255 || this.form.value.opacity > 1
        || this.form.value.blueColor == null || this.form.value.opacity == null) {
        this.colorChoosed = false;
      }
    }
    return;
  }

  activateColorInPalette() {
    if (this.showPalette) {
      if (this.color.length !== 0) {
        this.colorChoosed = true;
      } else {
        this.colorChoosed = false;
      }
    }
    return;
  }
  setColor(color: string): void {
    this.activateColorInPalette();
    this.color = color;
  }

  getColor(): string {
    return this.color;
  }

  getRGBA(): void {
    const RGBAREGEX = '/[^\d,.]/g';
    const RGBAFORMAT = this.color.replace(RGBAREGEX, '').split(',');
    this.redColorPicker = Number(RGBAFORMAT[0].substring(this.color.indexOf('(') + 1));
    this.greenColorPicker = Number(RGBAFORMAT[1]);
    this.blueColorPicker = Number(RGBAFORMAT[2]);
  }

  onSubmit(): void {
    if (this.colorChoosed && this.heightChoosed && this.widthChoosed) {
      if (this.showHexadecimal) {
        this.hexToRgba();
      } else if (this.showPalette) {
        this.setColorFromPalette();
      }
      this.dialogRef.close(this.form.value);
    }
  }

  chooseRGBA(): void {
    this.showRGBA = !this.showRGBA;
    this.showHexadecimal = false;
    this.showPalette = false;
    this.activateColorInRGBA();
  }

  chooseHexadecimal(): void {
    this.showHexadecimal = !this.showHexadecimal;
    this.showRGBA = false;
    this.showPalette = false;
    this.activateColorInHex();
  }

  choosePalette(): void {
    this.showPalette = !this.showPalette;
    this.showRGBA = false;
    this.showHexadecimal = false;
  }

  setValueInForm( heightParam: number, widthParam: number,
                  redColorParam: number, greenColorParam: number, blueColorParam: number,
                  opacityParam: number, hexadecimalParam: string): void {
    this.form.setValue({
      height: heightParam,
      width: widthParam,
      redColor: redColorParam,
      greenColor: greenColorParam,
      blueColor: blueColorParam,
      opacity: opacityParam,
      hexadecimalColor: hexadecimalParam,
    });
  }

  setColorFromPalette(): void {
    this.getRGBA();
    this.setValueInForm(this.getHeight(), this.getWidth(),
      this.redColorPicker, this.greenColorPicker, this.blueColorPicker, 1,
      this.form.value.hexadecimalColor);
  }

  hexToRgba(): void {
    const hexString: string = this.form.value.hexadecimalColor;
    this.setValueInForm(this.getHeight(), this.getWidth(),
      parseInt(hexString.substr(1, 2), 16),
      parseInt(hexString.substr(3, 2), 16),
      parseInt(hexString.substr(5, 2), 16), parseInt(hexString.substr(7, 2), 16) / 255,
      this.form.value.hexadecimalColor,
    );
  }
}
