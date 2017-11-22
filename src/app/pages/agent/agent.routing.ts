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
      { path: '', redirectTo: 'agentCreation', pathMatch: 'full' },
      { path: 'agentCreation', component: AgentCreationComponent },
      { path: 'agents', component: AgentsComponent },

      { path: 'dashboard', component: DashboardComponent },
      { path: 'conversation', component: ConversationComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
