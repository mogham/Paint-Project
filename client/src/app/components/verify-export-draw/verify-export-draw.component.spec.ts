// tslint:disable: no-string-literal
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatIconModule } from '@angular/material';
import { VerifyExportDrawComponent } from './verify-export-draw.component';
describe('VerifyExportDrawComponent', () => {
  let component: VerifyExportDrawComponent;
  let fixture: ComponentFixture<VerifyExportDrawComponent>;
  let dialogSpy: jasmine.Spy;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [VerifyExportDrawComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
        MatIconModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyExportDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close matdialogref with null value', () => {
    component.close();
    expect(component['dialogRef'].close).toHaveBeenCalledWith(null);
  });

  it('should close matdialogref with true value', () => {
    component.newDraw();
    expect(component['dialogRef'].close).toHaveBeenCalledWith(true);
  });
});
