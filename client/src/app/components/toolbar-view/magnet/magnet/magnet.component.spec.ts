// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule, MatGridListModule, MatSliderModule } from '@angular/material';
import { MagnetManipulationService } from 'src/app/selection-manipulation/magnet-manipulation.service';
import { MagnetComponent } from './magnet.component';

describe('MagnetComponent', () => {
  let component: MagnetComponent;
  let fixture: ComponentFixture<MagnetComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagnetComponent ],
      imports: [FormsModule,
        MatGridListModule,
        MatSliderModule,
        MatCheckboxModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MagnetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update pointMagnet and call setIsActivate of its service', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    const spy = spyOn(newComponent['serviceMagnet'], 'setIsActivate');
    newComponent['isActivate'] = false;
    newComponent.setMagnetActivation();
    expect(newComponent['isActivate']).toEqual(true);
    expect(spy).toHaveBeenCalled();
  });

  it('should update message corrctly when the user click on LU', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'LU';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the upper left corner');
  });

  it('should update message corrctly when the user click on MU', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'MU';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the upper center');
  });

  it('should update message corrctly when the user click on RU', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'RU';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the upper right corner');
  });

  it('should update message corrctly when the user click on LM', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'LM';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the middle left side');
  });

  it('should update message corrctly when the user click on RM', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'RM';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the middle right side');
  });

  it('should update message corrctly when the user click on LD', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'LD';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the lower left corner');
  });

  it('should update message corrctly when the user click on MD', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'MD';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the lower middle point');
  });

  it('should update message corrctly when the user click on RD', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'RD';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the lower right corner');
  });

  it('should update message corrctly when the user click on C', () => {
    const serviceMagnet = new MagnetManipulationService();
    const newComponent = new MagnetComponent(serviceMagnet);
    newComponent['magnetPoint'] = 'C';
    newComponent.setMessage();
    expect(newComponent['message']).toEqual('the center');
  });
});
