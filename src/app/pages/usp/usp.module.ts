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

import { routing } from './usp.routing'
import { USPComponent } from './usp.component'
import { USPSearchComponent } from './components/uspsearch/uspsearch.component'


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
        USPComponent,
        USPSearchComponent
    ]

})
export class USPModule { }