import { Routes, RouterModule } from '@angular/router';

import { FlowComponent } from './flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './components/search/search.component';
import { DesignComponent } from './components/design/design.component';

const routes: Routes = [
  {
    path: '',
    component: FlowComponent,
    children: [
      { path: '', redirectTo: 'flsr', pathMatch: 'full' },
      { path: 'fldb', component: DashboardComponent },
      { path: 'flsr', component: SearchComponent },
      { path: 'fld', component: DesignComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
