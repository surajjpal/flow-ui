import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component } from "@angular/core";

import { BusinessProcessMonitorRequest, BusinessProcessMonitorCountPercentageChange } from '../../../../models/businessprocessmonitor.model'

import { ActivityMonitorService } from '../../../../services/activitymonitor.service'
import { GraphService } from  '../../../../services/flow.service'

import { Subscription } from "rxjs/Subscription";
import { GraphObject, DataPoint } from "app/models/flow.model";

declare let moment: any;

@Component({
    selector: 'api-businessprocessmonitor',
    templateUrl: './businessprocessmonitor.component.html',
    styleUrls: ['./businessprocessmonitor.scss']
  })
export class BusinessProcessMonitorcomponent implements OnInit, OnDestroy {

    graphObjects: GraphObject[]
    businessProcessMonitorRequest: BusinessProcessMonitorRequest;
    businessDataPoints: DataPoint[];
    tempBusinessDataPoints: DataPoint[];
    tempBusinessDataPointsSplice = [];
    flowstatuses = ["ACTIVE", "CLOSED"];
    tempDateRange: any = {}
    businessDataPointsValues = {}
    businessProcessMonitorCountPercentageChange: BusinessProcessMonitorCountPercentageChange[];
    tempBusinessProcessMonitorCountPercentageChange: BusinessProcessMonitorCountPercentageChange[];
    tempBusinessProcessMonitorCountPercentageChangeSplice = [];
    noOfHorizontalDiv = 0;
    divArray = []
    noOfPercentagediv = 0;
    noOfPercentagedivArray = [];
    startIndex = 0;
    endIndex= 3;

    private subscription: Subscription;


    constructor(
        private activityMonitorService: ActivityMonitorService,
        private graphService: GraphService

    ) {
        this.businessProcessMonitorRequest = new BusinessProcessMonitorRequest();
        this.businessDataPoints = [];
        this.tempBusinessDataPoints = [];
        this.businessDataPointsValues = {};
        this.businessProcessMonitorCountPercentageChange = [];
        this.tempBusinessProcessMonitorCountPercentageChangeSplice = [];
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
                                        this.getBusinessDataPoints(machineType);
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

    getBusinessDataPoints(machinetype: string) {
        this.activityMonitorService.getDataPoints(machinetype)
            .subscribe(
                response => {
                    console.log("success response");
                    console.log(response);
                    this.businessProcessMonitorRequest.machineType = machinetype;
                    this.businessDataPoints = response;
                    this.tempBusinessDataPoints = JSON.parse(JSON.stringify(response));
                    this.noOfHorizontalDiv = this.businessDataPoints.length / 3;
                    this.noOfHorizontalDiv = Math.floor(this.noOfHorizontalDiv);
                    if (this.businessDataPoints.length % 3 >0) {
                        this.noOfHorizontalDiv = this.noOfHorizontalDiv + 1;
                    }
                    for (let i=0; i< this.noOfHorizontalDiv; i++) {
                        this.divArray.push(i);
                    }
                    console.log("no of business data points");
                    console.log(this.businessDataPoints.length);
                    console.log("not of divs");
                    console.log(this.noOfHorizontalDiv);
                    this.setTempBusinessDataPoints();
                    for (let dataPoint of this.businessDataPoints) {
                        this.businessProcessMonitorRequest.dataPoints[dataPoint.dataPointName] = null;
                    }
                    this.setBusinessDataPonitValues();
                    this.submitfilter();
                },
                error => {
                    console.log("error");
                    console.log(error);
                }
            )
    }

    setTempBusinessDataPoints() {
        for(let i=0; i<this.divArray.length; i++) {
            if (this.businessDataPoints.length - 1 < this.endIndex) {
                this.endIndex = this.businessDataPoints.length - 1;
            }
            console.log("start index " + this.startIndex.toString() + " end index " + this.endIndex.toString());
            this.tempBusinessDataPointsSplice.push(this.tempBusinessDataPoints.splice(this.startIndex, this.endIndex));
            // this.startIndex = this.startIndex + 3;
            // this.endIndex = this.endIndex + 3
        }
    }

    setNoOfPercentageDiv() {
        let endIndex = 6
        for (let i=0; i<this.noOfPercentagedivArray.length; i++) {
            if (this.businessProcessMonitorCountPercentageChange.length < endIndex) {
                endIndex = this.businessProcessMonitorCountPercentageChange.length - 1;
            }
            this.tempBusinessProcessMonitorCountPercentageChangeSplice.push(this.tempBusinessProcessMonitorCountPercentageChange.splice(0, endIndex));
        }
    }

    getBusinessProcessPercentageChange(outIndex) {
        return this.tempBusinessProcessMonitorCountPercentageChangeSplice[outIndex];
    }

    getBusinessDataPoint(outIndex) {
        return this.tempBusinessDataPointsSplice[outIndex];
    }

    
    getBusinessDataPonitValuesFromDataPointKey(dataPonitKey: string) {
        for(let dp in this.businessDataPointsValues) {
            if (dp == dataPonitKey) {
                return this.businessDataPointsValues[dp];
            }
        }
        return [];
    }

    setBusinessDataPonitValues() {
        this.activityMonitorService.getDataPointValues(this.businessProcessMonitorRequest)
                .subscribe(
                    response => {
                        console.log("success response");
                        console.log(response);
                        this.businessDataPointsValues = response;
                    },
                    error => {
                        console.log("error");
                        console.log(error);
                    }
                )
    }

    submitfilter() {
        console.log("submit filter");
        console.log(this.businessProcessMonitorRequest);
        this.getCountWithPercentage();
        this.getGraphData();
    }

    getCountWithPercentage() {
        this.activityMonitorService.getCountwithPercentageChange(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            console.log("get count with percentage success");
                            console.log(response)
                            this.businessProcessMonitorCountPercentageChange = response;
                            this.tempBusinessProcessMonitorCountPercentageChange = JSON.parse(JSON.stringify(response));
                            this.noOfPercentagediv = this.businessProcessMonitorCountPercentageChange.length / 6;
                            this.noOfPercentagediv = Math.floor(this.noOfPercentagediv);
                            if (this.businessProcessMonitorCountPercentageChange.length % 6 >0) {
                                this.noOfPercentagediv = this.noOfPercentagediv + 1;
                            }
                            for (let i=0; i<this.noOfPercentagediv; i++) {
                                this.noOfPercentagedivArray.push(i);
                            }
                            this.setNoOfPercentageDiv();
                        },
                        error => {
                            console.log("get count with percentage error");
                            console.log(error);
                        }
                    )
    }

    getGraphData() {
        this.activityMonitorService.getGraphData(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            console.log("get graph data success");
                            console.log(response);
                        },
                        error => {
                            console.log("get graph data error");
                            console.log(error);
                        }
                    )
    }
}