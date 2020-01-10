import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatSliderChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { GridService } from 'src/app/drawing-tools/grid.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnDestroy {
  @ViewChild('checkbox', { static: false }) checkbox: ElementRef<HTMLInputElement>;
  @ViewChild('side', { static: true}) slider: any;
  @Output() eventEmit: EventEmitter<string> = new EventEmitter<string>();
  @Input() opacity: number;
  @Input() side: number;
  @Input() activate: boolean;
  private changeActivteSubscription: Subscription;
  constructor(private gridService: GridService) {
    this.opacity = 20;
    this.side = 5;
    this.activate = false;
  }

  ngOnInit() {
    this.changeActivteSubscription = this.gridService.getChangeIsActivate().subscribe(
      (arraySecondColor: boolean[]) => {
        this.activate = arraySecondColor[0];
      },
    );
    this.gridService.emitIsActivatedSubject();
  }
  @HostListener('document:keydown', ['$event'])
    shortcut(event: KeyboardEvent): void {
    if (event.key.toLowerCase() === '+') {
      if (this.gridService.getSideLenght() < 100) {
        this.side += 5;
        this.gridService.setSideLength(this.side);
      }
    } else if (event.key.toLowerCase() === '-') {
        if (this.gridService.getSideLenght() > 10) {
          this.side -= 5;
          this.gridService.setSideLength(this.side);
        }
      }
    this.slider.value = this.side;
    }

  setGridActivation(): void {
    this.eventEmit.emit(this.activate.toString());
  }

  setParamsOpacity(event: MatSliderChange): void {
    this.opacity = event.value as number;
    this.setParams();
  }

  setParamsSides(event: MatSliderChange): void {
    this.side = event.value as number;
    this.setParams();
  }

  setParams(): void {
    this.gridService.setOpacity(this.opacity / 100);
    this.gridService.setSideLength(this.side);
  }

  ngOnDestroy() {
    this.changeActivteSubscription.unsubscribe();
  }
}
