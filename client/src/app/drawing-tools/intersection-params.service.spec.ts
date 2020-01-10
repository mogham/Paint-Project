// tslint:disable: no-string-literal Disable to remove the unused GET and SET of the components
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { WelcomeModalComponent } from '../components/welcome-modal/welcome-modal.component';
import { IntersectionParamsService } from './intersection-params.service';

describe('IntersectionParamsService', () => {
  const service: IntersectionParamsService = new IntersectionParamsService();
  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        IntersectionParamsService,
        WelcomeModalComponent,
      ],
    })
      .compileComponents();
  }));

  it('should intersect from outside the element', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const area = document.createElementNS(svgNS, 'rect');
    area.setAttributeNS(null, 'x', '50');
    area.setAttributeNS(null, 'y', '60');
    area.setAttributeNS(null, 'height', '40');
    area.setAttributeNS(null, 'width', '30');
    const child = document.createElementNS(svgNS, 'rect');
    child.setAttributeNS(null, 'x', '55');
    child.setAttributeNS(null, 'y', '65');
    child.setAttributeNS(null, 'height', '45');
    child.setAttributeNS(null, 'width', '35');
    service.intersection(area, child);
    expect(service['isIntersect']).toEqual(true);
  });

  it('should not intersect', () => {
    const svgNS = 'http://www.w3.org/2000/svg';
    const area = document.createElementNS(svgNS, 'rect');
    area.setAttributeNS(null, 'x', '50');
    area.setAttributeNS(null, 'y', '60');
    area.setAttributeNS(null, 'height', '10');
    area.setAttributeNS(null, 'width', '10');
    const child = document.createElementNS(svgNS, 'rect');
    child.setAttributeNS(null, 'x', '65');
    child.setAttributeNS(null, 'y', '70');
    child.setAttributeNS(null, 'height', '45');
    child.setAttributeNS(null, 'width', '35');
    service.intersection(area, child);
    expect(service['isIntersect']).toEqual(false);
  });
});
