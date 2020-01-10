import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
@Component({
  selector: 'app-verify-create-new-draw',
  templateUrl: './verify-create-new-draw.component.html',
  styleUrls: ['./verify-create-new-draw.component.scss'],
})
export class VerifyCreateNewDrawComponent {

  constructor(private dialogRef: MatDialogRef<VerifyCreateNewDrawComponent>) { }

  cancel(): void {
    this.dialogRef.close(false);
  }
  onYes(): void {
    this.dialogRef.close(true);
  }
}
