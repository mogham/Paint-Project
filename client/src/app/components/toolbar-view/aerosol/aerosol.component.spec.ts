// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { AerosolComponent } from './aerosol.component';

describe('AerosolComponent', () => {
  let component: AerosolComponent;
  let fixture: ComponentFixture<AerosolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [ AerosolComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AerosolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the EmissionRate', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsEmissionRate(event);
    const service = component['useAerosol'];
    expect(service['getEmissionRate']()).toEqual(5);
  });

  it('should set the Diameter', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsDiameter(event);
    const service = component['useAerosol'];
    expect(service['getDiameter']()).toEqual(5);
  });

  it('should call setStyles() when we call setParams()', () => {
    const service = component['useAerosol'];
    const spyStyles = spyOn(service, 'setStyles');
    component.setParams();
    expect(spyStyles).toHaveBeenCalled();
  });

  it('should set diameter and emission when we call setParams()', () => {
    const service = component['useAerosol'];
    const spyDiameter = spyOn(service, 'setDiameter');
    component.setParams();
    expect(spyDiameter).toHaveBeenCalled();
    const spyEmission = spyOn(service, 'setEmissionRate');
    component.setParams();
    expect(spyEmission).toHaveBeenCalled();
  });

});
