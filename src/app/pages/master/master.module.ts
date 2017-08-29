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



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    Daterangepicker,
    MomentModule,
    NvD3Module,
    DataTableModule
  ],
  declarations: [
    
  ],
  providers: [
   
  ]
})
export class MasterModule { }
