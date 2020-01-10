import { MousePosition, ShapeCounter} from '../components/drawing-view/drawing-view-constants';
import { drawingSpecifics } from './drawing-tool-constants';

export abstract class DrawingTool {
    protected fill = '';
    protected stroke = '';
    protected strokeWidth = 0;
    protected svgCode = '';
    protected isSelected = false;
    protected isReady = false;
    protected isCorrect = true;

    abstract draw(currentPosition: MousePosition): void;
    abstract startDrawing(currentPosition: MousePosition): void;
    abstract setStyles(): any;

    setDefault(): void {
        //
    }

    getElementID(): number {
        return ShapeCounter.drawElementCounter;
    }

    getSvgCode(): string {
        return this.svgCode;
    }

    getSelection(): boolean {
        return this.isSelected;
    }

    setSelection(newSelection: boolean): boolean {
        return this.isSelected = newSelection;
    }

    getFill(): string {
        return this.fill;
    }

    getStrokeWidth(): number {
        return this.strokeWidth;
    }

    getStroke(): string {
        return this.stroke;
    }

    onMouseDown(currentPosition: MousePosition): void {
        this.startDrawing(currentPosition);
    }

    onMouseMove(currentPosition: MousePosition): void {
        this.draw(currentPosition);
    }

    onMouseUp(currentPosition: MousePosition): void {
        return;
    }
    set setReady(status: boolean) {
        this.isReady = status;
    }

    isToolReady(): boolean {
        return this.isReady;
    }

    submitElement(shape: Element, shapeName: string): boolean {
        shape.setAttributeNS(null, drawingSpecifics.stroke, this.stroke);
        shape.setAttributeNS(null, drawingSpecifics.strokeWidth, this.strokeWidth.toString());
        shape.setAttributeNS(null, drawingSpecifics.fill, this.fill);
        shape.setAttributeNS(null, drawingSpecifics.elementID, (ShapeCounter.drawElementCounter++).toString());
        return this.isCorrect;
    }
}
