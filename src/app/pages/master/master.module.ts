import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTableModule } from 'angular2-datatable';
import { TagInputModule } from 'ngx-chips';

import { NgaModule } from '../../theme/nga.module';

import { routing } from './master.routing';

import { MasterComponent } from './master.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AccountCreationComponent } from './components/account/accountCreation.component';
import { UserComponent } from './components/user/user.component';
import { UpdateUserComponent } from './components/updateUser/updateUser.component';
import { RoutelinkComponent } from './components/routelink/routelink.component';
import { ApiConfigComponent } from './components/apiConfig/apiConfig.component';
import { ApiConfigSetupComponent } from './components/apiConfigSetup/apiConfigSetup.component';

import { SharedModule } from '../../shared/shared.module';
import { UserHierarchyComponent } from 'app/pages/master/components/userHierarchy/userHierarchy.component';
import { AnalyticsReportsComponent } from 'app/pages/analytics/components/analyticsReports/analyticsReports.component';
import { AnalyticsReportSetupComponent } from 'app/pages/analytics/components/analyticsReportSetup/analyticsReportSetup.component';
import { DateRangePickerComponent } from 'app/pages/analytics/components/analyticsReportSetup/daterangepicker/daterangepicker.component';
import { ConnectorConfigComponent } from './components/connectorConfig/connectorConfig.component';
import { ConConfigSetupComponent } from './components/conConfigSetup/conConfigSetup.component';
import { AccountViewComponent } from './components/accountView/accountView.component';

@NgModule({
  imports: [

    CommonModule,
    FormsModule,
    DataTableModule,
    NgaModule.forRoot(),
    routing,
    TagInputModule,
    SharedModule,
    Daterangepicker,
    NgbModule,
    SharedModule
    
  ],
  declarations: [
    MasterComponent,
    AccountCreationComponent,
    UserComponent,
    UpdateUserComponent,
    RoutelinkComponent,
    ApiConfigComponent,
    ApiConfigSetupComponent,
    UserHierarchyComponent,
    AnalyticsReportsComponent,
    AnalyticsReportSetupComponent,
    DateRangePickerComponent,
    ConnectorConfigComponent,
    ConConfigSetupComponent,
    AccountViewComponent
  ]
})
export class MasterModule { }
