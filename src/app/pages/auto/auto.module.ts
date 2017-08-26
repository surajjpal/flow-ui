import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';
import { DataTableModule } from 'angular2-datatable';

import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment/moment';

import { routing } from './auto.routing';
import { AutoComponent } from './auto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { DashboardService, ConversationService } from './auto.service';
import { DataFilterPipe } from './components/conversation/data-filter.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Daterangepicker,
    MomentModule,
    NvD3Module,
    DataTableModule
  ],
  declarations: [
    AutoComponent,
    DashboardComponent,
    ConversationComponent,
    DateRangePickerComponent,
    DataFilterPipe
  ],
  providers: [
    DashboardService,
    ConversationService
  ]
})
export class AutoModule { }
