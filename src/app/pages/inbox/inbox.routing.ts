import { Routes, RouterModule } from '@angular/router';
import { TeamViewComponent} from './components/teamView/teamView.component';
import { PersonalComponent} from './components/personal/personal.component';
import { InboxComponent } from './inbox.component';
import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    children: [
      { path: '', redirectTo: 'tact', pathMatch: 'full' },
      { path: 'tact', component: ActiveComponent },
      { path: 'trch', component: ArchivedComponent },
      { path: 'tdts', component: TaskDetailsComponent },
      { path: 'tmvi', component: TeamViewComponent},
      { path: 'pervi', component: PersonalComponent}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
