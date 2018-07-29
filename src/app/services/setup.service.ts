import { Injectable } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../environments/environment';
import { RoleRouteMap, ApiConfig,ConnectorInfo,ConnectorConfig } from '../models/setup.model';
import { Account } from '../models/account.model';
import { UniversalUser } from './shared.service';

@Injectable()
export class RoutesService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private router: Router, private httpClient: HttpClient, private universalUser: UniversalUser) { }

  routes(): Observable<Routes> {
    const subject = new Subject<Routes>();
    
    const loggedinuser = this.universalUser.getUser();
    const url = `${environment.server + environment.menurouteurl}`;

    this.httpClient.post<Routes>(
      url,
      loggedinuser,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Routes>) => {
        if (response.body) {
         // console.log(response.body)
          subject.next(response.body);
        }
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
      );
    console.log(subject.asObservable());
    return subject.asObservable();
  }
  
  getAllRoutes(): Observable<RoleRouteMap[]> {
    const subject = new Subject<RoleRouteMap[]>();

    const url = `${environment.server + environment.roleroutemapurl}`;

    this.httpClient.get<RoleRouteMap[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<RoleRouteMap[]>) => {
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

  createRoute(roleRouteMap: RoleRouteMap): Observable<RoleRouteMap> {
    const subject = new Subject<RoleRouteMap>();

    if (roleRouteMap) {
      roleRouteMap._id = null;

      const url = `${environment.server + environment.roleroutemapurl}`;

      this.httpClient.post<RoleRouteMap>(
        url,
        roleRouteMap,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<RoleRouteMap>) => {
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
      subject.error('Object is null');
    }

    return subject.asObservable();
  }

  updateRoute(roleRouteMap: RoleRouteMap): Observable<RoleRouteMap> {
    const subject = new Subject<RoleRouteMap>();

    if (roleRouteMap && roleRouteMap._id && roleRouteMap._id.length > 0) {
      const url = `${environment.server + environment.roleroutemapurl}`;

      this.httpClient.put<RoleRouteMap>(
        url,
        roleRouteMap,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<RoleRouteMap>) => {
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
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }

  deleteRoute(roleRouteMap: RoleRouteMap): Observable<any> {
    const subject = new Subject<any>();

    if (roleRouteMap && roleRouteMap._id && roleRouteMap._id.length > 0) {
      const url = `${environment.server + environment.roleroutemapurl}/${roleRouteMap._id}`;
      
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

  rolesMaster(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.rolesurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<string[]>) => {
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

  routesMaster(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.routesurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<string[]>) => {
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
export class ApiConfigService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private router: Router, private httpClient: HttpClient) { }

  getAllApi(): Observable<ApiConfig[]> {
    const subject = new Subject<ApiConfig[]>();

    const url = `${environment.server + environment.apiconfigurl}`;

    this.httpClient.get<ApiConfig[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<ApiConfig[]>) => {
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

  createApiConfig(apiConfig: ApiConfig): Observable<ApiConfig> {
    const subject = new Subject<ApiConfig>();

    if (apiConfig) {
      apiConfig._id = null;
      const url = `${environment.server + environment.apiconfigurl}`;

      this.httpClient.post<ApiConfig>(
        url,
        apiConfig,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<ApiConfig>) => {
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
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }

  updateApiConfig(apiConfig: ApiConfig): Observable<ApiConfig> {
    const subject = new Subject<ApiConfig>();

    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      const url = `${environment.server + environment.apiconfigurl}`;

      this.httpClient.put<ApiConfig>(
        url,
        apiConfig,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<ApiConfig>) => {
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
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }

  deleteApiConfig(apiConfig: ApiConfig): Observable<any> {
    const subject = new Subject<any>();

    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      const url = `${environment.server + environment.apiconfigurl + apiConfig._id}`;

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

  getSupportedMethods(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.server + environment.supportedmethodsurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<string[]>) => {
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
export class FileService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private router: Router, private httpClient: HttpClient) { }
  upload(formData: FormData): Observable<any> {
    const subject = new Subject<any>();
    const url = `${environment.interfaceService + environment.fileUploadUrl}`;
    if (formData) {
      this.httpClient.post<any>(
        url,
        formData,
        {
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

@Injectable()
export class ConnectorConfigService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private router: Router, private httpClient: HttpClient) { }
  getConnecterInfo(): Observable<ConnectorInfo[]> {
    const subject = new Subject<ConnectorInfo[]>();

    const url = `${environment.server + environment.connectorinfo}`;

    this.httpClient.get<ConnectorInfo[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<ConnectorInfo[]>) => {
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

  

  getAllCons(): Observable<ConnectorConfig[]> {
    const subject = new Subject<ConnectorConfig[]>();

    const url = `${environment.server + environment.getallconconfig}`;

    this.httpClient.get<ConnectorConfig[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<ConnectorConfig[]>) => {
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

  createConConfig(connectorConfig: ConnectorConfig): Observable<ConnectorConfig> {
    const subject = new Subject<ConnectorConfig>();

    if (connectorConfig) {
      connectorConfig._id = null;
      const url = `${environment.server + environment.saveconconfig}`;

      this.httpClient.post<ConnectorConfig>(
        url,
        connectorConfig,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<ConnectorConfig>) => {
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
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }

  updateConConfig(connectorConfig: ConnectorConfig): Observable<ConnectorConfig> {
    const subject = new Subject<ConnectorConfig>();

    if (connectorConfig) {
      const url = `${environment.server + environment.saveconconfig}`;

      this.httpClient.put<ConnectorConfig>(
        url,
        connectorConfig,
        {
          headers: this.httpHeaders,
          observe: 'response',
          reportProgress: true,
          withCredentials: true
        }
      )
        .subscribe(
        (response: HttpResponse<ConnectorConfig>) => {
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
      subject.error('Object is null or invalid');
    }

    return subject.asObservable();
  }

  deleteConConfig(connectorConfig: ConnectorConfig): Observable<any> {
    const subject = new Subject<any>();

    if (connectorConfig && connectorConfig._id && connectorConfig._id.length > 0) {
      const url = `${environment.server + environment.deleteconconfig + connectorConfig._id}`;

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

  getConnectorInfos(type:string): Observable<ConnectorInfo[]> {
    const subject = new Subject<ConnectorInfo[]>();
    
    const url = `${environment.server + environment.getallconinfo + type}`;

    this.httpClient.get<ConnectorInfo[]>(
      url,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<ConnectorInfo[]>) => {
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

  getConnectorConfigByRef(configRef:string): Observable<ConnectorInfo[]> {
    const subject = new Subject<ConnectorInfo[]>();
    
    const url = `${environment.server + environment.getbyconfigref + configRef}`;

    this.httpClient.get<ConnectorInfo[]>(
      url,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<ConnectorInfo[]>) => {
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
export class AccountService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private router: Router, private httpClient: HttpClient) { }

  saveAccount(account: Account): Observable<Account> {
    const subject = new Subject<Account>();

    const url = `${environment.saveaccounturl}`;

    this.httpClient.post<Account>(
      url,
      account,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account>) => {
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

  updateAccount(account: Account): Observable<Account> {
    const subject = new Subject<Account>();

    const url = `${environment.saveaccounturl}`;

    this.httpClient.put<Account>(
      url,
      account,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account>) => {
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

  publishAccount(account: Account): Observable<Account> {
    const subject = new Subject<Account>();

    const url = `${environment.publishaccounturl + account._id}`;

    this.httpClient.get<Account>(
      url,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account>) => {
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


  unpublishAccount(account: Account): Observable<Account> {
    const subject = new Subject<Account>();

    const url = `${environment.unpublishaccounturl + account._id}`;

    this.httpClient.get<Account>(
      url,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account>) => {
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

  getAccountById(companyId: string): Observable<Account> {
    const subject = new Subject<Account>();

    const url = `${environment.fetchaccountbyidurl + companyId}`;

    this.httpClient.get<Account[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account[]>) => {
        if (response.body) {
          const accounts: Account[] = response.body;

          // Currenlty service sends array of Account even though it has single object in it.
          // So we are extracting object out of array in case array size is greater than 0.
          // TODO: Once service is updated, expect object in api response and remove parsing.

          if (accounts && accounts.length > 0) {
            subject.next(accounts[0]);
          } else {
            subject.next(null);
          }
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

  getAllAccounts(): Observable<Account[]> {
    const subject = new Subject<Account[]>();

    const url = `${environment.fetchaccountbyidurl}`;

    this.httpClient.get<Account[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    )
      .subscribe(
      (response: HttpResponse<Account[]>) => {
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
