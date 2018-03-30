import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription'
import { AnalyticsReportSetup, AnalyticsReport } from '../../../../models/analytics.model';
import { ScheduleTaskConfiguration } from '../../../../models/scheduler.model'
import { AnalyticsService } from '../../../../services/analytics.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { from } from 'rxjs/observable/from';


@Component({
    selector: 'api-analyticsReportSetup',
    templateUrl: './analyticsReportSetup.component.html'
})
export class AnalyticsReportSetupComponent implements OnInit, OnDestroy {
    private analyticsReportSetup: AnalyticsReportSetup;
    private analyticsReport: AnalyticsReport;
    private scheduleTaskConfiguration: ScheduleTaskConfiguration;
    private subscription: Subscription;
    reportTypes: string[] = ["INSTANT_REPORT", "SCHEDULE_REPORT"]
    subscriptions: string[] = ["TIMER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
    scheduleDayOfWeek: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    scheduleHours = this.range(1,24);
    scheduleMinutes = this.range(1,60);
    scheduleSeconds = this.range(1,60);
    time: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
    seconds = true;

    
    constructor(private router: Router,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private analyticsService: AnalyticsService,
        private sharingService: DataSharingService,
        private slimLoadingBarService: SlimLoadingBarService) 
    {
        this.analyticsReportSetup = new AnalyticsReportSetup();
        this.analyticsReport = new AnalyticsReport();
        this.scheduleTaskConfiguration = new ScheduleTaskConfiguration();
        //this.scheduleHours = this.range(1,24);
    }
    
    ngOnInit() {

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
        if (this.analyticsReportSetup.reportType == 'INSTANT_REPORT') {
            this.analyticsReport.setValues(this.analyticsReportSetup.reportName, this.analyticsReportSetup.toEmailIds,
                this.analyticsReportSetup.ccEmailIds, this.analyticsReportSetup.reportType, this.analyticsReportSetup.startDate,
                this.analyticsReportSetup.endDate
            )
            this.subscription = this.analyticsService.sendReport(this.analyticsReport)
            .subscribe(
                response => {
                  this.router.navigate(['/anlt/anltst'], { relativeTo: this.route });
                }
              );
        }
        else if (this.analyticsReportSetup.reportType == 'SCHEDULE_REPORT') {
            this.analyticsReport.setValues(this.analyticsReportSetup.reportName, this.analyticsReportSetup.toEmailIds,
                this.analyticsReportSetup.ccEmailIds, this.analyticsReportSetup.reportType, this.analyticsReportSetup.startDate,
                this.analyticsReportSetup.endDate
            )
            this.subscription = this.analyticsService.sendReport(this.analyticsReport)
            .subscribe(
                response => {
                    this.scheduleTaskConfiguration.setValues("system",null,this.analyticsReportSetup.endDate, this.analyticsReportSetup.subscription,
                        this.analyticsReportSetup.timeZone, this.analyticsReportSetup.scheduleSecond, this.analyticsReportSetup.scheduleMinute,
                        this.analyticsReportSetup.scheduleHour, this.analyticsReportSetup.scheduleDayOfWeek, this.analyticsReportSetup.scheduleMonth,
                        this.analyticsReportSetup.scheduleDayOfMonth, this.analyticsReportSetup.repeateCount, this.analyticsReportSetup.status
                    )
                    this.analyticsService.scheduleReport(this.scheduleTaskConfiguration)  
                  
                }
              );
        }
        
    }

    setReportDateRange(dateRange) {
                                                                    
        this.analyticsReportSetup.startDate = dateRange.start.format('YYYY-MM-DDTHH:mm:ss');
        this.analyticsReportSetup.endDate = dateRange.end.format('YYYY-MM-DDTHH:mm:ss');
    }

}