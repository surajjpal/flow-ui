import { Route, Routes } from "@angular/router";
import { AnalyticsComponent } from "./analytics.component";
import { AnalyticsReportSetupComponent } from "./components/analyticsReportSetup/analyticsReportSetup.component";
import { AnalyticsReportsComponent } from  './components/analyticsReports/analyticsReports.component';
import { RouterModule } from "@angular/router";

const routes: Routes = [
    // {
    //     path : '',
    //     component : AnalyticsComponent,
    //     children: [
    //         { path: '', redirectTo: 'anlt', pathMatch: 'full' },
    //         { path : 'anltst', component: AnalyticsReportSetupComponent },
    //         { path: 'anlt', component: AnalyticsReportsComponent}
    //     ]
    // }
];
export const routing = RouterModule.forChild(routes);