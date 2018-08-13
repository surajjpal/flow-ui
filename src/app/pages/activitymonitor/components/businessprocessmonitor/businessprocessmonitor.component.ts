import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component } from "@angular/core";

import { BusinessProcessMonitorRequest, BusinessProcessMonitorCountPercentageChange, BusinessProcessMonitorGraphData } from '../../../../models/businessprocessmonitor.model'

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
    GRAPH_TYPE_PIE_CHART = "PIE_CHART";
    GRAPH_TYPE_BAR_GRAPH = "BAR_GRAPH";
    GRAPH_TYPE_MULTI_BAR_GRAPH = "MULTI_BAR_GRAPH";
    tempDateRange: any = {}
    businessDataPointsValues = {}
    businessProcessMonitorCountPercentageChange: BusinessProcessMonitorCountPercentageChange[];
    tempBusinessProcessMonitorCountPercentageChange: BusinessProcessMonitorCountPercentageChange[];
    tempBusinessProcessMonitorCountPercentageChangeSplice = [];
    businessProcessMonitorGraphData: BusinessProcessMonitorGraphData[];
    tempBusinessProcessMonitorGraphData: BusinessProcessMonitorGraphData[];
    tempBusinessProcessMonitorGraphDataSplice = [];
    noOfGraphDataDiv = 0
    noOfGraphDataDivArray = [];
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

    setTimeRange(dateTimeRange) {
        console.log("datetimeRange");
        console.log(dateTimeRange);
        if (dateTimeRange != null) {
            this.businessProcessMonitorRequest.startTime = dateTimeRange.start;
            this.businessProcessMonitorRequest.endTime = dateTimeRange.end;
        }
        
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
                    this.submitfilter(true);
                },
                error => {
                    console.log("error");
                    console.log(error);
                }
            )
    }

    setTempBusinessDataPoints() {
        for(let i=0; i<this.divArray.length; i++) {
            if (this.businessDataPoints.length < this.endIndex) {
                this.endIndex = this.businessDataPoints.length;
            }
            console.log("start index " + this.startIndex.toString() + " end index " + this.endIndex.toString());
            this.tempBusinessDataPointsSplice.push(this.tempBusinessDataPoints.splice(this.startIndex, this.endIndex));
            // this.startIndex = this.startIndex + 3;
            // this.endIndex = this.endIndex + 3
        }
    }

    setNoOfPercentageDiv() {
        let endIndex = 6;
        for (let i=0; i<this.noOfPercentagedivArray.length; i++) {
            if (this.businessProcessMonitorCountPercentageChange.length < endIndex) {
                endIndex = this.businessProcessMonitorCountPercentageChange.length;
            }
            this.tempBusinessProcessMonitorCountPercentageChangeSplice.push(this.tempBusinessProcessMonitorCountPercentageChange.splice(0, endIndex));
        }
        console.log("tempBusinessProcessMonitorCountPercentageChangeSplice");
        console.log(this.tempBusinessProcessMonitorCountPercentageChangeSplice);
    }

    setUpGraphDataDiv() {
        let endIndex = 2;
        for(let i=0; i<this.noOfGraphDataDivArray.length; i++) {
            if (this.businessProcessMonitorGraphData.length < endIndex) {
                endIndex = this.businessProcessMonitorGraphData.length;
            }
            this.tempBusinessProcessMonitorGraphDataSplice.push(this.tempBusinessProcessMonitorGraphData.splice(0, endIndex));
            
        }
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log(this.tempBusinessProcessMonitorGraphDataSplice);
    }

    getBusinessGraphDataDiv(outIndex) {
        return this.tempBusinessProcessMonitorGraphDataSplice[outIndex];
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

    submitfilter(initiate?: boolean) {
        console.log("submit filter");
        console.log(this.businessProcessMonitorRequest);
        if (!initiate) {
            this.businessProcessMonitorCountPercentageChange = [];
            this.tempBusinessProcessMonitorCountPercentageChange = [];
            this.tempBusinessProcessMonitorCountPercentageChangeSplice = [];
            this.businessProcessMonitorGraphData = [];
            this.noOfPercentagediv = 0;
            this.noOfPercentagedivArray = [];
        }
        //this.businessProcessMonitorRequest.startTime = null;
        //this.businessProcessMonitorRequest.endTime = null;
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
                            if (this.businessProcessMonitorCountPercentageChange.length % 6 >=0) {
                                this.noOfPercentagediv = this.noOfPercentagediv + 1;
                            }
                            console.log("noOfPercentageDiv");
                            console.log(this.noOfPercentagediv);
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
                            this.businessProcessMonitorGraphData = response;
                            for (let gdata of this.businessProcessMonitorGraphData) {
                                for (let dataPoints of this.businessDataPoints) {
                                    if (dataPoints.dataPointName == gdata.dataPointName) {
                                        if(dataPoints.graphType == this.GRAPH_TYPE_BAR_GRAPH) {
                                            
                                            gdata.options = this.singleBarBarChartOptions(gdata.dataPointLabel, 'value');
                                            console.log("bar graph");
                                            console.log(gdata);
                                        }
                                        else {
                                            gdata.options = this.donutChartOptions();
                                        }
                                    }
                                    
                                }
                                
                            }
                            
                        },
                        error => {
                            console.log("get graph data error");
                            console.log(error);
                        }
                    )
    }


    // ************************ graph **************************
    donutChartOptions() {
        return {
          chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showLabels: false,
            pie: {
              dispatch: {
                elementClick: function(e) {
                 // console.log('Element Click');
                 // console.log(e);
                }            
              }
            },
            duration: 500,
            legend: {
              margin: {
                top: 5,
                right: 5,
                bottom: 5,
                left: 5
              }
            }
          }
        };
    }

    singleBarBarChartOptions(xAxisLabel?: string, yAxisLabel?: string) {
        if (xAxisLabel == null) {
            xAxisLabel = 'X'
        }
        if (yAxisLabel == null) {
            yAxisLabel = 'Y'
        }
        return {
          chart: {
            type: 'multiBarChart',
            staggerLabels: true,
            height: 450,
            margin : {
              top: 35,
              right: 20,
              bottom: 50,
              left: 60
            },
            clipEdge: true,
            duration: 500,
            stacked: true,
            showControls: false,
            forceY: [0, 100],
            reduceXTicks: false,
            xAxis: {
              axisLabel: xAxisLabel,
              showMaxMin: true,
              tickFormat: function(d){
                return d;
              }
            },
            yAxis: {
              axisLabel: yAxisLabel,
              tickFormat: function(d){
                return d3.format('d')(d);
              }
            },
            multibar: {
              dispatch: {
                elementClick: function (e) {
                //  console.log('click');
                //  console.log(e);
                }
              }
            }
          }
        }
      }
    
}