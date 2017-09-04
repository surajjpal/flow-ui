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
import { TagInputModule } from 'ngx-chips';

import { routing } from './auto.routing';
import { AutoComponent } from './auto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { DateRangePickerComponent } from './components/dashboard/daterangepicker/daterangepicker.component';
import { DashboardService, ConversationService, TrainingService, IntentService, EntityService } from './auto.service';
import { DataFilterPipe } from './components/conversation/data-filter.pipe';
import { TrainingDataFilterPipe } from './components/training/data-filter.pipe';
import { TrainingComponent } from './components/training/training.component';
import { IntentDataFilterPipe } from './components/intent/data-filter.pipe';
import { IntentComponent } from './components/intent/intent.component';
import { EntityDataFilterPipe } from './components/entity/data-filter.pipe';
import { EntityComponent } from './components/entity/entity.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    // BrowserAnimationsModule,
    NgaModule,
    routing,
    Daterangepicker,
    MomentModule,
    NvD3Module,
    DataTableModule,
    TagInputModule
  ],
  declarations: [
    AutoComponent,
    DashboardComponent,
    ConversationComponent,
    DateRangePickerComponent,
    DataFilterPipe,
    TrainingDataFilterPipe,
    TrainingComponent,
    IntentDataFilterPipe,
    IntentComponent,
    EntityDataFilterPipe,
    EntityComponent
  ],
  providers: [
    DashboardService,
    ConversationService,
    TrainingService,
    IntentService,
    EntityService
  ]
})
export class AutoModule { }
