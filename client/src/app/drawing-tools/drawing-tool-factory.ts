import { Injectable } from '@angular/core';
import { PencilParamsService } from 'src/app/drawing-tools/pencil-params.service';
import { AerosolService } from './aerosol.service';
import { EllipseService } from './ellipse.service';
import { EraserParamsService } from './eraser-params.service';
import { FountainPenParamsService } from './fountain-pen-params.service';
import { PaintBrushParamsService } from './paint-brush-params.service';
import { PenParamsService } from './pen-params.service';
import { PolygonParamsService } from './polygon-params.service';
import { PolylineParamsService } from './polyline-params.service';
import { RectParamsService } from './rect-params.service';
import { SelectionParamsService } from './selection-params.service';
import { StampService } from './stamp.service';
import { TextParamsService } from './text-params.service';

@Injectable({ providedIn: 'root' })
export class DrawingToolFactory {
    constructor(private drawRectangle: RectParamsService,
                private pencilTool: PencilParamsService,
                private paintBrush: PaintBrushParamsService,
                private drawLine: PolylineParamsService,
                private selectShapes: SelectionParamsService,
                private drawPolygon: PolygonParamsService,
                private useStamp: StampService,
                private drawEllipse: EllipseService,
                private penTool: PenParamsService,
                private insertText: TextParamsService,
                private useEraser: EraserParamsService,
                private useFountainPen: FountainPenParamsService,
                private aerosol: AerosolService) { }

    createTool(drawingTool: string) {
        switch (drawingTool) {
            case 'pencil':
                return this.pencilTool;
            case 'paintBrush':
                return this.paintBrush;
            case 'rectangle':
                return this.drawRectangle;
            case 'line':
                return this.drawLine;
            case 'selection':
                return this.selectShapes;
            case 'polygon':
                return this.drawPolygon;
            case 'ellipse':
                return this.drawEllipse;
            case 'stamp':
                return this.useStamp;
            case 'pen':
              return this.penTool;
            case 'text':
                return this.insertText;
            case 'eraser':
                return this.useEraser;
            case 'aerosol':
                return this.aerosol;
            case 'fountainPen':
                return this.useFountainPen;
            default:
                throw Error();
        }
    }
}
