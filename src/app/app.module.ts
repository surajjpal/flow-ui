import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
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

import { AuthGuard, AntiAuthGuard, UserBroadcastService, AuthService,
  AlertService, DataSharingService, UniversalUser } from './shared/shared.service';
import { SharedModule } from './shared/shared.module';

import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { AngularFontAwesomeModule } from 'angular-font-awesome/angular-font-awesome';

// Application wide providers
const APP_PROVIDERS = [
  AppState,
  GlobalState,
  AuthGuard,
  AntiAuthGuard,
  UserBroadcastService,
  AuthService,
  AlertService,
  DataSharingService,
  UniversalUser
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
    SharedModule
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
