import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { User, UserHierarchy,UserGraphObject } from '../models/user.model'
import { environment } from '../../environments/environment';
import { State } from 'ngx-chips/dist/modules/core';




@Injectable()
export class FetchUserService {
    constructor(private httpClient: HttpClient) { }
  fetchUsers(): Observable<UserHierarchy[]> {
    const subject = new Subject<UserHierarchy[]>();
    
    
    var url = `${environment.server + environment.userlisturl}`;
    
    this.httpClient.get<UserHierarchy[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<UserHierarchy[]>) => {
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

    return subject.asObservable();
  }

  fetchChildUsers(userId): Observable<UserHierarchy[]> {
    const subject = new Subject<UserHierarchy[]>();
    
    
    var url = `${environment.server + environment.userlisturl + userId}/childUsers`;
    
    this.httpClient.get<UserHierarchy[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<UserHierarchy[]>) => {
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

    return subject.asObservable();
  }
  getUserHierarchy(id): Observable<UserHierarchy> {
    const subject = new Subject<UserHierarchy>();
    
    
    var url = `${environment.server + environment.getuserhierarchy + id}/userHierarchy`;
    
    this.httpClient.get<UserHierarchy>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<UserHierarchy>) => {
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

    return subject.asObservable();
  }



}


@Injectable()
export class UserGraphService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private httpClient: HttpClient) { }

  saveUserGraphObject(userGraphObject: UserGraphObject): Observable<UserGraphObject> {

    
    const subject = new Subject<UserGraphObject>();

    if (userGraphObject) {
      const url = `${environment.server + environment.usergraphurl}`;

      if (userGraphObject._id && userGraphObject._id.length > 0) {
        this.httpClient.put<UserGraphObject>(
          url,
          userGraphObject,
          {
            headers: this.httpHeaders,
            observe: 'response',
            reportProgress: true,
            withCredentials: true
          }
        ).subscribe(
          (response: HttpResponse<UserGraphObject>) => {
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
        this.httpClient.post<UserGraphObject>(
          url,
          userGraphObject,
          {
            headers: this.httpHeaders,
            observe: 'response',
            reportProgress: true,
            withCredentials: true
          }
        ).subscribe(
          (response: HttpResponse<UserGraphObject>) => {
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
      }
    } else {
      subject.error('GraphObject is null or empty');
    }

    return subject.asObservable();
  }

  saveUserHierarchy(userHirearchy: UserHierarchy[]): Observable<UserHierarchy[]> {
    
        
        const subject = new Subject<UserHierarchy[]>();
    
        if (userHirearchy) {
          const url = `${environment.server + environment.savehierarchy}`;
          this.httpClient.post<UserHierarchy[]>(
              url,
              userHirearchy,
              {
                headers: this.httpHeaders,
                observe: 'response',
                reportProgress: true,
                withCredentials: true
              }
            ).subscribe(
              (response: HttpResponse<UserHierarchy[]>) => {
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
          subject.error('GraphObject is null or empty');
        }
    
        return subject.asObservable();
      }


     

  getUserGraph(id): Observable<UserGraphObject> {
    const subject = new Subject<UserGraphObject>();
    
    
    var url = `${environment.server + environment.getusergraphurl + id}/getUserGraph`;
    
    this.httpClient.get<UserGraphObject>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<UserGraphObject>) => {
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

    return subject.asObservable();
  }


  deleteUserGraph(userGraphObject: UserGraphObject): Observable<any> {
    const subject = new Subject<any>();

    if (userGraphObject && userGraphObject._id && userGraphObject._id.length > 0) {
      const url = `${environment.server + environment.getusergraphurl + userGraphObject._id}/delete`;

      this.httpClient.delete<any>(
        url,
        {
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<any>) => {
          subject.next(response);
        },
        (err: HttpErrorResponse) => {
          // All errors are handled in ErrorInterceptor, no further handling required
          // Unless any specific action is to be taken on some error

          subject.error(err);
        }
        );
    } else {
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }


}


@Injectable()
export class AllocateTaskToUser {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private httpClient: HttpClient) { }

  allocateTask(userId,stateId,type):Observable<State> {
    const subject = new Subject<State>();
    
   
    var url = `${environment.server + environment.alocateuserurl}/${stateId}/${userId}/${type}`;
    console.log(url)
    this.httpClient.get<any>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<State>) => {
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
    console.log(subject)
    return subject.asObservable();
  }
}