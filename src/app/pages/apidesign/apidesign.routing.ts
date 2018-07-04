import { Routes, RouterModule } from '@angular/router';

import { ApiDesignComponent } from './apidesign.component';
import { ApiDesignsComponent } from './components/apidesigns/apidesigns.component';
import { ApiDesignSetupComponent } from './components/apidesignSetup/apidesignSetup.component';

const routes: Routes = [
  {
    path: '',
    component: ApiDesignComponent,
    children: [
      { path: '', redirectTo: 'dmsr', pathMatch: 'full' },
      { path: 'apidgn', component: ApiDesignsComponent },
      { path: 'apidgnstp', component: ApiDesignSetupComponent }
      
    ]
  }
];

export const routing = RouterModule.forChild(routes);
