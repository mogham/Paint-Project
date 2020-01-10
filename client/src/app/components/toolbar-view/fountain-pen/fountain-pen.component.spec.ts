// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { FountainPenComponent } from './fountain-pen.component';

describe('FountainPenComponent', () => {
  let component: FountainPenComponent;
  let fixture: ComponentFixture<FountainPenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
      ],
      declarations: [ FountainPenComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FountainPenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the line lenght and the degree', () => {
    component['length'] = 10;
    component['degree'] = 45;
    component.setParams();
    const service = component['fountainPenInUse'];
    expect(service['degree']).toEqual(45);
    expect(service['lenght']).toEqual(10);
    const spyLine = spyOn(service, 'setLineLenght');
    component.setParams();
    expect(spyLine).toHaveBeenCalled();
    const spyDegree = spyOn(service, 'setRotationDegree');
    component.setParams();
    expect(spyDegree).toHaveBeenCalled();
  });

  it('should set the length', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsLength(event);
    const service = component['fountainPenInUse'];
    expect(service['lenght']).toEqual(5);
  });

  it('should set the degree', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsDegree(event);
    const service = component['fountainPenInUse'];
    expect(service['degree']).toEqual(5);
  });

});
