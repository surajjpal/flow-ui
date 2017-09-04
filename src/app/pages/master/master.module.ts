import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './master.routing';

import { MasterComponent } from './master.component';
import { UserComponent } from './components/user/user.component';
import { UserFilterPipe } from './components/user/data-filter.pipe';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';
import { RouteFilterPipe } from './components/routelink/data-filter.pipe';

import { UserService, RoutesService } from './master.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule,
    routing
  ],
  declarations: [
    MasterComponent,
    UserComponent,
    UserFilterPipe,
    UpdateUserComponent,
    RoutelinkComponent,
    RouteFilterPipe
  ],
  providers: [
    UserService,
    RoutesService
  ]
})
export class MasterModule { }
