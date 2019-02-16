import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component } from "@angular/core";

import { BusinessProcessMonitorRequest, BusinessProcessMonitorCountPercentageChange, BusinessProcessMonitorGraphData, OnDemandReportRequest } from '../../../../models/businessprocessmonitor.model'

import { ActivityMonitorService } from '../../../../services/activitymonitor.service'
import { GraphService } from  '../../../../services/flow.service'

import { Subscription } from "rxjs/Subscription";
import { GraphObject, DataPoint,CommonSearchModel } from "app/models/flow.model";

declare let moment: any;

@Component({
    selector: 'api-businessprocessmonitor',
    templateUrl: './businessprocessmonitor.component.html',
    styleUrls: ['./businessprocessmonitor.scss']
  })
export class BusinessProcessMonitorcomponent implements OnInit, OnDestroy {

    graphObjects: GraphObject[]
    graphObjectFilterByMachineTypes: GraphObject[];
    businessProcessMonitorRequest: BusinessProcessMonitorRequest;
    onDemandReportRequest:OnDemandReportRequest;
    businessDataPointConfiguationsForGraph: DataPoint[];
    businessDataPoints: DataPoint[];
    tempBusinessDataPoints: DataPoint[];
    tempBusinessDataPointsSplice = [];
    flowstatuses = ["ACTIVE", "CLOSED"];
    GRAPH_TYPE_PIE_CHART = "PIE_CHART";
    GRAPH_TYPE_BAR_GRAPH = "BAR_GRAPH";
    GRAPH_TYPE_MULTI_BAR_GRAPH = "MULTI_BAR_GRAPH";
    HTML_COMMOM_COLORS = { "red" : "red", "green" : "green", "amber" : "#FFA500", "red_partial" : "#F73232", "amber_partial" :  "#FB9D17" };
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
    loading = false;


    private subscription: Subscription;


    constructor(
        private activityMonitorService: ActivityMonitorService,
        private graphService: GraphService

    ) {
        this.businessProcessMonitorRequest = new BusinessProcessMonitorRequest();
        this.onDemandReportRequest = new OnDemandReportRequest();
        this.businessDataPoints = [];
        this.tempBusinessDataPoints = [];
        this.businessDataPointsValues = {};
        this.businessProcessMonitorCountPercentageChange = [];
        this.tempBusinessProcessMonitorCountPercentageChangeSplice = [];
    }

    ngOnInit() {
        this.loading=true;
        this.tempDateRange.start = moment().startOf('day');
        this.tempDateRange.end = moment().endOf('day');
        let commonsearchModel = new CommonSearchModel();
        commonsearchModel.searchParams = [{"statusCd":"ACTIVE"},{"statusCd":"DRAFT"},{"statusCd":"CLOSED"}];
        commonsearchModel.returnFields = ["machineLabel","version","statusCd","machineType","dataPointConfigurationList", "states"];
        this.subscription = this.graphService.fetch(commonsearchModel)
                            .subscribe(
                                response => {
                                    if (response.length>0) {
                                        this.graphObjects = response;
                                        this.setFilterMachineTypes();
                                        const machineType = response[0].machineType;
                                        //this.getBusinessDataPoints(machineType, true);
                                    }
                                    this.loading=false;
                                },
                                error => {
                                    this.loading=false;
                                }
                            )

    }
      
    ngOnDestroy(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    setFilterMachineTypes() {
        this.graphObjectFilterByMachineTypes = [];
        if (this.graphObjects && this.graphObjects.length > 0) {

            for (let gf of this.graphObjects) {
                let found = false
                for (let fgf of this.graphObjectFilterByMachineTypes) {
                    if (fgf.machineType == gf.machineType) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    this.graphObjectFilterByMachineTypes = this.graphObjectFilterByMachineTypes.concat(gf);
                }
            }
        }
        return this.graphObjectFilterByMachineTypes;
    }

    onMachineTypeSelect() {
        // this.loading=true;
        // this.businessDataPoints = [];
        // this.tempBusinessDataPoints = [];
        // this.noOfHorizontalDiv = 0;
        // this.divArray = [];
        
        // this.businessProcessMonitorCountPercentageChange = [];
        // this.tempBusinessProcessMonitorCountPercentageChange = [];
        // this.tempBusinessProcessMonitorCountPercentageChangeSplice = [];
        // this.businessProcessMonitorGraphData = [];
        // this.noOfPercentagediv = 0;
        // this.noOfPercentagedivArray = [];
        // this.getBusinessDataPoints(this.businessProcessMonitorRequest.machineType);
        // this.loading=true;
        }

    setTimeRange(dateTimeRange) {
        if (dateTimeRange != null) {
            this.businessProcessMonitorRequest.startTime = dateTimeRange.start;
            this.businessProcessMonitorRequest.endTime = dateTimeRange.end;
        }
        
    }

    setTimeRangeReport(dateTimeRange) {
        if (dateTimeRange != null) {
            this.onDemandReportRequest.startDate = dateTimeRange.start.format('YYYY-MM-DD');
            this.onDemandReportRequest.endDate = dateTimeRange.end.format('YYYY-MM-DD');
        }
    }

    getBusinessDataPoints(machinetype: string, getResult?: boolean) {
        this.loading=true;
        this.activityMonitorService.getDataPoints(machinetype)
            .subscribe(
                response => {
                    this.loading=true;
                    this.businessProcessMonitorRequest.machineType = machinetype;
                    this.businessDataPoints = response;
                    this.tempBusinessDataPoints = JSON.parse(JSON.stringify(response));
                    this.noOfHorizontalDiv = this.businessDataPoints.length / 3;
                    this.noOfHorizontalDiv = Math.floor(this.noOfHorizontalDiv);
                    if (this.businessDataPoints.length % 3 >0) {
                        this.noOfHorizontalDiv = this.noOfHorizontalDiv + 1;
                    }
                    this.divArray = [];
                    for (let i=0; i< this.noOfHorizontalDiv; i++) {
                        this.divArray.push(i);
                    }
                    this.setTempBusinessDataPoints();
                    for (let dataPoint of this.businessDataPoints) {
                        this.businessProcessMonitorRequest.dataPoints[dataPoint.dataPointName] = null;
                    }
                    //this.setBusinessDataPonitValues();
                    if(getResult) {
                        this.getResult();
                    }
                    this.loading=true;
                },
                error => {
                    this.loading=true; 
                }
            )
    }

    setTempBusinessDataPoints() {
        this.loading=true;
        for(let i=0; i<this.divArray.length; i++) {
            if (this.businessDataPoints.length < this.endIndex) {
                this.endIndex = this.businessDataPoints.length;
            }
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
        
    }

    setUpGraphDataDiv() {
        let endIndex = 2;
        for(let i=0; i<this.noOfGraphDataDivArray.length; i++) {
            if (this.businessProcessMonitorGraphData.length < endIndex) {
                endIndex = this.businessProcessMonitorGraphData.length;
            }
            this.tempBusinessProcessMonitorGraphDataSplice.push(this.tempBusinessProcessMonitorGraphData.splice(0, endIndex));
            
        }
        
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
        this.loading=true;
        this.activityMonitorService.getDataPointValues(this.businessProcessMonitorRequest)
                .subscribe(
                    response => {
                        this.businessDataPointsValues = response;
                        this.loading=false;
                    },
                    error => {
                        this.loading=false;
                    }
                )
    }

    submitfilter(initiate?: boolean) {
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
        //this.getBusinessDataPoints(this.businessProcessMonitorRequest.machineType, true);
        this.businessDataPointConfiguationsForGraph = []
        let businessDataPointConfiguationsForSummary = []
        let businessStatesForSummary = [];
        for (let graphData of this.graphObjects) {
            if (!this.businessProcessMonitorRequest.companyId) {
                this.businessProcessMonitorRequest.companyId = graphData.companyId;
            }
            
            
            if (graphData.machineType == this.businessProcessMonitorRequest.machineType) {
               
                if (this.businessProcessMonitorRequest.machineIds.indexOf(graphData._id) == -1) {
                    this.businessProcessMonitorRequest.machineIds = this.businessProcessMonitorRequest.machineIds.concat(graphData._id);
                }
                for (let dataPointconfig of graphData.dataPointConfigurationList) {
                    let found = false;
                    
                    if (graphData.statusCd == 'ACTIVE' && dataPointconfig.businessMonitorKey && dataPointconfig.graphType != null) {
                        this.businessDataPointConfiguationsForGraph = this.businessDataPointConfiguationsForGraph.concat(dataPointconfig);
                    }
                    
                    if (graphData.statusCd == 'ACTIVE' && dataPointconfig.businessMonitorKey && (dataPointconfig.percentageChange || dataPointconfig.businessKeyFlag )) {
                        businessDataPointConfiguationsForSummary = businessDataPointConfiguationsForSummary.concat(dataPointconfig);
                    }
                    if (graphData.statusCd == 'ACTIVE') {
                        for (let stateData of graphData.states) {
                            if (stateData.businessMonitorFlag) {
                                businessStatesForSummary.push(stateData.stateCd);
                            }
                        }
                    }
                    for (let businessDataPointConfig of this.businessProcessMonitorRequest.dataPointConfigurations) {
                        if (businessDataPointConfig.dataPointName == dataPointconfig.dataPointName) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        this.businessProcessMonitorRequest.dataPointConfigurations = this.businessProcessMonitorRequest.dataPointConfigurations.concat(dataPointconfig);
                    }
                }
            }
        }
        console.log("changes reflecting")
        console.log("submit filter");
        console.log(this.businessDataPointConfiguationsForGraph);
        for (let graphDataPoint of this.businessDataPointConfiguationsForGraph) {
            this.businessProcessMonitorRequest.selectedDataPointConfiguration = JSON.parse(JSON.stringify(graphDataPoint));
            
            this.getFilterGraphData(graphDataPoint);
            
        }
        for (let summaryDataConfig of businessDataPointConfiguationsForSummary) {
            this.businessProcessMonitorRequest.selectedDataPointConfiguration = JSON.parse(JSON.stringify(summaryDataConfig));
            this.getCountWithPercentage(summaryDataConfig);
        }

        for (let stateCd of businessStatesForSummary) {
            this.businessProcessMonitorRequest.stateCd = JSON.parse(JSON.stringify(stateCd));
            this.getStateCountWithPercentage();
        }
        
    }

    sendEmail(initiate?: boolean) {
        console.log("send email filter");
        console.log(this.onDemandReportRequest);
        this.sendEmailCSV();
    }

    getResult() {
        this.businessProcessMonitorCountPercentageChange = [];
        this.tempBusinessProcessMonitorCountPercentageChange = [];
        this.tempBusinessProcessMonitorCountPercentageChangeSplice = [];
        this.businessProcessMonitorGraphData = [];
        this.noOfPercentagediv = 0;
        this.noOfPercentagedivArray = [];
        this.getGraphData();
    }

    getCountWithPercentage(dataPoint: DataPoint) {
        console.log("----------------------inside----------------------------------")
        this.loading=true;
        this.activityMonitorService.getCountwithPercentageChange(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            if (dataPoint.businessKeyFlag) {
                                response.sequence = 0;
                            }
                            else {
                                response.sequence = dataPoint.sequence;
                            }
                            this.businessProcessMonitorCountPercentageChange = this.businessProcessMonitorCountPercentageChange.concat(response);
                            
                            this.loading=false;
                            this.businessProcessMonitorCountPercentageChange.sort((a , b) => {
                                if (a.sequence < b.sequence) return -1;
                                else if (a.sequence > b.sequence) return 1;
                                else return 0;
                              });
                        },
                        error => {
                            this.loading=false;
                        }
                    )
    }

    getStateCountWithPercentage() {
        this.activityMonitorService.getCountwithPercentageChange(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            console.log("statedata");
                            console.log(response);
                        },
                        error => {
                            console.log("error");
                            console.log(error);
                        }
                    )
    }

    getGraphData() {
        this.loading=true;
        this.activityMonitorService.getGraphData(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            this.businessProcessMonitorGraphData = response;
                            for (let gdata of this.businessProcessMonitorGraphData) {
                                for (let dataPoints of this.businessDataPoints) {
                                    if (dataPoints.dataPointName == gdata.dataPointName) {
                                        if(dataPoints.graphType == this.GRAPH_TYPE_BAR_GRAPH) {
                                            
                                            gdata.options = this.singleDiscreteChartOptions(dataPoints.dataPointLabel, "Value");
                                            
                                        }
                                        else {
                                            const colors = []
                                            for (let donutData of gdata.result) {
                                                if ( donutData != null && donutData['label'] != null && typeof donutData['label'] === 'string' && this.HTML_COMMOM_COLORS[donutData['label']] != null) {
                                                    donutData['color'] = this.HTML_COMMOM_COLORS[donutData['label']]
                                                }
                                                else {
                                                    donutData['color'] = '#' + Math.floor(Math.random()*16777215).toString(16);
                                                    // while (this.HTML_COMMOM_COLORS.indexOf(donutData['color'].toLowerCase()) != -1) {
                                                    //     donutData['color'] = '#' + Math.floor(Math.random()*16777215).toString(16);
                                                    // }
                                                    
                                                }
                                                colors.push(donutData["label"]);
                                            }
                                            gdata.options = this.donutChartOptions();
                                        }
                                    }
                                    
                                }
                                
                            }
                           this.loading=false; 
                        },
                        error => {
                          this.loading=false;  
                        }
                    )
    }

    sendEmailCSV() {
        this.activityMonitorService.sendReportCSV(this.onDemandReportRequest)
                    .subscribe(
                        response => {
                            let gdata = response;
                            if (gdata != null) {

                            }
                            
                            this.loading=false; 
                        },
                        error => {
                          this.loading=false;  
                        }
                    )   
    }

    getFilterGraphData(dataPoint: DataPoint) {
        this.activityMonitorService.getGraphDataForDataPoint(this.businessProcessMonitorRequest)
                    .subscribe(
                        response => {
                            let gdata = response;
                            if (gdata != null && dataPoint.graphType != null) {
                                if (dataPoint.dataPointName == gdata.dataPointName) {
                                    if (dataPoint.graphType == this.GRAPH_TYPE_BAR_GRAPH) {
                                        gdata.options = this.singleDiscreteChartOptions(dataPoint.dataPointLabel, "Value");
                                        gdata.sequence = dataPoint.sequence
                                        this.businessProcessMonitorGraphData = this.businessProcessMonitorGraphData.concat(gdata);
                                    }
                                    else if (dataPoint.graphType == this.GRAPH_TYPE_PIE_CHART && gdata.result) {
                                        const colors = []
                                        for (let donutData of gdata.result) {
                                            if ( donutData != null && donutData['label'] != null && typeof donutData['label'] === 'string' && this.HTML_COMMOM_COLORS[donutData['label']] != null) {
                                                donutData['color'] = this.HTML_COMMOM_COLORS[donutData['label']]
                                            }
                                            else {
                                                donutData['color'] = '#' + Math.floor(Math.random()*16777215).toString(16);
                                                // while (this.HTML_COMMOM_COLORS.indexOf(donutData['color'].toLowerCase()) != -1) {
                                                //     donutData['color'] = '#' + Math.floor(Math.random()*16777215).toString(16);
                                                // }
                                                
                                            }
                                            colors.push(donutData["label"]);
                                        }
                                        gdata.options = this.donutChartOptions();
                                        gdata.sequence = dataPoint.sequence;
                                        this.businessProcessMonitorGraphData = this.businessProcessMonitorGraphData.concat(gdata);
                                    }
                                }
                                this.businessProcessMonitorGraphData.sort((a , b) => {
                                    if (a.sequence < b.sequence) return -1;
                                    else if (a.sequence > b.sequence) return 1;
                                    else return 0;
                                  });
                            }
                            
                            this.loading=false; 
                        },
                        error => {
                          this.loading=false;  
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
            y: function(d){return parseFloat(d.value).toFixed(2);},
            showLabels: true,
            showTooltipPercent: true,
            pie: {
              dispatch: {
                elementClick: function(e) {
                 // console.log('Element Click');
                 // console.log(e);
                }            
              }
            },
            color: function(d,i){
                return (d.color) || '#' + Math.floor(Math.random()*16777215).toString(16)
            },
            pieLabelsOutside: false,
            labelType: 'percent',
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

    singleDiscreteChartOptions(xAxisLabel, yAxisLabel) {
        return  {
            chart: {
                type: 'discreteBarChart',
                height: 450,
                margin : {
                    top: 35,
                    right: 20,
                    bottom: 70,
                    left: 60
                },
                staggerLabels: true,
                x: function(d){return d.label;},
                y: function(d){return d.value + (1e-10);},
                showValues: true,
                valueFormat: function(d){
                    return d3.format(',.2f')(d);
                },
                duration: 500,
                xAxis: {
                    axisLabel: xAxisLabel
                },
                yAxis: {
                    axisLabel: yAxisLabel,
                    axisLabelDistance: -10
                }
            }
        };
    }

    multiBarBarChartOptions(xAxisLabel?: string, yAxisLabel?: string) {
        if (xAxisLabel == null) {
            xAxisLabel = 'X'
        }
        if (yAxisLabel == null) {
            yAxisLabel = 'Y'
        }
        return {
          chart: {
            type: 'discreteBarChart',
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
            stacked: false,
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