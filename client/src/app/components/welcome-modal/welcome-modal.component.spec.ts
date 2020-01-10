import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDialogRef} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { WelcomeModalComponent } from './welcome-modal.component';

describe('WelcomeModalComponent', () => {
  let component: WelcomeModalComponent;
  let fixture: ComponentFixture<WelcomeModalComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, MatCheckboxModule],
      declarations: [WelcomeModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],

      providers: [
        WelcomeModalComponent,
        { provide: MatDialogRef, useValue: {
          close: () => { /*mock*/ },
        } },
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change the checkbox status', () => {
    component.onClickCheckbox();
    expect(component.getIsChecked()).toBeTruthy();
    component.onClickCheckbox();
    expect(component.getIsChecked()).toBeFalsy();
  });

  it('should set the item checkbox to true on the localStorage when is checked', () => {
    component.setIsChecked(true);
    component.saveCheckbox();
    expect(localStorage.getItem('checkbox')).toBe('true');
  });

  it('should set the item checkbox to false on the localStorage when is not checked', () => {
    component.setIsChecked(false);
    component.saveCheckbox();
    expect(localStorage.getItem('checkbox')).toBe('false');
  });

  it('should close the modal', () => {
    const spy = spyOn( component.getDialogRef(), 'close');
    component.closeModal();
    expect(spy).toHaveBeenCalled();
  });
});
