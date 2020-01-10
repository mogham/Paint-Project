// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { PenComponent } from './pen.component';

describe('PenComponent', () => {
  let component: PenComponent;
  let fixture: ComponentFixture<PenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
      ],
      declarations: [ PenComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the maxStrokeWidth', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsMaxStrokeWidth(event);
    const service = component['usePen'];
    expect(service['getMaxStrokeWidth']()).toEqual(5);
  });

  it('should set the minimumStrokeWidth', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsMinStrokeWidth(event);
    const service = component['usePen'];
    expect(service['getMinStrokeWidth']()).toEqual(5);
  });
});
