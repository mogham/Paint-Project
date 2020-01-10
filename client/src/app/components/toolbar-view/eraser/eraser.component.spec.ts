// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { ColorToolService } from 'src/app/drawing-tools/color-tool.service';
import { EraserParamsService } from 'src/app/drawing-tools/eraser-params.service';
import { IntersectionParamsService } from 'src/app/drawing-tools/intersection-params.service';
import { SelectionParamsService } from 'src/app/drawing-tools/selection-params.service';
import { PaperweightManipulationService } from 'src/app/selection-manipulation/paperweight-manipulation.service';
import { RotationManipulationService } from 'src/app/selection-manipulation/rotation-manipulation.service';
import { EraserComponent } from './eraser.component';

describe('EraserComponent', () => {
  let component: EraserComponent;
  let fixture: ComponentFixture<EraserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
      ],
      declarations: [EraserComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EraserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call setStyles of the service when we set params of the compenent', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const newComponent = new EraserComponent(service);
    const spy = spyOn(service, 'setSize');
    newComponent.setParams();
    expect(spy).toHaveBeenCalled();
  });

  it('should call setStyles of the service when we set params of the compenent', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const newComponent = new EraserComponent(service);
    const spy = spyOn(service, 'setStyles');
    newComponent.setParams();
    expect(spy).toHaveBeenCalled();
  });

  it('should set the FontSize', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsSize(event);
    const service = component['useEraser'];
    expect(service['size']).toEqual(5);
  });

  it('should return attribute size', () => {
    const intersection = new IntersectionParamsService();
    const colorToolService = new ColorToolService();
    const paperweight = new PaperweightManipulationService();
    const rotation = new RotationManipulationService();
    const selection = new SelectionParamsService(colorToolService, intersection, paperweight, rotation);
    const service: EraserParamsService = new EraserParamsService(intersection, selection);
    const newComponent = new EraserComponent(service);
    newComponent['size'] = 30;
    expect(newComponent.getSize()).toEqual(30);
  });
});
