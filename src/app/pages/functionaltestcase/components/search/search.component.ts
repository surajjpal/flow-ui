declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FtcConfig } from 'app/models/ftc.model';
import { FtcService } from 'app/services/ftc.service';
import { DataSharingService } from 'app/services/shared.service';

@Component({
    selector: 'api-ftc-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'testcaseCd';
    sortOrder = 'asc';

    // Models to bind with html
    ftList: FtcConfig[];
    selectedTest: FtcConfig = new FtcConfig();

    progressBarFlag: boolean = false;

    private subscriptionFetchRoute: Subscription;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ftcService: FtcService,
        private dataSharingService: DataSharingService
    ) {

    }

    ngOnInit() {
        this.fetchTestCases();
    }

    private fetchTestCases() {
        this.subscriptionFetchRoute = this.ftcService.fetch().subscribe(
            result => {
                if (result && result.length > 0) {
                    this.ftList = result;
                }
            }, error => {

            }
        );
    }

    ngOnDestroy() {
        if (this.subscriptionFetchRoute && !this.subscriptionFetchRoute.closed) {
            this.subscriptionFetchRoute.unsubscribe();
        }
    }

    deleteTest(modalId: string): void {
        if (this.selectedTest) {
            // this.subscriptionFetchRoute = this.mwRouteService.delete().subscribe(
            //     result => {
            //         this.fetchRoutes();
            //     }, error => {
    
            //     }
            // );
        }

        new closeModal(modalId);
    }

    onSelect(ftConfig: FtcConfig): void {
        if (ftConfig) {
            this.dataSharingService.setSharedObject(ftConfig);
            this.router.navigate(['/pg/ftc/ftcd'], { relativeTo: this.route });
        }
    }

    playTest(ftConfig: FtcConfig): void {
        if (ftConfig) {
            // this.dataSharingService.setSharedObject(ftConfig);
            // this.router.navigate(['/pg/ftc/ftcd'], { relativeTo: this.route });
    
        alert(ftConfig.routeCd+" is getting invok");
        }
    }


    toInt(){
        //please check this
    }
}