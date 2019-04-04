import { Routes, RouterModule } from '@angular/router';

import { USPComponent } from './usp.component';
import { USPSearchComponent } from './components/uspsearch/uspsearch.component';

const routes: Routes = [
  {
    path: '',
    component: USPComponent,
    children: [
      { path: '', redirectTo: 'agsr', pathMatch: 'full' },
      { path: 'sh', component: USPSearchComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
