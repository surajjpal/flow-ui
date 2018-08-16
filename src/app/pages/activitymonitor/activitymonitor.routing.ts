import { Routes, RouterModule } from '@angular/router';

import { ActivityMonitorComponent } from './activitymonitor.component';
import { BusinessProcessMonitorcomponent } from './components/businessprocessmonitor/businessprocessmonitor.component';

const routes: Routes = [
  {
    path: '',
    component: ActivityMonitorComponent,
    children: [
      { path: '', redirectTo: 'agsr', pathMatch: 'full' },
      { path: 'pd', component: BusinessProcessMonitorcomponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
