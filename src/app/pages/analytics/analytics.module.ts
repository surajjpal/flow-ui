import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { DataTableModule } from 'angular2-datatable';
import { TagInputModule } from 'ngx-chips';
import { Daterangepicker } from 'ng2-daterangepicker';
import * as moment from 'moment/moment';
import { AnalyticsComponent } from './analytics.component';
import { AnalyticsReportSetupComponent } from './components/analyticsReportSetup/analyticsReportSetup.component';
import { routing } from './analytics.routing';
import { DateRangePickerComponent } from './components/analyticsReportSetup/daterangepicker/daterangepicker.component';



@NgModule({
    imports : [
        CommonModule,
        FormsModule,
        DataTableModule,
        TagInputModule,
        Daterangepicker,
        routing,
        NgbModule.forRoot()
    ],
    declarations: [
        AnalyticsComponent,
        AnalyticsReportSetupComponent,
        DateRangePickerComponent
    
    ]
})
export class AnalyticsModule {}