import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ColorToolService } from './color-tool.service';

describe('ColorToolComponent', () => {
    const service: ColorToolService = new ColorToolService();
    const serviceModified: ColorToolService = new ColorToolService();

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            providers: [ColorToolService, ],
        })
            .compileComponents();
    }));

    it('should get the primaryColor attribute', () => {
        const primaryColor = service.getPrimaryColor();
        expect(primaryColor).toEqual('#000000');
    });

    it('should get the secondColor attribute', () => {
        const secondColor = service.getSecondColor();
        expect(secondColor).toEqual('#000000');
    });

    it('should set the primaryColor and secondColor', () => {
        serviceModified.setPrimaryColor('#FFFFFF');
        serviceModified.setSecondColor('#FFFFFF');
        const primaryColor = serviceModified.getPrimaryColor();
        const secondColor = serviceModified.getSecondColor();
        expect(primaryColor).toEqual('#FFFFFF');
        expect(secondColor).toEqual('#FFFFFF');
    });

    it('should set the primaryColor and secondColor when we use the pipette', () => {
        serviceModified.updatePrimaryColorWithPipette('#FFFFFF');
        serviceModified.setSecondColor('#FFFFFF');
        const primaryColor = serviceModified.getPrimaryColor();
        const secondColor = serviceModified.getSecondColor();
        expect(primaryColor).toEqual('#FFFFFF');
        expect(secondColor).toEqual('#FFFFFF');
    });

    it('should update second color with pipette', () => {
        spyOn(service, 'setSecondColor');
        spyOn(service, 'emitSecondColorSubject');
        service.updateSecondColorWithPipette('red');
        expect(service.setSecondColor).toHaveBeenCalled();
        expect(service.emitSecondColorSubject).toHaveBeenCalled();
    });

});
