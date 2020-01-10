// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatGridListModule, MatRadioModule, MatSliderChange, MatSliderModule } from '@angular/material';
import { PaintBrushComponent } from './paint-brush.component';

describe('PaintBrushComponent', () => {
  let component: PaintBrushComponent;
  let fixture: ComponentFixture<PaintBrushComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatRadioModule,
      ],
      declarations: [ PaintBrushComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaintBrushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should get the texture chosen', () => {
    const texture = component.getTexture();
    expect(texture).toEqual('Texture 1');
  });

  it('should set the texture and thickness', () => {
    component.setThickness(6);
    component.setTexture('Texture 2');
    component.setParams();

    const service = component.getPaintBrushInUse();
    expect(service.getTexture()).toEqual('Texture 2');
    expect(service.getThickness()).toEqual(6);
  });

  it('should return thickness', () => {
    component['thickness'] = 1;
    const result: number = component.getThickness();
    expect(result).toEqual(1);
  });

  it('should set the thickness', () => {
    const event = new MatSliderChange();
    event.value = 5;
    component.setParamsThickness(event);
    const service = component['paintBrushInUse'];
    expect(service['thickness']).toEqual(5);
  });

});
