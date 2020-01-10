import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SvgImage } from '../../../../common/SvgImage';

const URL_SERVER = 'http://' + window.location.hostname + ':3000/api/';
const URL_DATABASE = URL_SERVER + 'database/';
const URL_CLOUD = URL_SERVER + 'cloud/';
const SAVE_SVG_DATABASE = 'svgdrawings/';
const GET_KEY_REQUEST = 'svgdrawings/keys';

@Injectable({
  providedIn: 'root',
})

export class SaveService {
  constructor(private httpClient: HttpClient) {
  }

  saveDrawInDataBase(newImage: SvgImage) {
    return this.httpClient.post(URL_DATABASE + SAVE_SVG_DATABASE, newImage)
      .pipe(catchError(this.errorHandler));
  }

  saveDrawInCloud(newImage: SvgImage) {
    return this.httpClient.post(URL_CLOUD + SAVE_SVG_DATABASE, newImage)
    .pipe(catchError(this.errorHandler));
  }

  getAllkey() {
    return this.httpClient.get(URL_CLOUD + GET_KEY_REQUEST)
                          .pipe(catchError(this.errorHandler));
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }
}
