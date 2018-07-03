import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';
import * as moment from 'moment/moment';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './apidesign.routing';

import { ApiDesignComponent } from './apidesign.component';
import { ApiDesignsComponent } from './components/apidesigns/apidesigns.component';
import { ApiDesignSetupComponent } from './components/apidesignSetup/apidesignSetup.component'
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule,
    routing,
    TagInputModule,
    SharedModule
  ],
  declarations: [
    ApiDesignComponent,
    ApiDesignsComponent,
    ApiDesignSetupComponent
  ]
})
export class ApiDesignModule { }
