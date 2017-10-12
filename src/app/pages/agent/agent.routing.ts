import { Routes, RouterModule } from '@angular/router';

import { AgentComponent } from './agent.component';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { AgentCreationComponent } from './components/agent/agentCreation.component';
import { DomainSetupComponent } from './components/domain/domainSetup.component';

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
    children: [
      { path: '', redirectTo: 'accountCreation', pathMatch: 'full' },
      { path: 'accountCreation', component: AccountCreationComponent },
      { path: 'agentCreation', component: AgentCreationComponent },
      { path: 'domainSetup', component: DomainSetupComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
