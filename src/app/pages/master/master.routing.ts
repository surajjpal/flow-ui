import { Routes, RouterModule } from '@angular/router';

import {MasterComponent } from './master.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
   
    ]
  }
];

export const routing = RouterModule.forChild(routes);
