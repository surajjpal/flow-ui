import { Routes, RouterModule } from '@angular/router';

import { MWRouteComponent } from './mwroute.component';
import { SearchComponent } from './components/search/search.component';
import { DesignComponent } from './components/design/design.component';

const routes: Routes = [
    {
        path: '',
        component: MWRouteComponent,
        children: [
            { path: '', redirectTo: 'rtsr', pathMatch: 'full' },
            { path: 'rtsr', component: SearchComponent },
            { path: 'rtd', component: DesignComponent }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
