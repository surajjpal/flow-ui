import { Routes, RouterModule } from '@angular/router';

import { ForgotPasswordComponent } from './forgotpassword.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);