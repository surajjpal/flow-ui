import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';
import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment/moment';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './agent.routing';

import { AgentComponent } from './agent.component';
import { AgentCreationComponent } from './components/agent/agentCreation.component';
import { AgentsComponent } from './components/agents/agents.component';


import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { MyDatePickerModule } from 'mydatepicker';
import { SharedModule } from '../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule,
    routing,
    Daterangepicker,
    MomentModule,
    NvD3Module,
    TagInputModule,
    SharedModule,
    MyDatePickerModule
  ],
  declarations: [
    AgentComponent,
    AgentCreationComponent,
    AgentsComponent,
    DashboardComponent,
    ConversationComponent,
    DateRangePickerComponent
  ]
})
export class AgentModule { }
