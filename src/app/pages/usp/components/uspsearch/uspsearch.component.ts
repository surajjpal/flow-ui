import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component } from "@angular/core";
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';

import { USPService } from '../../../../services/usp.service'
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { USPSearchRequest, USPSearchResult, USPSearchResultData } from "app/models/usp.model";

@Component({
    selector: 'api-uspsearch',
    templateUrl: './uspsearch.component.html',
    styleUrls: ['./uspsearch.scss']
})
export class USPSearchComponent implements OnInit, OnDestroy {

    uspSearchRequest: USPSearchRequest;
    uspSearchResult: USPSearchResult;
    searchResultData: USPSearchResultData[];
    maxScore: number;

    constructor(
        private uspService: USPService,
        private stateService: StateService,
        private dataCachingService: DataCachingService,
        private router: Router,
        private route: ActivatedRoute,
    )
    {
        this.uspSearchRequest = new USPSearchRequest();
        this.uspSearchResult = new USPSearchResult();
        this.searchResultData = [];
        this.maxScore = 0;
    }
    
    ngOnInit() {

    }

    ngOnDestroy() {

    }

    onUSPSearch() {
        console.log("on usp search");
        this.searchResultData = [];
        this.getSearchResult(false);
        
    }

    onSearchLoadMore() {
        this.uspSearchRequest.scrollId = this.uspSearchResult.scrollId;
        this.uspSearchRequest.maxScore = this.maxScore;
        this.getSearchResult(true);

    }

    getSearchResult(isLoadMore?: boolean) {
        this.uspService.search(this.uspSearchRequest)
                .subscribe(
                    response => {
                       console.log("search result success");
                       console.log(response);
                       this.uspSearchResult = response;
                       for (let data of this.uspSearchResult.result) {
                           this.searchResultData.push(data);
                       }
                       if (!isLoadMore && this.searchResultData.length > 0) {
                           this.maxScore = this.searchResultData[0].maxScore;
                       }
                       console.log(this.searchResultData);
                       
                    },
                    error => {
                        console.log("search result failed");
                        console.log(error);
                    }
                )
    }

    uspSelfTrain(data: USPSearchResultData) {
        const redirectLink = data.data.link; 
        const highlight = data.highlight; 
        const entityType = data.data.entityType;
        var highlightData = [];
        if (highlight) {
          var temp = {}
          for (var key in highlight) {
            temp = {}
            temp[key] = highlight[key];
            highlightData.push(temp);
          }
          temp = {}
          temp["entityType"] = [entityType];
          highlightData.push(temp);
        }
        this.uspService.selfTrainSerchData(highlightData, this.uspSearchRequest.searchText);
        window.open(
            redirectLink,
            '_blank' // <- This is what makes it open in a new window.
            );
        // if (entityType == "Flow" || entityType == "State") {
        //     if (redirectLink) {
        //         const flowId = redirectLink.split("/")[redirectLink.split("/").length - 1];
        //         console.log("flowId " + flowId);
        //         console.log("processmodel");
        //         console.log(data.data["payload"]);
        //         const subscriptionXML = this.stateService.getXMLforActiveState(flowId)
        //         .subscribe(graphObject => {
        //             const entityId = data.data["payload"]["entityId"];
        //             window.open(
        //                 '/#/pg/flw/flpa/' + flowId + "/" + entityId,
        //                 '_blank' // <- This is what makes it open in a new window.
        //                 );
        //             //this.router.navigate(['/pg/flw/flpa'], { relativeTo: this.route});
        //         });
        //     }
            
        // }
        // else {
        //     window.open(
        //     redirectLink,
        //     '_blank' // <- This is what makes it open in a new window.
        //     );
        // }
        
      }
}