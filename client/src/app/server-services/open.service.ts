import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const URL_SERVER = 'http://' + window.location.hostname + ':3000/api/';
const URL_DATABASE = URL_SERVER + 'database/';
const URL_CLOUD = URL_SERVER + 'cloud/';
const GET_SVGDB_REQUEST = 'svgdrawings';
const GET_KEY_REQUEST = 'svgdrawings/keys';
const DELETE_SVGDB_REQUEST = 'delete/';

@Injectable({
  providedIn: 'root',
})
export class OpenService {
  constructor(private httpClient: HttpClient) {
  }

  getAllSvgFromDataBase() {
    return this.httpClient.get(URL_DATABASE + GET_SVGDB_REQUEST)
      .pipe(catchError(this.errorHandler));
  }

  getAllSvgFromCloud() {
    return this.httpClient.get(URL_CLOUD + GET_SVGDB_REQUEST)
                          .pipe(catchError(this.errorHandler));
  }

  getAllkey() {
    return this.httpClient.get(URL_CLOUD + GET_KEY_REQUEST)
                          .pipe(catchError(this.errorHandler));
  }

  deleteDrawingFromDataBase(newImage: string) {
    return this.httpClient.delete(URL_DATABASE + DELETE_SVGDB_REQUEST + newImage)
      .pipe(catchError(this.errorHandler));
  }

  deleteDrawingFromCloud(newImage: string) {
    return this.httpClient.delete(URL_CLOUD + DELETE_SVGDB_REQUEST + newImage)
                          .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
