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
      { path: 'mwrt', loadChildren: './mwroute/mwroute.module#MWRouteModule' },
      { path: 'ent', loadChildren: './entity/entity.module#EntityModule' },
      { path: 'agnt', loadChildren: './agent/agent.module#AgentModule' },
      { path: 'dmn', loadChildren: './domain/domain.module#DomainModule' },
      { path: 'stp', loadChildren: './master/master.module#MasterModule' },
      { path: 'stn', loadChildren: './settings/settings.module#SettingsModule' },
      { path: 'apidgn', loadChildren: './apidesign/apidesign.module#ApiDesignModule'},
      { path: 'bam', loadChildren: './activitymonitor/activitymonitor.module#ActivityMonitorModule' },
      { path: 'usp', loadChildren: './usp/usp.module#USPModule' }
    ]
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
