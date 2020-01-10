import { Component } from '@angular/core';
import { MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-welcome-modal',
  templateUrl: './welcome-modal.component.html',
  styleUrls: ['./welcome-modal.component.scss'],
})

export class WelcomeModalComponent {

  private isChecked: boolean;

  constructor(private dialogRef: MatDialogRef<WelcomeModalComponent>) {
    this.isChecked = false;
  }

  getIsChecked(): boolean {
    return this.isChecked;
  }

  getDialogRef(): MatDialogRef<WelcomeModalComponent> {
    return this.dialogRef;
  }

  setIsChecked(isChecked: boolean) {
    this.isChecked = isChecked;
  }

  onClickCheckbox(): void {
    this.isChecked = !this.isChecked;
  }

  saveCheckbox(): void {
    localStorage.setItem('checkbox', String(this.isChecked));
  }

  closeModal(): void {
    this.saveCheckbox();
    this.dialogRef.close();
  }
}
