import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

/*
 * Platform and Environment providers/directives/pipes
 */
import { routing } from './app.routing';

// App is our top level component
import { App } from './app.component';
import { AppState, InternalStateType } from './app.service';
import { GlobalState } from './global.state';
import { NgaModule } from './theme/nga.module';
import { PagesModule } from './pages/pages.module';
import { FetchUserService, UserGraphService } from './services/userhierarchy.service';
import { AuthService } from './services/auth.service';
import { AgentService, ConversationService, AgentDashboardService } from './services/agent.service';
import { DomainService } from './services/domain.service';
import { FlowDashboardService, GraphService, CommunicationService } from './services/flow.service';
import { MWRouteService } from './services/mwroute.service';
import { DataCachingService, StateService } from './services/inbox.service';
import { AccountService, ApiConfigService, RoutesService, FileService } from './services/setup.service';
import { ApiDesignService } from './services/apidesign.service';
import { AuthGuard, AntiAuthGuard, AlertService, DataSharingService, UniversalUser, ScrollService, DataModelObject } from './services/shared.service';
import { AnalyticsService } from './services/analytics.service';
import { ScheduleTaskService } from './services/scheduletasks.service';
import { ActivityMonitorService } from  './services/activitymonitor.service'
import { USPService } from './services/usp.service'
import { FileUploaderService } from './shared/services/file-uploader.service'
import { DataModelService } from './services/setup.service'
import { EntityService } from './services/entity.service'
import { SharedModule } from './shared/shared.module';

import { ErrorInterceptor } from './services/interceptors';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { FtcService } from './services/ftc.service';
import { FtcFlowService } from './services/ftcflow.service';

// Application wide providers
const APP_PROVIDERS = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  },
  AgentService, ConversationService, AgentDashboardService,
  DomainService,
  FlowDashboardService, GraphService, CommunicationService,
  MWRouteService,
  DataCachingService, StateService,
  AccountService, ApiConfigService, RoutesService, FetchUserService, UserGraphService,
  ApiDesignService, DataModelService, EntityService,
  AnalyticsService,
  ScheduleTaskService,
  ActivityMonitorService,
  USPService,
  AppState, GlobalState, AuthGuard, AntiAuthGuard, AuthService, AlertService, DataSharingService,DataModelObject, UniversalUser, FileUploaderService, ScrollService,
  FileService, FtcService, FtcFlowService
];

export type StoreType = {
  state: InternalStateType,
  restoreInputValues: () => void,
  disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [App],
  declarations: [
    App
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgaModule.forRoot(),
    NgbModule.forRoot(),
    PagesModule,
    routing,
    SlimLoadingBarModule.forRoot(),
    AngularFontAwesomeModule,
    SharedModule,
    ScrollToModule.forRoot()
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    APP_PROVIDERS
  ],
  exports: [
    SlimLoadingBarModule,
    SharedModule
  ]
})

export class AppModule {

  constructor(public appState: AppState) {
  }
}
