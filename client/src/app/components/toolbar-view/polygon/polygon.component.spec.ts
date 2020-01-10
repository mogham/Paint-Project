// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { PolygonComponent } from './polygon.component';

describe('PolygonComponent', () => {
  let component: PolygonComponent;
  let fixture: ComponentFixture<PolygonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [ PolygonComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PolygonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsThickness(event);
    const service = component['drawPolygon'];
    expect(service['thickness']).toEqual(5);
  });

  it('should set the plot', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsPlot(event);
    const service = component['drawPolygon'];
    expect(service['plot']).toEqual('5');
  });

  it('should set the nbSides', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsSides(event);
    const service = component['drawPolygon'];
    expect(service['slides']).toEqual(5);
  });
});
