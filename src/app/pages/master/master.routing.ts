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
      { path: '', redirectTo: 'stu', pathMatch: 'full' },
      { path: 'stac', component: AccountCreationComponent },
      { path: 'stu', component: UserComponent },
      { path: 'stus', component: UpdateUserComponent },
      { path: 'stus/:prf', component: UpdateUserComponent },
      { path: 'stm', component: RoutelinkComponent },
      { path: 'sta', component: ApiConfigComponent },
      { path: 'stas', component: ApiConfigSetupComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
