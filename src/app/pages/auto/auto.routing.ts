import { Routes, RouterModule } from '@angular/router';

import { AutoComponent } from './auto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ConversationComponent } from './components/conversation/conversation.component';
import { TrainingComponent } from './components/training/training.component';
import { IntentComponent } from './components/intent/intent.component';
import { EntityComponent } from './components/entity/entity.component';

const routes: Routes = [
  {
    path: '',
    component: AutoComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'conversation', component: ConversationComponent },
      { path: 'training', component: TrainingComponent },
      { path: 'intent', component: IntentComponent },
      { path: 'entity', component: EntityComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
