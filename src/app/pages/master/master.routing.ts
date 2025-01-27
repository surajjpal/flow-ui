import { Routes, RouterModule } from '@angular/router';

import { MasterComponent } from './master.component';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';
import { ApiConfigComponent } from './components/apiConfig/apiConfig.component';
import { ApiConfigSetupComponent } from './components/apiConfigSetup/apiConfigSetup.component';
import { UserHierarchyComponent } from './components/userHierarchy/userHierarchy.component';
import { AnalyticsReportsComponent } from 'app/pages/analytics/components/analyticsReports/analyticsReports.component';
import { AnalyticsReportSetupComponent } from 'app/pages/analytics/components/analyticsReportSetup/analyticsReportSetup.component';
import { ConnectorConfigComponent } from './components/connectorConfig/connectorConfig.component';
import { ConnectorInfoComponent } from './components/connectorInfo/connectorInfo.component';
import { ConnectorInfoDetailComponent } from './components/connectorInfoDetail/connectorInfoDetail.component';
import { ConConfigSetupComponent } from './components/conConfigSetup/conConfigSetup.component';
import { AccountViewComponent } from './components/accountView/accountView.component';
import { DataModelComponent } from './components/dataModel/dataModel.component';
import { DataModelSetupComponent } from './components/dataModelSetup/dataModelSetup.component';


const routes: Routes = [
  {
    path: '',
    component: MasterComponent,
    children: [
      { path: '', redirectTo: 'stu', pathMatch: 'full' },
      { path: 'stac', component: AccountViewComponent },
      { path: 'stacs', component: AccountCreationComponent },
      { path: 'stu', component: UserComponent },
      { path: 'stus', component: UpdateUserComponent },
      { path: 'stus/:prf', component: UpdateUserComponent },
      { path: 'stm', component: RoutelinkComponent },
      { path: 'sta', component: ApiConfigComponent },
      { path: 'stas', component: ApiConfigSetupComponent },
      { path: 'stuh', component: UserHierarchyComponent },
      { path: 'stdm', component: DataModelComponent },
      { path: 'stdms', component: DataModelSetupComponent },
      { path: 'anlt', component: AnalyticsReportsComponent },
      { path: 'anltst', component: AnalyticsReportSetupComponent },
      { path: 'stcm', component: ConnectorInfoComponent },
      { path: 'stcms', component: ConnectorInfoDetailComponent },
      { path: 'stcc', component: ConnectorConfigComponent },
      { path: 'stccs', component: ConConfigSetupComponent },
      { path : 'anltst', component: AnalyticsReportSetupComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
