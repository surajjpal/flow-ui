import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { NvD3Module } from 'ng2-nvd3';
import 'd3';
import 'nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import * as moment from 'moment/moment';

import { routing } from './auto.routing';
import { AutoComponent } from './auto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { DashboardService } from './auto.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    Daterangepicker,
    MomentModule,
    NvD3Module
  ],
  declarations: [
    AutoComponent,
    DashboardComponent,
    DateRangePickerComponent
  ],
  providers: [
    DashboardService
  ]
})
export class AutoModule { }
