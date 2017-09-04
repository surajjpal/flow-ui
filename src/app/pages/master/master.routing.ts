import { Routes, RouterModule } from '@angular/router';

import { MasterComponent } from './master.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: UserComponent },
      { path: 'updateUser', component: UpdateUserComponent },
      { path: 'updateUser/:profile', component: UpdateUserComponent },
      { path: 'route', component: RoutelinkComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
