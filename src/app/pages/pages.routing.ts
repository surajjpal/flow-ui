import { Routes, RouterModule }  from '@angular/router';
import { Pages } from './pages.component';
import { ModuleWithProviders } from '@angular/core';
// noinspection TypeScriptValidateTypes

// export function loadChildren(path) { return System.import(path); };

export const routes: Routes = [
  {
    path: 'pages',
    component: Pages,
    children: [
      { path: '', redirectTo: 'auto/dashboard', pathMatch: 'full' },
      { path: 'inbox', loadChildren: './inbox/inbox.module#InboxModule' },
      { path: 'auto', loadChildren: './auto/auto.module#AutoModule' },
      { path: 'flow', loadChildren: './flow/flow.module#FlowModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
