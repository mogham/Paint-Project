import { async, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NotificationService } from './notification-service.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async(() => TestBed.configureTestingModule({
    imports: [MatSnackBarModule],
    providers: [NotificationService],
  })));

  beforeEach(() => {
    service = TestBed.get(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit success message', () => {
    const spy: any = spyOn(service.snackBar, 'open');
    service.success({});
    expect(spy).toHaveBeenCalled();
  });

  it('should emit warning message', () => {
    const spy: any = spyOn(service.snackBar, 'open');
    service.warn({});
    expect(spy).toHaveBeenCalled();
  });

});
