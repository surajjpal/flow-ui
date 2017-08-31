import { Routes, RouterModule } from '@angular/router';

import { MasterComponent } from './master.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'user', component: UserComponent },
      { path: 'updateUser', component: UpdateUserComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
