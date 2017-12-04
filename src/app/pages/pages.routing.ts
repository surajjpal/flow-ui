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
    path: 'register',
    canActivate: [AntiAuthGuard],
    loadChildren: 'app/pages/register/register.module#RegisterModule'
  },
  {
    path: 'pg',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'tsk/tact', pathMatch: 'full' },
      { path: 'tsk', loadChildren: './inbox/inbox.module#InboxModule' },
      { path: 'flw', loadChildren: './flow/flow.module#FlowModule' },
      { path: 'agnt', loadChildren: './agent/agent.module#AgentModule' },
      { path: 'dmn', loadChildren: './domain/domain.module#DomainModule' },
      { path: 'stp', loadChildren: './master/master.module#MasterModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
