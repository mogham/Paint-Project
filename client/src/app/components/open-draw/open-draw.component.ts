import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MatPaginator, MatTableDataSource } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/notification-service/notification-service.service';
import { OpenService } from 'src/app/server-services/open.service';
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
import { TagFilter } from '../../../../../common/interface/filter';
import { SvgImage } from '../../../../../common/SvgImage';
@Component({
  selector: 'app-open-draw',
  templateUrl: './open-draw.component.html',
  styleUrls: ['./open-draw.component.scss'],
})
export class OpenDrawComponent implements OnInit {
  protected displayedColumns: string[];
  protected dataSource = new MatTableDataSource();
  protected dataSourceCloud = new MatTableDataSource();
  protected tagsFilter = new FormControl();
  protected allTags: string[];
  protected allTagsCloud: string[];
  protected selectedTags: string[];
  protected isLocal: boolean;
  protected onDataBase: boolean;
  protected onCloud: boolean;
  protected fileOpen: string;
  protected indexSave: number;
  protected SaveWhere: string[];
  private localDrawLaod: string;
  private showSpinner: boolean;
  private showSpinnerCloud: boolean;
  private isEmpty: boolean;
  protected isEmptyCloud: boolean;
  private serverError: boolean;
  protected keys: any;
  private localOpenButtonState: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginatorCloud: MatPaginator;
  protected filteredValues: TagFilter = { tags: [] };

  constructor(
    private dialogRef: MatDialogRef<OpenDrawComponent>,
    private allSvg: OpenService,
    private notificationService: NotificationService,
    protected sanitizer: DomSanitizer,
  ) {
    this.displayedColumns = ['name', 'tags', 'svg', 'actions'];
    this.dataSource = new MatTableDataSource();
    this.dataSourceCloud = new MatTableDataSource();
    this.tagsFilter = new FormControl();
    this.allTags = [];
    this.allTagsCloud = [];
    this.isLocal = true;
    this.onCloud = false;
    this.onDataBase = false;
    this.indexSave = 0;
    this.SaveWhere = ['Open online', 'Open local'];
    this.localDrawLaod = '';
    this.showSpinner = true;
    this.showSpinnerCloud = true;
    this.isEmpty = true;
    this.isEmptyCloud = true;
    this.selectedTags = this.allTags;
    this.serverError = false;
    this.localOpenButtonState = false;
  }

  close(): void {
    this.dialogRef.close(null);
  }

  ngOnInit() {
    this.showSpinner = true;

    setTimeout(() => {
      this.getSavedSvg();
      this.getSavedSvgfromCloud();
      this.dataSourceCloud.paginator = this.paginatorCloud;
      this.dataSource.paginator = this.paginator;
    });
    this.tagsFilter.valueChanges.subscribe((tagFilterValue) => {
      this.filteredValues.tags = tagFilterValue;
      this.dataSourceCloud.filterPredicate = this.customFilterPredicate();
      this.dataSourceCloud.filter = JSON.stringify(this.filteredValues);
      this.dataSource.filterPredicate = this.customFilterPredicate();
      this.dataSource.filter = JSON.stringify(this.filteredValues);
    });
  }

  customFilterPredicate() {
    return (data: SvgImage, filter: string): boolean => {
      const searchString = JSON.parse(filter) as TagFilter;
      let isPositionAvailable = false;
      if (searchString.tags.length) {
        for (const d of searchString.tags) {
          for (const tag of data.tags) {
            if (tag.trim() === d) {
              isPositionAvailable = true;
            }
          }
        }
      } else {
        isPositionAvailable = true;
      }
      return isPositionAvailable;
    };
  }

  getSavedSvgfromCloud() {
    this.allSvg.getAllSvgFromCloud().subscribe(
      (response: SvgImage[]) => {
        this.serverError = false;
        for (const i of response) {
          if (i.tags !== undefined) {
            for (const j of i.tags) {
              if (!this.allTagsCloud.includes(j)) {
                this.allTagsCloud.push(j);
              }
            }
          }
        }
        if (response.length === 0) {
          this.isEmptyCloud = true;
        }
        this.dataSourceCloud = new MatTableDataSource(response);
        this.showSpinnerCloud = !this.showSpinnerCloud;
        this.showSpinnerCloud = false;
        this.dataSource.paginator = this.paginatorCloud;
      },
      (error: any) => {
        this.notificationService.warn('Problem with the server.');
        if (!this.serverError) {
          this.serverError = true;
          this.showSpinnerCloud = false;
        }
      },
    );
  }

  getSavedSvg() {
    this.allSvg.getAllSvgFromDataBase().subscribe(
      (response: SvgImage[]) => {
        setTimeout(() => {
          this.serverError = false;
          for (const i of response) {
            for (const j of i.tags) {
              if (!this.allTags.includes(j)) {
                this.allTags.push(j);
              }
            }
          }
          if (response.length) {
            this.isEmpty = !this.isEmpty;
          }

          this.dataSource = new MatTableDataSource(response);
          this.showSpinner = !this.showSpinner;
          this.showSpinner = false;
          this.dataSource.paginator = this.paginator;
        });
      },
      (error: any) => {
        this.notificationService.warn('Problem with the server.');
        if (!this.serverError) {
          this.serverError = true;
          this.showSpinner = false;
        }
      },
    );
  }

  openDraw(row: SvgImage): void {
    this.dialogRef.close(row);
  }

  deleteDrawingFromDataBase(row: SvgImage): void {
    if (confirm('Are you sure you want to delete this draw?')) {
      this.allSvg
        .deleteDrawingFromDataBase(row._id)
        .subscribe((response: boolean) => {
          if (response) {
            this.dialogRef.close(false);
            this.notificationService.warn('Draw successfully deleted !');
          } else {
            this.notificationService.warn('Failed to delete drawing !');
          }
        });
    }
  }

  deleteDrawingFromCloud(row: SvgImage): void {
    if (confirm('Are you sure you want to delete this draw?')) {
      this.allSvg
        .deleteDrawingFromCloud(row._id)
        .subscribe((response: boolean) => {
          if (response) {
            this.notificationService.warn('Draw successfully deleted !');
            this.dialogRef.close(false);
          } else {
            this.notificationService.warn('Failed to delete drawing !');
          }
        });
    }
  }

  openLocalDraw(): void {
    const result: [SvgImage, boolean] = this.createSVGImageFromString();
    if (result[1]) {
      this.dialogRef.close(result[0]);
    } else {
      this.notificationService.warn('The drawing file cannot be opened.');
    }
  }

  createSVGImageFromString(): [SvgImage, boolean] {
    let currentIndex = 0;
    const svgImage = new SvgImage();
    svgImage.width = this.runThroughEOL(currentIndex);
    currentIndex += svgImage.width.length + 1;
    svgImage.height = this.runThroughEOL(currentIndex);
    currentIndex += svgImage.height.length + 1;
    svgImage.backgroundColor = this.runThroughEOL(currentIndex);
    currentIndex += svgImage.backgroundColor.length + 1;
    let currentId = '';
    let result: [StructSVGElement, number];
    while (currentIndex < this.localDrawLaod.length) {
      currentId = this.runThroughEOL(currentIndex);
      currentIndex += currentId.length + 1;
      if (currentId.includes('rect') || currentId.includes('ellipse')) {
        result = this.stringToShape(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (currentId.includes('path')) {
        result = this.stringToPath(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (currentId.includes('image')) {
        result = this.stringToImage(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (currentId.includes('polygon')) {
        result = this.stringToPolygon(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (currentId.includes('text')) {
        result = this.stringToText(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (
        currentId.includes('pen') ||
        currentId.includes('fountainPen')
      ) {
        result = this.stringToPen(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else if (currentId.includes('aerosol')) {
        result = this.stringToAerosol(currentIndex, currentId);
        svgImage.shapes.push(result[0]);
        currentIndex = result[1];
      } else {
        return [svgImage, false];
      }
    }
    return [svgImage, true];
  }

  runThroughEOL(index: number): string {
    let currentLetter = '';
    let currentString = '';
    while (currentLetter !== '\n') {
      currentLetter = this.localDrawLaod[index];
      if (currentLetter !== '\n') {
        currentString += currentLetter;
      }
      index++;
    }
    return currentString;
  }

  stringToAerosol(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const pathArray: StructEllipseAerosol[] = new Array();
    const numberOfChilString = this.runThroughEOL(index);
    index += numberOfChilString.length + 1;
    const numberOfChild = parseFloat(numberOfChilString);
    for (let indexChild = 0; indexChild < numberOfChild; indexChild++) {
      const rx = this.runThroughEOL(index);
      index += rx.length + 1;
      const ry = this.runThroughEOL(index);
      index += ry.length + 1;
      const cx = this.runThroughEOL(index);
      index += cx.length + 1;
      const cy = this.runThroughEOL(index);
      index += cy.length + 1;
      const stroke = this.runThroughEOL(index);
      index += stroke.length + 1;
      const strokeWidth = this.runThroughEOL(index);
      index += strokeWidth.length + 1;
      const fill = this.runThroughEOL(index);
      index += fill.length + 1;
      pathArray.push(
        new StructEllipseAerosol(
          elementID,
          rx,
          ry,
          cx,
          cy,
          stroke,
          strokeWidth,
          fill,
        ),
      );
    }
    return [new StructAerosol(elementID, transform, pathArray), index];
  }

  stringToPen(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const pathArray: StructPathPen[] = new Array();
    const numberOfChilString = this.runThroughEOL(index);
    index += numberOfChilString.length + 1;
    const numberOfChild = parseFloat(numberOfChilString);
    for (let indexChild = 0; indexChild < numberOfChild; indexChild++) {
      const stroke = this.runThroughEOL(index);
      index += stroke.length + 1;
      const strokeWidth = this.runThroughEOL(index);
      index += strokeWidth.length + 1;
      const fill = this.runThroughEOL(index);
      index += fill.length + 1;
      const d = this.runThroughEOL(index);
      index += d.length + 1;
      const strokeLinecap = this.runThroughEOL(index);
      index += strokeLinecap.length + 1;
      const strokeLinejoin = this.runThroughEOL(index);
      index += strokeLinejoin.length + 1;
      pathArray.push(
        new StructPathPen(
          elementID,
          stroke,
          strokeWidth,
          fill,
          d,
          strokeLinecap,
          strokeLinejoin,
        ),
      );
    }
    return [new StructPen(elementID, transform, pathArray), index];
  }
  stringToText(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const stroke = this.runThroughEOL(index);
    index += stroke.length + 1;
    const fill = this.runThroughEOL(index);
    index += fill.length + 1;
    const strokewidht = this.runThroughEOL(index);
    index += strokewidht.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const x = this.runThroughEOL(index);
    index += x.length + 1;
    const y = this.runThroughEOL(index);
    index += y.length + 1;
    const fontSize = this.runThroughEOL(index);
    index += fontSize.length + 1;
    const fontFamily = this.runThroughEOL(index);
    index += fontFamily.length + 1;
    const fontWeight = this.runThroughEOL(index);
    index += fontWeight.length + 1;
    const fontStyle = this.runThroughEOL(index);
    index += fontStyle.length + 1;
    const textAnchor = this.runThroughEOL(index);
    index += textAnchor.length + 1;
    const tspanArray: StructTspan[] = new Array();
    const numberOfChilString = this.runThroughEOL(index);
    index += numberOfChilString.length + 1;
    const numberOfChild = parseFloat(numberOfChilString);
    for (let indexChild = 0; indexChild < numberOfChild; indexChild++) {
      const xChild = this.runThroughEOL(index);
      index += xChild.length + 1;
      const yChild = this.runThroughEOL(index);
      index += yChild.length + 1;
      const text = this.runThroughEOL(index);
      index += text.length + 1;
      tspanArray.push(new StructTspan(elementID, xChild, yChild, text));
    }
    return [
      new StructText(
        elementID,
        stroke,
        fill,
        strokewidht,
        transform,
        x,
        y,
        fontSize,
        fontFamily,
        fontWeight,
        fontStyle,
        textAnchor,
        tspanArray,
      ),
      index,
    ];
  }
  stringToShape(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const stroke = this.runThroughEOL(index);
    index += stroke.length + 1;
    const fill = this.runThroughEOL(index);
    index += fill.length + 1;
    const strokewidht = this.runThroughEOL(index);
    index += strokewidht.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const originX = this.runThroughEOL(index);
    index += originX.length + 1;
    const originY = this.runThroughEOL(index);
    index += originY.length + 1;
    const width = this.runThroughEOL(index);
    index += width.length + 1;
    const height = this.runThroughEOL(index);
    index += height.length + 1;
    if (id.includes('rect')) {
      return [
        new StructRectangle(
          elementID,
          stroke,
          fill,
          strokewidht,
          transform,
          originX,
          originY,
          width,
          height,
        ),
        index,
      ];
    } else {
      return [
        new StructEllipse(
          elementID,
          stroke,
          fill,
          strokewidht,
          transform,
          originX,
          originY,
          width,
          height,
        ),
        index,
      ];
    }
  }

  stringToPath(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const stroke = this.runThroughEOL(index);
    index += stroke.length + 1;
    const fill = this.runThroughEOL(index);
    index += fill.length + 1;
    const strokewidht = this.runThroughEOL(index);
    index += strokewidht.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const points = this.runThroughEOL(index);
    index += points.length + 1;
    const strokeLinceCap = this.runThroughEOL(index);
    index += strokeLinceCap.length + 1;
    const filter = this.runThroughEOL(index);
    index += filter.length + 1;
    const strokeDasharray = this.runThroughEOL(index);
    index += strokeDasharray.length + 1;
    const markerMid = this.runThroughEOL(index);
    index += markerMid.length + 1;
    const fillRule = this.runThroughEOL(index);
    index += fillRule.length + 1;
    return [
      new StructPencil(
        elementID,
        stroke,
        fill,
        strokewidht,
        transform,
        points,
        strokeLinceCap,
        filter,
        strokeDasharray,
        markerMid,
        fillRule,
      ),
      index,
    ];
  }

  stringToImage(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const stroke = this.runThroughEOL(index);
    index += stroke.length + 1;
    const fill = this.runThroughEOL(index);
    index += fill.length + 1;
    const strokewidht = this.runThroughEOL(index);
    index += strokewidht.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const originX = this.runThroughEOL(index);
    index += originX.length + 1;
    const originY = this.runThroughEOL(index);
    index += originY.length + 1;
    const width = this.runThroughEOL(index);
    index += width.length + 1;
    const height = this.runThroughEOL(index);
    index += height.length + 1;
    const href = this.runThroughEOL(index);
    index += href.length + 1;
    return [
      new StructImage(
        elementID,
        originX,
        originY,
        width,
        height,
        transform,
        href,
      ),
      index,
    ];
  }

  stringToPolygon(index: number, id: string): [StructSVGElement, number] {
    const elementID = this.runThroughEOL(index);
    index += elementID.length + 1;
    const stroke = this.runThroughEOL(index);
    index += stroke.length + 1;
    const fill = this.runThroughEOL(index);
    index += fill.length + 1;
    const strokewidht = this.runThroughEOL(index);
    index += strokewidht.length + 1;
    const transform = this.runThroughEOL(index);
    index += transform.length + 1;
    const points = this.runThroughEOL(index);
    index += points.length + 1;
    return [
      new StructPolygon(
        elementID,
        stroke,
        fill,
        strokewidht,
        points,
        transform,
      ),
      index,
    ];
  }

  loadLocalDraw(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = () => {
        const result = reader.result;
        if (result !== null) {
          if (!this.localOpenButtonState) {
            this.localOpenButtonState = true;
          }
          this.localDrawLaod = result.toString();
        }
      };
    }
  }
}
