import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
import { AuthGuard, AntiAuthGuard } from '../services/shared.service';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [AntiAuthGuard],
    loadChildren: 'app/pages/login/login.module#LoginModule'
  },
  {
    path:'forgotpassword',
    canActivate: [AntiAuthGuard],
    loadChildren: 'app/pages/forgotpassword/forgotpassword.module#ForgotPasswordModule'
  },
  {
    path: 'pg',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tsk/pervi', pathMatch: 'full' },
      { path: 'tsk', loadChildren: './inbox/inbox.module#InboxModule' },
      { path: 'flw', loadChildren: './flow/flow.module#FlowModule' },
      { path: 'agnt', loadChildren: './agent/agent.module#AgentModule' },
      { path: 'dmn', loadChildren: './domain/domain.module#DomainModule' },
      { path: 'stp', loadChildren: './master/master.module#MasterModule' },
      { path: 'anlt', loadChildren: './analytics/analytics.module#AnalyticsModule'},
      { path: 'stn', loadChildren: './settings/settings.module#SettingsModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
