import { Routes, RouterModule } from '@angular/router';

import { FTCComponent } from './ftc.component';
import { SearchComponent } from './components/search/search.component';
import { DesignComponent } from './components/design/design.component';

const routes: Routes = [
    {
        path: '',
        component: FTCComponent,
        children: [
            { path: '', redirectTo: 'ftcsr', pathMatch: 'full' },
            { path: 'ftcsr', component: SearchComponent },
            { path: 'ftcd', component: DesignComponent }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
