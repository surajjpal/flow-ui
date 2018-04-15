import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

export const routes: Routes = [
  { path: '', redirectTo: 'pg', pathMatch: 'full' },
  { path: '**', redirectTo: 'pg/tsk/pervi' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true });
