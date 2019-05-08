import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './flow.routing';

import { TagInputModule } from 'ngx-chips';
import { NvD3Module } from 'ng2-nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import { DataTableModule } from 'angular2-datatable';

import { FlowComponent } from './flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';

import { SearchComponent } from './components/search/search.component';
import { SearchProcessComponent } from './components/searchprocess/searchprocess.component';
import { ProcessAuditComponent } from './components/processaudit/processaudit.component';
import { DesignComponent } from './components/design/design.component';


import 'd3';
import 'nvd3';
import * as moment from 'moment/moment';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    TagInputModule,
    Daterangepicker,
    MomentModule,
    NvD3Module,
    DataTableModule,
    SharedModule
  ],
  declarations: [
    FlowComponent,
    DashboardComponent,
    DateRangePickerComponent,
    SearchComponent,
    DesignComponent,
    SearchProcessComponent,
    ProcessAuditComponent
  ]
})
export class FlowModule { }