import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './inbox.routing';
import { InboxComponent } from './inbox.component';
import { StateService } from './inbox.service';

import { TasksComponent } from './components/tasks/tasks.component';
import { ApiTableModule } from './components/api_table/apitable.module';
// import { DataFilterPipe } from './components/api_table/data-filter.pipe';
// import { DataFilterPipe } from '../flow/components/search/data-filter.pipe';
// import { ApiTableComponent } from './components/api_table/apitable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    ApiTableModule,
    DataTableModule
  ],
  declarations: [
    InboxComponent,
    TasksComponent
  ],
  providers: [
    StateService
  ]
})
export class InboxModule { }
