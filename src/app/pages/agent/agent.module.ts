import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';

import { TagInputModule } from 'ngx-chips';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './agent.routing';

import { AgentComponent } from './agent.component';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { AgentCreationComponent } from './components/agent/agentCreation.component';
import { DomainSetupComponent } from './components/domainSetup/domainSetup.component';
import { DomainsComponent } from './components/domains/domains.component';
import { AgentsComponent } from './components/agents/agents.component';

import { AgentService } from './agent.services';
import { GraphService } from '../flow/flow.service';

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
    AgentComponent,
    AccountCreationComponent,
    AgentCreationComponent,
    DomainSetupComponent,
    DomainsComponent,
    AgentsComponent
  ],
  providers: [
    AgentService,
    GraphService
  ]
})
export class AgentModule { }
