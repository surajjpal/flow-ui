import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FlowDashboardService } from '../../../../services/flow.service';
import { ConversationSummary, Dashboard, WorkflowSummary, StateConsumingMaxResTimeTransaction } from '../../../../models/dashboard.model';
import { DateRangePickerComponent } from './daterangepicker/daterangepicker.component';

declare let d3: any;
declare let moment: any;

@Component({
  selector: 'api-flow-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  flowTimelineOptions;
  flowTimelineData;

  rangeOfTransactionInStatesOptions;
  rangeOfTransactionInStatesData;

  groupResourceAllocationInStatesOptions;
  groupResourceAllocationInStatesData;

  transactionValueInStatesOptions
  transactionValueInStatesData;

  avgTimeInStatesOptions;
  avgTimeInStatesData;

  statesConsumingMaxResTimeTransaction;
  workflowSummary;

  private workflowSummarySubscription: Subscription;
  private statesConsumingMaxResTimeTransactionSubscription: Subscription;
  private flowTimelineSubscription: Subscription;
  private rangeOfTransactionInStatesSubscription: Subscription;
  private groupResourceAllocationInStatesSubscription: Subscription;
  private transactionValueInStatesSubscription: Subscription;
  private avgTimeInStatesSubscription: Subscription;
  
  constructor(private dashboardService: FlowDashboardService) { }

  ngOnInit(): void {
    // this.fetchFlowStats();
    this.setupChartOptions();
  }

  ngOnDestroy(): void {
    if (this.workflowSummarySubscription && !this.workflowSummarySubscription.closed) {
      this.workflowSummarySubscription.unsubscribe();
    }
    if (this.flowTimelineSubscription && !this.flowTimelineSubscription.closed) {
      this.flowTimelineSubscription.unsubscribe();
    }
    if (this.rangeOfTransactionInStatesSubscription && !this.rangeOfTransactionInStatesSubscription.closed) {
      this.rangeOfTransactionInStatesSubscription.unsubscribe();
    }
    if (this.groupResourceAllocationInStatesSubscription && !this.groupResourceAllocationInStatesSubscription.closed) {
      this.groupResourceAllocationInStatesSubscription.unsubscribe();
    }
    if (this.transactionValueInStatesSubscription && !this.transactionValueInStatesSubscription.closed) {
      this.transactionValueInStatesSubscription.unsubscribe();
    }
    if (this.avgTimeInStatesSubscription && !this.avgTimeInStatesSubscription.closed) {
      this.avgTimeInStatesSubscription.unsubscribe();
    }
    if (this.statesConsumingMaxResTimeTransactionSubscription && !this.statesConsumingMaxResTimeTransactionSubscription.closed) {
      this.statesConsumingMaxResTimeTransactionSubscription.unsubscribe();
    }

  }

  
  fetchFlowStats(dateRange: any) {
    let fromDate = dateRange.start.format('DD/MM/YYYY');
    let toDate = dateRange.end.format('DD/MM/YYYY');
    let body = {}
    body['startDate'] = fromDate;
    body['endDate'] = toDate;
    
    this.workflowSummarySubscription = this.dashboardService.dashboard_summary(body)
      .subscribe(flowDashboard => { 
        console.log(flowDashboard); 
        this.workflowSummary = flowDashboard['result'];
      })



    this.flowTimelineSubscription = this.dashboardService.flow_timeline(body)
      .subscribe(flowDashboard => { 
        console.log(flowDashboard)
        this.flowTimelineData = flowDashboard['result'] ;
       
      })


    this.rangeOfTransactionInStatesSubscription = this.dashboardService.transaction_range(body)
      .subscribe(flowDashboard => { this.rangeOfTransactionInStatesData = flowDashboard['result']; })


    // this.groupResourceAllocationInStatesSubscription = this.dashboardService.fetch('GROUP_RESOURCE_ALLOCATION_STATES_COUNT', dateRange)
    //   .subscribe(flowDashboard => { this.groupResourceAllocationInStatesData = flowDashboard.nvd3ChartInputList[0]; })
    this.transactionValueInStatesSubscription = this.dashboardService.state_transactions(body)
      .subscribe(flowDashboard => { this.transactionValueInStatesData = flowDashboard['result']; })


    this.avgTimeInStatesSubscription = this.dashboardService.avg_time_states(body)
      .subscribe(flowDashboard => { 
        console.log(flowDashboard);
        this.avgTimeInStatesData = flowDashboard['result']; })

    this.statesConsumingMaxResTimeTransactionSubscription = this.dashboardService.consumption(body)
      .subscribe(flowDashboard => { this.statesConsumingMaxResTimeTransaction = flowDashboard['result']; })
  }

  setupChartOptions() {
    this.flowTimelineOptions = this.lineChartOptionsTimeVsValue("Timeline", "State Count");
    this.rangeOfTransactionInStatesOptions = this.mulitBarChartOptionsStringVsValue("Range of transactions", "State count");
    this.groupResourceAllocationInStatesOptions = this.mulitBarChartOptionsStringVsValue("Resource group", "State Count")
    this.transactionValueInStatesOptions = this.singleBarChartOptionsStringVsValue("Sates", "Transaction values");
    this.avgTimeInStatesOptions = this.singleBarChartOptionsStringVsValue("States", "Time (minutes)");
  }

  
  donutChartOptions() {
    return {
      chart: {
        type: 'pieChart',
        height: 450,
        donut: true,
        x: function (d) { return d.label; },
        y: function (d) { return d.value; },
        showLabels: false,
        pie: {
          dispatch: {
            elementClick: function (e) {
              //  console.log('Element Click');
              //  console.log(e);
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

  lineChartOptionsTimeVsValue(xAxisLabel, yAxisLabel) {
    return {
      chart: {
        type: 'lineWithFocusChart',
        height: 450,
        margin: {
          top: 35,
          right: 35,
          bottom: 35,
          left: 50
        },
        duration: 500,
        useInteractiveGuideline: true,
        forceY: [0],
        xAxis: {
          axisLabel: "Timeline",
          axisLabelDistance: 5,
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d));
          }
        },
        x2Axis: {
          tickFormat: function (d) {
            return d3.time.format('%x')(new Date(d));
          },
          showMaxMin: false
        },
        yAxis: {
          axisLabel: "State Count",
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d3.format('d')(d)
          }
        },
        lines: {
          dispatch: {
            elementClick: function (e) {
              //  console.log('click');
              //  console.log(e);
            }
          }
        }
      }
    };
  }

  lineChartOptionsTimeVsValueTest(xAxisLabel, yAxisLabel) {
    return {
      chart: {
        type: 'lineWithFocusChart',
        height: 450,
        margin: {
          top: 35,
          right: 35,
          bottom: 35,
          left: 50
        },
        duration: 500,
        useInteractiveGuideline: true,
        forceY: [0],
        xAxis: {
          axisLabel: "Timeline",
          axisLabelDistance: 5,
          tickFormat: function (d) {
            return d; //d3.time.format('%x')(new Date(d));
          }
        },
        x2Axis: {
          tickFormat: function (d) {
            return d; //d3.time.format('%x')(new Date(d));
          },
          showMaxMin: false
        },
        yAxis: {
          axisLabel: "State Count",
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d;//d3.format('d')(d)
          }
        },
        lines: {
          dispatch: {
            elementClick: function (e) {
              //  console.log('click');
              //  console.log(e);
            }
          }
        }
      }
    };
  }

  
  singleBarChartOptionsStringVsValue(xAxisLabel, yAxisLabel) {
    return {
      chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
          top: 20,
          right: 20,
          bottom: 50,
          left: 55
        },
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        showValues: true,
        clipEdge: true,
        staggerLabels: true,
        // valueFormat: function(d){
        //   return d3.format(',.4f')(d);
        // },
        duration: 500,
        forceY: [0],
        xAxis: {
          axisLabel: xAxisLabel,
          showMaxMin: true,
          axisLabelDistance: 10,
          tickFormat: function (d) {
            return d;
          }
        },
        yAxis: {
          axisLabel: yAxisLabel,
          axisLabelDistance: -15,
          tickFormat: function (d) {
            return d3.format('d')(d);
          }
        }
      }
    }
  }

  mulitBarChartOptionsStringVsValue(xAxisLabel, yAxisLabel) {
    return {
      chart: {
        type: 'multiBarChart',
        height: 450,
        margin: {
          top: 35,
          right: 20,
          bottom: 70,
          left: 50
        },
        clipEdge: true,
        staggerLabels: true,
        duration: 500,
        stacked: true,
        forceY: [0],
        reduceXTicks: false,
        xAxis: {
          axisLabel: xAxisLabel,
          showMaxMin: true,
          axisLabelDistance: 10,
          tickFormat: function (d) {
            return d;
          }
        },
        yAxis: {
          axisLabel: yAxisLabel,
          axisLabelDistance: -15,
          tickFormat: function (d) {
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

  goalEfficiencyBarChartOptions() {
    return {
      chart: {
        type: 'multiBarChart',
        height: 450,
        margin: {
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
          axisLabel: 'Goals',
          showMaxMin: true,
          tickFormat: function (d) {
            return d3.format('d')(d)
          }
        },
        yAxis: {
          axisLabel: 'Efficiency',
          tickFormat: function (d) {
            return d3.format('d')(d) + '%';
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

  /*
  // this is used to change keys in map with new keys

  parseData(flowDashboard: FlowDashboard) {
    this.data = flowDashboard.nvd3ChartInputList[0].map(function(series) {
      let clone = JSON.parse(JSON.stringify(series.values));
      series.values = null;
      series.values = clone.map(function(d) { return {x: +d.label, y: +d.value } });
      return series;
    });
  }
  */
}
