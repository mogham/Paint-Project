import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule, MatDialogRef} from '@angular/material';
import { VerifyCreateNewDrawComponent } from './verify-create-new-draw.component';

describe('VerifyCreateNewDrawComponent', () => {
  let component: VerifyCreateNewDrawComponent;
  let fixture: ComponentFixture<VerifyCreateNewDrawComponent>;
  let dialogSpy: any;

  beforeEach(async(() => {
    dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    TestBed.configureTestingModule({
      imports: [MatButtonModule],
      declarations: [ VerifyCreateNewDrawComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MatDialogRef, useValue: dialogSpy },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyCreateNewDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close verification and send true', () => {
    component.cancel();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

  it('should close verification and send true', () => {
    component.onYes();
    expect(dialogSpy.close).toHaveBeenCalled();
  });

});
