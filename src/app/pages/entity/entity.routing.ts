import { Routes, RouterModule } from '@angular/router';

import { EntityComponent } from './entity.component';
import { EntityCreateComponent } from './components/entitycreate/entitycreate.component';


const routes: Routes = [
  {
    path: '',
    component: EntityComponent,
    children: [
      { path: '', redirectTo: 'ensr', pathMatch: 'full' },
      { path: 'encr', component: EntityCreateComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
