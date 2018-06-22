import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FileUploaderService {
  constructor(private httpClient: HttpClient) { }

  upload(fileData: FormData, url: string, headers: HttpHeaders): Observable<any> {
    const subject = new Subject<any>();
    console.log("upload file");
    console.log(fileData.get("file"));

    if (fileData) {
      this.httpClient.post<any>(
        url,
        fileData,
        {
          headers: headers,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      ).subscribe(
        (response: HttpResponse<any>) => {
          if (response.body) {
            subject.next(response.body);
          }
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
      );
    } else {
      subject.error('File is null or empty');
    }

    return subject.asObservable();
  }
}
