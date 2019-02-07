import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Domain } from '../models/domain.model';
import { environment } from '../../environments/environment';
import { CRUDOperationInput } from '../models/crudOperationInput.model';

@Injectable()
export class DomainService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  constructor(private httpClient: HttpClient) { }
  
  modelKeysLookup(): Observable<string[]> {
    const subject = new Subject<string[]>();

    const url = `${environment.autoServer + environment.modelkeyslookupurl}`;

    this.httpClient.get<string[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
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

  getDomainById(_id: String) : Observable<Domain> {
    const subject = new Subject<Domain>();
    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = new Map<any, any>();
    crudInput.collection = 'domain';
    crudInput.operation = "READ";
    crudInput.payload = {"_id" : _id};
    this.httpClient.post<Map<string, Domain[]>>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Domain[]>>) => {
        subject.next(response.body['data']);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  domainLookupByPage(pageNo: number, pageSize: number, fields: String[]) : Observable<Domain[]> {
    const subject = new Subject<Domain[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = new Map<any, any>();
    crudInput.collection = 'domain';
    crudInput.operation = "READ_ALL";
    crudInput.page = pageNo;
    crudInput.pageSize = pageSize;
    crudInput.fields = fields;
    
    this.httpClient.post<Map<string, Domain[]>>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Domain[]>>) => {
        subject.next(response.body['data']);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  domainLookup(payload?: any): Observable<Domain[]> {
    const subject = new Subject<Domain[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = payload;
    crudInput.collection = 'domain';
    crudInput.fields = ["name","_id","langSupported","version","statusCd"]
    crudInput.operation = "READ_ALL";
    crudInput["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    
    this.httpClient.post<Map<string, Domain[]>>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Domain[]>>) => {
        subject.next(response.body['data']);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  getDomain(payload?: any,fields?:any): Observable<Domain> {
    const subject = new Subject<Domain>();
    
    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = payload;
    crudInput.collection = 'domain';
    crudInput.operation = "READ";
    crudInput.fields = fields;
    crudInput["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    
    this.httpClient.post<Map<string, Domain>>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Domain>>) => {
        subject.next(response.body['data']);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  getFeatures(payload?: any): Observable<any> {
    const subject = new Subject<any>();
    
    const featureUrl = `${environment.fetaureurl}`;
    
   
    
    this.httpClient.post<any>(
      featureUrl, 
      payload,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<any>) => {
        subject.next(response.body);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }


  uploadFaq(payload?: any): Observable<any> {
    const subject = new Subject<any>();
    
    const featureUrl = `${environment.faqupload}`;
    
   
    
    this.httpClient.post<any>(
      featureUrl, 
      payload,
      {
        //headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<any>) => {
        subject.next(response.body);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }


  trainDt(payload?: any): Observable<any> {
    const subject = new Subject<any>();
    
    const trainurl = `${environment.traindt}`;
    
    this.httpClient.post<any>(
      trainurl, 
      payload,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<any>) => {
        subject.next(response.body["Success"]);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }

  converse(payload?: any): Observable<any> {
    const subject = new Subject<any>();
    
    const trainurl = `${environment.converse}`;
    
    this.httpClient.post<any>(
      trainurl, 
      payload,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<any>) => {
        subject.next(response.body);
      },
      (err: HttpErrorResponse) => {
        // All errors are handled in ErrorInterceptor, no further handling required
        // Unless any specific action is to be taken on some error

        subject.error(err);
      }
    );

    return subject.asObservable();
  }


  /*
  domainLookup(query?: string): Observable<Domain[]> {
    const subject = new Subject<Domain[]>();

    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.autoServer + environment.fetchdomainurl + query}`;

    this.httpClient.get<Domain[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Domain[]>) => {
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
  }*/

  deleteDomain(domainId?: string): Observable<any> {
    const subject = new Subject<any>();

    const crudInput = new CRUDOperationInput();
    crudInput.payload = {"_id":domainId};
    crudInput.collection = 'domain';
    crudInput["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    crudInput.operation = "DELETE";
    
    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    this.httpClient.post<any>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
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
        console.log(err);
        subject.error(err);
      }
    );
    return subject.asObservable();
  }


  saveDomain(domain: Domain): Observable<any> {
    const subject = new Subject<any>();

    const crudInput = new CRUDOperationInput();
    crudInput.payload = domain;
    crudInput.collection = 'domain';
    crudInput["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    if (domain._id !== null) {
      crudInput.operation = "UPDATE";
    } else {
      crudInput.operation = "CREATE";
    }
    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    this.httpClient.post<any>(
      crudUrl, 
      crudInput,
      {
        headers: this.httpHeaders,
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
        console.log(err);
        subject.error(err);
      }
    );
    return subject.asObservable();
  }

  /*
  saveDomain(domain: Domain): Observable<any> {
    const subject = new Subject<any>();

    const url = `${environment.autoServer + environment.savedomainurl}`;

    this.httpClient.post<any>(
      url,
      domain,
      {
        headers: this.httpHeaders,
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

    return subject.asObservable();
  }*/

  updateIntentTraining(domain: Domain): Observable<any> {
    const subject = new Subject<any>();
    let requestBody = new Map<string, string>();
    requestBody["domain"] = domain.name;
    requestBody["version"] = domain.version   // currently we do not have any versioning system
    const url = `${environment.updateIntentTraining}`;
    this.httpClient.post<any>(
      url,
      requestBody,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
     (response: HttpResponse<any>) => {
       if (response.status == 401) {
         subject.error("Unauthorized to train intents");
       }
       else{
         if (response.body !=null && response.body["result"] != null && response.body["result"]["train"]) {
           subject.next(response.body);
         }
         else{
           subject.error(response.body["result"]);
         }
       }
     },
     (err: HttpErrorResponse) => {
       subject.error(err);
     }
    )
    return subject.asObservable();
  }

  updateDomainClassifierTraining(domain: Domain): Observable<any> {
    const subject = new Subject<any>();
    let requestBody = new Map<string, string>();
    requestBody["companyContext"] = {"companyId":"6efe654013b041e79c5935e2228f34b2"}
    requestBody["domainId"] = domain._id;
    requestBody["version"] = domain.version   // currently we do not have any versioning system
    const url = `${environment.updateClassifierTraining}`;
    this.httpClient.post<any>(
      url,
      requestBody,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
     (response: HttpResponse<any>) => {
       if (response.status == 401) {
         subject.error("Unauthorized to train classifier");
       }
       else{
         if (response.body !=null && response.body["entityResult"] != null && response.body["intentResult"] != null) {
           subject.next(response.body);
         }
         else{
           subject.error(response.body);
         }
       }
     },
     (err: HttpErrorResponse) => {
       subject.error(err);
     }
    )
    return subject.asObservable();
  }


  updateEntityTraining(domain: Domain): Observable<any> {
    const subject = new Subject<any>();
    let requestBody = new Map<string, string>();
    requestBody["domain"] = domain.name;
    requestBody["version"] = domain.version   // currently we do not have any versioning system
    const url = `${environment.updateEntityTraining}`;
    this.httpClient.post<any>(
      url,
      requestBody,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
     (response: HttpResponse<any>) => {
       if (response.status == 401) {
         subject.error("Unauthorized to train intents");
       }
       else{
         if (response.body !=null && response.body["result"] != null && response.body["result"]["train"]) {
           subject.next(response.body);
         }
         else{
           subject.error(response.body["result"]);
         }
       }
     },
     (err: HttpErrorResponse) => {
       subject.error(err);
     }
    )
    return subject.asObservable();
  }

  
  
  getSynonyms(tag:string): Observable<any> {
    const subject = new Subject<any>();
    let request = {};
    request["word"] = tag;
    request["language"] = "ENG";
    request["category"] = "synonyms";
    const url = `${environment.vocabulary}`;

    this.httpClient.post<any>(
      url,
      request,
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

    return subject.asObservable();
  }
}
