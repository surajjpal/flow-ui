import { Routes, RouterModule } from '@angular/router';

import { EntityComponent } from './entity.component';
import { EntityCreateComponent } from './components/entitycreate/entitycreate.component';
import { EntitySearchComponent } from './components/entitysearch/entitysearch.component';


const routes: Routes = [
  {
    path: '',
    component: EntityComponent,
    children: [
      { path: '', redirectTo: 'ensr', pathMatch: 'full' },
      { path: 'encr', component: EntityCreateComponent },
      { path: 'ensr', component: EntitySearchComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
