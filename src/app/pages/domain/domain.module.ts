import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';
import * as moment from 'moment/moment';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './domain.routing';

import { DomainComponent } from './domain.component';
import { DomainSetupComponent } from './components/domainSetup/domainSetup.component';
import { DomainsComponent } from './components/domains/domains.component';

import { DomainService } from './domain.services';

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
    DomainComponent,
    DomainSetupComponent,
    DomainsComponent
  ],
  providers: [
    DomainService
  ]
})
export class DomainModule { }
