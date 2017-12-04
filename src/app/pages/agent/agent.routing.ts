import { Routes, RouterModule } from '@angular/router';

import { AgentComponent } from './agent.component';
import { AgentCreationComponent } from './components/agent/agentCreation.component';
import { AgentsComponent } from './components/agents/agents.component';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
    children: [
      { path: '', redirectTo: 'agsr', pathMatch: 'full' },
      { path: 'ags', component: AgentCreationComponent },
      { path: 'agsr', component: AgentsComponent },

      { path: 'agdb', component: DashboardComponent },
      { path: 'agcv', component: ConversationComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
