import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-verify-save-draw',
  templateUrl: './verify-save-draw.component.html',
  styleUrls: ['./verify-save-draw.component.scss'],
})

export class VerifySaveDrawComponent {

  constructor(private dialogRef: MatDialogRef<VerifySaveDrawComponent>) { }

  close(): void {
    this.dialogRef.close(null);
  }
  newDraw(): void {
    this.dialogRef.close(true);
  }
}
