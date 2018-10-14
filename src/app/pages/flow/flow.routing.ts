import { Routes, RouterModule } from '@angular/router';

import { FlowComponent } from './flow.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SearchComponent } from './components/search/search.component';
import { DesignComponent } from './components/design/design.component';
import { SearchProcessComponent } from './components/searchprocess/searchprocess.component';
import { ProcessAuditComponent } from './components/processaudit/processaudit.component';

const routes: Routes = [
  {
    path: '',
    component: FlowComponent,
    children: [
      { path: '', redirectTo: 'flsr', pathMatch: 'full' },
      { path: 'fldb', component: DashboardComponent },
      { path: 'flsr', component: SearchComponent },
      { path: 'fld', component: DesignComponent },
      { path:'flpsr', component: SearchProcessComponent},
      { path : 'flpa', component: ProcessAuditComponent}
    ]
  }
];

export const routing = RouterModule.forChild(routes);
