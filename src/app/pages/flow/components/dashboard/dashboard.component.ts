import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FlowDashboardService } from '../../../../services/flow.service';
import { ConversationSummary, Dashboard } from '../../../../models/agentDashboard.model';
import { DateRangePickerComponent } from './daterangepicker/daterangepicker.component';

declare let d3: any;
declare let moment: any;

@Component({
  selector: 'api-flow-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  episodeCountOptions;
  episodeCountData;

  intentCountOptions;
  intentCountData;

  entityCountOptions;
  entityCountData;

  sentimentCountOptions;
  sentimentCountData;

  goalsCountOptions;
  goalsCountData;

  messagesInEpisodeOptions;
  messagesInEpisodeData;

  goalsEfficiencyOptions;
  goalsEfficiencyData;

  private conversationSubscription: Subscription;
  private episodeSubscription: Subscription;
  private intentSubscription: Subscription;
  private entitySubscription: Subscription;
  private sentimentSubscription: Subscription;
  private goalSubscription: Subscription;
  private messagesSubscription: Subscription;

  constructor(private dashboardService: FlowDashboardService) { }

  ngOnInit(): void {
    // this.fetchFlowStats();
    this.setupChartOptions();
  }

  ngOnDestroy(): void {
    if (this.conversationSubscription && !this.conversationSubscription.closed) {
      this.conversationSubscription.unsubscribe();
    }
    if (this.episodeSubscription && !this.episodeSubscription.closed) {
      this.episodeSubscription.unsubscribe();
    }
    if (this.intentSubscription && !this.intentSubscription.closed) {
      this.intentSubscription.unsubscribe();
    }
    if (this.entitySubscription && !this.entitySubscription.closed) {
      this.entitySubscription.unsubscribe();
    }
    if (this.sentimentSubscription && !this.sentimentSubscription.closed) {
      this.sentimentSubscription.unsubscribe();
    }
    if (this.goalSubscription && !this.goalSubscription.closed) {
      this.goalSubscription.unsubscribe();
    }
    if (this.messagesSubscription && !this.messagesSubscription.closed) {
      this.messagesSubscription.unsubscribe();
    }
  }

  conversationSummary: ConversationSummary;
  fetchFlowStats(dateRange: any) {
    this.conversationSubscription = this.dashboardService.fetch('CONVERSATION_SUMMARY', dateRange)
      .subscribe(flowDashboard => { this.conversationSummary = flowDashboard.conversationSummary; });
    this.episodeSubscription = this.dashboardService.fetch('EPISODE_TIMELINE', dateRange)
      .subscribe(flowDashboard => { this.episodeCountData = flowDashboard.nvd3ChartInputList[0]; });
    this.intentSubscription = this.dashboardService.fetch('INTENT_COUNT', dateRange)
      .subscribe(flowDashboard => { this.intentCountData = flowDashboard.nvd3ChartInputList[0][0].values; });
    this.entitySubscription = this.dashboardService.fetch('ENTITY_COUNT', dateRange)
      .subscribe(flowDashboard => { this.entityCountData = flowDashboard.nvd3ChartInputList[0][0].values; });
    this.sentimentSubscription = this.dashboardService.fetch('SENTIMENT_COUNT', dateRange)
      .subscribe(flowDashboard => { this.sentimentCountData = flowDashboard.nvd3ChartInputList[0][0].values; });
    this.goalSubscription = this.dashboardService.fetch('GOAL_COUNT_AND_EFFICIENCY', dateRange)
      .subscribe(flowDashboard => { this.parseGoalsCountAndEfficiency(flowDashboard); });
    this.messagesSubscription = this.dashboardService.fetch('MESSAGES_IN_EPISODE', dateRange)
      .subscribe(flowDashboard => { this.messagesInEpisodeData = flowDashboard.nvd3ChartInputList[0]; });
  }

  setupChartOptions() {
    this.episodeCountOptions = this.lineChartOptionsTimeVsValue();
    this.intentCountOptions = this.donutChartOptions();
    this.entityCountOptions = this.donutChartOptions();
    this.sentimentCountOptions = this.donutChartOptions();
    this.goalsCountOptions = this.donutChartOptions();
    this.messagesInEpisodeOptions = this.mulitBarChartOptionsStringVsValue();
    this.goalsEfficiencyOptions = this.goalEfficiencyBarChartOptions();
  }

  parseGoalsCountAndEfficiency(flowDashboard: Dashboard) {
    this.goalsCountData = flowDashboard.nvd3ChartInputList[0][0].values;
    this.goalsEfficiencyData = flowDashboard.nvd3ChartInputList[1];
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

  lineChartOptionsTimeVsValue() {
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
          axisLabel: "Episode Count",
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

  mulitBarChartOptionsStringVsValue() {
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
          axisLabel: 'Episodes',
          showMaxMin: true,
          axisLabelDistance: 10,
          tickFormat: function (d) {
            return d;
          }
        },
        yAxis: {
          axisLabel: 'Message Count',
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
