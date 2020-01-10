// tslint:disable no-string-literal
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatIconModule } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './../../material/material.module';
import { ExportDrawComponent } from './export-draw.component';

const RANDOMNAME = 'nameTest';
const CORRECTEXTENSION = 'SVG';
describe('ExportDrawComponent', () => {
  let component: ExportDrawComponent;
  let dialogSpy: jasmine.Spy;
  let fixture: ComponentFixture<ExportDrawComponent>;
  const nativeELementfake = {
    innerHTML: 'test',
  };
  const svgElementFake = {
    nativeElement: nativeELementfake,
  };
  const data = {
    elements: 'svgElements',
    width: '10px',
    height: '10px',
    tags: ['hello'],
    svg: svgElementFake,
    backgroundColor: '#000000',
  };

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ ExportDrawComponent ],
      imports: [ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: MAT_DIALOG_DATA, useValue: data },
        MatIconModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog', () => {
    const spy = spyOn(component.form, 'reset');
    component.closeDialog();
    expect(spy).toHaveBeenCalled();
  });

  it('should return name', () => {
    expect(component.getName()).toEqual(component.form.value.name);
  });
  it('should return extension', () => {
    expect(component.getExtension()).toEqual(component.form.value.extension);
  });

  it('should set value in form', () => {
    spyOn(component.form, 'setValue');
    component.setValueInForm(RANDOMNAME, CORRECTEXTENSION);
    expect(component.form.setValue).toHaveBeenCalled();
  });

  it('should close the dialog and submit the form', () => {
    component.setValueInForm(RANDOMNAME, CORRECTEXTENSION);
    spyOn(component['extensions'], 'includes').and.returnValue(true);
    component.export();
    expect(component['dialogRef'].close).toHaveBeenCalled();
  });

});
