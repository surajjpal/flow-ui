import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './inbox.routing';
import { InboxComponent } from './inbox.component';

import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';
import { ApiTableModule } from './components/api_table/apitable.module';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    TagInputModule,
    ApiTableModule,
    DataTableModule,
    SharedModule
  ],
  declarations: [
    InboxComponent,
    ActiveComponent,
    ArchivedComponent,
    TaskDetailsComponent
  ]
})
export class InboxModule { }
