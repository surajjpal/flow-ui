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

  statesConsumingMaxResTimeTransaction: StateConsumingMaxResTimeTransaction;
  workflowSummary: WorkflowSummary;

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
    this.workflowSummarySubscription = this.dashboardService.fetch('WORKFLOW_SUMMARY', dateRange)
      .subscribe(flowDashboard => { this.workflowSummary = flowDashboard.workflowSummary; })
    this.flowTimelineSubscription = this.dashboardService.fetch('FLOW_TIMELINE', dateRange)
      .subscribe(flowDashboard => { this.flowTimelineData = flowDashboard.nvd3ChartInputList[0]; })
    this.rangeOfTransactionInStatesSubscription = this.dashboardService.fetch('RANGE_TRANSACTION_IN_STATES_COUNT', dateRange)
      .subscribe(flowDashboard => { this.rangeOfTransactionInStatesData = flowDashboard.nvd3ChartInputList[0]; })
    this.groupResourceAllocationInStatesSubscription = this.dashboardService.fetch('GROUP_RESOURCE_ALLOCATION_STATES_COUNT', dateRange)
      .subscribe(flowDashboard => { this.groupResourceAllocationInStatesData = flowDashboard.nvd3ChartInputList[0]; })
    this.transactionValueInStatesSubscription = this.dashboardService.fetch('TRANSACTION_IN_STATES_COUNT', dateRange)
      .subscribe(flowDashboard => { this.transactionValueInStatesData = flowDashboard.nvd3ChartInputList[0]; })
    this.avgTimeInStatesSubscription = this.dashboardService.fetch('AVERAGE_TIME_IN_STATES', dateRange)
      .subscribe(flowDashboard => { this.avgTimeInStatesData = flowDashboard.nvd3ChartInputList[0]; })
    this.statesConsumingMaxResTimeTransactionSubscription = this.dashboardService.fetch('STATES_CONSUME_MAX_BY_RESOURCEGROUP_TIME_TRANSACTIONVALUE', dateRange)
      .subscribe(flowDashboard => { this.statesConsumingMaxResTimeTransaction = flowDashboard.stateConsumingMaxResTimeTransaction; })
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
