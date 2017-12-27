import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { NgaModule } from '../../../../theme/nga.module';

import { ApiTableComponent } from './apitable.component';

import { SharedModule } from '../../../../shared/shared.module';

import { MomentModule } from 'angular2-moment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    DataTableModule,
    MomentModule,
    SharedModule
  ],
  declarations: [
    ApiTableComponent
  ],
  exports: [
    ApiTableComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ApiTableModule { }
