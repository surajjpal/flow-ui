import { Component, OnInit, OnDestroy } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription'
import { AnalyticsReportSetup } from '../../../../models/analytics.model';
import { AnalyticsService } from '../../../../services/analytics.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';


@Component({
    selector: 'api-analyticsReportSetup',
    templateUrl: './analyticsReportSetup.component.html'
})
export class AnalyticsReportSetupComponent implements OnInit, OnDestroy {
    private analyticsReportSetup: AnalyticsReportSetup;
    private subscription: Subscription;
    
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
        
        this.subscription = this.analyticsService.scheduleReport(this.analyticsReportSetup)
        .subscribe(
            response => {
              this.router.navigate(['/anlt/anltst'], { relativeTo: this.route });
            }
          );
        
    }

}