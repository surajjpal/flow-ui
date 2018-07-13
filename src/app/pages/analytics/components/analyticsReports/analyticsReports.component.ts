declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'

import { AnalyticsReportSetup, AnalyticsReport } from '../../../../models/analytics.model';
import { Agent } from '../../../../models/agent.model'

import { AnalyticsService } from '../../../../services/analytics.service';
import { AgentService } from '../../../../services/agent.service'
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Component({
    selector: 'api-analyticsReports',
    templateUrl: './analyticsReports.component.html'
})
export class AnalyticsReportsComponent implements OnInit, OnDestroy {

    analyticsReports: AnalyticsReport[];
    definedAgents: Agent[];
    selectedAnalyticsReport: AnalyticsReport;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private analyticsService: AnalyticsService,
        private sharingService: DataSharingService,
        private agentService: AgentService,
        private slimLoadingBarService: SlimLoadingBarService) 
    {
        this.analyticsReports = [];
        this.selectedAnalyticsReport = new AnalyticsReport();
    }

    ngOnInit() {

        this.agentService.agentLookup()
                        .subscribe(
                            agentresponse => {
                                if (agentresponse) {
                                    this.definedAgents = agentresponse;
                                    this.analyticsService.getAnalyticsReports()
                                        .subscribe(
                                            response => {
                                                this.analyticsReports = response;
                                            },
                                            error => {
                                                console.log("error");
                                                console.log(error);
                                            }
                                        )
                                }
                            },
                            agenterror => {
                                new showAlertModal("Error", "agents not found");
                            }
                        )
        
        
    }

    ngOnDestroy() {

    }

    getAgentName(agentId: string) {
        for (let agent of this.definedAgents) {
            if (agent._id == agentId) {
                return agent.name;
            }
        }
        return "";
    }

    onAnalyticsReportSelect(analyticsReport: AnalyticsReport) {
        if (analyticsReport) {
            this.selectedAnalyticsReport = analyticsReport;
          } else {
            this.selectedAnalyticsReport = null;
          }
      
          this.sharingService.setSharedObject(this.selectedAnalyticsReport);
      
          this.router.navigate(['/pg/anlt/anltst'], { relativeTo: this.route });
    }
}