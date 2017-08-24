import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { NgaModule } from '../../../../theme/nga.module';

import { DataFilterPipe } from './data-filter.pipe';
import { KeysPipe } from './data-key.pipe';
import { ApiTableComponent } from './apitable.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    DataTableModule
  ],
  declarations: [
    DataFilterPipe,
    KeysPipe,
    ApiTableComponent
  ],
  exports: [
    ApiTableComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class ApiTableModule { }
