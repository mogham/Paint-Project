import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { BackgroundColorCommand } from 'src/app/commandes/background-color-command.service';
import { ColorAppCommand } from 'src/app/commandes/color-app-command.service';
import { CommandeAbstractService } from 'src/app/commandes/commande-abstract.service';
import { CopyPasteCommand } from 'src/app/commandes/copypaste-command.service';
import { CreateElementCommandService } from 'src/app/commandes/create-element-command.service';
import { CutDeleteCommand } from 'src/app/commandes/cutdelete-command.service';
import { ManipulationSelectionCommand } from 'src/app/commandes/manipulation-selection-command.service';
import { DrawingTool } from 'src/app/drawing-tools/abstract-drawing-tools';
import { DrawingToolFactory } from 'src/app/drawing-tools/drawing-tool-factory';
import { EllipseService } from 'src/app/drawing-tools/ellipse.service';
import { EraserParamsService } from 'src/app/drawing-tools/eraser-params.service';
import { FountainPenParamsService } from 'src/app/drawing-tools/fountain-pen-params.service';
import { GridService } from 'src/app/drawing-tools/grid.service';
import { PaintBucketService } from 'src/app/drawing-tools/paint-bucket.service';
import { PolygonParamsService } from 'src/app/drawing-tools/polygon-params.service';
import { PolylineParamsService } from 'src/app/drawing-tools/polyline-params.service';
import { RectParamsService } from 'src/app/drawing-tools/rect-params.service';
import { SelectionParamsService } from 'src/app/drawing-tools/selection-params.service';
import { StampService } from 'src/app/drawing-tools/stamp.service';
import { TextParamsService } from 'src/app/drawing-tools/text-params.service';
import { PaperweightManipulationService } from 'src/app/selection-manipulation/paperweight-manipulation.service';
import { ScaleManipulationService } from 'src/app/selection-manipulation/scale-manipulation.service';
import { TranslateManipulationService } from 'src/app/selection-manipulation/translate-manipulation.service';
import { GenerateElementService } from '../open-draw/generate-element.service';
import { OpenDrawComponent } from '../open-draw/open-draw.component';
import { GenerateStructSVGElementService } from '../save-draw/generate-structsvgelement.service';
import { VerifyOpenDrawComponent } from '../verify-open-draw/verify-open-draw.component';
import { VerifySaveDrawComponent } from '../verify-save-draw/verify-save-draw.component';
import { AerosolService } from './../../drawing-tools/aerosol.service';
import { ColorToolService } from './../../drawing-tools/color-tool.service';
import { ExportFileService } from './../../drawing-tools/export.service';
import { VelocityParamsService } from './../../drawing-tools/velocity-params.service';
import { NotificationService } from './../../notification-service/notification-service.service';
import { ExportDrawComponent } from './../export-draw/export-draw.component';
import { NewDrawCreationComponent } from './../new-draw-creation/new-draw-creation.component';
import { SaveDrawComponent } from './../save-draw/save-draw.component';
import { VerifyCreateNewDrawComponent } from './../verify-create-new-draw/verify-create-new-draw.component';
import { VerifyExportDrawComponent } from './../verify-export-draw/verify-export-draw.component';
import { WelcomeModalComponent } from './../welcome-modal/welcome-modal.component';
import { CURSORS, MousePosition, ShapeCounter, SHORTCUTS } from './drawing-view-constants';

const MIN_X = 5;
const MIN_Y = 10;
const MARGE_ERR = 10;
const SVG_NS = 'http://www.w3.org/2000/svg';
const IS_OUTSIDE_DEFAULT_VALUE = false;
const DEFAULT_VALUE_ZERO = 0;
const DEFAULT_PERCENTAGE_ZERO = '0%';
const DIALOG_WIDTH = '60%';
const DIALOG_HEIGHT = '93%';
const DIALOG_WIDTH_WELCOME = '70%';
const DIALOG_HEIGHT_WELCOME = '80%';
const DIALOG_HEIGHT_SAVE = '76%';
const DIALOG_WIDTH_SAVE = '50%';
const DIALOG_WIDTH_VERIFY = '33%';
const DIALOG_HEIGHT_VERIFY = '34%';
const DIALOG_WIDTH_EXPORT = '40%';
const DIALOG_HEIGHT_EXPORT =  '55%';
const WHITE_RGBA_COLOR = 'rgba(255,255,255,1)';
const ORIENTATION_FACTOR = (15 / 150);
const DOUBLE_CLICK = 2;
const DELAY = 10;
const DELAY_EMISSION = 80;
@Component({
  selector: 'app-drawing-view',
  templateUrl: './drawing-view.component.html',
  styleUrls: ['./drawing-view.component.scss'],
})
export class DrawingViewComponent implements OnInit {
  @ViewChild('MySVG', { static: true }) svg: ElementRef;
  private emptyLocalStorage: number;
  private tool: DrawingTool;
  private currentPosition: MousePosition;
  private isStartedOutside: boolean;
  protected isCopied: boolean;
  private isDrawing: boolean;
  private isOutside: boolean;
  private isSaved: boolean;
  private isExisting: boolean;
  private drawingToolUsed: string;
  private iscolorApplicatorUsed: boolean;
  private isScale: boolean;
  private isTranslate: boolean;
  private isRotate: boolean;
  private shapes: Element[];
  private tempShapes: Element[];
  private dialogConfigWelcomeModal = new MatDialogConfig();
  private maxX: number;
  private maxY: number;
  private isEraserUsed: boolean;
  private isEnableShortCuts: boolean;
  private isPipetteUsed: boolean;
  protected isGrid: string;
  private interval: any;
  private aerosolContainer: any;
  private penFContainer: any;
  private lastEventTime: number;
  private commandArray: CommandeAbstractService[];
  private commandDeletedArray: CommandeAbstractService[];
  protected isCreate: boolean;
  protected isDrawingDone: boolean;

  private isPaintBucket: boolean;
  @ViewChild('downloadLink', { static: true }) downloadLink: ElementRef;

  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  fillColor: string = WHITE_RGBA_COLOR;
  heightDraw: string = DEFAULT_PERCENTAGE_ZERO;
  widthDraw: string = DEFAULT_PERCENTAGE_ZERO;
  constructor(private renderer: Renderer2,
              private drawingTool: DrawingToolFactory,
              private dialog: MatDialog,
              protected colorService: ColorToolService,
              protected gridService: GridService,
              private drawLine: PolylineParamsService,
              private notificationService: NotificationService,
              private serviceStructSVGElement: GenerateStructSVGElementService,
              private serviceElement: GenerateElementService,
              private selection: SelectionParamsService,
              private insertText: TextParamsService,
              private velocity: VelocityParamsService,
              private paperweightService: PaperweightManipulationService,
              private useEraser: EraserParamsService,
              private exportService: ExportFileService,
              private scaleService: ScaleManipulationService,
              private translateService: TranslateManipulationService,
              private paintBucketService: PaintBucketService,
              private useFountainPen: FountainPenParamsService) {
    this.emptyLocalStorage = DEFAULT_VALUE_ZERO;
    this.drawingToolUsed = '';
    this.isOutside = IS_OUTSIDE_DEFAULT_VALUE;
    this.currentPosition = {
      x: DEFAULT_VALUE_ZERO,
      y: DEFAULT_VALUE_ZERO,
    };
    this.isDrawing = false;
    this.isEnableShortCuts = true;
    this.isEraserUsed = false;
    this.iscolorApplicatorUsed = false;
    this.isPipetteUsed = false;
    this.isSaved = false;
    this.isExisting = false;
    this.isStartedOutside = false;
    this.isTranslate = false;
    this.shapes = [];
    this.tempShapes = [];
    this.isGrid = 'false';
    this.lastEventTime = 0;
    this.commandArray = new Array();
    this.commandDeletedArray = new Array();
    this.isScale = false;
    this.isPaintBucket = false;
    this.isRotate = false;
    this.isCreate = false;
    this.isCopied = false;
    this.isDrawingDone = false;
  }
  ngOnInit() {
    if (localStorage.getItem('checkbox') === 'false'
      || (localStorage.length === this.emptyLocalStorage)) {
      this.welcomeModal();
    }
  }
  @HostListener('mouseup')
  outOfDrawingSurface() {
    if (this.currentPosition.x >= this.maxX || (this.currentPosition.x <= MIN_X)
      || this.currentPosition.y >= this.maxY || (this.currentPosition.y <= MIN_Y)) {
      if (this.isOutside && this.drawingToolUsed !== '' && !this.isStartedOutside) {
        this.isDrawing = false;
        if (this.drawingToolUsed === 'pen') {
          clearInterval(this.interval);
          this.tool.onMouseUp(this.currentPosition);
        }
        if (this.drawingToolUsed !== 'selection') {
          const drawingElement: Element = this.renderer.createElement(
            this.tool.getSvgCode(),
            SVG_NS);
          this.tool.submitElement(drawingElement, this.drawingToolUsed);
          this.shapes.push(drawingElement);
          this.svg.nativeElement.appendChild(drawingElement);
          this.tool.onMouseUp(this.currentPosition);
          this.isSaved = false;
        } else {
          this.selection.removeSelectionRectangle();
        }
      }
    }
  }
  @HostListener('window:keydown.control.z', ['$event'])
  undo() {
    this.tempShapes = this.shapes;
    const lastCommand = this.commandArray.pop();
    switch (true) {
      case lastCommand instanceof CreateElementCommandService:
        this.commandDeletedArray.push(lastCommand as CreateElementCommandService);
        const lastShape = this.shapes.pop();
        this.svg.nativeElement.removeChild(lastShape);
        this.selection.deleteSelectionShape(lastShape as Element, this.svg.nativeElement);
        break;
      case lastCommand instanceof ColorAppCommand:
        this.commandDeletedArray.push(lastCommand as ColorAppCommand);
        (lastCommand as ColorAppCommand).updateUndoShapes(this.tempShapes);
        break;
      case lastCommand instanceof BackgroundColorCommand:
        this.commandDeletedArray.push(lastCommand as BackgroundColorCommand);
        this.svg.nativeElement.style.backgroundColor = (lastCommand as BackgroundColorCommand).getOldColor();
        break;
      case lastCommand instanceof CopyPasteCommand:
        this.commandDeletedArray.push(lastCommand as CopyPasteCommand);
        (lastCommand as CopyPasteCommand).undoSVG(this.shapes, this.svg.nativeElement);
        break;
      case lastCommand instanceof CutDeleteCommand:
        this.commandDeletedArray.push(lastCommand as CutDeleteCommand);
        (lastCommand as CutDeleteCommand).undoSVG(this.shapes, this.svg, this.renderer);
        break;
      case lastCommand instanceof ManipulationSelectionCommand:
        this.commandDeletedArray.push(lastCommand as ManipulationSelectionCommand);
        (lastCommand as ManipulationSelectionCommand).undoSVG(this.shapes, this.svg, this.renderer);
        break;
    }
  }
  @HostListener('window:keydown.control.shift.z', ['$event'])
  redo() {
    this.tempShapes = this.shapes;
    const lastCommand = this.commandDeletedArray.pop();
    const selectionElement: Element = this.renderer.createElement(
      'rect',
      SVG_NS,
    );
    switch (true) {
      case lastCommand instanceof CreateElementCommandService:
        this.commandArray.push(lastCommand as CreateElementCommandService);
        this.shapes.push((lastCommand as CreateElementCommandService).getElementToAdd());
        this.svg.nativeElement.appendChild((lastCommand as CreateElementCommandService).getElementToAdd());
        this.selection.addSelectionRect(selectionElement, this.svg);
        break;
      case lastCommand instanceof ColorAppCommand:
        this.commandArray.push(lastCommand as ColorAppCommand);
        (lastCommand as ColorAppCommand).updateRedoShapes(this.tempShapes);
        break;
      case lastCommand instanceof BackgroundColorCommand:
        this.commandArray.push(lastCommand as BackgroundColorCommand);
        this.svg.nativeElement.style.backgroundColor = (lastCommand as BackgroundColorCommand).getNewColor();
        break;
      case lastCommand instanceof CopyPasteCommand:
        this.commandArray.push(lastCommand as CopyPasteCommand);
        (lastCommand as CopyPasteCommand).redoSVG(this.shapes, this.svg, this.renderer);
        break;
      case lastCommand instanceof CutDeleteCommand:
        this.commandArray.push(lastCommand as CutDeleteCommand);
        (lastCommand as CutDeleteCommand).redoSVG(this.shapes, this.svg.nativeElement);
        break;
      case lastCommand instanceof ManipulationSelectionCommand:
        this.commandArray.push(lastCommand as ManipulationSelectionCommand);
        (lastCommand as ManipulationSelectionCommand).redoSVG(this.shapes, this.svg, this.renderer);
        break;
    }
  }
  @HostListener('document:keydown.control.o', ['$event'])
  shortCutNewDraw(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.verifyCreation();
    }
  }
  @HostListener('document:keydown.control.s', ['$event'])
  shortCutSaving(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.verifySaving();
    }
  }
  @HostListener('document:keydown.control.g', ['$event'])
  shortCutOpen(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.verifyOpening();
    }
  }
  @HostListener('document:keydown.control.e', ['$event'])
  shortCutExport(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts) {
      this.verifyExporting();
    }
  }
  @HostListener('document:keydown.control.c', ['$event'])
  shortCutCopy(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.copy();
    }
  }
  @HostListener('document:keydown.control.v', ['$event'])
  shortCutPaste(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.paste();
    }
  }
  @HostListener('document:keydown.control.d', ['$event'])
  shortCutDuplicate(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.duplicate();
    }
  }
  @HostListener('document:keydown.control.a', ['$event'])
  shortCutSelectALL(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.selectAll();
    }
  }
  @HostListener('document:keydown.control.x', ['$event'])
  shortCutCut(event: KeyboardEvent) {
    event.preventDefault();
    if (this.isEnableShortCuts && this.insertText.enableShortCuts) {
      this.cut();
    }
  }

  @HostListener('document:keyup', ['$event'])
  stopSquare(event: KeyboardEvent): void {
    if (this.isScale) {
      if (event.key === 'Alt') {
        this.scaleService.setAlt(false);
      }
      if (event.key === 'Shift') {
        this.scaleService.setShift(false);
      }
    }
  }

  @HostListener('document:keyup.shift', ['$event'])
  rotateSeperatelyDisable(): void {
    if (this.tool instanceof SelectionParamsService && !this.isScale && !this.isTranslate) {
      this.selection.drawGroupSelectionBox();
      this.tool.resetRotationFeatures();
      this.tool.updateParams();
      this.selection.drawGroupSelectionBox();
      this.tool.disableShift();
    }
  }

  @HostListener('document:keydown', ['$event'])
  shortCutsList(event: KeyboardEvent) {
    this.scaleSelectionEnable(event.key);
    this.rotateSeperatelyEnable(event.key);
    if (this.isEnableShortCuts && this.insertText.enableShortCuts && !event.ctrlKey) {
      switch (event.key.toLowerCase()) {
        case SHORTCUTS.rectangle:
          this.select('rectangle');
          this.tool.setDefault();
          break;
        case SHORTCUTS.ellipse:
          this.select('ellipse');
          this.tool.setDefault();
          break;
        case SHORTCUTS.polygon:
          this.select('polygon');
          this.tool.setDefault();
          break;
        case SHORTCUTS.pencil:
          this.select('pencil');
          this.tool.setDefault();
          break;
        case SHORTCUTS.paintBrush:
          this.select('paintBrush');
          this.tool.setDefault();
          break;
        case SHORTCUTS.colorApplicator:
          this.select('colorApplicator');
          break;
        case SHORTCUTS.rotateBack:
          event.preventDefault();
          if (this.tool instanceof FountainPenParamsService) {
            this.tool.isAltPressed = true;
          } else if (this.tool instanceof SelectionParamsService) {
            this.tool.isAlt = true;
          } else if (this.tool instanceof StampService) {
            this.tool.isAltPressed = true;
          }
          break;
        case SHORTCUTS.polyline:
          this.select('line');
          this.tool.setDefault();
          break;
        case SHORTCUTS.grid:
          this.isGrid === 'false' ? this.isGrid = 'true' : this.isGrid = 'false';
          this.gridService.updateIsActivateWithShortcuts();
          break;
        case SHORTCUTS.pen:
          this.select('pen');
          this.tool.setDefault();
          break;
        case SHORTCUTS.text:
          this.select('text');
          this.tool.setDefault();
          break;
        case SHORTCUTS.delete:
          this.deleteSelection();
          break;
        case SHORTCUTS.aerosol:
          this.select('aerosol');
          this.tool.setDefault();
          break;
        case SHORTCUTS.fountainPen:
          this.select('fountainPen');
          this.tool.setDefault();
          break;
        case SHORTCUTS.paintBucket:
          this.select('paintBucket');
          this.tool.setDefault();
          break;
      }
    }
  }

  scaleSelectionEnable(key: string): void {
    if (this.isScale) {
      if (key === 'Alt') {
        this.scaleService.setAlt(true);
      }
      if (key === 'Shift') {
        this.scaleService.setShift(true);
      }
    }
  }

  rotateSeperatelyEnable(key: string): void {
    if (this.tool instanceof SelectionParamsService && key === 'Shift') {
      this.tool.enableShift();
      this.tool.updateParams();
      this.selection.drawGroupSelectionBox();
    }
  }

  @HostListener('document:keyup', ['$event'])
  FountainPenRotation(event: KeyboardEvent) {
    if (event.key === 'Alt') {
      if (this.tool instanceof FountainPenParamsService) {
        this.tool.isAltPressed = false;
      } else if (this.tool instanceof SelectionParamsService) {
        this.tool.isAlt = false;
      }
    }
  }

  @HostListener('mousewheel', ['$event'])
  rotate(event: WheelEvent) {
    const orientationAngle = event.deltaY * ORIENTATION_FACTOR;
    if (this.tool instanceof StampService) {
      this.tool.setAngleWithMouse(event);
    } else if (this.tool instanceof SelectionParamsService && !this.isScale && !this.isTranslate) {
      this.isRotate = true;
      this.tool.rotate(orientationAngle);
    }
    if (this.tool instanceof FountainPenParamsService) {
      this.tool.setAngleWithMouse(event);
    }
  }

  copy(): void {
    this.selection.copySelection(this.shapes);
    this.isCopied = true;
  }

  paste(): void {
    const shapesToPaste = this.paperweightService.paste(this.renderer, parseFloat(this.widthDraw), parseFloat(this.heightDraw));
    const command = new CopyPasteCommand(shapesToPaste, this.selection);
    this.commandArray.push(command);
    this.commandDeletedArray = [];
    this.addShapes(shapesToPaste);
  }

  duplicate(): void {
    if (this.selection.duplicateSelection(this.shapes)) {
      const shapesToPaste = this.paperweightService.paste(this.renderer, parseFloat(this.widthDraw), parseFloat(this.heightDraw));
      const command = new CopyPasteCommand(shapesToPaste, this.selection);
      this.commandArray.push(command);
      this.commandDeletedArray = [];
      this.addShapes(shapesToPaste);
    }
  }

  cut(): void {
    const shapesToCut = this.selection.copySelection(this.shapes);
    if (shapesToCut !== undefined) {
      const command = new CutDeleteCommand(shapesToCut, this.selection);
      this.commandArray.push(command);
      this.commandDeletedArray = [];
      this.removeElement(shapesToCut);
      this.isCopied = true;
    }
  }

  selectAll(): void {
    this.selection.selectShapes(this.shapes);
    this.select('selection');
  }

  setShapes(newShapes: Element[]): void {
    this.shapes = [];
    for (const currentElement of newShapes) {
      this.shapes.push(currentElement);
    }
  }
  setDrawValues(height: string, width: string, color: string) {
    this.heightDraw = height;
    this.widthDraw = width;
    this.fillColor = color;
    this.isSaved = false;
  }
  deleteSelection(): void {
    const shapesSelected = this.selection.takeSelection(this.shapes);
    if (shapesSelected.length > 0) {
      const command = new CutDeleteCommand(shapesSelected, this.selection);
      this.commandArray.push(command);
      this.commandDeletedArray = [];
      this.removeElement(shapesSelected);
    }
  }
  removeElement(shapesToRemove: Element[]) {
    for (const currentElement of shapesToRemove) {
      this.svg.nativeElement.removeChild(currentElement);
      this.shapes.splice(this.shapes.indexOf(currentElement), 1);
      this.selection.deleteSelectionShape(currentElement, this.svg.nativeElement);
    }
    this.selection.unselect();
  }

  addShapes(newShapes: Element[]): void {
    for (const currentElement of newShapes) {
      this.shapes.push(currentElement);
      const selectionElement: Element = this.renderer.createElement(
        'rect',
        SVG_NS,
      );
      this.svg.nativeElement.appendChild(currentElement);
      this.selection.addSelectionRect(selectionElement, this.svg);
    }
    this.selection.selectShapes(newShapes);
    this.select('selection');
  }

  activateGrid(event: string): void {
    this.isGrid = event;
  }

  configureMatDialogConfig(location: string): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    switch (location) {
      case 'verify':
        dialogConfig.width = DIALOG_WIDTH_VERIFY;
        dialogConfig.height = DIALOG_HEIGHT_VERIFY;
        break;
      case 'save':
        dialogConfig.width = DIALOG_WIDTH_SAVE;
        dialogConfig.height = DIALOG_HEIGHT_SAVE;
        break;
      case 'export':
        dialogConfig.width = DIALOG_WIDTH_EXPORT;
        dialogConfig.height = DIALOG_HEIGHT_EXPORT;
        break;
      default :
        dialogConfig.width = DIALOG_WIDTH;
        dialogConfig.height = DIALOG_HEIGHT;
        break;
    }
    return dialogConfig;
  }

  verifyCreation() {
    this.isEnableShortCuts = false;
    if (this.shapes.length === 0) {
      this.onCreate();
      return;
    }
    const verify = 'verify';
    const dialogConfig = this.configureMatDialogConfig(verify);
    const dialogRef = this.dialog.open(VerifyCreateNewDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result) {
          this.onCreate();
          this.isExisting = true;
          this.isEnableShortCuts = true;
        } else {
          this.isExisting = true;
          this.isEnableShortCuts = true;
        }
      }
    });
  }

  save(): void {
    this.serviceStructSVGElement.setShapes(this.shapes);
    const save = 'save';
    const dialogConfig = this.configureMatDialogConfig(save);
    this.serviceStructSVGElement.makeEmpty();
    dialogConfig.data = {
      elements: this.serviceStructSVGElement.getArrayStructSVGElement(),
      width: this.widthDraw,
      height: this.heightDraw,
      svg: this.svg,
      backgroundColor: this.svg.nativeElement.style.backgroundColor,
    };
    const dialogRef = this.dialog.open(SaveDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (!result) {
          this.notificationService.warn('Impossible to save due to problems with the server, sorry!');
          this.isEnableShortCuts = true;
          this.svg.nativeElement.style.cursor = '';
        } else {
          this.isSaved = true;
          this.isExisting = true;
          this.isEnableShortCuts = true;
          this.svg.nativeElement.style.cursor = '';
          this.notificationService.success('Saved successfully !');
        }
      } else {
        this.isEnableShortCuts = true;
      }
    });
  }

  verifyExporting() {
    this.isEnableShortCuts = false;
    if (this.shapes.length !== 0) {
      this.exportDraw();
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = DIALOG_WIDTH_VERIFY;
    dialogConfig.height = DIALOG_HEIGHT_VERIFY;
    const dialogRef = this.dialog.open(VerifyExportDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result) {
          this.onCreate();
        }
      } else {
        this.isEnableShortCuts = true;
      }
    });
  }

  exportDraw() {
    this.serviceStructSVGElement.setShapes(this.shapes);
    const exportDialog = 'export';
    const dialogConfig = this.configureMatDialogConfig(exportDialog);
    this.serviceStructSVGElement.makeEmpty();
    dialogConfig.data = {
      width: this.widthDraw,
      height: this.heightDraw,
      svg: this.svg,
      backgroundColor: this.svg.nativeElement.style.backgroundColor,
    };
    this.serviceStructSVGElement.makeEmpty();
    const dialogRef = this.dialog.open(ExportDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (!result) {
          this.notificationService.warn('Impossible to export, sorry!');
        } else {
          this.isSaved = true;
          this.isExisting = true;
          this.exportService.setCurrentRenderAndSVG(this.renderer, this.svg.nativeElement.cloneNode(true), this.widthDraw, this.heightDraw);
          this.exportService.loadImage(result.extension, result.name);
          this.svg.nativeElement.style.cursor = '';
          this.drawingToolUsed = '';
          this.notificationService.success('Exported successfully !');
        }
      }
      this.isEnableShortCuts = true;
    });
  }

  verifySaving() {
    this.drawingToolUsed = '';
    this.isEnableShortCuts = false;
    if ((this.shapes.length !== 0 && !this.isSaved && !this.isExisting) || (this.isExisting && !this.isSaved)) {
      this.save();
      return;
    } else if (this.shapes.length === 0 && !this.isExisting) {
      const verify = 'verify';
      const dialogSaveConfig = this.configureMatDialogConfig(verify);
      const dialogRef = this.dialog.open(VerifySaveDrawComponent, dialogSaveConfig);
      dialogRef.afterClosed().subscribe((result) => {
        if (result != null) {
          if (result) {
            this.onCreate();
          }
        }
        this.isEnableShortCuts = true;
      });
    } else if (this.isSaved && this.isExisting) {
      this.notificationService.success('Already saved !');
    }
  }

  clearTheWorkspace(result: any) {
    let child = this.svg.nativeElement.lastElementChild;
    while (this.svg.nativeElement.children.length > 1) {
      this.svg.nativeElement.removeChild(child);
      child = this.svg.nativeElement.lastElementChild;
    }
    this.resetToolRect();
    this.resetToolEllipse();
    this.isGrid = 'false';
    this.shapes = [];
    this.drawingToolUsed = '';
    const color = `rgba(${result.redColor}, ${result.greenColor}, ${result.blueColor}, ${result.opacity})`;
    this.setDrawValues(result.height.toString() + 'px', result.width.toString() + 'px', color);
    this.svg.nativeElement.style.backgroundColor = color;
    this.maxX = result.width - MARGE_ERR;
    this.maxY = result.height - MARGE_ERR;
  }

  openDraw(): void {
    this.commandArray = [];
    this.commandDeletedArray = [];
    this.isDrawingDone = false;
    this.isCopied = false;
    const open = 'open';
    const dialogConfig = this.configureMatDialogConfig(open);
    const dialogRef = this.dialog.open(OpenDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null) {
        if (result) {
          let child = this.svg.nativeElement.lastElementChild;
          this.svg.nativeElement.style.cursor = '';
          while (this.svg.nativeElement.children.length > 1) {
            this.svg.nativeElement.removeChild(child);
            child = this.svg.nativeElement.lastElementChild;
          }
          this.selection.resetAll();
          this.resetToolRect();
          this.resetToolEllipse();
          this.isSaved = true;
          this.isExisting = true;
          this.isEnableShortCuts = true;
          this.isCreate = true;
          this.isGrid = 'false';
          this.drawingToolUsed = '';
          this.serviceStructSVGElement.makeEmpty();
          this.shapes = [];
          for (const currentElement of result.shapes) {
            const idElement = currentElement.id;
            let element: Element;
            if (idElement === 'pen' || idElement === 'aerosol') {
              element = this.renderer.createElement('g', SVG_NS);
            } else {
              element = this.renderer.createElement(idElement, SVG_NS);
            }
            this.serviceElement.addShapes(currentElement, element, idElement);
            if (idElement === 'pen') {
              if (currentElement.elementID > ShapeCounter.gCounter) {
                ShapeCounter.gCounter = currentElement.elementID + 1;
              }
              for (const currentStructPenPath of currentElement.pathArray) {
                const childText: Element = this.renderer.createElement(
                  'path',
                  SVG_NS,
                );
                childText.setAttributeNS(null, 'elementID', currentElement.elementID);
                childText.setAttributeNS(null, 'stroke', currentStructPenPath.stroke);
                childText.setAttributeNS(null, 'stroke-width', currentStructPenPath.strokeWidth);
                childText.setAttributeNS(null, 'fill', currentStructPenPath.fill);
                childText.setAttributeNS(null, 'd', currentStructPenPath.d);
                childText.setAttributeNS(null, 'stroke-linecap', currentStructPenPath.strokeLinecap);
                childText.setAttributeNS(null, 'stroke-linejoin', currentStructPenPath.strokeLinejoin);
                this.renderer.appendChild(element, childText);
              }
            } else if (idElement === 'aerosol') {
              if (currentElement.elementID > ShapeCounter.gCounter) {
                ShapeCounter.gCounter = currentElement.elementID + 1;
              }
              for (const currentStructEllipseAerosol of currentElement.ellipseArray) {
                const childAerosol: Element = this.renderer.createElement(
                  'ellipse',
                  SVG_NS,
                );
                childAerosol.setAttributeNS(null, 'elementID', currentElement.elementID);
                childAerosol.setAttributeNS(null, 'id', currentStructEllipseAerosol.id);
                childAerosol.setAttributeNS(null, 'rx', currentStructEllipseAerosol.rx);
                childAerosol.setAttributeNS(null, 'ry', currentStructEllipseAerosol.ry);
                childAerosol.setAttributeNS(null, 'cx', currentStructEllipseAerosol.cx);
                childAerosol.setAttributeNS(null, 'cy', currentStructEllipseAerosol.cy);
                childAerosol.setAttributeNS(null, 'stroke', currentStructEllipseAerosol.stroke);
                childAerosol.setAttributeNS(null, 'stroke-width', currentStructEllipseAerosol.strokeWidth);
                childAerosol.setAttributeNS(null, 'fill', currentStructEllipseAerosol.fill);
                this.renderer.appendChild(element, childAerosol);
              }
            } else if (idElement === 'text') {
              if (currentElement.elementID > ShapeCounter.drawElementCounter) {
                ShapeCounter.drawElementCounter = currentElement.elementID + 1;
              }
              for (const currentStructTspan of currentElement.tspanArray) {
                const childText: Element = this.renderer.createElement(
                  'tspan',
                  SVG_NS,
                );
                childText.setAttributeNS(null, 'elementID', currentElement.elementID);
                childText.setAttributeNS(null, 'x', currentStructTspan.x);
                childText.setAttributeNS(null, 'y', currentStructTspan.y);
                childText.textContent = currentStructTspan.text;
                this.renderer.appendChild(element, childText);
              }
            } else {
              if (currentElement.elementID > ShapeCounter.drawElementCounter) {
                ShapeCounter.drawElementCounter = currentElement.elementID + 1;
              }
            }
            this.shapes.push(element);
            this.svg.nativeElement.appendChild(element);
            const selectionElement: Element = this.renderer.createElement(
              'rect',
              SVG_NS,
            );
            this.selection.addSelectionRect(selectionElement, this.svg);
          }
          this.setDrawValues(result.height, result.width, result.backgroundColor);
          this.svg.nativeElement.style.backgroundColor = result.backgroundColor;
          this.maxX = result.width - MARGE_ERR;
          this.maxY = result.height - MARGE_ERR;
          this.notificationService.success('Opened succesfully !');
        } else {
          this.openDraw();
        }
      } else {
        this.isEnableShortCuts = true;
      }
    },
      (error) => {
        this.notificationService.warn('Impossible to save due to problems with the server, sorry!');
        this.isEnableShortCuts = false;
        this.openDraw();
      });
  }

  onCreate() {
    this.commandDeletedArray = [];
    this.commandArray = [];
    this.isDrawingDone = false;
    this.isCopied = false;
    const create = 'create';
    const dialogConfig = this.configureMatDialogConfig(create);
    this.serviceStructSVGElement.makeEmpty();
    const dialogRef = this.dialog.open(NewDrawCreationComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result !== null) {
        this.svg.nativeElement.style.cursor = '';
        this.clearTheWorkspace(result);
        this.shapes = [];
        this.isEnableShortCuts = true;
        this.isCreate = true;
      } else {
        this.isEnableShortCuts = true;
      }
    });
  }

  verifyOpening() {
    this.isEnableShortCuts = false;
    if (this.shapes.length === 0 || this.isSaved) {
      this.openDraw();
      return;
    }
    const verify = 'verify';
    const dialogConfig = this.configureMatDialogConfig(verify);
    const dialogRef = this.dialog.open(VerifyOpenDrawComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result != null) {
        if (result) {
          this.openDraw();
        }
      } else {
        this.isEnableShortCuts = true;
      }
    });
  }

  resetToolRect(): void {
    if (this.tool instanceof RectParamsService) {
      (this.tool as RectParamsService).setheight(DEFAULT_VALUE_ZERO);
    }
  }

  resetToolEllipse(): void {
    if (this.tool instanceof EllipseService) {
      (this.tool as EllipseService).setheight(DEFAULT_VALUE_ZERO);
    }
  }

  welcomeModal() {
    this.isEnableShortCuts = false;
    this.dialogConfigWelcomeModal.autoFocus = true;
    this.dialogConfigWelcomeModal.width = DIALOG_WIDTH_WELCOME;
    this.dialogConfigWelcomeModal.height = DIALOG_HEIGHT_WELCOME;
    this.dialogConfigWelcomeModal.disableClose = true;
    this.openModal();
  }

  openModal() {
    this.dialog.open(
      WelcomeModalComponent,
      this.dialogConfigWelcomeModal).afterClosed().subscribe(() => {
        this.dialog.closeAll();
        this.isEnableShortCuts = true;
      });
  }

  changeBackgroundColor(event: Event) {
    this.commandDeletedArray = [];
    const command = new BackgroundColorCommand(this.svg.nativeElement.style.backgroundColor);
    command.newToOldColor();
    this.svg.nativeElement.style.backgroundColor = event;
    this.fillColor = this.svg.nativeElement.style.backgroundColor;
    this.isSaved = false;
    command.setNewColor(this.fillColor);
    this.commandArray.push(command);
    this.commandDeletedArray = [];
  }

  changeCursorStyle(toolName: string) {
    switch (toolName) {
      case ('pencil'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.pencil}), auto`;
        break;
      case ('paintBrush'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.paintBrush}), auto`;
        break;
      case ('fountainPen'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.foutainPen}), auto`;
        break;
      case ('pen'):
      this.svg.nativeElement.style.cursor = `url(${CURSORS.pen}), auto`;
      break;
      case ('aerosol'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.aerosol}), auto`;
        break;
      case ('text'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.text}), auto`;
        break;
      case ('pipette'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.pipette}), auto`;
        break;
      case ('stamp'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.stamp}), auto`;
        break;
      case('paintBucket'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.paintBucket}), auto`;
        break;
      case('colorApplicator'):
        this.svg.nativeElement.style.cursor = `url(${CURSORS.colorApplicator}), auto`;
        break;
      default:
          this.svg.nativeElement.style.cursor = ``;
          break;
    }
  }

  select(toolName: string) {
    this.changeCursorStyle(toolName);
    this.selection.setAllSelectionEvents('none');
    if (this.drawingToolUsed === 'text' && toolName !== 'text') {
      this.insertText.enableShortCuts = true;
      this.appendElement();
      this.drawingToolUsed = toolName;
      this.select(toolName);
    }
    switch (toolName) {
      case ('colorApplicator'):
        this.isEraserUsed = false;
        this.isScale = false;
        this.isTranslate = false;
        this.activateColorApplicator();
        this.drawingToolUsed = '';
        break;
      case ('pipette'):
        this.isEraserUsed = false;
        this.iscolorApplicatorUsed = false;
        this.isScale = false;
        this.isTranslate = false;
        this.isPaintBucket = false;
        this.activatePipette();
        this.drawingToolUsed = '';
        break;
      case ('eraser'):
        this.isEraserUsed = true;
        this.iscolorApplicatorUsed = false;
        this.isScale = false;
        this.isTranslate = false;
        this.isPaintBucket = false;
        this.selection.setAllSelectionEvents('visible');
        this.tool = this.drawingTool.createTool(toolName);
        this.drawingToolUsed = toolName;
        break;
      case ('selection'):
        this.isScale = false;
        this.iscolorApplicatorUsed = false;
        this.isTranslate = false;
        this.isEraserUsed = false;
        this.isPaintBucket = false;
        this.selection.setAllSelectionEvents('visible');
        this.tool = this.drawingTool.createTool(toolName);
        this.drawingToolUsed = toolName;
        break;
      case('magnet'):
        this.drawingToolUsed = 'magnet';
        break;
      case ('paintBucket') :
        this.isScale = false;
        this.isTranslate = false;
        this.isEraserUsed = false;
        this.iscolorApplicatorUsed = false;
        this.isPaintBucket = false;
        this.isPaintBucket = true;
        this.drawingToolUsed = 'paintBucket';
        this.tool.setDefault();
        break;
      default:
        this.isScale = false;
        this.isTranslate = false;
        this.isEraserUsed = false;
        this.iscolorApplicatorUsed = false;
        this.isPaintBucket = false;
        this.isPipetteUsed = false;
        this.resetToolRect();
        this.resetToolEllipse();
        this.tool = this.drawingTool.createTool(toolName);
        this.tool.setDefault();
        this.drawingToolUsed = toolName;
    }
  }

  setCurrentPosition(x: number, y: number): void {
    this.currentPosition.x = x;
    this.currentPosition.y = y;
  }

  getDrawing(): boolean {
    return this.isDrawing;
  }

  setDrawing(isDrawing: boolean): void {
    this.isDrawing = isDrawing;
  }

  getMousePosition(event: MouseEvent): void {
    const pt = this.svg.nativeElement.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    this.currentPosition = pt.matrixTransform(
      this.svg.nativeElement.getScreenCTM().inverse(),
    );
  }

  onMouseLeave(): void {
    this.isOutside = true;
  }

  onMouseEnter(): void {
    this.isOutside = false;
  }

  private handleRotation(): void {
    if (this.isRotate) {
      const shapes = this.selection.takeSelection(this.shapes);
      this.commandArray.push(new ManipulationSelectionCommand(
        this.selection.getRotation().getNewRotation(),
        shapes,
        this.selection),
      );
      this.isRotate = false;
    }
  }

  private isLeftClick(event: MouseEvent): boolean {
    return event.button === 0;
  }

  private isRightClick(event: MouseEvent): boolean {
    return event.button === 2;
  }

  onMouseDown(event: MouseEvent): void {
    this.getMousePosition(event);
    this.isStartedOutside = this.isOutside;
    this.handleRotation();
    if ((this.drawingToolUsed !== '') && this.tool.isToolReady()) {
      if (!this.isStartedOutside
        && this.drawingToolUsed !== 'pen'
        && this.drawingToolUsed !== 'aerosol') {
        this.isDrawing = true;
        if (this.drawingToolUsed === 'selection') {
          if (this.isLeftClick(event)) {
            this.executeSelectionFunctionnality(event);
          } else if (this.isRightClick(event)) {
            this.selection.setRightClick(true);
            this.selection.rightSelect(event);
          }
        }
        this.tool.onMouseDown(this.currentPosition);
      } else if (this.usingPen()) {
        this.drawWithPen();
      } else if (this.usingAerosol()) {
        this.drawWithAerosol();
      }
      this.drawWithFountainPen();
    }
  }

  private executeSelectionFunctionnality(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const targetID = target.getAttribute('id');
    const dimensionSelectionBox = this.selection.getBoxCaracteristics();
    const shapes = this.selection.takeSelection(this.shapes);
    this.selection.resetRotationFeatures();
    if (targetID !== null && this.selection.isCircleOfSelection(targetID)) {
      this.executeScale(targetID, dimensionSelectionBox, shapes);
    } else if (this.selection.isInSelectionBox(this.currentPosition)) {
      this.executeTranslate(dimensionSelectionBox, shapes);
    } else {
      this.selection.setRightClick(false);
      this.selection.selectionClick(event);
    }
  }

  private drawWithFountainPen(): void {
    if (this.drawingToolUsed === 'fountainPen') {
      if (this.useFountainPen.isDrawing) {
        this.penFContainer = this.renderer.createElement('g', SVG_NS);
        this.penFContainer.setAttribute('id', 'fountainPen');
        ShapeCounter.gpCounter++;
        this.penFContainer.setAttribute('elementID', (ShapeCounter.gpCounter));
        this.renderer.appendChild(this.svg.nativeElement, this.penFContainer);
        this.addShapeInContainer(this.penFContainer, this.tool.getSvgCode(), ShapeCounter.gpCounter);
      }
    }
  }
  private executeTranslate(dimensionSelectionBox: number[], shapes: Element[]): void {
    this.translateService.startTranslation(
      this.currentPosition,
      dimensionSelectionBox[0],
      dimensionSelectionBox[1],
      dimensionSelectionBox[2],
      dimensionSelectionBox[3],
      shapes,
    );
    this.isTranslate = true;
  }

  private usingAerosol(): boolean {
    return this.drawingToolUsed === 'aerosol' && !this.isStartedOutside;
  }

  private executeScale(targetID: string, dimensionSelectionBox: number[], shapes: Element[]): void {
    this.scaleService.startScale(this.currentPosition, dimensionSelectionBox[0], dimensionSelectionBox[1],
      dimensionSelectionBox[2], dimensionSelectionBox[3], targetID, shapes);
    this.isScale = true;
  }

  private usingPen(): boolean {
    return this.drawingToolUsed === 'pen' && !this.isStartedOutside;
  }

  private drawWithPen(): void {
    this.isDrawing = true;
    const penContainer = this.renderer.createElement('g', SVG_NS);
    penContainer.setAttribute('id', this.drawingToolUsed);
    ShapeCounter.gCounter++;
    penContainer.setAttribute('elementID', (ShapeCounter.gCounter));
    this.renderer.appendChild(this.svg.nativeElement, penContainer);
    this.interval = setInterval(() => {
      this.tool.onMouseDown(this.currentPosition);
      this.addShapeInContainer(penContainer, this.tool.getSvgCode(), ShapeCounter.gCounter);
    }, DELAY);
    this.shapes.push(penContainer);
    this.commandArray.push(new CreateElementCommandService(penContainer));
    this.commandDeletedArray = [];
  }

  private drawWithAerosol(): void {
    this.isDrawing = true;
    const aerosolTool = this.tool as AerosolService;
    this.aerosolContainer = this.renderer.createElement('g', SVG_NS);
    this.aerosolContainer.setAttribute('id', this.drawingToolUsed);
    ShapeCounter.gCounter++;
    this.aerosolContainer.setAttribute('elementID', (ShapeCounter.gCounter));
    this.renderer.appendChild(this.svg.nativeElement, this.aerosolContainer);
    this.setAerosolInterval(aerosolTool);
    this.shapes.push(this.aerosolContainer);
    this.commandArray.push(new CreateElementCommandService(this.aerosolContainer));
    this.commandDeletedArray = [];
  }

  onMouseMove(event: MouseEvent): void {
    this.getMousePosition(event);
    if (this.isScale) {
      this.isTranslate = false;
      this.scaleService.scale(this.currentPosition);
      this.selection.updateBBox();
      this.selection.drawGroupSelectionBox();
      this.isSaved = false;
    } else if (this.isTranslate) {
      this.isScale = false;
      this.translateService.translate(this.currentPosition);
      this.selection.updateBBox();
      this.selection.drawGroupSelectionBox();
      this.isSaved = false;
    } else {
      this.isScale = false;
      this.isTranslate = false;
      if (this.isDrawing && this.drawingToolUsed !== 'line' && this.drawingToolUsed !== 'eraser' && this.drawingToolUsed !== 'pen') {
        this.tool.onMouseMove(this.currentPosition);
      }
      if (this.drawingToolUsed === 'line' || this.drawingToolUsed === 'eraser') {
        if (this.isEraserUsed) {
          this.findEraserIntersections();
        } else {
          this.tool.onMouseMove(this.currentPosition);
        }
      }
      if (this.drawingToolUsed === 'selection' && this.isDrawing) {
        this.findSelectionIntersections();
      }
      if (this.drawingToolUsed === 'pen') {
        this.fixPenSpeed(event);
      }
      if (this.drawingToolUsed === 'fountainPen') {
        if (this.useFountainPen.isMouseDown) {
          this.addShapeInContainer(this.penFContainer, this.tool.getSvgCode(), ShapeCounter.gpCounter);
          this.addShapeInContainer(this.penFContainer, 'path', ShapeCounter.gpCounter);
        }
      }
    }
  }

  readyToDraw(): boolean {
    return ((this.drawingToolUsed !== '' && this.drawingToolUsed !== 'line' && this.drawingToolUsed !== 'eraser'
      && this.drawingToolUsed !== 'selection' && this.drawingToolUsed !== 'text' && this.drawingToolUsed !== 'paintBucket'
      && this.drawingToolUsed !== 'fountainPen') ||
      (this.drawingToolUsed === 'line' && this.drawLine.click === DOUBLE_CLICK) ||
      this.insertText.isDone)
      && this.tool.isToolReady();
  }

  onMouseUp(event: MouseEvent): void {
    if (this.tool && this.tool.isToolReady()) {
      if (this.drawingToolUsed !== 'selection') {
        this.commandDeletedArray = [];
      }
      const selectedShapes = this.selection.takeSelection(this.shapes);
      let transformation = '';
      if (this.isScale) {
        transformation = this.scaleService.getNewScale();
        this.commandArray.push(new ManipulationSelectionCommand(transformation, selectedShapes, this.selection));
      } else if (this.isTranslate) {
        transformation = this.translateService.getNewTranslate();
        this.commandArray.push(new ManipulationSelectionCommand(transformation, selectedShapes, this.selection));
      }
      this.isScale = false;
      this.isTranslate = false;
      this.getMousePosition(event);
      if (this.drawingToolUsed === 'fountainPen') {
        if (this.useFountainPen.isMouseDown) {
          this.addShapeInContainer(this.penFContainer, this.tool.getSvgCode(), ShapeCounter.gpCounter);
          this.addShapeInContainer(this.penFContainer, 'path', ShapeCounter.gpCounter);
          this.shapes.push(this.penFContainer);
          this.commandArray.push(new CreateElementCommandService(this.penFContainer));
          this.commandDeletedArray = [];
        }
      }
      if (this.readyToDraw()) {
        if (!this.isEraserUsed) {
          if ((this.drawingToolUsed === 'pen' || this.drawingToolUsed === 'aerosol') && this.isDrawing) {
            clearInterval(this.interval);
            this.tool.onMouseUp(this.currentPosition);
            this.isSaved = false;
          } else {
            const drawingElement: Element = this.renderer.createElement(
              this.tool.getSvgCode(),
              SVG_NS,
            );
            const isCorrectElement: boolean = this.tool.submitElement(drawingElement, this.drawingToolUsed);
            if (isCorrectElement && this.drawingToolUsed !== 'selection'
              && this.drawingToolUsed !== 'pen' && this.drawingToolUsed !== 'aerosol') {
              this.shapes.push(drawingElement);
              this.svg.nativeElement.appendChild(drawingElement);
              this.createChildText(drawingElement);
              this.commandArray.push(new CreateElementCommandService(drawingElement));
              this.tool.onMouseUp(this.currentPosition);
              this.isSaved = false;
            }
            if (this.drawingToolUsed === 'polygon') {
              (this.tool as PolygonParamsService).updatePolygonPoints(drawingElement as SVGPolygonElement);
            }
          }
        }
      }
      if (!this.isEraserUsed) {
        const selectionElement: Element = this.renderer.createElement(
          'rect',
          SVG_NS,
        );
        this.selection.addSelectionRect(selectionElement, this.svg);
      }
      if (this.drawingToolUsed === 'selection') {
        this.selection.removeSelectionRectangle();
        this.tool.onMouseUp(this.currentPosition);
      }
      if (this.isEraserUsed) {
        if (this.useEraser.elementToErase.length > 0 && !this.isOutside) {
          const eraseElementCommand = new CutDeleteCommand(this.useEraser.getElementToErase(), this.selection);
          this.removeElement(this.useEraser.elementToErase);
          this.commandArray.push(eraseElementCommand);
        }
        this.useEraser.onMouseUp();
      }
      if (this.drawingToolUsed === 'fountainPen') {
        this.shapes.push(this.penFContainer);
        this.commandArray.push(new CreateElementCommandService(this.penFContainer));
        this.commandDeletedArray = [];
        this.tool.onMouseUp(this.currentPosition);
      }
      this.isDrawing = false;
      this.isDrawingDone = true;
      this.drawLine.isLastSegment = false;
      this.insertText.isDone = false;
    }
  }

  activateColorApplicator(): void {
    this.iscolorApplicatorUsed = !this.iscolorApplicatorUsed;
  }

  activatePipette(): void {
    this.isPipetteUsed = !this.isPipetteUsed;
  }

  isShape(target: HTMLElement): boolean {
    return target.tagName === 'rect'
      || target.tagName === 'ellipse'
      || target.tagName === 'polygon';
  }

  eventAndTargetAreValid(event: Event): boolean {
    return event != null && event.target != null;
  }

  onRightClick(event: Event): void {
    event.preventDefault();
    if (!this.eventAndTargetAreValid(event)) {
      return;
    }
    if (this.iscolorApplicatorUsed || this.isPipetteUsed) {
      const target = event.target as HTMLElement;
      event.preventDefault();
      if (this.isShape(target)) {
        if (this.iscolorApplicatorUsed) {
          this.isSaved = false;
          const command = new ColorAppCommand('stroke');
          command.fillIndex(target as Element, this.shapes);
          command.setNewColor(this.colorService.getSecondColor());
          this.commandArray.push(command);
          this.commandDeletedArray = [];
          target.setAttribute('stroke', this.colorService.getSecondColor());
        } else {
          const colorStroke = target.getAttribute('stroke');
          if (colorStroke !== null) {
            this.colorService.updateSecondColorWithPipette(colorStroke);
            this.isSaved = false;
          }
        }
      }
    }
  }

  async onLeftClick(event: Event): Promise<void> {
    if (this.iscolorApplicatorUsed) {
      if (this.eventAndTargetAreValid(event)) {
        const target = event.target as HTMLElement;
        if (this.isShape(target)) {
          const command = new ColorAppCommand('fill');
          command.fillIndex(target as Element, this.shapes);
          command.setNewColor(this.colorService.getPrimaryColor());
          this.commandArray.push(command);
          this.commandDeletedArray = [];
          target.setAttribute('fill', this.colorService.getPrimaryColor());
        } else {
          const command = new ColorAppCommand('stroke');
          command.fillIndex(target as Element, this.shapes);
          command.setNewColor(this.colorService.getPrimaryColor());
          this.commandArray.push(command);
          this.commandDeletedArray = [];
          target.setAttribute('stroke', this.colorService.getPrimaryColor());
          const parent = target.parentNode as HTMLElement;

          if (parent.children.length) {
            // tslint:disable-next-line:prefer-for-of
            for (let index = 0; index < parent.children.length; index++) {
              parent.children[index].setAttribute('stroke', this.colorService.getPrimaryColor());
            }
          }
        }
        this.isSaved = false;
      }
    } else if (this.isPipetteUsed) {
      if (this.eventAndTargetAreValid(event)) {
        const target = event.target as HTMLElement;
        if (this.isShape(target)) {
          const colorFill = target.getAttribute('fill');
          if (colorFill !== null) {
            this.colorService.updatePrimaryColorWithPipette(colorFill);
            this.isSaved = false;
          }
        } else {
          const colorStroke = target.getAttribute('stroke');
          if (colorStroke !== null) {
            this.colorService.updatePrimaryColorWithPipette(colorStroke);
            this.isSaved = false;
          }
        }
      }
    } else if (this.isEraserUsed) {
      let target = event.target as Element;
      if (target.getAttribute('stroke-opacity') !== null) {
        target = this.selection.getSelectionRectOfShapes().get(target) as Element;
      }
      let index = 0;
      for (index = 0; index <= this.shapes.length; index++) {
        if (index < this.shapes.length) {
          if (target === this.shapes[index]) {
            break;
          }
        }
      }
      if (index < this.shapes.length) {
        this.useEraser.setElementToErase(target);
        const eraseElementCommand = new CutDeleteCommand(this.useEraser.getElementToErase(), this.selection);
        if (target.tagName !== 'svg') {
          this.removeElement(this.useEraser.getElementToErase());
          this.useEraser.resetElement();
          this.useEraser.onMouseUp();
          this.commandArray.push(eraseElementCommand);
          this.commandDeletedArray = [];
          this.isSaved = false;
        }
      }
    } else if (this.isPaintBucket) {
      let pathBucket;
      this.paintBucketService.setRendererAndSVG(this.renderer, this.svg.nativeElement.cloneNode(true),
        this.widthDraw, this.heightDraw);
      await this.paintBucketService.drawImageOnCanvas().then(() => {
        this.getMousePosition(event as MouseEvent);
        pathBucket = this.paintBucketService.createPath(this.currentPosition);
        if (pathBucket !== undefined) {
          this.shapes.push(pathBucket);
          const selectionElement: Element = this.renderer.createElement(
            'rect',
            SVG_NS,
          );
          this.svg.nativeElement.appendChild(pathBucket);
          this.selection.addSelectionRect(selectionElement, this.svg);
          this.commandArray.push(new CreateElementCommandService(pathBucket));
        }
      });
    }
  }

  createChildText(parentElement: Element): void {
    if (this.drawingToolUsed === 'text') {
      for (let i = 0; i < this.insertText.textArray.length; i++) {
        if (this.insertText.textArray[i] !== '   ') {
          const childText: Element = this.renderer.createElement(
            'tspan',
            SVG_NS,
          );
          childText.setAttributeNS(null, 'elementID', parentElement.getAttribute('elementID') as string);
          childText.setAttributeNS(null, 'x', String(this.insertText.originX));
          childText.setAttributeNS(null, 'y', String(this.insertText.position + i * this.insertText.getFontSize()));
          childText.textContent = this.insertText.textArray[i];
          this.renderer.appendChild(parentElement, childText);
        }
      }
    }
  }

  appendElement(): void {
    const drawingElement: Element = this.renderer.createElement(
      this.tool.getSvgCode(),
      SVG_NS,
    );
    const isCorrectElement: boolean = this.tool.submitElement(drawingElement, this.drawingToolUsed);
    if (isCorrectElement) {
      this.shapes.push(drawingElement);
      this.svg.nativeElement.appendChild(drawingElement);
      this.createChildText(drawingElement);
      this.commandArray.push(new CreateElementCommandService(drawingElement));
      this.commandDeletedArray = [];
      this.tool.onMouseUp(this.currentPosition);
      this.isSaved = false;
    }
  }

  addShapeInContainer(container: any, svgCode: any, counter: number) {
    const drawingElement: Element = this.renderer.createElement(
      svgCode,
      SVG_NS,
    );
    this.tool.submitElement(drawingElement, this.drawingToolUsed);
    drawingElement.setAttributeNS(null, 'elementID', (counter).toString());
    this.tool.onMouseUp(this.currentPosition);
    this.renderer.appendChild(container, drawingElement);
  }

  findEraserIntersections(): void {
    const eraser: Element = this.renderer.createElement('rect', SVG_NS);
    eraser.setAttribute('x', String(this.currentPosition.x - this.useEraser.getSize() / 2));
    eraser.setAttribute('y', String(this.currentPosition.y - this.useEraser.getSize() / 2));
    eraser.setAttribute('width', String(this.useEraser.getSize()));
    eraser.setAttribute('height', String(this.useEraser.getSize()));
    this.useEraser.findIntersections(eraser, this.svg);
    this.tool.onMouseMove(this.currentPosition);
  }

  findSelectionIntersections(): void {
    const drawingElement: Element = this.renderer.createElement('rect', SVG_NS);
    drawingElement.setAttribute('x', String(this.selection.getOriginX()));
    drawingElement.setAttribute('y', String(this.selection.getOriginY()));
    drawingElement.setAttribute('width', String(this.selection.getWidth()));
    drawingElement.setAttribute('height', String(this.selection.getHeight()));
    this.selection.intersections(drawingElement, this.svg);
  }

  fixPenSpeed(event: MouseEvent): void {
    const speed: number = (Math.sqrt(Math.pow(event.movementX, 2) + Math.pow(event.movementY, 2)))
      / (event.timeStamp - this.lastEventTime);
    this.lastEventTime = event.timeStamp;
    this.velocity.setVelocity(speed);
    this.tool.onMouseMove(this.currentPosition);
  }

  setAerosolInterval(aerosol: AerosolService): void {
    this.interval = setInterval(() => {
      for (let i = 0; i < aerosol.getEmissionRate(); i++) {
        this.tool.onMouseDown(this.currentPosition);
        this.addShapeInContainer(this.aerosolContainer, this.tool.getSvgCode(), ShapeCounter.gCounter);
      }
    }, DELAY_EMISSION);
  }
}
