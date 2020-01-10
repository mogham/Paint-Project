/*
* On s'est inspiré du tutorial dans le lien suivant:
* https://malcoded.com/posts/angular-color-picker/
*
*/
import { Component, EventEmitter, Output } from '@angular/core';
import { ColorPickerService } from 'src/app/drawing-tools/color-picker.service';
@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss'],
})
export class ColorPickerComponent {
  hue: string;
  @Output() event: EventEmitter<string> = new EventEmitter<string>();
  private colorClicked = false;
  @Output() color = 'rgba(255,255,255,1)';

  setColorClicked() {
    this.colorClicked = true;
  }
  getColorClicked() {
    return this.colorClicked;
  }
  constructor(private colorPickerService: ColorPickerService) {
    this.colorClicked = false;
  }
  setColor(color: string) {
    this.colorPickerService.setColor(color);
    this.setColorClicked();
    this.event.emit(color);
  }
}
