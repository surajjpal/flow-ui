import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthGuard, AntiAuthGuard, UserBroadcastService, AuthService,
          AlertService, DataSharingService, UniversalUser } from './shared.service';
import { AlertComponent } from './shared.component';
import { UniversalFilterPipe } from './universal-data-filter.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent,
    UniversalFilterPipe
  ],
  providers: [
    AuthGuard,
    AntiAuthGuard,
    UserBroadcastService,
    AuthService,
    AlertService,
    DataSharingService,
    UniversalUser
  ],
  exports: [
    AlertComponent,
    UniversalFilterPipe
  ]
})
export class SharedModule { }
