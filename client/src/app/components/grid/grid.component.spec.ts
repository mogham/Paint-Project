// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Renderer2 } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { GridComponent } from './grid.component';

describe('GridComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatSliderModule,
        MatCheckboxModule,
      ],
      declarations: [ GridComponent ],
      providers: [Renderer2],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the activation to true', () => {
    const spy = spyOn(component.eventEmit, 'emit');
    component.setGridActivation();
    expect(spy).toHaveBeenCalled();
  });

  it('should set the opacity', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsOpacity(event);
    const service = component['gridService'];
    expect(service['opacity']).toEqual(5 / 100);
  });

  it('should set the sides', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsSides(event);
    const service = component['gridService'];
    expect(service['sideLength']).toEqual(5);
  });

});
