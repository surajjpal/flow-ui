import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component } from "@angular/core";

import { BusinessProcessMonitorRequest } from '../../../../models/businessprocessmonitor.model'

import { ActivityMonitorService } from '../../../../services/activitymonitor.service'
import { GraphService } from  '../../../../services/flow.service'

import { Subscription } from "rxjs/Subscription";
import { GraphObject } from "app/models/flow.model";

declare let moment: any;

@Component({
    selector: 'api-businessprocessmonitor',
    templateUrl: './businessprocessmonitor.component.html',
    styleUrls: ['./businessprocessmonitor.scss']
  })
export class BusinessProcessMonitorcomponent implements OnInit, OnDestroy {

    graphObjects: GraphObject[]
    businessProcessMonitorRequest: BusinessProcessMonitorRequest;
    flowstatuses = ["ACTIVE", "CLOSED"];
    tempDateRange: any = {}

    private subscription: Subscription;


    constructor(
        private activityMonitorService: ActivityMonitorService,
        private graphService: GraphService

    ) {
        this.businessProcessMonitorRequest = new BusinessProcessMonitorRequest();
    }

    ngOnInit() {
        console.log("ngoninit");
        this.tempDateRange.start = moment().startOf('day');
        this.tempDateRange.end = moment().endOf('day');
        this.subscription = this.graphService.fetch('ACTIVE')
                            .subscribe(
                                response => {
                                    console.log("graph object");
                                    console.log(response);
                                    if (response.length>0) {
                                        this.graphObjects = response;
                                        const machineType = response[1].machineType;
                                        this.businessProcessMonitorRequest.machineType = machineType;
                                        this.activityMonitorService.getDataPointValues(this.businessProcessMonitorRequest)
                                        .subscribe(
                                            response => {
                                                console.log("success response");
                                                console.log(response);
                                            },
                                            error => {
                                                console.log("error");
                                                console.log(error);
                                            }
                                        )
                                    }
                                },
                                error => {
                                    console.log("graph object error");
                                    console.log(error);
                                }
                            )

    }
      
    ngOnDestroy(): void {
        console.log("ngdestroy");
    }
}