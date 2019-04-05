import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { State,CommonInsightWrapper } from '../models/tasks.model';
import { GraphObject,ProcessModel,CommonSearchModel } from '../models/flow.model';
import { Dashboard } from '../models/dashboard.model';
import { ApiConfig } from '../models/setup.model';

import { environment } from '../../environments/environment';
import { AsyncAction } from 'rxjs/scheduler/AsyncAction';
import { Entity } from '../models/datamodel.model';

@Injectable()
export class EntityService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  getEntityList(pageNumber: any, fetchRecords: any): Observable<Entity[]> {
    const subject = new Subject<Entity[]>();

    const url = `${environment.server + environment.entityurl}${pageNumber},${fetchRecords}`;

    this.httpClient.get<Entity[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Entity[]>) => {
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

  saveEntity(entity?: Entity): Observable<Entity> {
    const subject = new Subject<Entity>();

    const url = `${environment.server + environment.entitysaveurl}`;

    this.httpClient.post<Entity>(
      url,
      entity,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Entity>) => {
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


  updateEntity(entity?: Entity): Observable<Entity> {
    const subject = new Subject<Entity>();

    const url = `${environment.server + environment.entitysaveurl}`;

    this.httpClient.put<Entity>(
      url,
      entity,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Entity>) => {
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


  getEntity(id?:string): Observable<Entity> {
    const subject = new Subject<Entity>();

    const url = `${environment.server + environment.entityurl + id}`;

    this.httpClient.get<Entity>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Entity>) => {
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
