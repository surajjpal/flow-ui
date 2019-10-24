declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FtcConfig } from 'app/models/ftc.model';
import { FtcService } from 'app/services/ftc.service';
import { DataSharingService } from 'app/services/shared.service';
import { FtcFlowService } from 'app/services/ftcflow.service';

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
    //response: string;

    progressBarFlag: boolean = false;


    private subscriptionFetchRoute: Subscription;
    private subscriptionInvokedRoute: Subscription;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ftcService: FtcService,
        private ftcflowService: FtcFlowService,
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
        if (ftConfig) 
        {
            // this.dataSharingService.setSharedObject(ftConfig);
            // this.router.navigate(['/pg/ftc/ftcd'], { relativeTo: this.route });
    
            this.subscriptionInvokedRoute = this.ftcflowService.invoke(ftConfig).subscribe(
                result => {

                     if (result && result['testCaseStatus']=="Passed") 
                     {
                        //  this.response= JSON.stringify(result);
                        //  if(this.response && this.response.length>0)
                         alert(ftConfig.routeCd+" is invoked successfully");
                         
                     }
                     else
                     {
                        alert(ftConfig.routeCd+"failed");
                     }
                }, error => {
    
                }
            );

            
        
        }
    }


    toInt(){
        //please check this
    }
}