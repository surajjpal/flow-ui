import { NgModule } from "@angular/core";
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

import { SharedModule } from '../../shared/shared.module';

import { routing } from "./activitymonitor.routing"
import { ActivityMonitorComponent } from "./activitymonitor.component";
import { BusinessProcessMonitorcomponent } from "./components/businessprocessmonitor/businessprocessmonitor.component";
import { DateRangePickerComponent } from "./components/businessprocessmonitor/daterangepicker/daterangepicker.component"

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
        SharedModule
    ],

    declarations: [
        ActivityMonitorComponent,
        BusinessProcessMonitorcomponent,
        DateRangePickerComponent
    ]

})
export class ActivityMonitorModule { }