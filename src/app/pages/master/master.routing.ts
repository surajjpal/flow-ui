import { Routes, RouterModule } from '@angular/router';

import { MasterComponent } from './master.component';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';
import { ApiConfigComponent } from './components/apiConfig/apiConfig.component';
import { ApiConfigSetupComponent } from './components/apiConfigSetup/apiConfigSetup.component';

const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'user', pathMatch: 'full' },
      { path: 'accountCreation', component: AccountCreationComponent },
      { path: 'user', component: UserComponent },
      { path: 'updateUser', component: UpdateUserComponent },
      { path: 'route', component: RoutelinkComponent },
      { path: 'apiConfig', component: ApiConfigComponent },
      { path: 'apiSetup', component: ApiConfigSetupComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
