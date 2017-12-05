import { Routes, RouterModule } from '@angular/router';

import { DomainComponent } from './domain.component';
import { DomainSetupComponent } from './components/domainSetup/domainSetup.component';
import { DomainsComponent } from './components/domains/domains.component';

const routes: Routes = [
  {
    path: '',
    component: DomainComponent,
    children: [
      { path: '', redirectTo: 'dmsr', pathMatch: 'full' },
      { path: 'dms', component: DomainSetupComponent },
      { path: 'dmsr', component: DomainsComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
