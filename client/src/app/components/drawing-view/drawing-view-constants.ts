export interface MousePosition {
  x: number;
  y: number;
}

export class ShapeCounter {
  static gCounter = 9999;
  static gpCounter = 100000;
  static drawElementCounter = 0;

}

export const enum SHORTCUTS {
  rectangle = '1',
  ellipse = '2',
  polygon = '3',
  pencil = 'c',
  paintBrush = 'w',
  colorApplicator = 'r',
  rotateBack = 'alt',
  seperateRotation = 'shift',
  polyline = 'l',
  pen = 'y',
  grid = 'g',
  text = 't',
  delete = 'delete',
  aerosol = 'a',
  fountainPen = 'p',
  paintBucket = 'b',
  magnet = 'm',
}

export const enum CURSORS {
  pencil = 'assets/cursors/pencil.cur',
  paintBrush = 'assets/cursors/BobRoss.cur',
  foutainPen = 'assets/cursors/fountainPen.cur',
  pen = 'assets/cursors/pen.cur',
  aerosol = 'assets/cursors/aerosol.cur',
  text = 'assets/cursors/text.cur',
  pipette = 'assets/cursors/pipette.cur',
  stamp = 'assets/cursors/stamp.cur',
  paintBucket = 'assets/cursors/paintBucket.cur',
  colorApplicator = 'assets/cursors/drop.cur',
}
