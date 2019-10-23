import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './ftc.routing';

import { TagInputModule } from 'ngx-chips';
import { DataTableModule } from 'angular2-datatable';

import { FTCComponent } from './ftc.component';

import { SearchComponent } from './components/search/search.component';
import { DesignComponent } from './components/design/design.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgaModule,
    routing,
    TagInputModule,
    DataTableModule,
    SharedModule
  ],
  declarations: [
    FTCComponent,
    SearchComponent,
    DesignComponent
  ]
})
export class FTCModule { }