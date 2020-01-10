// tslint:disable: no-string-literal
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MatIconModule} from '@angular/material';
import { VerifySaveDrawComponent } from './verify-save-draw.component';

describe('VerifySaveDrawComponent', () => {
  let dialogSpy: jasmine.Spy;
  let component: VerifySaveDrawComponent;
  let fixture: ComponentFixture<VerifySaveDrawComponent>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ VerifySaveDrawComponent ],
      providers: [
        { provide: MatDialogRef,  useValue: dialogSpy },
        MatIconModule,
      ],
      schemas : [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifySaveDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
