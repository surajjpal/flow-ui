import { Route, Routes } from "@angular/router";
import { AnalyticsComponent } from "./analytics.component";
import { AnalyticsReportSetupComponent } from "./components/analyticsReportSetup/analyticsReportSetup.component";
import { RouterModule } from "@angular/router";

const routes: Routes = [
    {
        path : '',
        component : AnalyticsComponent,
        children: [
            { path: '', redirectTo: 'anlt', pathMatch: 'full' },
            { path : 'anltst', component: AnalyticsReportSetupComponent }
        ]
    }
];
export const routing = RouterModule.forChild(routes);