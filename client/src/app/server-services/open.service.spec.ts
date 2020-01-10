// tslint:disable: no-string-literal
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OpenService } from './open.service';

describe('OpenService', () => {
  let httpClientSpy: any;
  let openService: OpenService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OpenService],
    });
  }));

  beforeEach(() => {
    openService = TestBed.get(OpenService);
  });

  it('should get all key from cloud', () => {
      httpClientSpy = spyOn(openService['httpClient'], 'get');
      httpClientSpy.and.returnValue(of({}));
      openService.getAllkey();
      expect(openService['httpClient'].get).toHaveBeenCalled();
  });

  it('should get all draws from cloud', () => {
      httpClientSpy = spyOn(openService['httpClient'], 'get');
      httpClientSpy.and.returnValue(of({}));
      openService.getAllSvgFromCloud();
      expect(openService['httpClient'].get).toHaveBeenCalled();
  });

  it('should delete draw from data base', () => {
      httpClientSpy = spyOn(openService['httpClient'], 'delete');
      httpClientSpy.and.returnValue(of({}));
      openService.deleteDrawingFromDataBase('test');
      expect(openService['httpClient'].delete).toHaveBeenCalled();
  });

  it('should delete draw from cloud', () => {
      httpClientSpy = spyOn(openService['httpClient'], 'delete');
      httpClientSpy.and.returnValue(of({}));
      openService.deleteDrawingFromCloud('test');
      expect(openService['httpClient'].delete).toHaveBeenCalled();
  });

  it('should be created', () => {
    expect(openService).toBeTruthy();
  });

  it('should get all draws from data base', () => {
    httpClientSpy = spyOn(openService['httpClient'], 'get');
    httpClientSpy.and.returnValue(of({}));
    openService.getAllSvgFromDataBase();
    expect(openService['httpClient'].get).toHaveBeenCalled();
  });

  it('should delete draw from data base', () => {
    httpClientSpy = spyOn(openService['httpClient'], 'delete');
    httpClientSpy.and.returnValue(of({}));
    openService.deleteDrawingFromCloud('test');
    expect(openService['httpClient'].delete).toHaveBeenCalled();
  });

  it('should throw error', () => {
    jasmine.createSpy('throwError').and.returnValue(of({}));
    expect(openService.errorHandler({} as HttpErrorResponse)).toBeTruthy();
  });

});
