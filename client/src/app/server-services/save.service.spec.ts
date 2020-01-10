// tslint:disable: no-string-literal
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { SvgImage } from '../../../../common/SvgImage';
import { SaveService } from './save.service';

import { of } from 'rxjs';

describe('SaveService', () => {
  let service: SaveService;
  let httpClientSpy: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SaveService],
    });
  }));

  beforeEach(() => {
    service = TestBed.get(SaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post draw to server', () => {
    httpClientSpy = spyOn(service['httpClient'], 'post');
    httpClientSpy.and.returnValue(of({}));
    service.saveDrawInDataBase({} as SvgImage);
    expect(service['httpClient'].post).toHaveBeenCalled();
  });

  it('should post draw to server', () => {
    httpClientSpy = spyOn(service['httpClient'], 'post');
    httpClientSpy.and.returnValue(of({}));
    service.saveDrawInCloud({} as SvgImage);
    expect(service['httpClient'].post).toHaveBeenCalled();
  });

  it('should post draw to server', () => {
    httpClientSpy = spyOn(service['httpClient'], 'get');
    httpClientSpy.and.returnValue(of({}));
    service.getAllkey();
    expect(service['httpClient'].get).toHaveBeenCalled();
  });

  it('should throw error', () => {
    jasmine.createSpy('throwError').and.returnValue(of({}));
    expect(service.errorHandler({} as HttpErrorResponse)).toBeTruthy();
  });

});
