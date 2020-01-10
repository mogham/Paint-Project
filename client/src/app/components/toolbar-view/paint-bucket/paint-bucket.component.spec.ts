// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioButton, MatRadioChange, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { PaintBucketComponent } from './paint-bucket.component';

describe('PaintBucketComponent', () => {
  let component: PaintBucketComponent;
  let fixture: ComponentFixture<PaintBucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [PaintBucketComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBucketComponent);
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
    const service = component['servicePaintBucket'];
    expect(service['thickness']).toEqual(5);
  });

  it('should set the tolerance', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsTolerance(event);
    const service = component['servicePaintBucket'];
    expect(service['tolerance']).toEqual(5);
  });

  it('should set the plot', () => {
    const event = new MatRadioChange({} as MatRadioButton, '5');
    component.setParamsPlot(event);
    const service = component['servicePaintBucket'];
    expect(service['plot']).toEqual('5');
  });
});
