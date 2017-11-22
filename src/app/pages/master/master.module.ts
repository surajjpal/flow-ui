import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { TagInputModule } from 'ngx-chips';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './master.routing';

import { MasterComponent } from './master.component';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';
import { ApiConfigComponent } from './components/apiConfig/apiConfig.component';
import { ApiConfigSetupComponent } from './components/apiConfigSetup/apiConfigSetup.component';

import { UserService, RoutesService, ApiConfigService, AccountService } from './master.service';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule,
    routing,
    TagInputModule,
    SharedModule
  ],
  declarations: [
    MasterComponent,
    AccountCreationComponent,
    UserComponent,
    UpdateUserComponent,
    RoutelinkComponent,
    ApiConfigComponent,
    ApiConfigSetupComponent
  ],
  providers: [
    UserService,
    RoutesService,
    ApiConfigService,
    AccountService
  ]
})
export class MasterModule { }
