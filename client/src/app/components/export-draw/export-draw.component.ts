import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

const ALPHANUMERICREGEX = '^[a-zA-Z0-9]+$';
@Component({
  selector: 'app-export-draw',
  templateUrl: './export-draw.component.html',
  styleUrls: ['./export-draw.component.scss'],
})
export class ExportDrawComponent {
  viewBox: string;
  protected fileUrl: any;
  @ViewChild('MySVG', { static: true }) svg: ElementRef;

  private  extensions = ['SVG', 'PNG', 'JPG', 'BMP'];
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,
    Validators.pattern(ALPHANUMERICREGEX)]),
    extension: new FormControl('SVG'),
  });

  constructor(private dialogRef: MatDialogRef<ExportDrawComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              protected sanitizer: DomSanitizer) {
    const indexPInHeight = this.data.height.indexOf('p');
    const heightTemp = Number(this.data.height.substring(0, indexPInHeight));
    const indexPInWidth = this.data.width.indexOf('p');
    const widthTemp = Number(this.data.width.substring(0, indexPInWidth));
    this.viewBox = `0 0 ${widthTemp} ${heightTemp}`;
              }

  closeDialog(): void {
    this.form.reset();
    this.dialogRef.close(null);
  }
  getName(): string {
    return this.form.value.name;
  }
  getExtension(): number {
    return this.form.value.extension;
  }

  export() {
    if (this.extensions.includes(this.form.value.extension)) {
      this.dialogRef.close(this.form.value);
    }
  }
  setValueInForm(nameValue: string, extensionValue: string): void {
    this.form.setValue({
      name: nameValue,
      extension: extensionValue,
    });
  }
}
