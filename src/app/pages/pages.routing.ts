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
    path: 'pages',
    component: PagesComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'inbox/active', pathMatch: 'full' },
      { path: 'inbox', loadChildren: './inbox/inbox.module#InboxModule' },
      { path: 'flow', loadChildren: './flow/flow.module#FlowModule' },
      { path: 'master', loadChildren: './master/master.module#MasterModule' },
      { path: 'agent', loadChildren: './agent/agent.module#AgentModule' },
      { path: 'domain', loadChildren: './domain/domain.module#DomainModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
