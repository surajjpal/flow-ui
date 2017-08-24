import { Routes, RouterModule } from '@angular/router';

import { InboxComponent } from './inbox.component';
import { TasksComponent } from './components/tasks/tasks.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    children: [
      { path: '', redirectTo: 'tasks', pathMatch: 'full' },
      { path: 'tasks', component: TasksComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
