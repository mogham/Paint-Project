// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule, } from '@angular/material';
import { StampComponent } from './stamp.component';

describe('StampComponent', () => {
  let component: StampComponent;
  let fixture: ComponentFixture<StampComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [ StampComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the orientationngle', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsOrientationAngle(event);
    const service = component['stampInUse'];
    expect(service['orientationAngle']).toEqual(5);
  });

  it('should set the scale', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsScale(event);
    const service = component['stampInUse'];
    expect(service['scale']).toEqual(5);
  });

  it('should set the stamp used', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsStampUsed(event);
    const service = component['stampInUse'];
    expect(service['stampUsed']).toEqual('5');
  });
});
