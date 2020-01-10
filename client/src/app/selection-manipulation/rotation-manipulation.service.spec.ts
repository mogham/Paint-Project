// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { TestBed } from '@angular/core/testing';
import { RotationManipulationService } from './rotation-manipulation.service';

describe('RotationManipulationService', () => {
  const service: RotationManipulationService = new RotationManipulationService();
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create the rotate transformation of a shape', () => {
    const originXBox = 2;
    const originYBox = 2;
    const widthBox = 4;
    const heightBox = 4;
    const orientationAngle = 15;
    const attributes = {
      originXBox: 2,
      originYBox: 2,
      widthBox: 4,
      heightBox: 4,
    };
    const transform = `rotate(${orientationAngle}, ${originXBox + widthBox / 2},${originYBox + heightBox / 2}) `;
    service.ShapeRotation(orientationAngle, attributes);
    const serviceTransform = service.getNewRotation();
    expect(serviceTransform).toEqual(transform);
  });

  it('should create the rotate transformation of a group of shapes', () => {
    const originXGroupBox = 2;
    const originYGroupBox = 2;
    const widthGroupBox = 4;
    const heightGroupBox = 4;
    const orientationAngle = 15;
    const attributes = {
      originXGroupBox: 2,
      originYGroupBox: 2,
      widthGroupBox: 4,
      heightGroupBox: 4,
    };
    const transform = `rotate(${orientationAngle}, ${originXGroupBox + widthGroupBox / 2},${originYGroupBox + heightGroupBox / 2}) `;
    service.GroupRotation(orientationAngle, attributes);
    const serviceTransform = service.getNewRotation();
    expect(serviceTransform).toEqual(transform);
  });

  it('should apply rotate on shape', () => {
    const newService: RotationManipulationService = new RotationManipulationService();
    newService['newRotation'] = 'rotate(50, 80, 80) rotate(-50, -80, -80)';
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const elements = [];
    elements.push(rectangle);
    rectangle.setAttribute('transform', '');
    const attributes = [];
    attributes.push({
      group: false,
      originXBox: 2,
      originYBox: 2,
      widthBox: 4,
      heightBox: 4,
    });
    const orientationAngle = [];
    orientationAngle.push(0);
    newService.applyRotate(elements, attributes, orientationAngle);
    expect(orientationAngle.length).toEqual(1);
    expect(rectangle.getAttribute('transform')).toEqual('rotate(0, 4,4) ');
    expect(newService['newRotation']).toEqual('rotate(0, 4,4) ');
  });

  it('should apply rotate on shape', () => {
    const newService: RotationManipulationService = new RotationManipulationService();
    newService['newRotation'] = 'rotate(50, 80, 80) rotate(-50, -80, -80)';
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const elements = [];
    elements.push(rectangle);
    rectangle.setAttribute('transform', '');
    const attributes = [];
    attributes.push({
      group: false,
      originXBox: 2,
      originYBox: 2,
      widthBox: 4,
      heightBox: 4,
  });
    const orientationAngle = [];
    orientationAngle.push(0);
    newService.applyRotate(elements, attributes, orientationAngle);
    expect(orientationAngle.length).toEqual(1);
    expect(rectangle.getAttribute('transform')).toEqual('rotate(0, 4,4) ');
    expect(newService['newRotation']).toEqual('rotate(0, 4,4) ');
  });

  it('should update rotate on shape', () => {
    const newService: RotationManipulationService = new RotationManipulationService();
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const transformation = 'rotate(50, 80, 80) ';
    rectangle.setAttribute('transform', 'rotate(50, 80, 80) ');
    const element = [];
    element.push(rectangle);
    const map = new Map();
    map.set(rectangle, transformation.length);
    newService['lastRotateShape'] = map;
    const attributes = [];
    attributes.push({
      group: false,
      originXBox: 2,
      originYBox: 2,
      widthBox: 4,
      heightBox: 4,
    });
    const orientationAngle = [];
    orientationAngle.push(0);
    newService.applyRotate(element, attributes, orientationAngle);
    expect(rectangle.getAttribute('transform')).toEqual('rotate(0, 4,4) ');
  });

  it('should set last rotate shape', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const rectangle = document.createElementNS(svgNS, 'rect');
    const map = new Map();
    map.set(rectangle, 0);
    service.setLastRotateShape(map);
    expect(service['lastRotateShape']).toEqual(map);
  });

});
