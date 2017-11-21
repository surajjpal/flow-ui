import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './inbox.routing';
import { InboxComponent } from './inbox.component';
import { StateService, DataSharingService } from './inbox.service';

import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';
import { ApiTableModule } from './components/api_table/apitable.module';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ApiTableModule,
    DataTableModule,
    SharedModule
  ],
  declarations: [
    InboxComponent,
    ActiveComponent,
    ArchivedComponent,
    TasksComponent,
    TaskDetailsComponent
  ],
  providers: [
    StateService,
    DataSharingService
  ]
})
export class InboxModule { }
