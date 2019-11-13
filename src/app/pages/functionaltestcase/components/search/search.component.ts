declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { FtcConfig } from 'app/models/ftc.model';
import { FtcService } from 'app/services/ftc.service';
import { DataSharingService } from 'app/services/shared.service';
import { FtcFlowService } from 'app/services/ftcflow.service';
import { AlertService } from 'app/services/shared.service';

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
    testResult : boolean = false;
    result: string = 'Ready To Test';
    resultArray:any[] =[];
    


    private subscriptionFetchRoute: Subscription;
    private subscriptionInvokedRoute: Subscription;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private ftcService: FtcService,
        private ftcflowService: FtcFlowService,
        private alertService: AlertService,
        private dataSharingService: DataSharingService
    ) {

    }

    ngOnInit() {
        this.fetchTestCases();
    
    //     for(let i=0;i<=this.resultArray.length;i++)
    //     {
    //             this.resultArray[i]='Not Invoked';
    //     }       
     }

    private fetchTestCases() {
        this.subscriptionFetchRoute = this.ftcService.fetch().subscribe(
            result => {
                if (result && result.length > 0) {
                    this.ftList = result;
                    let i =0;
                    result.forEach(element => {
                        this.resultArray[i]='Not Invoked';
                        i++;
                    });
                }
            }, error => {
                            this.alertService.error("Can not fetch test cases::"+ error);

            }
        );
    }

    ngOnDestroy() {
        if (this.subscriptionFetchRoute && !this.subscriptionFetchRoute.closed) {
            this.subscriptionFetchRoute.unsubscribe();
        }
    }

    disableTest(modalId: string): void {
        if (this.selectedTest) {

        
            // this.subscriptionFetchRoute = this.mwRouteService.delete().subscribe(
            //     result => {
            //         this.fetchRoutes();
            //     }, error => {
    
            //     }
            // );
        }

        //new closeModal(modalId);
    }
    deleteTest(ftConfig: FtcConfig): void {
        if (ftConfig) 
        {
            
            //this.alertService.success("Testcase deleted successfully",false,2000);
            this.subscriptionInvokedRoute = this.ftcService.delete(ftConfig).subscribe(
                result => {
                    new closeModal('deleteWarningModal');
                    this.alertService.success("Testcase deleted successfully",false,2000);
                    this.fetchTestCases();
                }, error => {
                    new closeModal('deleteWarningModal');
                    this.alertService.error(error,false,2000);
                });
            //this.alertService.success("Testcase deleted successfully",false,2000);
            // this.subscriptionFetchRoute = this.mwRouteService.delete().subscribe(
            //     result => {
            //         this.fetchRoutes();
            //     }, error => {
    
            //     }
            // );
        }
    }

    onSelect(ftConfig: FtcConfig): void {
        if (ftConfig) {
            this.dataSharingService.setSharedObject(ftConfig);
            this.router.navigate(['/pg/ftc/ftcd'], { relativeTo: this.route });
        }
    }

    
    playTest(ftConfig: FtcConfig, index: any): void {
        
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
                         //alert(ftConfig.routeCd+" is invoked successfully");
                         this.alertService.success('Test Case Passed!', false, 2000);
                         this.testResult=true;
                         this.result = "Passed";    
                         this.resultArray[index] = "Passed";
                     }
                     else if (result && result['testCaseStatus']=="Failed")
                     {
                        //alert(ftConfig.routeCd+"failed");
                        this.alertService.error("Test Case Failed!", false, 2000);
                        this.testResult = false;
                        this.result = "Failed";
                        this.resultArray[index] = "Failed";
                     }
                     else if (result && result['testCaseStatus']=="no instance")
                     {
                        this.alertService.error("Can not find state Instance.", false, 5000);  
                        this.resultArray[index] = "State Instance Error";
                     }
                     else if (result && result['testCaseStatus']=="Payload error")
                     {
                        this.alertService.error("Payload can not be empty.", false, 5000);  
                        this.resultArray[index] = "Payload error";
                     }
                     else
                     {
                        this.alertService.error(result['testCaseStatus'], false, 5000);
                        this.resultArray[index] = result['testCaseStatus'];
                     }
                }, error => {
                                this.alertService.error("Something went wrong with the invoke method");
                }
            );
        }
    }
    toInt(){
        //please check this
    }
}