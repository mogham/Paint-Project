import { Component, HostListener } from '@angular/core';
import { SHORTCUTS } from 'src/app/components/drawing-view/drawing-view-constants';
import { MagnetManipulationService } from 'src/app/selection-manipulation/magnet-manipulation.service';

@Component({
  selector: 'app-magnet',
  templateUrl: './magnet.component.html',
  styleUrls: ['./magnet.component.scss'],
})
export class MagnetComponent {
  private magnetPoint: string;
  private isActivate: boolean;
  protected message: string;
  constructor(private serviceMagnet: MagnetManipulationService) {
    this.magnetPoint = 'LU';
    this.message = 'the upper left corner';
    this.isActivate = false;
  }

  onLeftClick(event: Event): void {
    const target = event.target as HTMLElement;
    const targetID = target.getAttribute('id');
    if (targetID !== null) {
      this.magnetPoint = targetID;
      this.setMessage();
      this.serviceMagnet.setMagnetPoint(this.magnetPoint);
    }
  }

  setMessage(): void {
    switch (this.magnetPoint) {
      case 'LU' :
        this.message = 'the upper left corner';
        break;
        case 'MU' :
        this.message = 'the upper center';
        break;
        case 'RU' :
        this.message = 'the upper right corner';
        break;
        case 'LM' :
        this.message = 'the middle left side';
        break;
        case 'RM' :
        this.message = 'the middle right side';
        break;
        case 'C' :
        this.message = 'the center';
        break;
        case 'LD' :
        this.message = 'the lower left corner';
        break;
        case 'MD' :
        this.message = 'the lower middle point';
        break;
        case 'RD' :
        this.message = 'the lower right corner';
        break;
    }
  }
  setMagnetActivation(): void {
    this.isActivate = !this.isActivate;
    this.serviceMagnet.setIsActivate(this.isActivate);
  }

  @HostListener('document:keydown', ['$event'])
  shortCutsList(event: KeyboardEvent) {
    if (event.key.toLowerCase() === SHORTCUTS.magnet) {
      this.setMagnetActivation();
    }
  }
}
