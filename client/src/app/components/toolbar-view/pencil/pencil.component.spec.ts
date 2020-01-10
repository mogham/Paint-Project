// tslint:disable: no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { PencilComponent } from './pencil.component';

describe('PencilComponent', () => {
  let component: PencilComponent;
  let fixture: ComponentFixture<PencilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
      ],
      declarations: [ PencilComponent],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PencilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the plot and thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParams(event);
    const service = component['usePencil'];
    expect(service['thickness']).toEqual(5);
  });
});
