declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription'
import { AnalyticsReportSetup, AnalyticsReport } from '../../../../models/analytics.model';
import { ScheduleTaskConfiguration } from '../../../../models/scheduler.model'
import { AnalyticsService } from '../../../../services/analytics.service';
import { AgentService } from '../../../../services/agent.service'
import { ScheduleTaskService } from '../../../../services/scheduletasks.service'
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { from } from 'rxjs/observable/from';
import { Agent } from 'app/models/agent.model';

declare let moment: any;

@Component({
    selector: 'api-analyticsReportSetup',
    templateUrl: './analyticsReportSetup.component.html'
})
export class AnalyticsReportSetupComponent implements OnInit, OnDestroy {
    selectedAnalyticsReport: AnalyticsReport;
    definedAgents: Agent[];
    createUpdateModel = true;
    analyticsReportModalHeader = '';
    analyticsReportSetup: AnalyticsReportSetup;
    analyticsReport: AnalyticsReport;
    scheduleTaskConfiguration: ScheduleTaskConfiguration;
    subscription: Subscription;
    reportTypes: string[] = ["INSTANT", "SCHEDULE"]
    subscriptions: string[] = ["TIMER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
    scheduleDayOfWeek: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    monthDays = this.range(1,30);
    scheduleHours = this.range(1,24);
    scheduleMinutes = this.range(1,60);
    scheduleSeconds = this.range(1,60);
    tempTime: NgbTimeStruct = {hour: 0, minute: 0, second: 0};
    tempDateRange: any = {}
    tempEndDate: any;
    seconds = true;
    timeZones = ["Asia/Kolkata"];
    reportFileTypes = ["pdf", "csv", "html"];
    reportCategories = ["STANDARD", "CUSTOM"];

    
    constructor(private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private analyticsService: AnalyticsService,
        private sharingService: DataSharingService,
        private agentService: AgentService,
        private scheduleTaskService: ScheduleTaskService,
        private slimLoadingBarService: SlimLoadingBarService) 
    {
        this.selectedAnalyticsReport = new AnalyticsReport();
        this.selectedAnalyticsReport = new AnalyticsReport();
        this.analyticsReportSetup = new AnalyticsReportSetup();
        this.analyticsReport = new AnalyticsReport();
        this.scheduleTaskConfiguration = new ScheduleTaskConfiguration();
        this.definedAgents = [];
        //this.scheduleHours = this.range(1,24);
    }
    
    ngOnInit() {
        this.tempDateRange.start = moment().startOf('day');
        this.tempDateRange.end = moment().endOf('day');
        const analyticsReport = this.sharingService.getSharedObject();
        this.agentService.agentLookup()
            .subscribe(
                response => {
                    if (response) {
                        this.definedAgents = response;
                        
                    }
                },
                error => {
                    new showAlertModal("Error", "agents not found");
                }
            )
        if (analyticsReport) {
            console.log("analyticsReport");
            console.log(analyticsReport);
            this.createUpdateModel = false;
            this.selectedAnalyticsReport = analyticsReport;
            this.analyticsReportModalHeader = "Update analytics report";

            if (this.selectedAnalyticsReport.requestedReportType == "INSTANT") {
                if (this.selectedAnalyticsReport.requestFilter["startDate"] && this.selectedAnalyticsReport.requestFilter["endDate"]) {
                    this.tempDateRange.start = moment(new Date(this.selectedAnalyticsReport.requestFilter["startDate"]));
                    this.tempDateRange.end = moment(new Date(this.selectedAnalyticsReport.requestFilter["endDate"]));
                }
                
            }
            if (this.selectedAnalyticsReport.requestedReportType == "SCHEDULE") {
                if (this.selectedAnalyticsReport._id) {
                console.log("********************");
                this.selectedAnalyticsReport.scheduleConfig = new ScheduleTaskConfiguration();
                this.scheduleTaskService.getScheduleTaskConfigurationById(this.selectedAnalyticsReport.scheduleTaskConfigurationId, this.selectedAnalyticsReport.companyId)
                    .subscribe (
                        response => {
                            this.selectedAnalyticsReport.scheduleConfig = response;
                            if ((this.selectedAnalyticsReport.scheduleConfig.scheduleHour != 0 || this.selectedAnalyticsReport.scheduleConfig.scheduleMinute != 0 || this.selectedAnalyticsReport.scheduleConfig.scheduleSecond != 0)) {
                                this.tempTime.hour = this.selectedAnalyticsReport.scheduleConfig.scheduleHour;
                                this.tempTime.minute = this.selectedAnalyticsReport.scheduleConfig.scheduleMinute;
                                this.tempTime.second = this.selectedAnalyticsReport.scheduleConfig.scheduleSecond;                
                            }
                            
                            if (this.selectedAnalyticsReport.scheduleConfig.endTime) {
                                console.log("endTime");
                                console.log(this.selectedAnalyticsReport.scheduleConfig.endTime);
                                if (this.selectedAnalyticsReport.scheduleConfig.endTime.length >= 7) {
                                    this.tempEndDate = {}
                                    this.tempEndDate.year = this.selectedAnalyticsReport.scheduleConfig.endTime[0];
                                    this.tempEndDate.month = this.selectedAnalyticsReport.scheduleConfig.endTime[1];
                                    this.tempEndDate.day = this.selectedAnalyticsReport.scheduleConfig.endTime[2];
                                }
                                
                            }
                        },
                        error => {
                            console.log("schedule task configuration not found");
                        }
                    )
                }
                
            }
        }
        else {
            this.createUpdateModel = true;
            this.selectedAnalyticsReport = new AnalyticsReport();
            this.analyticsReportModalHeader = "Create analytics report";
            
        }
    }

    ngOnDestroy(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    onSubscriptionChange(newValue) {
        console.log(newValue);
        this.analyticsReportSetup.subscription = newValue;
    }

    range(min, max) {
        var inputRange = [];
        min = parseInt(min); //Make string input int
        max = parseInt(max);
        for (var i=min; i<max; i++)
            inputRange.push(i);
        return inputRange;
    }

    toggleSeconds() {
        this.seconds = !this.seconds;
    }

    scheduleAnalyticsReport() {
        console.log("temptime");
        console.log(this.tempTime);
        if (this.selectedAnalyticsReport.requestedReportType == "INSTANT") {
            if (this.tempDateRange) {
                var date = new Date(this.tempDateRange.start.toDate().getTime() - this.tempDateRange.start.toDate().getTimezoneOffset() * 60000);
                this.selectedAnalyticsReport.requestFilter["startDate"] = this.tempDateRange.start.toDate(); //date.toISOString();
                date = new Date(this.tempDateRange.end.toDate().getTime() - this.tempDateRange.end.toDate().getTimezoneOffset() * 60000);
                this.selectedAnalyticsReport.requestFilter["endDate"] = this.tempDateRange.end.toDate(); //date.toISOString();
            }
        }
        if (this.selectedAnalyticsReport.requestedReportType == "SCHEDULE") {
            if (this.tempTime) {
                this.selectedAnalyticsReport.scheduleConfig.scheduleHour = this.tempTime.hour;
                this.selectedAnalyticsReport.scheduleConfig.scheduleMinute = this.tempTime.minute;
                this.selectedAnalyticsReport.scheduleConfig.scheduleSecond = this.tempTime.second;
            }
            if (this.tempEndDate) {
                const date = new Date();
                date.setFullYear(this.tempEndDate.year);
                date.setMonth(this.tempEndDate.month);
                date.setDate(this.tempEndDate.day);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                this.selectedAnalyticsReport.scheduleConfig.endTime = date.toISOString();
            }
            
        }

        if (this.selectedAnalyticsReport.requestedReportType == "INSTANT") {
            this.subscription = this.analyticsService.sendReport(this.selectedAnalyticsReport)
                .subscribe (
                    response => {
                        console.log("success");
                        console.log(response);
                        

                    },
                    error => {
                        console.log("error");
                        console.log(error);
                        new showAlertModal("Error", error);
                    }
                )
            new showAlertModal("Success", "You will receive an email for requested report")
        }
        else if (this.selectedAnalyticsReport.requestedReportType == "SCHEDULE") {
            this.subscription = this.analyticsService.scheduleReport(this.selectedAnalyticsReport)
                .subscribe (
                    response => {
                        console.log("success");
                        console.log(response);
                        
                    },
                    error => {
                        console.log("error");
                        console.log(error);
                        new showAlertModal("Error", error);
                    }
                )
            new showAlertModal("Success", "Report has been scheduled");
        }

        console.log(this.selectedAnalyticsReport);
        // this.subscription = this.analyticsService.sendReport(this.analyticsReportSetup)
        //     .subscribe (
        //         response => {
        //             this.router.navigate(['/anlt/anltst'], { relativeTo: this.route});
        //         }
        //     )
    }

    setReportDateRange(dateRange) {
        if (dateRange) {
            console.log(dateRange.start);
            this.tempDateRange.start = dateRange.start;
            this.tempDateRange.end = dateRange.end;
        }
    }

}