import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-verify-export-draw',
  templateUrl: './verify-export-draw.component.html',
  styleUrls: ['./verify-export-draw.component.scss'],
})
export class VerifyExportDrawComponent {

  constructor(private dialogRef: MatDialogRef<VerifyExportDrawComponent>) { }

  close(): void {
    this.dialogRef.close(null);
  }
  newDraw(): void {
    this.dialogRef.close(true);
  }
}
