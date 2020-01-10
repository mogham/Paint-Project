// tslint:disable:no-string-literal Disable to remove the unused GET and SET of the components
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef} from '@angular/material';
import { VerifyOpenDrawComponent } from './verify-open-draw.component';

describe('VerifyOpenDrawComponent', () => {
  let dialogSpy: jasmine.Spy;
  let component: VerifyOpenDrawComponent;
  let fixture: ComponentFixture<VerifyOpenDrawComponent>;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      declarations: [ VerifyOpenDrawComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef,  useValue: dialogSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyOpenDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close matdialogref on cancel with false', () => {
    component.cancel();
    expect(component['dialogRef'].close).toHaveBeenCalledWith(false);
  });

  it('should close matdialogref on onYes with true', () => {
    component.onYes();
    expect(component['dialogRef'].close).toHaveBeenCalledWith(true);
  });

});
