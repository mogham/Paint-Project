import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-verify-open-draw',
  templateUrl: './verify-open-draw.component.html',
  styleUrls: ['./verify-open-draw.component.scss'],
})
export class VerifyOpenDrawComponent {

  constructor(private dialogRef: MatDialogRef<VerifyOpenDrawComponent>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }
  onYes(): void {
    this.dialogRef.close(true);
  }
}
