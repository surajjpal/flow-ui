import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './entity.routing';

import { TagInputModule } from 'ngx-chips';
import { NvD3Module } from 'ng2-nvd3';
import { Daterangepicker } from 'ng2-daterangepicker';
import { MomentModule } from 'angular2-moment';
import { DataTableModule } from 'angular2-datatable';

import { EntityComponent } from './entity.component';
import { EntityCreateComponent } from './components/entitycreate/entitycreate.component';

import { APISpinnerComponent } from '../../shared/components/api-spinner/api-spinner.component'

import { FlexLayoutModule } from '@angular/flex-layout';

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
    SharedModule,
    FlexLayoutModule
  ],
  declarations: [
    EntityComponent,
    EntityCreateComponent,
    APISpinnerComponent
  ]
})
export class EntityModule { }