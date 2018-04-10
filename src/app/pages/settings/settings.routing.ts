import { Routes, RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { UpdateUserComponent } from '../master/components/updateUser/updateUser.component';
import { ChangePasswordComponent } from './components/changepassword.component'

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '', redirectTo: 'chpw', pathMatch: 'full' },
      { path: 'chpw', component: ChangePasswordComponent },
    ]
  }
];

export const routing = RouterModule.forChild(routes);
