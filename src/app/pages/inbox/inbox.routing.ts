import { Routes, RouterModule } from '@angular/router';

import { InboxComponent } from './inbox.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'active', component: ActiveComponent },
      { path: 'archive', component: ArchivedComponent },
      { path: 'tasks', component: TasksComponent },
      { path: 'taskDetails', component: TaskDetailsComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
