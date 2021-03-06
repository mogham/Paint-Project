import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ColorSliderComponent } from './color-slider.component';

const RANDOM_STRING_NUMBER_FOR_TEST = '100';
const WHITE_COLOR_RGBA = 'RGBA(255,255,255,1)';
const RANDOM_COLOR_FOR_TESTS = 'RGBA(100,100,100,1)';
const RANDOM_NUMBER_X_Y = 10;

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ColorSliderComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit color', () => {
    spyOn(component, 'getColorAtPosition').and.returnValue(RANDOM_COLOR_FOR_TESTS);
    spyOn(component.color , 'emit');
    component.emitColor(RANDOM_NUMBER_X_Y, RANDOM_NUMBER_X_Y);
    expect(component.color.emit).toHaveBeenCalledWith(RANDOM_COLOR_FOR_TESTS);
  });

  it('should get color at position for ctx null', () => {
    component.setCtx(null);
    spyOn(component.color , 'emit');
    expect(component.getColorAtPosition(RANDOM_NUMBER_X_Y, RANDOM_NUMBER_X_Y)).toEqual(WHITE_COLOR_RGBA);
  });

  it('should get color at position for ctx not null', () => {
    const ctx: any = jasmine.createSpyObj('CanvasRenderingContext2D', ['getImageData']);
    const ctxData: any  = { data: {
      0: RANDOM_STRING_NUMBER_FOR_TEST,
      1: RANDOM_STRING_NUMBER_FOR_TEST,
      2: RANDOM_STRING_NUMBER_FOR_TEST,
      }};
    ctx.getImageData.and.returnValue(ctxData);
    component.setCtx(ctx);
    expect(component.getColorAtPosition(RANDOM_NUMBER_X_Y, RANDOM_NUMBER_X_Y)).toEqual(RANDOM_COLOR_FOR_TESTS);
  });

  it('should emit color at a position on mouse down and move', () => {
    const event: any = new CustomEvent('mousedown');
    window.dispatchEvent(new CustomEvent('mousemove'));
    spyOn(component , 'draw');
    spyOn(component , 'emitColor');
    spyOn(component , 'getColorAtPosition');
    component.onMouseDown(event);
    expect(component.emitColor).toHaveBeenCalled();
    component.onMouseMove(event);
    expect(component.emitColor).toHaveBeenCalled();
  });

  it('should set mousedown to false at mouse up event', () => {
    const event: any = new CustomEvent('mouseup');
    component.onMouseUp(event);
    expect(component.getMouseStatus()).toEqual(false);
  });

});
