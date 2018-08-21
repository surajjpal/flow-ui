import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';
import { NgaModule } from '../../theme/nga.module';

import { routing } from './inbox.routing';
import { InboxComponent } from './inbox.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { ArchiveMasterComponent } from './components/archivedmaster/archivedmaster.component'
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';
import { TeamViewComponent} from './components/teamView/teamView.component';
import { PersonalComponent} from './components/personal/personal.component';
import { DashboardComponent} from './components/dashboard/dashboard.component';
import { ApiTableModule } from './components/api_table/apitable.module';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { SharedModule } from '../../shared/shared.module';

import { MomentModule } from 'angular2-moment';
import * as moment from 'moment/moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    TagInputModule,
    ApiTableModule,
    DataTableModule,
    SharedModule,
    MomentModule,
    Daterangepicker
  ],
  declarations: [
    InboxComponent,
    ActiveComponent,
    ArchivedComponent,
    ArchiveMasterComponent,
    TaskDetailsComponent,
    TeamViewComponent,
    PersonalComponent,
    DateRangePickerComponent,
    DashboardComponent
    
  ]
})
export class InboxModule { }
