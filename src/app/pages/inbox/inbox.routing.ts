import { Routes, RouterModule } from '@angular/router';
import { TeamViewComponent} from './components/teamView/teamView.component';
import { PersonalComponent} from './components/personal/personal.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { InboxComponent } from './inbox.component';
import { ActiveComponent } from './components/active/active.component';
import { ArchivedComponent } from './components/archived/archived.component';
import { TaskDetailsComponent } from './components/taskDetails/taskDetails.component';
import { ArchiveMasterComponent } from 'app/pages/inbox/components/archivedmaster/archivedmaster.component';
import { PersonalMasterComponent } from 'app/pages/inbox/components/personalmaster/personalmaster.component';

const routes: Routes = [
  {
    path: '',
    component: InboxComponent,
    children: [
      { path: '', redirectTo: 'tact', pathMatch: 'full' },
      { path: 'tskd', component: DashboardComponent },
      { path: 'tact', component: ActiveComponent },
      { path: 'trch', component: ArchivedComponent },
      { path: 'tdts', component: TaskDetailsComponent },
      { path: 'tmvi', component: TeamViewComponent},
      { path: 'pervi', component: PersonalMasterComponent},
      { path: 'trchtst', component: ArchiveMasterComponent },
      { path: 'pervitst', component: PersonalComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
