import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { MatChipInputEvent } from '@angular/material/chips';
import { DomSanitizer } from '@angular/platform-browser';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { SaveService } from 'src/app/server-services/save.service';
import { ShapesSVGElement } from '../../../../../common/class/shapes-svgelement';
import { StructAerosol } from '../../../../../common/class/struct-aerosol';
import { StructEllipse } from '../../../../../common/class/struct-ellipse';
import { StructEllipseAerosol } from '../../../../../common/class/struct-ellipse-aerosol';
import { StructImage } from '../../../../../common/class/struct-image';
import { StructPathPen } from '../../../../../common/class/struct-path-pen';
import { StructPen } from '../../../../../common/class/struct-pen';
import { StructPencil } from '../../../../../common/class/struct-pencil';
import { StructPolygon } from '../../../../../common/class/struct-polygon';
import { StructRectangle } from '../../../../../common/class/struct-rectangle';
import { StructSVGElement } from '../../../../../common/class/struct-svgelement';
import { StructText } from '../../../../../common/class/struct-text';
import { StructTspan } from '../../../../../common/class/struct-tspan';
import { SvgImage } from '../../../../../common/SvgImage';
const ALPHANUMERICREGEX = '^[a-zA-Z0-9]+$';
@Component({
  selector: 'app-save-draw',
  templateUrl: './save-draw.component.html',
  styleUrls: ['./save-draw.component.scss'],
})
export class SaveDrawComponent {
  private obj: SvgImage;
  protected isLocal: boolean;
  protected onDataBase: boolean;
  protected onCloud: boolean;
  protected indexSave: number;
  protected SaveWhere: string[];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl();
  filteredTags: Observable<string[]>;
  tags: string[] = [];
  allTags: string[] = [];
  viewBox: string;
  existingkey: string[];
  private drawAsString: string;
  @ViewChild('tagInput', { static: true }) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('MySVG', { static: true }) svg: ElementRef;
  constructor(private dialogRef: MatDialogRef<SaveDrawComponent>,
              private saveService: SaveService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              protected sanitizer: DomSanitizer) {
    this.obj = new SvgImage();
    const indexPInHeight = this.data.height.indexOf('p');
    const heightTemp = Number(this.data.height.substring(0, indexPInHeight));
    const indexPInWidth = this.data.width.indexOf('p');
    const widthTemp = Number(this.data.width.substring(0, indexPInWidth));
    this.viewBox = `0 0 ${widthTemp} ${heightTemp}`;
    this.isLocal = true;
    this.onCloud = false;
    this.onDataBase = false;
    this.indexSave = 0;
    this.SaveWhere = ['Save online', 'Save local'];
    this.drawAsString = '';
    this.saveService.getAllkey().subscribe((result: string[]) => {
      this.existingkey = result;
    });
  }
  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required,
    Validators.pattern(ALPHANUMERICREGEX)]),
    tags: new FormControl([], []),
  });
  getName(): string {
    return this.form.value.name;
  }
  close(): void {
    this.form.reset();
    this.dialogRef.close(null);
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    const index: number = this.tags.indexOf(value);
    if (index >= 0) {
      this.tagCtrl.setValue(null);
      input.value = '';
      return;
    }
    if ((value || '').trim()) {
      this.tags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.tagCtrl.setValue(null);
    this.form.setValue({
      name: this.getName(),
      tags: this.tags,
    });
  }
  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0 && index < this.tags.length) {
      this.tags.splice(index, 1);
    }
  }
  createObject(): void {
    this.obj.svg = this.svg.nativeElement.outerHTML;
    this.obj.name = this.form.value.name;
    this.obj.tags = this.tags;
    this.obj.height = this.data.height;
    this.obj.width = this.data.width;
    this.obj.backgroundColor = this.data.backgroundColor;
    this.obj.shapes = this.data.elements;
  }

  saveOnDataBase(): void {
    this.createObject();
    this.saveService.saveDrawInDataBase(this.obj).subscribe(
      (response: boolean) => {
        this.dialogRef.close(response);
      },
      () => {
        this.dialogRef.close(false);
        return;
      },
    );
  }
  generatekey(): number {
    return Math.floor(Math.random() * 1000) + 1;
  }

  saveOnCloud(): void {
    let key: string = this.generatekey().toString() ;
    while ( (this.existingkey.indexOf(key) > 0 )) {
      key = this.generatekey().toString();
    }
    this.createObject();
    this.obj._id = key ;
    this.saveService.saveDrawInCloud(this.obj).subscribe(
      () => {
        this.dialogRef.close(true);
      });
    this.dialogRef.close(true);

  }

  saveLocal() {
    this.createObject();
    this.svgImageToString();
    const blob = new Blob([this.drawAsString], { type: 'text/plain;charset=utf-8' });
    FileSaver.saveAs(blob, this.form.value.name + '.txt');
  }

  svgImageToString(): void {
    this.drawAsString = '';
    this.drawAsString += this.obj.width + '\n';
    this.drawAsString += this.obj.height + '\n';
    this.drawAsString += this.obj.backgroundColor + '\n';
    for (const currentShape of this.obj.shapes) {
      if (currentShape instanceof StructPen) {
        this.PenSVGElelementToString(currentShape);
      } else if (currentShape instanceof StructAerosol) {
        this.AerosolSVGElelementToString(currentShape);
      } else {
        this.abstractSVGElementToString(currentShape);
        if (currentShape instanceof StructRectangle || currentShape instanceof StructEllipse) {
          this.shapesSVGElementToString(currentShape);
        } else if (currentShape instanceof StructPencil) {
          this.pathSVGElementToString(currentShape);
        } else if (currentShape instanceof StructPolygon) {
          this.polygonSVGElementToString(currentShape);
        } else if (currentShape instanceof StructImage) {
          this.imageSVGElementToString(currentShape);
        } else if (currentShape instanceof StructText) {
          this.texteSVGElelementToString(currentShape);
        }
      }
    }
  }

  AerosolSVGElelementToString(shape: StructAerosol) {
    this.drawAsString += shape.id + '\n';
    this.drawAsString += shape.elementID + '\n';
    this.drawAsString += shape.transform + '\n';
    this.drawAsString += String(shape.ellipseArray.length) + '\n';
    for (const ellipseAerosol of shape.ellipseArray) {
      this.ellipseAerosolSVGElementToString(ellipseAerosol);
    }
  }

  ellipseAerosolSVGElementToString(shape: StructEllipseAerosol) {
    this.drawAsString += shape.rx + '\n';
    this.drawAsString += shape.ry + '\n';
    this.drawAsString += shape.cx + '\n';
    this.drawAsString += shape.cy + '\n';
    this.drawAsString += shape.stroke + '\n';
    this.drawAsString += shape.strokeWidth + '\n';
    this.drawAsString += shape.fill + '\n';
  }
  PenSVGElelementToString(shape: StructPen) {
    this.drawAsString += shape.id + '\n';
    this.drawAsString += shape.elementID + '\n';
    this.drawAsString += shape.transform + '\n';
    this.drawAsString += String(shape.pathArray.length) + '\n';
    for (const pathPen of shape.pathArray) {
      this.pathPenSVGElementToString(pathPen);
    }
  }

  pathPenSVGElementToString(shape: StructPathPen) {
    this.drawAsString += shape.stroke + '\n';
    this.drawAsString += shape.strokeWidth + '\n';
    this.drawAsString += shape.fill + '\n';
    this.drawAsString += shape.d + '\n';
    this.drawAsString += shape.strokeLinecap + '\n';
    this.drawAsString += shape.strokeLinejoin + '\n';
  }

  texteSVGElelementToString(shape: StructText) {
    this.drawAsString += shape.x + '\n';
    this.drawAsString += shape.y + '\n';
    this.drawAsString += shape.fontSize + '\n';
    this.drawAsString += shape.fontFamily + '\n';
    this.drawAsString += shape.fontWeight + '\n';
    this.drawAsString += shape.fontStyle + '\n';
    this.drawAsString += shape.textAnchor + '\n';
    this.drawAsString += String(shape.tspanArray.length) + '\n';
    for (const tspan of shape.tspanArray) {
      this.tspanSVGElementToString(tspan);
    }
  }

  tspanSVGElementToString(shape: StructTspan) {
    this.drawAsString += shape.x + '\n';
    this.drawAsString += shape.y + '\n';
    this.drawAsString += shape.text + '\n';
  }

  abstractSVGElementToString(shape: StructSVGElement): void {
    this.drawAsString += shape.id + '\n';
    this.drawAsString += shape.elementID + '\n';
    this.drawAsString += shape.stroke + '\n';
    this.drawAsString += shape.fill + '\n';
    this.drawAsString += shape.strokewidht + '\n';
    this.drawAsString += shape.transform + '\n';
  }
  shapesSVGElementToString(shape: ShapesSVGElement): void {
    this.drawAsString += shape.originX + '\n';
    this.drawAsString += shape.originY + '\n';
    this.drawAsString += shape.width + '\n';
    this.drawAsString += shape.height + '\n';
  }
  pathSVGElementToString(shape: StructPencil): void {
    this.drawAsString += shape.points + '\n';
    this.drawAsString += shape.strokeLinceCap + '\n';
    this.drawAsString += shape.filter + '\n';
    this.drawAsString += shape.strokeDasharray + '\n';
    this.drawAsString += shape.markerMid + '\n';
    this.drawAsString += shape.fillRule + '\n';
  }
  polygonSVGElementToString(shape: StructPolygon): void {
    this.drawAsString += shape.points + '\n';
  }
  imageSVGElementToString(shape: StructImage): void {
    this.drawAsString += shape.originX + '\n';
    this.drawAsString += shape.originY + '\n';
    this.drawAsString += shape.width + '\n';
    this.drawAsString += shape.height + '\n';
    this.drawAsString += shape.href + '\n';
  }

}
