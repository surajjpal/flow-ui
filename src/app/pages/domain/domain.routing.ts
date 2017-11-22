import { Routes, RouterModule } from '@angular/router';

import { DomainComponent } from './domain.component';
import { DomainSetupComponent } from './components/domainSetup/domainSetup.component';
import { DomainsComponent } from './components/domains/domains.component';

const routes: Routes = [
  {
    path: '',
    component: DomainComponent,
    children: [
      { path: '', redirectTo: 'domains', pathMatch: 'full' },
      { path: 'domainSetup', component: DomainSetupComponent },
      { path: 'domains', component: DomainsComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
