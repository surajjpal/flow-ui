import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Domain } from '../models/domain.model';
import { Agent } from '../models/agent.model';
import { Episode, ChatMessage } from '../models/conversation.model';
import { environment } from '../../environments/environment';
import { DomainService } from './domain.service';
import { CRUDOperationInput } from '../models/crudOperationInput.model';
import { UniversalUser } from './shared.service';

@Injectable()
export class AgentService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient, private domainService: DomainService) { }

  domainLookup(query?: string): Observable<Domain[]> {
    return this.domainService.domainLookup(query);
  }

  agentLookup(query?: string): Observable<Agent[]> {
    const subject = new Subject<Agent[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = new Map<any, any>();
    crudInput.collection = 'agent';
    crudInput.operation = "READ_ALL";

    this.httpClient.post<Map<string, Agent[]>>(
      crudUrl,
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Map<string, Agent[]>>) => {
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

  saveAgent(agent: Agent): Observable<any> {
    const subject = new Subject<any>();

    if (agent.agentDomain !== null) {
      agent.agentDomain = null;
    }

    const crudInput = new CRUDOperationInput();
    crudInput.payload = agent;
    crudInput.collection = 'agent';
    if (agent._id !== null) {
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
  }

  agentLookup(query?: string): Observable<Agent[]> {
    const subject = new Subject<Agent[]>();

    if (!query || query.length <= 0) {
      query = 'ALL';
    }

    const url = `${environment.autoServer + environment.fetchagenturl + query}`;

    this.httpClient.get<Agent[]>(
      url,
      {
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Agent[]>) => {
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

  saveAgent(agent: Agent): Observable<any> {
    const subject = new Subject<any>();

    if (agent.agentDomain !== null) {
      agent.agentDomain = null;
    }

    const url = `${environment.autoServer + environment.saveagenturl}`;

    this.httpClient.post<any>(
      url,
      agent,
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
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////


@Injectable()
export class AgentDashboardService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private httpClient: HttpClient) { }

  fetchSummary(body: any): Observable<any> {
    const subject = new Subject<any>();

    body['operation'] = "get_dashboard_summary";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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
  }



  fetchEpisodeTimeline(body: any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_episode_timeline";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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
  }


  fetchIntentCount(body: any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_intent_count";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;


    this.httpClient.post<any>(
      url,
      body,
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
  }


  fetchEntityCount(body: any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_entity_count";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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
  }


  fetchSentimentCount(body: any): Observable<any> {
    const subject = new Subject<any>();
    body['operation'] = "get_sentiment_count";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;


    this.httpClient.post<any>(
      url,
      body,
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
  }


  fetchGoalCount(body: any): Observable<any> {
    const subject = new Subject<any>();

    body['operation'] = "get_goal_count_effeciency";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;


    this.httpClient.post<any>(
      url,
      body,
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
  }

  fetchEpisodeMessages(body: any): Observable<any> {
    const subject = new Subject<any>();

    body['operation'] = "get_episode_messages";
    body['dashboard'] = "auto"
    const url = `${environment.dashboardinterface}`;

    this.httpClient.post<any>(
      url,
      body,
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
  }

}

@Injectable()
export class ConversationService {
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(
    private httpClient: HttpClient,
    private universalUser: UniversalUser
  ) { }

  getChat(episodeId: string): Observable<ChatMessage[]> {
    const subject = new Subject<ChatMessage[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = {
      'episodeId': episodeId
    };
    crudInput.collection = 'message';
    crudInput.operation = "READ_ALL";

    this.httpClient.post<ChatMessage[]>(
      crudUrl,
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<ChatMessage[]>) => {
        if (response.body) {
          let messageList: ChatMessage[] = response.body['data'];

          if (messageList && messageList.length > 1) {
            messageList = messageList.sort((msg1, msg2) => {
              const date1 = new Date(msg1.messageTime);
              const date2 = new Date(msg2.messageTime);

              if (date1 > date2) {
                return 1;
              } else if (date1 < date2) {
                return -1;
              } else {
                return 0;
              }
            });
          }

          subject.next(messageList);
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

  getEpisode(episodeId: string): Observable<Episode> {
    const subject = new Subject<Episode>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();
    crudInput.payload = {
      '_id': episodeId
    };
    crudInput.collection = 'episode';
    crudInput.operation = "READ";

    this.httpClient.post<Episode>(
      crudUrl,
      crudInput,
      {
        headers: this.httpHeaders,
        observe: 'response',
        reportProgress: true,
        withCredentials: true
      }
    ).subscribe(
      (response: HttpResponse<Episode>) => {
        if (response.body) {
          subject.next(response.body['data']);
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

  getEpisodesForBargeIn(missedExpressionTheshold: number): Observable<Episode[]> {
    const subject = new Subject<Episode[]>();

    const crudUrl = `${environment.interfaceService + environment.crudFunction}`;
    const crudInput = new CRUDOperationInput();

    crudInput.payload = {
      '$and': [
        { 'statusCd': { '$exists': true } },
        { 'episodeContext': { '$exists': true } },
        { 'episodeContext.missedExpressionCount': { '$exists': true } },
        { 'statusCd': 'ACTIVE' },
        { 'episodeContext.missedExpressionCount': { '$gte': missedExpressionTheshold } },
        {
          '$or': [
            {
              '$and': [
                {
                  '$or': [
                    { 'alreadyBargedIn': { '$exists': false } },
                    { 'alreadyBargedIn': null },
                    { 'alreadyBargedIn': false }
                  ]
                },
                {
                  '$or': [
                    { 'bargedInAgentId': { '$exists': false } },
                    { 'bargedInAgentId': null },
                    { 'bargedInAgentId': '' }
                  ]
                }
              ]
            },
            {
              '$and': [
                { 'alreadyBargedIn': { '$exists': true } },
                { 'bargedInAgentId': { '$exists': true } },
                { 'alreadyBargedIn': true },
                { 'bargedInAgentId': this.universalUser.getUser()._id },
              ]
            }
          ]
        },
      ]
    };

    crudInput.fields = {
      '_id': 1,
      'episodeContext.missedExpressionCount': 1,
      'modifiedTime': 1,
      'alreadyBargedIn': 1,
      'bargedInAgentId': 1
    };
    crudInput.collection = 'episode';
    crudInput.operation = "READ_ALL";

    this.httpClient.post<Episode[]>(
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
          subject.next(response.body['data']);
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

  saveEpisode(episode: Episode): Observable<any> {
    const subject = new Subject<any>();

    const crudInput = new CRUDOperationInput();
    crudInput.payload = episode;
    crudInput.collection = 'episode';
    crudInput.operation = "UPDATE";
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
        subject.error(err);
      }
    );
    return subject.asObservable();
  }

  sendAgentMessage(messagePayload: any): Observable<any> {
    const subject = new Subject<any>();

    const url = `${environment.interfaceService + environment.sendAgentMessage}`;
    this.httpClient.post<any>(
      url, 
      messagePayload,
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
  }
}
