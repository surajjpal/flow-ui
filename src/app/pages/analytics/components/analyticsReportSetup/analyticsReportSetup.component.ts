import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription'
import { AnalyticsReportSetup } from '../../../../models/analytics.model';

@Component({
    selector: 'api-analyticsReportSetup',
    templateUrl: './analyticsReportSetup.component.html'
})
export class AnalyticsReportSetupComponent implements OnInit, OnDestroy {
    analyticsReportSetup: AnalyticsReportSetup;
    subscriptions: string[] = ["TIMER", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"]
    scheduleDayOfWeek: string[] = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
    scheduleHours = this.range(1,24);
    scheduleMinutes = this.range(1,60);
    scheduleSeconds = this.range(1,60);
    time: NgbTimeStruct = {hour: 13, minute: 30, second: 30};
    seconds = true;

    constructor() {
        this.analyticsReportSetup = new AnalyticsReportSetup();
        //this.scheduleHours = this.range(1,24);
    }
    
    ngOnInit() {

    }

    ngOnDestroy(): void {
        
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
}