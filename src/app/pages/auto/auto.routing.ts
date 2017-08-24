import { Routes, RouterModule } from '@angular/router';

import { AutoComponent } from './auto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';

const routes: Routes = [
  {
    path: '',
    component: AutoComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'conversation', component: ConversationComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
