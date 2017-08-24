import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './flow.routing';

import { NvD3Module } from 'ng2-nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import { DataTableModule } from 'angular2-datatable';

import { FlowComponent } from './flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { SearchComponent } from './components/search/search.component';
import { DataFilterPipe } from './components/search/data-filter.pipe';
import { DesignComponent } from './components/design/design.component';

import { DashboardService, GraphService, CommunicationService } from './flow.service';

import 'd3';
import 'nvd3';
import * as moment from 'moment/moment';

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
    FlowComponent,
    DashboardComponent,
    DateRangePickerComponent,
    SearchComponent,
    DataFilterPipe,
    DesignComponent
  ],
  providers: [
    DashboardService,
    GraphService,
    CommunicationService
  ]
})
export class FlowModule { }