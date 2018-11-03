import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { FlowDashboardService } from '../../../../services/flow.service';
import { ConversationSummary, Dashboard, WorkflowSummary, StateConsumingMaxResTimeTransaction } from '../../../../models/dashboard.model';
import { DateRangePickerComponent } from './daterangepicker/daterangepicker.component';
// import { APISpinnerComponent } from '../../../../shared/components/api-spinner/api-spinner.component'

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

  testData() {
    {
      var sin = [],
          cos = [];
    
      for (var i = 0; i < 100; i++) {
        sin.push({x: i, y: Math.sin(i/10)});
        cos.push({x: i, y: .5 * Math.cos(i/10)});
      }
    
      return [{
        "values": [{
          "y": 1,
          "x": 1536658573636
        },
        {
          "y": 1,
          "x": 1536658558906
        },
        {
          "y": 1,
          "x": 1536658425152
        },
        {
          "y": 1,
          "x": 1536651209275
        },
        {
          "y": 1,
          "x": 1536650910413
        },
        {
          "y": 1,
          "x": 1536650706155
        },
        {
          "y": 1,
          "x": 1536650621514
        },
        {
          "y": 1,
          "x": 1536647161314
        },
        {
          "y": 1,
          "x": 1536647142782
        },
        {
          "y": 1,
          "x": 1536647106781
        },
        {
          "y": 1,
          "x": 1536647032804
        },
        {
          "y": 1,
          "x": 1536647000105
        },
        {
          "y": 1,
          "x": 1536607313335
        },
        {
          "y": 1,
          "x": 1536596646363
        },
        {
          "y": 1,
          "x": 1536596644844
        },
        {
          "y": 1,
          "x": 1536596643294
        },
        {
          "y": 1,
          "x": 1536596641283
        },
        {
          "y": 1,
          "x": 1536586692103
        },
        {
          "y": 1,
          "x": 1536586561108
        },
        {
          "y": 1,
          "x": 1536586434993
        },
        {
          "y": 1,
          "x": 1536586393202
        },
        {
          "y": 1,
          "x": 1536586315049
        },
        {
          "y": 1,
          "x": 1536585978629
        },
        {
          "y": 1,
          "x": 1536585954398
        },
        {
          "y": 1,
          "x": 1536582952937
        },
        {
          "y": 1,
          "x": 1536568640782
        },
        {
          "y": 1,
          "x": 1536568585518
        },
        {
          "y": 1,
          "x": 1536568469336
        },
        {
          "y": 1,
          "x": 1536568451941
        },
        {
          "y": 1,
          "x": 1536568425821
        },
        {
          "y": 1,
          "x": 1536568383412
        },
        {
          "y": 1,
          "x": 1536568148986
        },
        {
          "y": 1,
          "x": 1536568058877
        },
        {
          "y": 1,
          "x": 1536567938650
        },
        {
          "y": 1,
          "x": 1536567881356
        },
        {
          "y": 1,
          "x": 1536564787238
        },
        {
          "y": 1,
          "x": 1536564514448
        },
        {
          "y": 1,
          "x": 1536564460071
        },
        {
          "y": 1,
          "x": 1536564353175
        },
        {
          "y": 1,
          "x": 1536564233540
        },
        {
          "y": 1,
          "x": 1536506565688
        },
        {
          "y": 1,
          "x": 1536499751813
        },
        {
          "y": 1,
          "x": 1536499710506
        },
        {
          "y": 1,
          "x": 1536499665902
        },
        {
          "y": 1,
          "x": 1536650877325
        },
        {
          "y": 1,
          "x": 1536499581493
        },
        {
          "y": 1,
          "x": 1536499518612
        },
        {
          "y": 1,
          "x": 1536499475613
        },
        {
          "y": 1,
          "x": 1536499431516
        },
        {
          "y": 1,
          "x": 1536492399081
        },
        {
          "y": 1,
          "x": 1536492196541
        },
        {
          "y": 1,
          "x": 1536485014601
        },
        {
          "y": 1,
          "x": 1536481758263
        },
        {
          "y": 1,
          "x": 1536481672623
        },
        {
          "y": 1,
          "x": 1536478157983
        },
        {
          "y": 1,
          "x": 1536477952265
        },
        {
          "y": 1,
          "x": 1536477910616
        },
        {
          "y": 1,
          "x": 1536477867010
        },
        {
          "y": 1,
          "x": 1536575001360
        },
        {
          "y": 1,
          "x": 1536470580814
        },
        {
          "y": 1,
          "x": 1536231223555
        },
        {
          "y": 1,
          "x": 1536230953832
        },
        {
          "y": 1,
          "x": 1536230933971
        },
        {
          "y": 1,
          "x": 1536230912744
        },
        {
          "y": 1,
          "x": 1536230892797
        },
        {
          "y": 1,
          "x": 1536230876376
        },
        {
          "y": 1,
          "x": 1536230790362
        },
        {
          "y": 1,
          "x": 1536651191910
        },
        {
          "y": 1,
          "x": 1536230423395
        },
        {
          "y": 1,
          "x": 1536223898476
        },
        {
          "y": 1,
          "x": 1536564715659
        },
        {
          "y": 1,
          "x": 1536223720094
        },
        {
          "y": 1,
          "x": 1536223703987
        },
        {
          "y": 1,
          "x": 1536223579420
        },
        {
          "y": 1,
          "x": 1536499408473
        },
        {
          "y": 1,
          "x": 1536223418257
        },
        {
          "y": 1,
          "x": 1536223370946
        },
        {
          "y": 1,
          "x": 1536223241000
        },
        {
          "y": 1,
          "x": 1536216337758
        },
        {
          "y": 1,
          "x": 1536216241510
        },
        {
          "y": 1,
          "x": 1536216223983
        },
        {
          "y": 1,
          "x": 1536651155625
        },
        {
          "y": 1,
          "x": 1536216110672
        },
        {
          "y": 1,
          "x": 1536216095541
        },
        {
          "y": 1,
          "x": 1536216079334
        },
        {
          "y": 1,
          "x": 1536212453636
        },
        {
          "y": 1,
          "x": 1536586518282
        },
        {
          "y": 1,
          "x": 1536212387969
        },
        {
          "y": 1,
          "x": 1536212373520
        },
        {
          "y": 1,
          "x": 1536212326094
        },
        {
          "y": 1,
          "x": 1536208837488
        },
        {
          "y": 1,
          "x": 1536208820811
        },
        {
          "y": 1,
          "x": 1536208788145
        },
        {
          "y": 1,
          "x": 1536165508769
        },
        {
          "y": 1,
          "x": 1536162234546
        },
        {
          "y": 1,
          "x": 1536162114008
        },
        {
          "y": 1,
          "x": 1536158847529
        },
        {
          "y": 1,
          "x": 1536158850218
        },
        {
          "y": 1,
          "x": 1536646980987
        },
        {
          "y": 1,
          "x": 1536155123156
        },
        {
          "y": 1,
          "x": 1536148897485
        },
        {
          "y": 1,
          "x": 1536148874348
        },
        {
          "y": 1,
          "x": 1536148775544
        },
        {
          "y": 1,
          "x": 1536148736041
        },
        {
          "y": 1,
          "x": 1536148685245
        },
        {
          "y": 1,
          "x": 1536148481404
        },
        {
          "y": 1,
          "x": 1536596647041
        },
        {
          "y": 1,
          "x": 1536148385708
        },
        {
          "y": 1,
          "x": 1536148364120
        },
        {
          "y": 1,
          "x": 1536148271823
        },
        {
          "y": 1,
          "x": 1536148185233
        },
        {
          "y": 1,
          "x": 1536148137920
        },
        {
          "y": 1,
          "x": 1536148047203
        },
        {
          "y": 1,
          "x": 1536147890904
        },
        {
          "y": 1,
          "x": 1536147870996
        },
        {
          "y": 1,
          "x": 1536147849584
        },
        {
          "y": 1,
          "x": 1536147778774
        },
        {
          "y": 1,
          "x": 1536147695056
        },
        {
          "y": 1,
          "x": 1536145210143
        },
        {
          "y": 1,
          "x": 1536145188327
        },
        {
          "y": 1,
          "x": 1536145098694
        },
        {
          "y": 1,
          "x": 1536144799461
        },
        {
          "y": 1,
          "x": 1536658587864
        },
        {
          "y": 1,
          "x": 1536144729831
        },
        {
          "y": 1,
          "x": 1536144705754
        },
        {
          "y": 1,
          "x": 1536144682596
        },
        {
          "y": 1,
          "x": 1536144471950
        },
        {
          "y": 1,
          "x": 1536144360523
        },
        {
          "y": 1,
          "x": 1536144275893
        },
        {
          "y": 1,
          "x": 1536144230737
        },
        {
          "y": 1,
          "x": 1536148638275
        },
        {
          "y": 1,
          "x": 1536144135936
        },
        {
          "y": 1,
          "x": 1536144074134
        },
        {
          "y": 1,
          "x": 1536141764585
        },
        {
          "y": 1,
          "x": 1536141702869
        },
        {
          "y": 1,
          "x": 1536141547186
        },
        {
          "y": 1,
          "x": 1536141502349
        },
        {
          "y": 1,
          "x": 1536141438149
        },
        {
          "y": 1,
          "x": 1536141388883
        },
        {
          "y": 1,
          "x": 1536141365037
        },
        {
          "y": 1,
          "x": 1536141204039
        },
        {
          "y": 1,
          "x": 1536141181714
        },
        {
          "y": 1,
          "x": 1536140984078
        },
        {
          "y": 1,
          "x": 1536140886117
        },
        {
          "y": 1,
          "x": 1536140794327
        },
        {
          "y": 1,
          "x": 1536140747048
        },
        {
          "y": 1,
          "x": 1536138374051
        },
        {
          "y": 1,
          "x": 1536138262503
        },
        {
          "y": 1,
          "x": 1536138142341
        },
        {
          "y": 1,
          "x": 1536138060099
        },
        {
          "y": 1,
          "x": 1536137806487
        },
        {
          "y": 1,
          "x": 1536481550753
        },
        {
          "y": 1,
          "x": 1536137545962
        },
        {
          "y": 1,
          "x": 1536137522853
        },
        {
          "y": 1,
          "x": 1536137498835
        },
        {
          "y": 1,
          "x": 1536137373370
        },
        {
          "y": 1,
          "x": 1536137353614
        },
        {
          "y": 1,
          "x": 1536137208105
        },
        {
          "y": 1,
          "x": 1536137070702
        },
        {
          "y": 1,
          "x": 1536136961719
        },
        {
          "y": 1,
          "x": 1536136880821
        },
        {
          "y": 1,
          "x": 1536134603369
        },
        {
          "y": 1,
          "x": 1536134559716
        },
        {
          "y": 1,
          "x": 1536134309490
        },
        {
          "y": 1,
          "x": 1536134210984
        },
        {
          "y": 1,
          "x": 1536134148092
        },
        {
          "y": 1,
          "x": 1536134129887
        },
        {
          "y": 1,
          "x": 1536141052511
        },
        {
          "y": 1,
          "x": 1536658439348
        },
        {
          "y": 1,
          "x": 1536127911941
        },
        {
          "y": 1,
          "x": 1536127706912
        },
        {
          "y": 1,
          "x": 1536127623002
        },
        {
          "y": 1,
          "x": 1536127556873
        },
        {
          "y": 1,
          "x": 1536144385775
        },
        {
          "y": 1,
          "x": 1536077123548
        },
        {
          "y": 1,
          "x": 1536077108492
        },
        {
          "y": 1,
          "x": 1536073813596
        },
        {
          "y": 1,
          "x": 1536073790040
        },
        {
          "y": 1,
          "x": 1536073725138
        },
        {
          "y": 1,
          "x": 1536650654040
        },
        {
          "y": 1,
          "x": 1536069984576
        },
        {
          "y": 1,
          "x": 1536059893029
        },
        {
          "y": 1,
          "x": 1536059769038
        },
        {
          "y": 1,
          "x": 1536059724975
        },
        {
          "y": 1,
          "x": 1536059644100
        },
        {
          "y": 1,
          "x": 1536059568090
        },
        {
          "y": 1,
          "x": 1536059496284
        },
        {
          "y": 1,
          "x": 1536230697870
        },
        {
          "y": 1,
          "x": 1536059141644
        },
        {
          "y": 1,
          "x": 1536055716131
        },
        {
          "y": 1,
          "x": 1536049182910
        },
        {
          "y": 1,
          "x": 1536049142336
        },
        {
          "y": 1,
          "x": 1536049122579
        },
        {
          "y": 1,
          "x": 1536049016935
        },
        {
          "y": 1,
          "x": 1536048979803
        },
        {
          "y": 1,
          "x": 1536048943007
        },
        {
          "y": 1,
          "x": 1536048866596
        },
        {
          "y": 1,
          "x": 1536048846021
        },
        {
          "y": 1,
          "x": 1536048786454
        },
        {
          "y": 1,
          "x": 1536048631109
        },
        {
          "y": 1,
          "x": 1536048531027
        },
        {
          "y": 1,
          "x": 1536162085334
        },
        {
          "y": 1,
          "x": 1536048454648
        },
        {
          "y": 1,
          "x": 1536048326042
        },
        {
          "y": 1,
          "x": 1536041402735
        },
        {
          "y": 1,
          "x": 1536586155752
        },
        {
          "y": 1,
          "x": 1536041312464
        },
        {
          "y": 1,
          "x": 1536133346935
        },
        {
          "y": 1,
          "x": 1536041201362
        },
        {
          "y": 1,
          "x": 1536041085532
        },
        {
          "y": 1,
          "x": 1536037766295
        },
        {
          "y": 1,
          "x": 1536037748854
        },
        {
          "y": 1,
          "x": 1536037603128
        },
        {
          "y": 1,
          "x": 1536658467916
        },
        {
          "y": 1,
          "x": 1535987256361
        },
        {
          "y": 1,
          "x": 1535987197012
        },
        {
          "y": 1,
          "x": 1536481715136
        },
        {
          "y": 1,
          "x": 1535987045868
        },
        {
          "y": 1,
          "x": 1535969804725
        },
        {
          "y": 1,
          "x": 1535969591376
        },
        {
          "y": 1,
          "x": 1535969575141
        },
        {
          "y": 1,
          "x": 1535969554741
        },
        {
          "y": 1,
          "x": 1535969774698
        },
        {
          "y": 1,
          "x": 1535969403847
        },
        {
          "y": 1,
          "x": 1535969386491
        },
        {
          "y": 1,
          "x": 1536216128413
        },
        {
          "y": 1,
          "x": 1536151206161
        },
        {
          "y": 1,
          "x": 1535969205579
        },
        {
          "y": 1,
          "x": 1535969130327
        },
        {
          "y": 1,
          "x": 1535969112282
        },
        {
          "y": 1,
          "x": 1536133900566
        },
        {
          "y": 1,
          "x": 1535966618498
        },
        {
          "y": 1,
          "x": 1535966556377
        },
        {
          "y": 1,
          "x": 1535966483446
        },
        {
          "y": 1,
          "x": 1535966450431
        },
        {
          "y": 1,
          "x": 1535966392672
        },
        {
          "y": 1,
          "x": 1535966228279
        },
        {
          "y": 1,
          "x": 1535966170969
        },
        {
          "y": 1,
          "x": 1535966155330
        },
        {
          "y": 1,
          "x": 1535966137837
        },
        {
          "y": 1,
          "x": 1535966117244
        },
        {
          "y": 1,
          "x": 1535966075346
        },
        {
          "y": 1,
          "x": 1535965990369
        },
        {
          "y": 1,
          "x": 1536492418801
        },
        {
          "y": 1,
          "x": 1536133859280
        },
        {
          "y": 1,
          "x": 1535962519294
        },
        {
          "y": 1,
          "x": 1536144050662
        },
        {
          "y": 1,
          "x": 1535888218079
        },
        {
          "y": 1,
          "x": 1536586223341
        },
        {
          "y": 1,
          "x": 1536162136378
        },
        {
          "y": 1,
          "x": 1535812018953
        },
        {
          "y": 1,
          "x": 1535811928848
        },
        {
          "y": 1,
          "x": 1535809004974
        },
        {
          "y": 1,
          "x": 1535808971607
        },
        {
          "y": 1,
          "x": 1535808905061
        },
        {
          "y": 1,
          "x": 1535808883883
        },
        {
          "y": 1,
          "x": 1535808733876
        },
        {
          "y": 1,
          "x": 1535808683791
        },
        {
          "y": 1,
          "x": 1535808659187
        },
        {
          "y": 1,
          "x": 1535808564406
        },
        {
          "y": 1,
          "x": 1535805403802
        },
        {
          "y": 1,
          "x": 1535804731797
        },
        {
          "y": 1,
          "x": 1535802104834
        },
        {
          "y": 1,
          "x": 1535895048946
        },
        {
          "y": 1,
          "x": 1536477932190
        },
        {
          "y": 1,
          "x": 1535800914384
        },
        {
          "y": 1,
          "x": 1536049105294
        },
        {
          "y": 1,
          "x": 1535798044528
        },
        {
          "y": 1,
          "x": 1536567998175
        },
        {
          "y": 1,
          "x": 1536585892324
        },
        {
          "y": 1,
          "x": 1535793583772
        },
        {
          "y": 1,
          "x": 1536564197575
        },
        {
          "y": 1,
          "x": 1535793557942
        },
        {
          "y": 1,
          "x": 1535789536947
        },
        {
          "y": 1,
          "x": 1536499496869
        },
        {
          "y": 1,
          "x": 1535738722865
        },
        {
          "y": 1,
          "x": 1535738651958
        },
        {
          "y": 1,
          "x": 1536134691447
        },
        {
          "y": 1,
          "x": 1536231027118
        },
        {
          "y": 1,
          "x": 1535711341181
        },
        {
          "y": 1,
          "x": 1535708252456
        },
        {
          "y": 1,
          "x": 1535969520747
        },
        {
          "y": 1,
          "x": 1535797235121
        },
        {
          "y": 1,
          "x": 1536134332607
        },
        {
          "y": 1,
          "x": 1535700929504
        },
        {
          "y": 1,
          "x": 1535700798822
        },
        {
          "y": 2,
          "x": 1535700773246
        },
        {
          "y": 1,
          "x": 1535700749037
        },
        {
          "y": 1,
          "x": 1535700643496
        },
        {
          "y": 1,
          "x": 1535700591496
        },
        {
          "y": 1,
          "x": 1535700536121
        },
        {
          "y": 2,
          "x": 1535700353956
        },
        {
          "y": 1,
          "x": 1535700327780
        },
        {
          "y": 1,
          "x": 1535700311304
        },
        {
          "y": 2,
          "x": 1535697428508
        },
        {
          "y": 1,
          "x": 1536216176191
        },
        {
          "y": 2,
          "x": 1535697348496
        },
        {
          "y": 1,
          "x": 1535697266462
        },
        {
          "y": 2,
          "x": 1535696979267
        },
        {
          "y": 1,
          "x": 1536059437127
        },
        {
          "y": 1,
          "x": 1535700952939
        },
        {
          "y": 1,
          "x": 1536568678874
        },
        {
          "y": 1,
          "x": 1536133748705
        },
        {
          "y": 1,
          "x": 1535696759043
        },
        {
          "y": 1,
          "x": 1535696723234
        },
        {
          "y": 1,
          "x": 1536568037260
        },
        {
          "y": 1,
          "x": 1535651091495
        },
        {
          "y": 1,
          "x": 1535651065037
        },
        {
          "y": 1,
          "x": 1536568243966
        },
        {
          "y": 2,
          "x": 1535644092494
        },
        {
          "y": 1,
          "x": 1536499626971
        },
        {
          "y": 2,
          "x": 1535643932877
        },
        {
          "y": 2,
          "x": 1535643913299
        },
        {
          "y": 1,
          "x": 1535640390843
        },
        {
          "y": 1,
          "x": 1535640347165
        },
        {
          "y": 1,
          "x": 1535620889434
        },
        {
          "y": 1,
          "x": 1535620788059
        },
        {
          "y": 1,
          "x": 1536137698973
        },
        {
          "y": 1,
          "x": 1535620694308
        },
        {
          "y": 1,
          "x": 1535620669864
        },
        {
          "y": 1,
          "x": 1535620642493
        },
        {
          "y": 1,
          "x": 1535620444313
        },
        {
          "y": 1,
          "x": 1536592971500
        },
        {
          "y": 1,
          "x": 1536470599811
        },
        {
          "y": 1,
          "x": 1535566613054
        },
        {
          "y": 1,
          "x": 1536586371085
        },
        {
          "y": 1,
          "x": 1536059182644
        },
        {
          "y": 1,
          "x": 1535566597403
        },
        {
          "y": 1,
          "x": 1535566529664
        },
        {
          "y": 1,
          "x": 1535566514223
        },
        {
          "y": 1,
          "x": 1535566496567
        },
        {
          "y": 1,
          "x": 1535563189748
        },
        {
          "y": 1,
          "x": 1535563126398
        },
        {
          "y": 1,
          "x": 1535563110667
        },
        {
          "y": 1,
          "x": 1535562974102
        },
        {
          "y": 1,
          "x": 1536059935527
        },
        {
          "y": 1,
          "x": 1535562961605
        },
        {
          "y": 1,
          "x": 1535562933837
        },
        {
          "y": 1,
          "x": 1535562909819
        },
        {
          "y": 1,
          "x": 1535559927429
        },
        {
          "y": 1,
          "x": 1535559908906
        },
        {
          "y": 1,
          "x": 1535559858568
        },
        {
          "y": 1,
          "x": 1535559830724
        },
        {
          "y": 1,
          "x": 1535559812177
        },
        {
          "y": 1,
          "x": 1535559781569
        },
        {
          "y": 1,
          "x": 1535559734467
        },
        {
          "y": 1,
          "x": 1535559650897
        },
        {
          "y": 1,
          "x": 1535559615323
        },
        {
          "y": 1,
          "x": 1535697209790
        },
        {
          "y": 1,
          "x": 1535559477547
        },
        {
          "y": 1,
          "x": 1535559455203
        },
        {
          "y": 1,
          "x": 1535559422701
        },
        {
          "y": 1,
          "x": 1535559358481
        },
        {
          "y": 1,
          "x": 1535563001239
        },
        {
          "y": 1,
          "x": 1535969538350
        },
        {
          "y": 1,
          "x": 1535549101097
        },
        {
          "y": 1,
          "x": 1535549000536
        },
        {
          "y": 1,
          "x": 1536144030134
        },
        {
          "y": 1,
          "x": 1535548984331
        },
        {
          "y": 1,
          "x": 1535548971358
        },
        {
          "y": 1,
          "x": 1535548957967
        },
        {
          "y": 1,
          "x": 1535548933898
        },
        {
          "y": 1,
          "x": 1536650745097
        },
        {
          "y": 1,
          "x": 1535548892031
        },
        {
          "y": 1,
          "x": 1535548875650
        },
        {
          "y": 1,
          "x": 1535548848808
        },
        {
          "y": 1,
          "x": 1535548658399
        },
        {
          "y": 1,
          "x": 1536147758599
        },
        {
          "y": 1,
          "x": 1535548553047
        },
        {
          "y": 1,
          "x": 1536137333287
        },
        {
          "y": 1,
          "x": 1535530683558
        },
        {
          "y": 1,
          "x": 1535483642645
        },
        {
          "y": 1,
          "x": 1536564605760
        },
        {
          "y": 1,
          "x": 1535483631473
        },
        {
          "y": 1,
          "x": 1536477788731
        },
        {
          "y": 1,
          "x": 1535476741955
        },
        {
          "y": 1,
          "x": 1535476678461
        },
        {
          "y": 1,
          "x": 1535476627483
        },
        {
          "y": 1,
          "x": 1535476503568
        },
        {
          "y": 1,
          "x": 1535476487522
        },
        {
          "y": 1,
          "x": 1535476472102
        },
        {
          "y": 1,
          "x": 1535472993387
        },
        {
          "y": 1,
          "x": 1536586616952
        },
        {
          "y": 1,
          "x": 1535472980119
        },
        {
          "y": 1,
          "x": 1535793843102
        },
        {
          "y": 1,
          "x": 1535466071268
        },
        {
          "y": 1,
          "x": 1535466061210
        },
        {
          "y": 1,
          "x": 1535466048761
        },
        {
          "y": 1,
          "x": 1535465939575
        },
        {
          "y": 1,
          "x": 1535465924664
        },
        {
          "y": 1,
          "x": 1535465912469
        },
        {
          "y": 1,
          "x": 1535465900022
        },
        {
          "y": 1,
          "x": 1535465856044
        },
        {
          "y": 1,
          "x": 1536223403384
        },
        {
          "y": 1,
          "x": 1536137188250
        },
        {
          "y": 1,
          "x": 1535465725784
        },
        {
          "y": 1,
          "x": 1536230480669
        },
        {
          "y": 1,
          "x": 1536651228398
        },
        {
          "y": 1,
          "x": 1535462273151
        },
        {
          "y": 1,
          "x": 1535462127168
        },
        {
          "y": 1,
          "x": 1535808495038
        },
        {
          "y": 1,
          "x": 1535458616997
        },
        {
          "y": 1,
          "x": 1535455161777
        },
        {
          "y": 1,
          "x": 1535455073736
        },
        {
          "y": 1,
          "x": 1536137830909
        },
        {
          "y": 1,
          "x": 1535448079956
        },
        {
          "y": 1,
          "x": 1535448008253
        },
        {
          "y": 1,
          "x": 1535559512727
        },
        {
          "y": 1,
          "x": 1535447994564
        },
        {
          "y": 1,
          "x": 1535447981605
        },
        {
          "y": 1,
          "x": 1535447969611
        },
        {
          "y": 1,
          "x": 1536134517117
        },
        {
          "y": 1,
          "x": 1535447957176
        },
        {
          "y": 1,
          "x": 1535888348680
        },
        {
          "y": 1,
          "x": 1535130209145
        },
        {
          "y": 1,
          "x": 1535130261938
        },
        {
          "y": 1,
          "x": 1535130155528
        },
        {
          "y": 1,
          "x": 1535130140829
        },
        {
          "y": 1,
          "x": 1535129994337
        },
        {
          "y": 1,
          "x": 1535129949316
        },
        {
          "y": 1,
          "x": 1535126657133
        },
        {
          "y": 1,
          "x": 1535126644936
        },
        {
          "y": 1,
          "x": 1535126590223
        },
        {
          "y": 1,
          "x": 1535123142340
        },
        {
          "y": 1,
          "x": 1535123107959
        },
        {
          "y": 1,
          "x": 1535994220703
        },
        {
          "y": 1,
          "x": 1535123014131
        },
        {
          "y": 1,
          "x": 1535123063598
        },
        {
          "y": 1,
          "x": 1535122955656
        },
        {
          "y": 1,
          "x": 1535122968927
        },
        {
          "y": 1,
          "x": 1535119366736
        },
        {
          "y": 1,
          "x": 1535119331824
        },
        {
          "y": 1,
          "x": 1536048360471
        },
        {
          "y": 1,
          "x": 1535115730522
        },
        {
          "y": 1,
          "x": 1535115718587
        },
        {
          "y": 1,
          "x": 1535112473755
        },
        {
          "y": 1,
          "x": 1535112462319
        },
        {
          "y": 1,
          "x": 1536141457094
        },
        {
          "y": 1,
          "x": 1535112282383
        },
        {
          "y": 1,
          "x": 1535112218582
        },
        {
          "y": 1,
          "x": 1536481812666
        },
        {
          "y": 1,
          "x": 1536231155374
        },
        {
          "y": 1,
          "x": 1535105142766
        },
        {
          "y": 1,
          "x": 1535969366537
        },
        {
          "y": 1,
          "x": 1535105076727
        },
        {
          "y": 1,
          "x": 1535105062979
        },
        {
          "y": 1,
          "x": 1535104983508
        },
        {
          "y": 1,
          "x": 1535104908508
        },
        {
          "y": 1,
          "x": 1535104764714
        },
        {
          "y": 1,
          "x": 1536141657186
        },
        {
          "y": 1,
          "x": 1535104753512
        },
        {
          "y": 1,
          "x": 1535104726519
        },
        {
          "y": 1,
          "x": 1535101442240
        },
        {
          "y": 1,
          "x": 1535101416437
        },
        {
          "y": 1,
          "x": 1535101358687
        },
        {
          "y": 1,
          "x": 1535483663734
        },
        {
          "y": 1,
          "x": 1535101243568
        },
        {
          "y": 1,
          "x": 1535563093465
        },
        {
          "y": 1,
          "x": 1535101145018
        },
        {
          "y": 1,
          "x": 1535101081624
        },
        {
          "y": 1,
          "x": 1535097617892
        },
        {
          "y": 1,
          "x": 1535112049128
        },
        {
          "y": 1,
          "x": 1535223419861
        },
        {
          "y": 1,
          "x": 1535219863543
        },
        {
          "y": 1,
          "x": 1536144515176
        },
        {
          "y": 1,
          "x": 1535216571759
        },
        {
          "y": 1,
          "x": 1536223199348
        },
        {
          "y": 1,
          "x": 1535216521516
        },
        {
          "y": 1,
          "x": 1535216492545
        },
        {
          "y": 1,
          "x": 1536123981181
        },
        {
          "y": 1,
          "x": 1535216476918
        },
        {
          "y": 1,
          "x": 1535216435499
        },
        {
          "y": 1,
          "x": 1535115778868
        },
        {
          "y": 1,
          "x": 1535216373325
        },
        {
          "y": 1,
          "x": 1535216358108
        },
        {
          "y": 1,
          "x": 1535808793424
        },
        {
          "y": 1,
          "x": 1535216347370
        },
        {
          "y": 1,
          "x": 1535216296861
        },
        {
          "y": 1,
          "x": 1535216285534
        },
        {
          "y": 1,
          "x": 1535212966568
        },
        {
          "y": 1,
          "x": 1535212941684
        },
        {
          "y": 1,
          "x": 1535212868537
        },
        {
          "y": 1,
          "x": 1535212817924
        },
        {
          "y": 1,
          "x": 1535969754722
        },
        {
          "y": 1,
          "x": 1535212807159
        },
        {
          "y": 1,
          "x": 1535212668240
        },
        {
          "y": 1,
          "x": 1536133326588
        },
        {
          "y": 1,
          "x": 1535884189067
        },
        {
          "y": 1,
          "x": 1535213000754
        },
        {
          "y": 1,
          "x": 1536144640062
        },
        {
          "y": 1,
          "x": 1535700874465
        },
        {
          "y": 1,
          "x": 1535209329514
        },
        {
          "y": 1,
          "x": 1535962188483
        },
        {
          "y": 1,
          "x": 1535209284181
        },
        {
          "y": 1,
          "x": 1535209242294
        },
        {
          "y": 1,
          "x": 1535966411684
        },
        {
          "y": 1,
          "x": 1535209219511
        },
        {
          "y": 1,
          "x": 1535209207916
        },
        {
          "y": 1,
          "x": 1535209198040
        },
        {
          "y": 1,
          "x": 1536137722252
        },
        {
          "y": 1,
          "x": 1535209070606
        },
        {
          "y": 1,
          "x": 1536560782862
        },
        {
          "y": 1,
          "x": 1535205671360
        },
        {
          "y": 1,
          "x": 1535205650930
        },
        {
          "y": 1,
          "x": 1535202255908
        },
        {
          "y": 1,
          "x": 1536144839793
        },
        {
          "y": 1,
          "x": 1535202243638
        },
        {
          "y": 1,
          "x": 1536230988794
        },
        {
          "y": 1,
          "x": 1535216307409
        },
        {
          "y": 1,
          "x": 1535201941246
        },
        {
          "y": 1,
          "x": 1535201923283
        },
        {
          "y": 1,
          "x": 1535778503614
        },
        {
          "y": 1,
          "x": 1536059543465
        },
        {
          "y": 2,
          "x": 1535198721309
        },
        {
          "y": 2,
          "x": 1535198696037
        },
        {
          "y": 2,
          "x": 1535198668949
        },
        {
          "y": 2,
          "x": 1535198616382
        },
        {
          "y": 1,
          "x": 1536059519797
        },
        {
          "y": 1,
          "x": 1535198593015
        },
        {
          "y": 1,
          "x": 1535198544258
        },
        {
          "y": 1,
          "x": 1535198424443
        },
        {
          "y": 1,
          "x": 1535101320690
        },
        {
          "y": 1,
          "x": 1535195110659
        },
        {
          "y": 1,
          "x": 1536059161765
        },
        {
          "y": 1,
          "x": 1535195048106
        },
        {
          "y": 1,
          "x": 1535194963820
        },
        {
          "y": 1,
          "x": 1536144820942
        },
        {
          "y": 1,
          "x": 1535194892532
        },
        {
          "y": 1,
          "x": 1535194821869
        },
        {
          "y": 1,
          "x": 1536661691009
        },
        {
          "y": 1,
          "x": 1536477809588
        },
        {
          "y": 1,
          "x": 1535465791493
        },
        {
          "y": 1,
          "x": 1535194806982
        },
        {
          "y": 1,
          "x": 1535191180592
        },
        {
          "y": 1,
          "x": 1535191089568
        },
        {
          "y": 1,
          "x": 1535187547093
        },
        {
          "y": 1,
          "x": 1535187490625
        },
        {
          "y": 1,
          "x": 1535213023441
        },
        {
          "y": 1,
          "x": 1535187463319
        },
        {
          "y": 1,
          "x": 1535187437263
        },
        {
          "y": 1,
          "x": 1536144539211
        },
        {
          "y": 1,
          "x": 1535183933181
        },
        {
          "y": 1,
          "x": 1535183861817
        },
        {
          "y": 1,
          "x": 1535198450333
        },
        {
          "y": 1,
          "x": 1535133580812
        },
        {
          "y": 1,
          "x": 1535133524680
        },
        {
          "y": 1,
          "x": 1536037645412
        },
        {
          "y": 1,
          "x": 1535133462517
        },
        {
          "y": 1,
          "x": 1536564697675
        },
        {
          "y": 2,
          "x": 1535130182834
        },
        {
          "y": 1,
          "x": 1536134539914
        },
        {
          "y": 2,
          "x": 1535130016565
        },
        {
          "y": 2,
          "x": 1535129914440
        },
        {
          "y": 1,
          "x": 1536137459202
        },
        {
          "y": 1,
          "x": 1535126681506
        },
        {
          "y": 1,
          "x": 1536136899743
        },
        {
          "y": 1,
          "x": 1535198529082
        },
        {
          "y": 1,
          "x": 1536048686771
        },
        {
          "y": 2,
          "x": 1535126425268
        },
        {
          "y": 1,
          "x": 1535548836554
        },
        {
          "y": 2,
          "x": 1535126402930
        },
        {
          "y": 2,
          "x": 1535126394857
        },
        {
          "y": 2,
          "x": 1535126340470
        },
        {
          "y": 2,
          "x": 1535126260747
        },
        {
          "y": 2,
          "x": 1535122672659
        },
        {
          "y": 1,
          "x": 1535119095409
        },
        {
          "y": 1,
          "x": 1536162024598
        },
        {
          "y": 1,
          "x": 1535205444154
        },
        {
          "y": 1,
          "x": 1535119083598
        },
        {
          "y": 2,
          "x": 1535115669599
        },
        {
          "y": 2,
          "x": 1535115637668
        },
        {
          "y": 1,
          "x": 1536133880260
        },
        {
          "y": 2,
          "x": 1535112194932
        },
        {
          "y": 2,
          "x": 1535198488928
        },
        {
          "y": 1,
          "x": 1535112306368
        },
        {
          "y": 1,
          "x": 1535126528200
        },
        {
          "y": 2,
          "x": 1535093837712
        },
        {
          "y": 1,
          "x": 1535047192083
        },
        {
          "y": 1,
          "x": 1535047167386
        },
        {
          "y": 1,
          "x": 1535047132007
        },
        {
          "y": 1,
          "x": 1535047121850
        },
        {
          "y": 1,
          "x": 1535194871518
        },
        {
          "y": 1,
          "x": 1535972688677
        },
        {
          "y": 1,
          "x": 1535043766412
        },
        {
          "y": 1,
          "x": 1535043728369
        },
        {
          "y": 1,
          "x": 1535212882137
        },
        {
          "y": 1,
          "x": 1535043610958
        },
        {
          "y": 1,
          "x": 1535043472722
        },
        {
          "y": 1,
          "x": 1535040119122
        },
        {
          "y": 1,
          "x": 1535040085284
        },
        {
          "y": 1,
          "x": 1535111973501
        },
        {
          "y": 1,
          "x": 1536127814212
        },
        {
          "y": 1,
          "x": 1535040076249
        },
        {
          "y": 1,
          "x": 1535040064237
        },
        {
          "y": 1,
          "x": 1535036501481
        },
        {
          "y": 1,
          "x": 1535036473825
        },
        {
          "y": 1,
          "x": 1535036473066
        },
        {
          "y": 1,
          "x": 1535036472513
        },
        {
          "y": 1,
          "x": 1535195073385
        },
        {
          "y": 1,
          "x": 1535097707414
        },
        {
          "y": 1,
          "x": 1535036468973
        },
        {
          "y": 1,
          "x": 1535097503305
        },
        {
          "y": 1,
          "x": 1535209297310
        },
        {
          "y": 1,
          "x": 1535036303350
        },
        {
          "y": 1,
          "x": 1535036293114
        },
        {
          "y": 1,
          "x": 1536070075432
        },
        {
          "y": 1,
          "x": 1535033033369
        },
        {
          "y": 2,
          "x": 1535198629461
        },
        {
          "y": 1,
          "x": 1535033003137
        },
        {
          "y": 1,
          "x": 1535032983003
        },
        {
          "y": 1,
          "x": 1535032835271
        },
        {
          "y": 1,
          "x": 1535032811694
        },
        {
          "y": 1,
          "x": 1535032788359
        },
        {
          "y": 1,
          "x": 1535212953886
        },
        {
          "y": 1,
          "x": 1535032695651
        },
        {
          "y": 1,
          "x": 1536586672824
        },
        {
          "y": 1,
          "x": 1535030522212
        },
        {
          "y": 1,
          "x": 1535030520107
        },
        {
          "y": 1,
          "x": 1535701084281
        },
        {
          "y": 1,
          "x": 1535030515321
        },
        {
          "y": 1,
          "x": 1535030514361
        },
        {
          "y": 1,
          "x": 1535030511329
        },
        {
          "y": 1,
          "x": 1535030510876
        },
        {
          "y": 1,
          "x": 1535030504954
        },
        {
          "y": 1,
          "x": 1535030522637
        },
        {
          "y": 1,
          "x": 1536603738306
        },
        {
          "y": 1,
          "x": 1535030498638
        },
        {
          "y": 1,
          "x": 1536586292126
        },
        {
          "y": 1,
          "x": 1535104778052
        },
        {
          "y": 1,
          "x": 1536137114141
        },
        {
          "y": 1,
          "x": 1535018598370
        },
        {
          "y": 1,
          "x": 1535032854371
        },
        {
          "y": 1,
          "x": 1536137268808
        },
        {
          "y": 1,
          "x": 1535014873092
        },
        {
          "y": 1,
          "x": 1535123051352
        },
        {
          "y": 1,
          "x": 1535014724801
        },
        {
          "y": 1,
          "x": 1535014704184
        },
        {
          "y": 1,
          "x": 1535014679721
        },
        {
          "y": 1,
          "x": 1535011376318
        },
        {
          "y": 1,
          "x": 1535011326624
        },
        {
          "y": 1,
          "x": 1535011289410
        },
        {
          "y": 1,
          "x": 1535209170356
        },
        {
          "y": 1,
          "x": 1535011255000
        },
        {
          "y": 1,
          "x": 1535011220376
        },
        {
          "y": 1,
          "x": 1535011158612
        },
        {
          "y": 1,
          "x": 1536037687850
        },
        {
          "y": 1,
          "x": 1535011131531
        },
        {
          "y": 2,
          "x": 1535111944588
        },
        {
          "y": 1,
          "x": 1534967800243
        },
        {
          "y": 1,
          "x": 1536215978367
        },
        {
          "y": 1,
          "x": 1534964217785
        },
        {
          "y": 1,
          "x": 1535030495817
        },
        {
          "y": 1,
          "x": 1536041348454
        },
        {
          "y": 1,
          "x": 1535119306333
        },
        {
          "y": 1,
          "x": 1536230517463
        },
        {
          "y": 1,
          "x": 1535559547897
        },
        {
          "y": 1,
          "x": 1534946243673
        },
        {
          "y": 1,
          "x": 1535032912402
        },
        {
          "y": 1,
          "x": 1535696929253
        },
        {
          "y": 1,
          "x": 1536216407268
        },
        {
          "y": 1,
          "x": 1534924818041
        },
        {
          "y": 1,
          "x": 1535111931467
        },
        {
          "y": 1,
          "x": 1536564316441
        },
        {
          "y": 1,
          "x": 1534924726473
        },
        {
          "y": 1,
          "x": 1534924716735
        },
        {
          "y": 1,
          "x": 1534924692711
        },
        {
          "y": 1,
          "x": 1535137023591
        },
        {
          "y": 1,
          "x": 1534921016554
        },
        {
          "y": 1,
          "x": 1536586137534
        },
        {
          "y": 1,
          "x": 1534877851156
        },
        {
          "y": 1,
          "x": 1534924683831
        },
        {
          "y": 1,
          "x": 1536133684629
        },
        {
          "y": 1,
          "x": 1535216557650
        },
        {
          "y": 1,
          "x": 1535191078211
        },
        {
          "y": 1,
          "x": 1534874401678
        },
        {
          "y": 1,
          "x": 1534874388226
        },
        {
          "y": 1,
          "x": 1535111918464
        },
        {
          "y": 1,
          "x": 1534874268465
        },
        {
          "y": 1,
          "x": 1534874258484
        },
        {
          "y": 1,
          "x": 1534874245111
        },
        {
          "y": 1,
          "x": 1534870761698
        },
        {
          "y": 1,
          "x": 1534870715711
        },
        {
          "y": 1,
          "x": 1535191098813
        },
        {
          "y": 1,
          "x": 1534870681691
        },
        {
          "y": 1,
          "x": 1534870647485
        },
        {
          "y": 1,
          "x": 1534870626780
        },
        {
          "y": 1,
          "x": 1534867321434
        },
        {
          "y": 1,
          "x": 1536137046345
        },
        {
          "y": 1,
          "x": 1536070738720
        },
        {
          "y": 1,
          "x": 1535620430364
        },
        {
          "y": 1,
          "x": 1534867264656
        },
        {
          "y": 1,
          "x": 1534867252864
        },
        {
          "y": 1,
          "x": 1536223667497
        },
        {
          "y": 1,
          "x": 1535112375497
        },
        {
          "y": 1,
          "x": 1535801985258
        },
        {
          "y": 1,
          "x": 1534867203285
        },
        {
          "y": 1,
          "x": 1534867158588
        },
        {
          "y": 1,
          "x": 1534867124547
        },
        {
          "y": 1,
          "x": 1534867101769
        },
        {
          "y": 1,
          "x": 1535007405631
        },
        {
          "y": 1,
          "x": 1536492437742
        },
        {
          "y": 1,
          "x": 1534867076728
        },
        {
          "y": 1,
          "x": 1534867067288
        },
        {
          "y": 1,
          "x": 1534863818998
        },
        {
          "y": 1,
          "x": 1534863788710
        },
        {
          "y": 1,
          "x": 1534863780406
        },
        {
          "y": 1,
          "x": 1534863771220
        },
        {
          "y": 1,
          "x": 1534863754826
        },
        {
          "y": 1,
          "x": 1534863712029
        },
        {
          "y": 1,
          "x": 1534863700449
        },
        {
          "y": 1,
          "x": 1534863670659
        },
        {
          "y": 1,
          "x": 1534863662485
        },
        {
          "y": 1,
          "x": 1535530486455
        },
        {
          "y": 1,
          "x": 1536138192814
        },
        {
          "y": 1,
          "x": 1534860355061
        },
        {
          "y": 1,
          "x": 1534860346129
        },
        {
          "y": 1,
          "x": 1534863522198
        },
        {
          "y": 1,
          "x": 1534860315112
        },
        {
          "y": 1,
          "x": 1536059873064
        },
        {
          "y": 1,
          "x": 1534860272390
        },
        {
          "y": 1,
          "x": 1534860241379
        },
        {
          "y": 1,
          "x": 1535032752078
        },
        {
          "y": 1,
          "x": 1534860214181
        },
        {
          "y": 1,
          "x": 1536564426819
        },
        {
          "y": 1,
          "x": 1534860166602
        },
        {
          "y": 1,
          "x": 1536470562543
        },
        {
          "y": 1,
          "x": 1534860157970
        },
        {
          "y": 1,
          "x": 1534860089281
        },
        {
          "y": 1,
          "x": 1534860066296
        },
        {
          "y": 1,
          "x": 1536481863778
        },
        {
          "y": 1,
          "x": 1534860049969
        },
        {
          "y": 1,
          "x": 1536059259603
        },
        {
          "y": 1,
          "x": 1534860041275
        },
        {
          "y": 1,
          "x": 1534859980948
        },
        {
          "y": 1,
          "x": 1535011063611
        },
        {
          "y": 1,
          "x": 1534859972011
        },
        {
          "y": 1,
          "x": 1534859949112
        },
        {
          "y": 1,
          "x": 1534859936950
        },
        {
          "y": 1,
          "x": 1535209112829
        },
        {
          "y": 1,
          "x": 1535563173181
        },
        {
          "y": 1,
          "x": 1534859885144
        },
        {
          "y": 1,
          "x": 1535562918780
        },
        {
          "y": 1,
          "x": 1535112341994
        },
        {
          "y": 1,
          "x": 1535566469051
        },
        {
          "y": 1,
          "x": 1536134583685
        },
        {
          "y": 1,
          "x": 1536037624782
        },
        {
          "y": 1,
          "x": 1534845683045
        },
        {
          "y": 1,
          "x": 1536474171454
        },
        {
          "y": 1,
          "x": 1534842031846
        },
        {
          "y": 1,
          "x": 1536481417965
        },
        {
          "y": 1,
          "x": 1534859958795
        },
        {
          "y": 1,
          "x": 1534838312219
        },
        {
          "y": 1,
          "x": 1534838291441
        },
        {
          "y": 1,
          "x": 1534791415580
        },
        {
          "y": 1,
          "x": 1535951148212
        },
        {
          "y": 1,
          "x": 1535030513360
        },
        {
          "y": 1,
          "x": 1536055856055
        },
        {
          "y": 1,
          "x": 1534787818937
        },
        {
          "y": 1,
          "x": 1534780997002
        },
        {
          "y": 1,
          "x": 1536586022462
        },
        {
          "y": 1,
          "x": 1536148295542
        },
        {
          "y": 1,
          "x": 1534780985432
        },
        {
          "y": 1,
          "x": 1535036470826
        },
        {
          "y": 1,
          "x": 1534780878310
        },
        {
          "y": 1,
          "x": 1536133617929
        },
        {
          "y": 1,
          "x": 1534780857816
        },
        {
          "y": 1,
          "x": 1536216158036
        },
        {
          "y": 1,
          "x": 1534780806224
        },
        {
          "y": 1,
          "x": 1534780795371
        },
        {
          "y": 1,
          "x": 1536492218980
        },
        {
          "y": 1,
          "x": 1534780769874
        },
        {
          "y": 1,
          "x": 1534780721316
        },
        {
          "y": 1,
          "x": 1534780714255
        },
        {
          "y": 1,
          "x": 1536145166472
        },
        {
          "y": 1,
          "x": 1534777767734
        },
        {
          "y": 1,
          "x": 1535030497506
        },
        {
          "y": 1,
          "x": 1534777747138
        },
        {
          "y": 1,
          "x": 1534777731289
        },
        {
          "y": 1,
          "x": 1536070193491
        },
        {
          "y": 1,
          "x": 1534777673465
        },
        {
          "y": 1,
          "x": 1534777662718
        },
        {
          "y": 1,
          "x": 1534780941705
        },
        {
          "y": 1,
          "x": 1534777651752
        },
        {
          "y": 1,
          "x": 1534860368055
        },
        {
          "y": 1,
          "x": 1534777643608
        },
        {
          "y": 1,
          "x": 1535902101772
        },
        {
          "y": 1,
          "x": 1535032973885
        },
        {
          "y": 1,
          "x": 1536133705879
        },
        {
          "y": 1,
          "x": 1534777601029
        },
        {
          "y": 1,
          "x": 1534838374532
        },
        {
          "y": 1,
          "x": 1536223969651
        },
        {
          "y": 1,
          "x": 1534777577195
        },
        {
          "y": 1,
          "x": 1534777569171
        },
        {
          "y": 1,
          "x": 1534777560792
        },
        {
          "y": 1,
          "x": 1534777530771
        },
        {
          "y": 1,
          "x": 1534777438601
        },
        {
          "y": 2,
          "x": 1535115892079
        },
        {
          "y": 1,
          "x": 1536481400118
        },
        {
          "y": 1,
          "x": 1536148611746
        },
        {
          "y": 1,
          "x": 1535119353231
        },
        {
          "y": 1,
          "x": 1534777375376
        },
        {
          "y": 1,
          "x": 1536161995896
        },
        {
          "y": 1,
          "x": 1534777334345
        },
        {
          "y": 1,
          "x": 1534777303669
        },
        {
          "y": 1,
          "x": 1536481437243
        },
        {
          "y": 1,
          "x": 1534777233709
        },
        {
          "y": 1,
          "x": 1534777224996
        },
        {
          "y": 1,
          "x": 1534777212635
        },
        {
          "y": 1,
          "x": 1534874326187
        },
        {
          "y": 1,
          "x": 1534777200943
        },
        {
          "y": 1,
          "x": 1534777177738
        },
        {
          "y": 2,
          "x": 1535198680742
        },
        {
          "y": 1,
          "x": 1534777127580
        },
        {
          "y": 1,
          "x": 1536148407550
        },
        {
          "y": 1,
          "x": 1534773947610
        },
        {
          "y": 1,
          "x": 1535133652535
        },
        {
          "y": 1,
          "x": 1534773897464
        },
        {
          "y": 1,
          "x": 1534773874106
        },
        {
          "y": 1,
          "x": 1534773812419
        },
        {
          "y": 1,
          "x": 1535559385664
        },
        {
          "y": 1,
          "x": 1534773772076
        },
        {
          "y": 1,
          "x": 1535195135959
        },
        {
          "y": 1,
          "x": 1534773721157
        },
        {
          "y": 1,
          "x": 1535563046548
        },
        {
          "y": 1,
          "x": 1534773680527
        },
        {
          "y": 1,
          "x": 1534773601517
        },
        {
          "y": 1,
          "x": 1535030502649
        },
        {
          "y": 1,
          "x": 1536230460473
        },
        {
          "y": 1,
          "x": 1534773548701
        },
        {
          "y": 1,
          "x": 1534773538802
        },
        {
          "y": 1,
          "x": 1534773528215
        },
        {
          "y": 1,
          "x": 1535194914307
        },
        {
          "y": 1,
          "x": 1536127684633
        },
        {
          "y": 1,
          "x": 1534773515760
        },
        {
          "y": 1,
          "x": 1534769960536
        },
        {
          "y": 1,
          "x": 1535111983642
        },
        {
          "y": 1,
          "x": 1534766972690
        },
        {
          "y": 1,
          "x": 1536230572635
        },
        {
          "y": 1,
          "x": 1536586088191
        },
        {
          "y": 1,
          "x": 1536134043852
        },
        {
          "y": 1,
          "x": 1535209060501
        },
        {
          "y": 1,
          "x": 1534766769871
        },
        {
          "y": 1,
          "x": 1535549068946
        },
        {
          "y": 1,
          "x": 1534867275874
        },
        {
          "y": 1,
          "x": 1534766676365
        },
        {
          "y": 1,
          "x": 1534766663877
        },
        {
          "y": 1,
          "x": 1535191259366
        },
        {
          "y": 1,
          "x": 1535563142441
        },
        {
          "y": 1,
          "x": 1534766630474
        },
        {
          "y": 1,
          "x": 1534766611447
        },
        {
          "y": 1,
          "x": 1536144206169
        },
        {
          "y": 1,
          "x": 1534766588830
        },
        {
          "y": 1,
          "x": 1534766420333
        },
        {
          "y": 1,
          "x": 1536133814502
        },
        {
          "y": 1,
          "x": 1534766373673
        },
        {
          "y": 1,
          "x": 1534763097688
        },
        {
          "y": 1,
          "x": 1536231047326
        },
        {
          "y": 1,
          "x": 1534762703976
        },
        {
          "y": 1,
          "x": 1536148573148
        },
        {
          "y": 1,
          "x": 1535040128483
        },
        {
          "y": 1,
          "x": 1535014657106
        },
        {
          "y": 1,
          "x": 1536059957157
        },
        {
          "y": 1,
          "x": 1535183979895
        },
        {
          "y": 1,
          "x": 1534751969121
        },
        {
          "y": 1,
          "x": 1536048471292
        },
        {
          "y": 1,
          "x": 1534697839408
        },
        {
          "y": 1,
          "x": 1534694385986
        },
        {
          "y": 1,
          "x": 1534694361598
        },
        {
          "y": 1,
          "x": 1536208706419
        },
        {
          "y": 1,
          "x": 1535104817607
        },
        {
          "y": 1,
          "x": 1536145145282
        },
        {
          "y": 1,
          "x": 1534694282815
        },
        {
          "y": 1,
          "x": 1534694262329
        },
        {
          "y": 1,
          "x": 1534766924275
        },
        {
          "y": 1,
          "x": 1535548777442
        },
        {
          "y": 1,
          "x": 1535126288014
        },
        {
          "y": 1,
          "x": 1534687343340
        },
        {
          "y": 1,
          "x": 1534687332197
        },
        {
          "y": 1,
          "x": 1534687319325
        },
        {
          "y": 1,
          "x": 1534687225372
        },
        {
          "y": 1,
          "x": 1534687251530
        },
        {
          "y": 1,
          "x": 1534687082195
        },
        {
          "y": 1,
          "x": 1534680303316
        },
        {
          "y": 1,
          "x": 1534680274646
        },
        {
          "y": 1,
          "x": 1534870700770
        },
        {
          "y": 1,
          "x": 1536059280398
        },
        {
          "y": 1,
          "x": 1534838405854
        },
        {
          "y": 1,
          "x": 1534680216216
        },
        {
          "y": 1,
          "x": 1534697821493
        },
        {
          "y": 1,
          "x": 1534680200636
        },
        {
          "y": 1,
          "x": 1534773644694
        },
        {
          "y": 1,
          "x": 1534680163716
        },
        {
          "y": 1,
          "x": 1534680109591
        },
        {
          "y": 1,
          "x": 1534841848605
        },
        {
          "y": 1,
          "x": 1535808710655
        },
        {
          "y": 1,
          "x": 1534679955905
        },
        {
          "y": 1,
          "x": 1534679910827
        },
        {
          "y": 1,
          "x": 1534676505208
        },
        {
          "y": 1,
          "x": 1534676443166
        },
        {
          "y": 1,
          "x": 1536223770199
        },
        {
          "y": 1,
          "x": 1534676338172
        },
        {
          "y": 2,
          "x": 1535122862808
        },
        {
          "y": 1,
          "x": 1534676287438
        },
        {
          "y": 1,
          "x": 1535911426115
        },
        {
          "y": 1,
          "x": 1536059789386
        },
        {
          "y": 1,
          "x": 1535018547989
        },
        {
          "y": 1,
          "x": 1534665826219
        },
        {
          "y": 1,
          "x": 1534679989729
        },
        {
          "y": 1,
          "x": 1534665810899
        },
        {
          "y": 1,
          "x": 1534773995990
        },
        {
          "y": 1,
          "x": 1535032845097
        },
        {
          "y": 1,
          "x": 1536564284670
        },
        {
          "y": 1,
          "x": 1534619150899
        },
        {
          "y": 1,
          "x": 1536133770405
        },
        {
          "y": 1,
          "x": 1534619049088
        },
        {
          "y": 1,
          "x": 1534780835657
        },
        {
          "y": 1,
          "x": 1535030513844
        },
        {
          "y": 1,
          "x": 1534618957072
        },
        {
          "y": 1,
          "x": 1534615319429
        },
        {
          "y": 1,
          "x": 1534611745223
        },
        {
          "y": 1,
          "x": 1536654694527
        },
        {
          "y": 1,
          "x": 1534605305451
        },
        {
          "y": 1,
          "x": 1534605147578
        },
        {
          "y": 1,
          "x": 1536041380892
        },
        {
          "y": 1,
          "x": 1534605130695
        },
        {
          "y": 1,
          "x": 1535122775256
        },
        {
          "y": 1,
          "x": 1536481493785
        },
        {
          "y": 1,
          "x": 1534867308576
        },
        {
          "y": 1,
          "x": 1534604893543
        },
        {
          "y": 1,
          "x": 1534860099075
        },
        {
          "y": 1,
          "x": 1536481778860
        },
        {
          "y": 1,
          "x": 1534604848196
        },
        {
          "y": 1,
          "x": 1536223220693
        },
        {
          "y": 1,
          "x": 1535036285107
        },
        {
          "y": 1,
          "x": 1535465755356
        },
        {
          "y": 1,
          "x": 1534604654578
        },
        {
          "y": 1,
          "x": 1534842011508
        },
        {
          "y": 1,
          "x": 1534604643033
        },
        {
          "y": 1,
          "x": 1534601194947
        },
        {
          "y": 1,
          "x": 1536564268132
        },
        {
          "y": 1,
          "x": 1534595523918
        },
        {
          "y": 1,
          "x": 1535130028651
        },
        {
          "y": 1,
          "x": 1534859914990
        },
        {
          "y": 1,
          "x": 1535563063833
        },
        {
          "y": 1,
          "x": 1534595437266
        },
        {
          "y": 1,
          "x": 1534595425835
        },
        {
          "y": 1,
          "x": 1534863810320
        },
        {
          "y": 1,
          "x": 1534595289295
        },
        {
          "y": 1,
          "x": 1536650724867
        },
        {
          "y": 1,
          "x": 1534595227129
        },
        {
          "y": 1,
          "x": 1535793337593
        },
        {
          "y": 1,
          "x": 1534595182059
        },
        {
          "y": 1,
          "x": 1536037470569
        },
        {
          "y": 1,
          "x": 1534595145020
        },
        {
          "y": 1,
          "x": 1534595128107
        },
        {
          "y": 1,
          "x": 1535465985617
        },
        {
          "y": 1,
          "x": 1535559764902
        },
        {
          "y": 1,
          "x": 1534594963460
        },
        {
          "y": 1,
          "x": 1534594908851
        },
        {
          "y": 1,
          "x": 1535216533104
        },
        {
          "y": 1,
          "x": 1536073602342
        },
        {
          "y": 1,
          "x": 1534669444039
        },
        {
          "y": 1,
          "x": 1536134648968
        },
        {
          "y": 1,
          "x": 1534665724984
        },
        {
          "y": 1,
          "x": 1534594807367
        },
        {
          "y": 1,
          "x": 1534665898485
        },
        {
          "y": 1,
          "x": 1534594794921
        },
        {
          "y": 1,
          "x": 1534592283980
        },
        {
          "y": 1,
          "x": 1536231278391
        },
        {
          "y": 1,
          "x": 1534924659561
        },
        {
          "y": 1,
          "x": 1534592091886
        },
        {
          "y": 1,
          "x": 1536481471098
        },
        {
          "y": 1,
          "x": 1536134669181
        },
        {
          "y": 1,
          "x": 1534769910462
        },
        {
          "y": 1,
          "x": 1536470542011
        },
        {
          "y": 1,
          "x": 1534592053860
        },
        {
          "y": 1,
          "x": 1534592043453
        },
        {
          "y": 1,
          "x": 1535805633279
        },
        {
          "y": 1,
          "x": 1536041181415
        },
        {
          "y": 1,
          "x": 1534592017328
        },
        {
          "y": 1,
          "x": 1534591976594
        },
        {
          "y": 1,
          "x": 1534874459022
        },
        {
          "y": 1,
          "x": 1536059851501
        },
        {
          "y": 1,
          "x": 1535195099767
        },
        {
          "y": 1,
          "x": 1534591786495
        },
        {
          "y": 1,
          "x": 1536478124365
        },
        {
          "y": 1,
          "x": 1534591616487
        },
        {
          "y": 1,
          "x": 1534766504992
        },
        {
          "y": 1,
          "x": 1535030493065
        },
        {
          "y": 1,
          "x": 1534591552404
        },
        {
          "y": 1,
          "x": 1534591510330
        },
        {
          "y": 1,
          "x": 1534591467917
        },
        {
          "y": 1,
          "x": 1534676488119
        },
        {
          "y": 1,
          "x": 1534591445511
        },
        {
          "y": 1,
          "x": 1534591431243
        },
        {
          "y": 1,
          "x": 1534591392782
        },
        {
          "y": 1,
          "x": 1534591354762
        },
        {
          "y": 1,
          "x": 1534766643471
        },
        {
          "y": 1,
          "x": 1534591344461
        },
        {
          "y": 1,
          "x": 1536161934716
        },
        {
          "y": 1,
          "x": 1534751950500
        },
        {
          "y": 1,
          "x": 1534777136694
        },
        {
          "y": 1,
          "x": 1536145036091
        },
        {
          "y": 1,
          "x": 1534591317521
        },
        {
          "y": 1,
          "x": 1534591265321
        },
        {
          "y": 1,
          "x": 1534591251037
        },
        {
          "y": 1,
          "x": 1535805778980
        },
        {
          "y": 1,
          "x": 1534588137550
        },
        {
          "y": 1,
          "x": 1535209436145
        },
        {
          "y": 1,
          "x": 1534694320570
        },
        {
          "y": 1,
          "x": 1534769883300
        },
        {
          "y": 1,
          "x": 1534588072277
        },
        {
          "y": 1,
          "x": 1534588038353
        },
        {
          "y": 1,
          "x": 1534587978542
        },
        {
          "y": 1,
          "x": 1534748216525
        },
        {
          "y": 1,
          "x": 1534766576685
        },
        {
          "y": 1,
          "x": 1536144450429
        },
        {
          "y": 1,
          "x": 1534591590228
        },
        {
          "y": 1,
          "x": 1534587833819
        },
        {
          "y": 1,
          "x": 1536661587458
        },
        {
          "y": 1,
          "x": 1535216506717
        },
        {
          "y": 1,
          "x": 1534592004711
        },
        {
          "y": 1,
          "x": 1534587589278
        },
        {
          "y": 1,
          "x": 1534587564549
        },
        {
          "y": 1,
          "x": 1534838279451
        },
        {
          "y": 1,
          "x": 1536568281786
        },
        {
          "y": 1,
          "x": 1535201992497
        },
        {
          "y": 1,
          "x": 1534584233759
        },
        {
          "y": 1,
          "x": 1535030508408
        },
        {
          "y": 1,
          "x": 1534591631802
        },
        {
          "y": 2,
          "x": 1535140612607
        },
        {
          "y": 1,
          "x": 1534584164792
        },
        {
          "y": 1,
          "x": 1534619073952
        },
        {
          "y": 1,
          "x": 1535212855707
        },
        {
          "y": 1,
          "x": 1534676327541
        },
        {
          "y": 1,
          "x": 1534584002810
        },
        {
          "y": 1,
          "x": 1535105194442
        },
        {
          "y": 1,
          "x": 1534583926200
        },
        {
          "y": 1,
          "x": 1534594919396
        },
        {
          "y": 1,
          "x": 1535962220186
        },
        {
          "y": 1,
          "x": 1535201953599
        },
        {
          "y": 1,
          "x": 1535011119815
        },
        {
          "y": 1,
          "x": 1535014669228
        },
        {
          "y": 1,
          "x": 1534583912215
        },
        {
          "y": 1,
          "x": 1534755469702
        },
        {
          "y": 1,
          "x": 1534580491882
        },
        {
          "y": 1,
          "x": 1534592228075
        },
        {
          "y": 1,
          "x": 1535115609500
        },
        {
          "y": 1,
          "x": 1536141609260
        },
        {
          "y": 1,
          "x": 1534605094194
        },
        {
          "y": 1,
          "x": 1535797834189
        },
        {
          "y": 1,
          "x": 1534576638687
        },
        {
          "y": 1,
          "x": 1535448065314
        },
        {
          "y": 1,
          "x": 1535212987590
        },
        {
          "y": 1,
          "x": 1536037547270
        },
        {
          "y": 2,
          "x": 1535151401704
        },
        {
          "y": 1,
          "x": 1534533486642
        },
        {
          "y": 1,
          "x": 1534533473203
        },
        {
          "y": 1,
          "x": 1534780673326
        },
        {
          "y": 1,
          "x": 1534584108561
        },
        {
          "y": 1,
          "x": 1534529973491
        },
        {
          "y": 1,
          "x": 1534529887957
        },
        {
          "y": 1,
          "x": 1534526413468
        },
        {
          "y": 1,
          "x": 1534676395007
        },
        {
          "y": 1,
          "x": 1534777776117
        },
        {
          "y": 1,
          "x": 1534523119790
        },
        {
          "y": 1,
          "x": 1534522972271
        },
        {
          "y": 1,
          "x": 1535122763581
        },
        {
          "y": 1,
          "x": 1536510146655
        },
        {
          "y": 1,
          "x": 1534522883285
        },
        {
          "y": 1,
          "x": 1534591947725
        },
        {
          "y": 1,
          "x": 1536037565736
        },
        {
          "y": 1,
          "x": 1534605287531
        },
        {
          "y": 1,
          "x": 1534770049337
        },
        {
          "y": 1,
          "x": 1534515147308
        },
        {
          "y": 2,
          "x": 1534515100190
        },
        {
          "y": 1,
          "x": 1536138082016
        },
        {
          "y": 1,
          "x": 1534523280547
        },
        {
          "y": 1,
          "x": 1534515050765
        },
        {
          "y": 1,
          "x": 1534514993076
        },
        {
          "y": 1,
          "x": 1534514979609
        },
        {
          "y": 1,
          "x": 1536144297862
        },
        {
          "y": 1,
          "x": 1534870655330
        },
        {
          "y": 1,
          "x": 1534514897464
        },
        {
          "y": 1,
          "x": 1534841990507
        },
        {
          "y": 1,
          "x": 1534514887108
        },
        {
          "y": 1,
          "x": 1536137853584
        },
        {
          "y": 1,
          "x": 1534514771166
        },
        {
          "y": 1,
          "x": 1534694268766
        },
        {
          "y": 1,
          "x": 1534514714988
        },
        {
          "y": 1,
          "x": 1534514704676
        },
        {
          "y": 1,
          "x": 1534526465091
        },
        {
          "y": 1,
          "x": 1534860107357
        },
        {
          "y": 1,
          "x": 1534514635495
        },
        {
          "y": 1,
          "x": 1535183876575
        },
        {
          "y": 1,
          "x": 1534573023777
        },
        {
          "y": 1,
          "x": 1534514372794
        },
        {
          "y": 1,
          "x": 1534604924016
        },
        {
          "y": 1,
          "x": 1536223436092
        },
        {
          "y": 1,
          "x": 1535793533788
        },
        {
          "y": 1,
          "x": 1535097591843
        },
        {
          "y": 1,
          "x": 1535030501026
        },
        {
          "y": 1,
          "x": 1536134190791
        },
        {
          "y": 1,
          "x": 1536223260978
        },
        {
          "y": 1,
          "x": 1536137674424
        },
        {
          "y": 1,
          "x": 1535198408474
        },
        {
          "y": 1,
          "x": 1534766382740
        },
        {
          "y": 1,
          "x": 1534512595029
        },
        {
          "y": 1,
          "x": 1534514825129
        },
        {
          "y": 1,
          "x": 1534512582586
        },
        {
          "y": 1,
          "x": 1534766342191
        },
        {
          "y": 1,
          "x": 1534512555776
        },
        {
          "y": 1,
          "x": 1534512506562
        },
        {
          "y": 1,
          "x": 1535011207412
        },
        {
          "y": 1,
          "x": 1534766985025
        },
        {
          "y": 1,
          "x": 1534512437148
        },
        {
          "y": 1,
          "x": 1534512398648
        },
        {
          "y": 1,
          "x": 1535030526433
        },
        {
          "y": 1,
          "x": 1535101096079
        },
        {
          "y": 1,
          "x": 1534514651226
        },
        {
          "y": 1,
          "x": 1535209425218
        },
        {
          "y": 1,
          "x": 1535805695506
        },
        {
          "y": 1,
          "x": 1534960771774
        },
        {
          "y": 1,
          "x": 1534687430428
        },
        {
          "y": 1,
          "x": 1535797538856
        },
        {
          "y": 1,
          "x": 1534507900088
        },
        {
          "y": 1,
          "x": 1534587947735
        },
        {
          "y": 1,
          "x": 1534507899738
        },
        {
          "y": 1,
          "x": 1535032716312
        },
        {
          "y": 1,
          "x": 1534701430418
        },
        {
          "y": 1,
          "x": 1534615337761
        },
        {
          "y": 1,
          "x": 1534881399809
        },
        {
          "y": 1,
          "x": 1534580431264
        },
        {
          "y": 1,
          "x": 1534507897752
        },
        {
          "y": 1,
          "x": 1535047146749
        },
        {
          "y": 1,
          "x": 1534507896973
        },
        {
          "y": 1,
          "x": 1534507896622
        },
        {
          "y": 1,
          "x": 1535966027302
        },
        {
          "y": 1,
          "x": 1534507896275
        },
        {
          "y": 1,
          "x": 1534514755430
        },
        {
          "y": 1,
          "x": 1534507895510
        },
        {
          "y": 1,
          "x": 1534514663639
        },
        {
          "y": 1,
          "x": 1534580464913
        },
        {
          "y": 1,
          "x": 1534507895151
        },
        {
          "y": 1,
          "x": 1534769873569
        },
        {
          "y": 1,
          "x": 1534507889087
        },
        {
          "y": 1,
          "x": 1536495793521
        },
        {
          "y": 1,
          "x": 1534780974162
        },
        {
          "y": 1,
          "x": 1534526725332
        },
        {
          "y": 1,
          "x": 1534507885828
        },
        {
          "y": 2,
          "x": 1534515158340
        },
        {
          "y": 1,
          "x": 1536148849629
        },
        {
          "y": 1,
          "x": 1534507892742
        },
        {
          "y": 1,
          "x": 1534507884289
        },
        {
          "y": 1,
          "x": 1534665795099
        },
        {
          "y": 1,
          "x": 1536499453051
        },
        {
          "y": 1,
          "x": 1534514541306
        },
        {
          "y": 1,
          "x": 1534773751063
        },
        {
          "y": 1,
          "x": 1536564736802
        },
        {
          "y": 1,
          "x": 1534874338982
        },
        {
          "y": 1,
          "x": 1534874314802
        },
        {
          "y": 1,
          "x": 1535566658032
        },
        {
          "y": 1,
          "x": 1534604862537
        },
        {
          "y": 1,
          "x": 1534584281517
        },
        {
          "y": 1,
          "x": 1534595576971
        },
        {
          "y": 1,
          "x": 1536658515021
        },
        {
          "y": 1,
          "x": 1534774135168
        },
        {
          "y": 1,
          "x": 1534507887066
        },
        {
          "y": 1,
          "x": 1534766897319
        },
        {
          "y": 1,
          "x": 1534601362147
        },
        {
          "y": 1,
          "x": 1535216461296
        },
        {
          "y": 1,
          "x": 1534587873430
        },
        {
          "y": 1,
          "x": 1535187521138
        },
        {
          "y": 1,
          "x": 1534856297081
        },
        {
          "y": 1,
          "x": 1534587887668
        },
        {
          "y": 1,
          "x": 1534766820683
        },
        {
          "y": 1,
          "x": 1534504307821
        },
        {
          "y": 1,
          "x": 1535462111719
        },
        {
          "y": 1,
          "x": 1534504306217
        },
        {
          "y": 1,
          "x": 1534514405596
        },
        {
          "y": 1,
          "x": 1534687123854
        },
        {
          "y": 1,
          "x": 1534860149359
        },
        {
          "y": 1,
          "x": 1536474224486
        },
        {
          "y": 1,
          "x": 1534515063854
        },
        {
          "y": 1,
          "x": 1536212418883
        },
        {
          "y": 1,
          "x": 1534507901631
        },
        {
          "y": 1,
          "x": 1536048401594
        },
        {
          "y": 1,
          "x": 1535801683347
        },
        {
          "y": 1,
          "x": 1534500722058
        },
        {
          "y": 1,
          "x": 1534580477784
        },
        {
          "y": 1,
          "x": 1534680228892
        },
        {
          "y": 1,
          "x": 1534500695747
        },
        {
          "y": 1,
          "x": 1534523082008
        },
        {
          "y": 1,
          "x": 1534497651401
        },
        {
          "y": 1,
          "x": 1534766812109
        },
        {
          "y": 1,
          "x": 1534595198349
        },
        {
          "y": 1,
          "x": 1534867229717
        },
        {
          "y": 1,
          "x": 1536138239034
        },
        {
          "y": 1,
          "x": 1534777499591
        },
        {
          "y": 1,
          "x": 1534497622829
        },
        {
          "y": 1,
          "x": 1534497625444
        },
        {
          "y": 1,
          "x": 1534766711065
        },
        {
          "y": 1,
          "x": 1534594848857
        },
        {
          "y": 1,
          "x": 1536658499508
        },
        {
          "y": 1,
          "x": 1534497617696
        },
        {
          "y": 1,
          "x": 1534512519205
        },
        {
          "y": 1,
          "x": 1535987122774
        },
        {
          "y": 1,
          "x": 1534497010229
        },
        {
          "y": 1,
          "x": 1534595342226
        },
        {
          "y": 1,
          "x": 1535465871869
        },
        {
          "y": 1,
          "x": 1534687440661
        },
        {
          "y": 1,
          "x": 1534497014189
        },
        {
          "y": 1,
          "x": 1534497014619
        },
        {
          "y": 1,
          "x": 1536141295758
        },
        {
          "y": 1,
          "x": 1534618931347
        },
        {
          "y": 1,
          "x": 1534587782732
        },
        {
          "y": 1,
          "x": 1534435551510
        },
        {
          "y": 1,
          "x": 1534435552372
        },
        {
          "y": 1,
          "x": 1534701412826
        },
        {
          "y": 1,
          "x": 1534591903371
        },
        {
          "y": 1,
          "x": 1534595477237
        },
        {
          "y": 1,
          "x": 1534594990232
        },
        {
          "y": 1,
          "x": 1536568078528
        },
        {
          "y": 1,
          "x": 1534435551099
        },
        {
          "y": 1,
          "x": 1534587757011
        },
        {
          "y": 1,
          "x": 1536661601664
        },
        {
          "y": 1,
          "x": 1536481575835
        },
        {
          "y": 1,
          "x": 1534515130750
        },
        {
          "y": 1,
          "x": 1534497011495
        },
        {
          "y": 1,
          "x": 1534435548838
        },
        {
          "y": 1,
          "x": 1535180208132
        },
        {
          "y": 1,
          "x": 1534780663562
        },
        {
          "y": 1,
          "x": 1535043727181
        },
        {
          "y": 1,
          "x": 1535032678151
        },
        {
          "y": 1,
          "x": 1536070780857
        },
        {
          "y": 1,
          "x": 1536568657864
        },
        {
          "y": 1,
          "x": 1534512713996
        },
        {
          "y": 1,
          "x": 1535097541089
        },
        {
          "y": 1,
          "x": 1534780846956
        },
        {
          "y": 2,
          "x": 1535644113366
        },
        {
          "y": 1,
          "x": 1534514529534
        },
        {
          "y": 1,
          "x": 1534924788070
        },
        {
          "y": 1,
          "x": 1535047040715
        },
        {
          "y": 1,
          "x": 1534435545954
        },
        {
          "y": 1,
          "x": 1536048603377
        },
        {
          "y": 1,
          "x": 1535462263255
        },
        {
          "y": 1,
          "x": 1534924636529
        },
        {
          "y": 1,
          "x": 1535194987184
        },
        {
          "y": 1,
          "x": 1534515034932
        },
        {
          "y": 1,
          "x": 1534777345713
        },
        {
          "y": 2,
          "x": 1535122684686
        },
        {
          "y": 1,
          "x": 1534780889271
        },
        {
          "y": 1,
          "x": 1534421512664
        },
        {
          "y": 1,
          "x": 1534595451027
        },
        {
          "y": 1,
          "x": 1534584094767
        },
        {
          "y": 1,
          "x": 1536141524258
        },
        {
          "y": 1,
          "x": 1534615356759
        },
        {
          "y": 1,
          "x": 1535202088898
        },
        {
          "y": 1,
          "x": 1536658543196
        },
        {
          "y": 1,
          "x": 1534588006368
        },
        {
          "y": 1,
          "x": 1534421508906
        },
        {
          "y": 1,
          "x": 1534773926522
        },
        {
          "y": 1,
          "x": 1534421507715
        },
        {
          "y": 1,
          "x": 1534580310481
        },
        {
          "y": 1,
          "x": 1534421506905
        },
        {
          "y": 1,
          "x": 1534421511414
        },
        {
          "y": 1,
          "x": 1534867049027
        },
        {
          "y": 1,
          "x": 1534421504014
        },
        {
          "y": 1,
          "x": 1534591672780
        },
        {
          "y": 1,
          "x": 1534863539268
        },
        {
          "y": 1,
          "x": 1536147650256
        },
        {
          "y": 1,
          "x": 1536481881756
        },
        {
          "y": 1,
          "x": 1534766440962
        },
        {
          "y": 1,
          "x": 1534522941829
        },
        {
          "y": 1,
          "x": 1535700436901
        },
        {
          "y": 1,
          "x": 1534421500987
        },
        {
          "y": 1,
          "x": 1534500700242
        },
        {
          "y": 1,
          "x": 1536048748415
        },
        {
          "y": 1,
          "x": 1534755479364
        },
        {
          "y": 1,
          "x": 1534421508530
        },
        {
          "y": 1,
          "x": 1534874278524
        },
        {
          "y": 1,
          "x": 1535805274211
        },
        {
          "y": 2,
          "x": 1535126413227
        },
        {
          "y": 1,
          "x": 1534595367865
        },
        {
          "y": 1,
          "x": 1534421493438
        },
        {
          "y": 1,
          "x": 1535018274934
        },
        {
          "y": 1,
          "x": 1536586717042
        },
        {
          "y": 1,
          "x": 1534957119767
        },
        {
          "y": 1,
          "x": 1534591417927
        },
        {
          "y": 1,
          "x": 1534595027985
        },
        {
          "y": 1,
          "x": 1534584028411
        },
        {
          "y": 1,
          "x": 1536216060092
        },
        {
          "y": 1,
          "x": 1534605276688
        },
        {
          "y": 1,
          "x": 1535030501606
        },
        {
          "y": 1,
          "x": 1535965953993
        },
        {
          "y": 1,
          "x": 1534595072185
        },
        {
          "y": 1,
          "x": 1534421490129
        },
        {
          "y": 1,
          "x": 1534680034019
        },
        {
          "y": 1,
          "x": 1535620842127
        },
        {
          "y": 1,
          "x": 1534587719172
        },
        {
          "y": 1,
          "x": 1534773570297
        },
        {
          "y": 1,
          "x": 1534395381180
        },
        {
          "y": 1,
          "x": 1534395380817
        },
        {
          "y": 1,
          "x": 1534595058908
        },
        {
          "y": 1,
          "x": 1534591566916
        },
        {
          "y": 1,
          "x": 1534512423604
        },
        {
          "y": 1,
          "x": 1534697874876
        },
        {
          "y": 1,
          "x": 1534780696688
        },
        {
          "y": 1,
          "x": 1536484996971
        },
        {
          "y": 1,
          "x": 1536223465776
        },
        {
          "y": 1,
          "x": 1534766473690
        },
        {
          "y": 1,
          "x": 1534507885050
        },
        {
          "y": 1,
          "x": 1534395379903
        },
        {
          "y": 1,
          "x": 1534395379537
        },
        {
          "y": 1,
          "x": 1535030505515
        },
        {
          "y": 1,
          "x": 1534435557032
        },
        {
          "y": 1,
          "x": 1534595169271
        },
        {
          "y": 1,
          "x": 1536596672849
        },
        {
          "y": 1,
          "x": 1534395373934
        },
        {
          "y": 1,
          "x": 1534665777108
        },
        {
          "y": 1,
          "x": 1536037490699
        },
        {
          "y": 1,
          "x": 1534395376784
        },
        {
          "y": 1,
          "x": 1534395374727
        },
        {
          "y": 1,
          "x": 1534701421689
        },
        {
          "y": 1,
          "x": 1534504308231
        },
        {
          "y": 1,
          "x": 1536127514352
        },
        {
          "y": 1,
          "x": 1534498303666
        },
        {
          "y": 1,
          "x": 1535697239135
        },
        {
          "y": 1,
          "x": 1534669511350
        },
        {
          "y": 1,
          "x": 1534777364889
        },
        {
          "y": 1,
          "x": 1534395369554
        },
        {
          "y": 1,
          "x": 1535112316291
        },
        {
          "y": 1,
          "x": 1534523343785
        },
        {
          "y": 1,
          "x": 1536037528131
        },
        {
          "y": 1,
          "x": 1534759456040
        },
        {
          "y": 1,
          "x": 1534583961917
        },
        {
          "y": 1,
          "x": 1534359439115
        },
        {
          "y": 1,
          "x": 1534679972480
        },
        {
          "y": 1,
          "x": 1534435550639
        },
        {
          "y": 1,
          "x": 1534863549266
        },
        {
          "y": 1,
          "x": 1535198514400
        },
        {
          "y": 1,
          "x": 1534676632332
        },
        {
          "y": 1,
          "x": 1536134229743
        },
        {
          "y": 1,
          "x": 1534774049031
        },
        {
          "y": 1,
          "x": 1534669426445
        },
        {
          "y": 1,
          "x": 1534359441205
        },
        {
          "y": 1,
          "x": 1535133603180
        },
        {
          "y": 1,
          "x": 1535011339929
        },
        {
          "y": 1,
          "x": 1535036471981
        },
        {
          "y": 1,
          "x": 1535133488663
        },
        {
          "y": 1,
          "x": 1534867140513
        },
        {
          "y": 1,
          "x": 1535896352539
        },
        {
          "y": 1,
          "x": 1534665851720
        },
        {
          "y": 1,
          "x": 1536478012075
        },
        {
          "y": 1,
          "x": 1535969443783
        },
        {
          "y": 1,
          "x": 1534514567562
        },
        {
          "y": 1,
          "x": 1534595330505
        },
        {
          "y": 1,
          "x": 1534766887777
        },
        {
          "y": 1,
          "x": 1534763203330
        },
        {
          "y": 1,
          "x": 1535036322134
        },
        {
          "y": 1,
          "x": 1536568363101
        },
        {
          "y": 1,
          "x": 1534694353056
        },
        {
          "y": 1,
          "x": 1534838323608
        },
        {
          "y": 1,
          "x": 1535483651729
        },
        {
          "y": 1,
          "x": 1534676517926
        },
        {
          "y": 1,
          "x": 1535990633736
        },
        {
          "y": 1,
          "x": 1534852722149
        },
        {
          "y": 1,
          "x": 1534507891086
        },
        {
          "y": 1,
          "x": 1534421492957
        },
        {
          "y": 1,
          "x": 1535130194556
        },
        {
          "y": 1,
          "x": 1535697181581
        },
        {
          "y": 1,
          "x": 1534591380730
        },
        {
          "y": 1,
          "x": 1534588026903
        },
        {
          "y": 1,
          "x": 1534773915675
        },
        {
          "y": 1,
          "x": 1534604821996
        },
        {
          "y": 1,
          "x": 1536070004642
        },
        {
          "y": 1,
          "x": 1534594863873
        },
        {
          "y": 1,
          "x": 1536138165968
        },
        {
          "y": 1,
          "x": 1534580404643
        },
        {
          "y": 1,
          "x": 1536124066248
        },
        {
          "y": 1,
          "x": 1534512698646
        },
        {
          "y": 1,
          "x": 1534877842396
        },
        {
          "y": 1,
          "x": 1534584195463
        },
        {
          "y": 1,
          "x": 1535032667654
        },
        {
          "y": 1,
          "x": 1535205631238
        },
        {
          "y": 1,
          "x": 1535122980738
        },
        {
          "y": 1,
          "x": 1535466011488
        },
        {
          "y": 1,
          "x": 1535640368798
        },
        {
          "y": 1,
          "x": 1534497643681
        },
        {
          "y": 1,
          "x": 1534592142268
        },
        {
          "y": 1,
          "x": 1535133564841
        },
        {
          "y": 1,
          "x": 1534687414727
        },
        {
          "y": 1,
          "x": 1534615305338
        },
        {
          "y": 2,
          "x": 1534584321514
        },
        {
          "y": 1,
          "x": 1534874374784
        },
        {
          "y": 1,
          "x": 1536144863213
        },
        {
          "y": 1,
          "x": 1534595351499
        },
        {
          "y": 1,
          "x": 1534435549245
        },
        {
          "y": 1,
          "x": 1534497015410
        },
        {
          "y": 1,
          "x": 1536568404694
        },
        {
          "y": 1,
          "x": 1534591813681
        },
        {
          "y": 1,
          "x": 1534766933022
        },
        {
          "y": 1,
          "x": 1534514606848
        },
        {
          "y": 1,
          "x": 1535209455658
        },
        {
          "y": 1,
          "x": 1535032948791
        },
        {
          "y": 1,
          "x": 1536560767235
        },
        {
          "y": 1,
          "x": 1535476695066
        },
        {
          "y": 1,
          "x": 1534669410356
        },
        {
          "y": 1,
          "x": 1535030508857
        },
        {
          "y": 1,
          "x": 1535696852285
        },
        {
          "y": 1,
          "x": 1534924776283
        },
        {
          "y": 1,
          "x": 1535011350194
        },
        {
          "y": 1,
          "x": 1534774007429
        },
        {
          "y": 1,
          "x": 1534773782687
        },
        {
          "y": 1,
          "x": 1536137786958
        },
        {
          "y": 1,
          "x": 1534395378363
        },
        {
          "y": 1,
          "x": 1534507894795
        },
        {
          "y": 1,
          "x": 1534601557079
        },
        {
          "y": 1,
          "x": 1535047071671
        },
        {
          "y": 1,
          "x": 1535808842185
        },
        {
          "y": 1,
          "x": 1534595002281
        },
        {
          "y": 1,
          "x": 1535202005668
        },
        {
          "y": 1,
          "x": 1534498310985
        },
        {
          "y": 1,
          "x": 1534766463524
        },
        {
          "y": 1,
          "x": 1535111957254
        },
        {
          "y": 1,
          "x": 1535465842037
        },
        {
          "y": 1,
          "x": 1534507891919
        },
        {
          "y": 1,
          "x": 1534867115084
        },
        {
          "y": 1,
          "x": 1534497009549
        },
        {
          "y": 1,
          "x": 1536133386911
        },
        {
          "y": 1,
          "x": 1536230716947
        },
        {
          "y": 1,
          "x": 1536137002834
        },
        {
          "y": 1,
          "x": 1534687237862
        },
        {
          "y": 1,
          "x": 1536144752533
        },
        {
          "y": 1,
          "x": 1534395377973
        },
        {
          "y": 1,
          "x": 1534591526555
        },
        {
          "y": 1,
          "x": 1534359440799
        },
        {
          "y": 1,
          "x": 1534766394864
        },
        {
          "y": 1,
          "x": 1535014823033
        },
        {
          "y": 1,
          "x": 1535566628887
        },
        {
          "y": 1,
          "x": 1535126468675
        },
        {
          "y": 1,
          "x": 1534694336662
        },
        {
          "y": 1,
          "x": 1534523244946
        },
        {
          "y": 1,
          "x": 1535465956472
        },
        {
          "y": 1,
          "x": 1534595560111
        },
        {
          "y": 1,
          "x": 1535112123670
        },
        {
          "y": 1,
          "x": 1534687137105
        },
        {
          "y": 1,
          "x": 1536223845228
        },
        {
          "y": 2,
          "x": 1535966520085
        },
        {
          "y": 2,
          "x": 1535198605647
        },
        {
          "y": 1,
          "x": 1536571426836
        },
        {
          "y": 1,
          "x": 1534504311405
        },
        {
          "y": 1,
          "x": 1534497619448
        },
        {
          "y": 1,
          "x": 1535126564577
        },
        {
          "y": 1,
          "x": 1535030515766
        },
        {
          "y": 1,
          "x": 1534530027189
        },
        {
          "y": 1,
          "x": 1536586760415
        },
        {
          "y": 1,
          "x": 1535104923748
        },
        {
          "y": 1,
          "x": 1534421495929
        },
        {
          "y": 1,
          "x": 1534605200222
        },
        {
          "y": 1,
          "x": 1534687171780
        },
        {
          "y": 1,
          "x": 1536162058352
        },
        {
          "y": 1,
          "x": 1534605225795
        },
        {
          "y": 1,
          "x": 1534838267126
        },
        {
          "y": 1,
          "x": 1536586414766
        },
        {
          "y": 1,
          "x": 1535209181197
        },
        {
          "y": 1,
          "x": 1535030496360
        },
        {
          "y": 1,
          "x": 1534877808718
        },
        {
          "y": 1,
          "x": 1534604955507
        },
        {
          "y": 1,
          "x": 1534498313031
        },
        {
          "y": 1,
          "x": 1534595464736
        },
        {
          "y": 1,
          "x": 1534773852516
        },
        {
          "y": 1,
          "x": 1534507890725
        },
        {
          "y": 1,
          "x": 1534780953096
        },
        {
          "y": 1,
          "x": 1535802537782
        },
        {
          "y": 1,
          "x": 1536568207013
        },
        {
          "y": 1,
          "x": 1534395373566
        },
        {
          "y": 1,
          "x": 1534676542224
        },
        {
          "y": 1,
          "x": 1534359441628
        },
        {
          "y": 1,
          "x": 1534591495203
        },
        {
          "y": 1,
          "x": 1534507894437
        },
        {
          "y": 1,
          "x": 1535549144418
        },
        {
          "y": 1,
          "x": 1535194995818
        },
        {
          "y": 1,
          "x": 1534523262869
        },
        {
          "y": 1,
          "x": 1535205609188
        },
        {
          "y": 1,
          "x": 1534421496852
        },
        {
          "y": 1,
          "x": 1536477847992
        },
        {
          "y": 1,
          "x": 1536223314301
        },
        {
          "y": 1,
          "x": 1534588108171
        },
        {
          "y": 1,
          "x": 1534580287937
        },
        {
          "y": 1,
          "x": 1534964209996
        },
        {
          "y": 1,
          "x": 1534507883489
        },
        {
          "y": 1,
          "x": 1536568564764
        },
        {
          "y": 1,
          "x": 1534676530223
        },
        {
          "y": 1,
          "x": 1535122743399
        },
        {
          "y": 1,
          "x": 1534512612031
        },
        {
          "y": 1,
          "x": 1534498316106
        },
        {
          "y": 1,
          "x": 1536133306444
        },
        {
          "y": 1,
          "x": 1534595214028
        },
        {
          "y": 1,
          "x": 1535030506007
        },
        {
          "y": 1,
          "x": 1534605063788
        },
        {
          "y": 1,
          "x": 1536137742377
        },
        {
          "y": 1,
          "x": 1534512672077
        },
        {
          "y": 1,
          "x": 1534421509283
        },
        {
          "y": 1,
          "x": 1535969349665
        },
        {
          "y": 1,
          "x": 1535032866996
        },
        {
          "y": 1,
          "x": 1535563034032
        },
        {
          "y": 1,
          "x": 1534595240235
        },
        {
          "y": 1,
          "x": 1535808322350
        },
        {
          "y": 1,
          "x": 1534838447674
        },
        {
          "y": 2,
          "x": 1535122754234
        },
        {
          "y": 1,
          "x": 1534605105682
        },
        {
          "y": 1,
          "x": 1536041441227
        },
        {
          "y": 1,
          "x": 1534777292821
        },
        {
          "y": 1,
          "x": 1536148070631
        },
        {
          "y": 1,
          "x": 1534751829059
        },
        {
          "y": 1,
          "x": 1535815315520
        },
        {
          "y": 1,
          "x": 1534949829795
        },
        {
          "y": 1,
          "x": 1534669496711
        },
        {
          "y": 1,
          "x": 1536148710401
        },
        {
          "y": 1,
          "x": 1534676428255
        },
        {
          "y": 1,
          "x": 1534594872433
        },
        {
          "y": 1,
          "x": 1536499539360
        },
        {
          "y": 1,
          "x": 1536138422289
        },
        {
          "y": 1,
          "x": 1534435557460
        },
        {
          "y": 1,
          "x": 1535036468398
        },
        {
          "y": 1,
          "x": 1534522959063
        },
        {
          "y": 1,
          "x": 1534507888267
        },
        {
          "y": 1,
          "x": 1536145012843
        },
        {
          "y": 1,
          "x": 1535209090180
        },
        {
          "y": 1,
          "x": 1536585999332
        },
        {
          "y": 1,
          "x": 1538390747613
        },
        {
          "y": 1,
          "x": 1538386672485
        },
        {
          "y": 1,
          "x": 1538386668750
        },
        {
          "y": 1,
          "x": 1538385734743
        },
        {
          "y": 4,
          "x": 1538384780981
        },
        {
          "y": 7,
          "x": 1538047285576
        },
        {
          "y": 1,
          "x": 1537970586096
        },
        {
          "y": 3,
          "x": 1536304448168
        },
        {
          "y": 5,
          "x": 1536295277378
        },
        {
          "y": 5,
          "x": 1536171730476
        },
        {
          "y": 4,
          "x": 1538383562931
        },
        {
          "y": 4,
          "x": 1537182118185
        },
        {
          "y": 7,
          "x": 1537178040573
        },
        {
          "y": 1,
          "x": 1535607985645
        },
        {
          "y": 1,
          "x": 1538386309934
        },
        {
          "y": 1,
          "x": 1538385809286
        },
        {
          "y": 4,
          "x": 1538385452813
        },
        {
          "y": 4,
          "x": 1538383580798
        },
        {
          "y": 7,
          "x": 1537167051708
        },
        {
          "y": 5,
          "x": 1538635568588
        },
        {
          "y": 2,
          "x": 1533786525694
        },
        {
          "y": 5,
          "x": 1533713593449
        },
        {
          "y": 1,
          "x": 1533547724845
        },
        {
          "y": 4,
          "x": 1532943189702
        },
        {
          "y": 2,
          "x": 1532942789137
        },
        {
          "y": 4,
          "x": 1532942555923
        },
        {
          "y": 7,
          "x": 1533712649570
        },
        {
          "y": 4,
          "x": 1532941585308
        },
        {
          "y": 1,
          "x": 1533713195192
        },
        {
          "y": 2,
          "x": 1533787235572
        },
        {
          "y": 6,
          "x": 1531481986700
        },
        {
          "y": 1,
          "x": 1533547971282
        },
        {
          "y": 1,
          "x": 1531480514728
        },
        {
          "y": 3,
          "x": 1533787279937
        },
        {
          "y": 1,
          "x": 1531475080410
        },
        {
          "y": 1,
          "x": 1531392202900
        },
        {
          "y": 1,
          "x": 1531392118583
        },
        {
          "y": 3,
          "x": 1533786594313
        },
        {
          "y": 4,
          "x": 1532347492106
        },
        {
          "y": 2,
          "x": 1533786920933
        },
        {
          "y": 3,
          "x": 1531126381312
        },
        {
          "y": 1,
          "x": 1531127756993
        },
        {
          "y": 4,
          "x": 1532351186027
        },
        {
          "y": 9,
          "x": 1532524114670
        },
        {
          "y": 1,
          "x": 1531118518948
        },
        {
          "y": 2,
          "x": 1532942629960
        },
        {
          "y": 1,
          "x": 1531393267729
        },
        {
          "y": 1,
          "x": 1531118284737
        },
        {
          "y": 1,
          "x": 1531059477057
        },
        {
          "y": 1,
          "x": 1530720340819
        },
        {
          "y": 1,
          "x": 1534747042443
        },
        {
          "y": 3,
          "x": 1530701833307
        },
        {
          "y": 5,
          "x": 1533713787162
        },
        {
          "y": 1,
          "x": 1532341617201
        },
        {
          "y": 3,
          "x": 1531126145324
        },
        {
          "y": 2,
          "x": 1530790771485
        },
        {
          "y": 1,
          "x": 1530191655077
        },
        {
          "y": 7,
          "x": 1530177625210
        },
        {
          "y": 1,
          "x": 1530186135547
        },
        {
          "y": 1,
          "x": 1531126960372
        },
        {
          "y": 1,
          "x": 1529923856180
        },
        {
          "y": 1,
          "x": 1530791067193
        },
        {
          "y": 1,
          "x": 1529910126870
        },
        {
          "y": 1,
          "x": 1529909884788
        },
        {
          "y": 1,
          "x": 1529902970829
        },
        {
          "y": 2,
          "x": 1529902701445
        },
        {
          "y": 1,
          "x": 1532518098931
        },
        {
          "y": 1,
          "x": 1529570656371
        },
        {
          "y": 1,
          "x": 1529564594396
        },
        {
          "y": 4,
          "x": 1531460607792
        },
        {
          "y": 1,
          "x": 1529573011371
        },
        {
          "y": 1,
          "x": 1530791252916
        },
        {
          "y": 1,
          "x": 1529563069293
        },
        {
          "y": 2,
          "x": 1529562864322
        }],
        "key": "AmtrustClaimRegister"
      },
      {
        "values": [{
          "y": 1,
          "x": 1536658573636
        },
        {
          "y": 1,
          "x": 1536658558906
        },
        {
          "y": 1,
          "x": 1536658425152
        },
        {
          "y": 1,
          "x": 1536651209275
        },
        {
          "y": 1,
          "x": 1536650910413
        },
        {
          "y": 1,
          "x": 1536650706155
        },
        {
          "y": 1,
          "x": 1536650621514
        },
        {
          "y": 1,
          "x": 1536647161314
        },
        {
          "y": 1,
          "x": 1536647142782
        },
        {
          "y": 1,
          "x": 1536647106781
        },
        {
          "y": 1,
          "x": 1536647032804
        },
        {
          "y": 1,
          "x": 1536647000105
        },
        {
          "y": 1,
          "x": 1536607313335
        },
        {
          "y": 1,
          "x": 1536596646363
        },
        {
          "y": 1,
          "x": 1536596644844
        },
        {
          "y": 1,
          "x": 1536596643294
        },
        {
          "y": 1,
          "x": 1536596641283
        },
        {
          "y": 1,
          "x": 1536586692103
        },
        {
          "y": 1,
          "x": 1536586561108
        },
        {
          "y": 1,
          "x": 1536586434993
        },
        {
          "y": 1,
          "x": 1536586393202
        },
        {
          "y": 1,
          "x": 1536586315049
        },
        {
          "y": 1,
          "x": 1536585978629
        },
        {
          "y": 1,
          "x": 1536585954398
        },
        {
          "y": 1,
          "x": 1536582952937
        },
        {
          "y": 1,
          "x": 1536568640782
        },
        {
          "y": 1,
          "x": 1536568585518
        },
        {
          "y": 1,
          "x": 1536568469336
        },
        {
          "y": 1,
          "x": 1536568451941
        },
        {
          "y": 1,
          "x": 1536568425821
        },
        {
          "y": 1,
          "x": 1536568383412
        },
        {
          "y": 1,
          "x": 1536568148986
        },
        {
          "y": 1,
          "x": 1536568058877
        },
        {
          "y": 1,
          "x": 1536567938650
        },
        {
          "y": 1,
          "x": 1536567881356
        },
        {
          "y": 1,
          "x": 1536564787238
        },
        {
          "y": 1,
          "x": 1536564514448
        },
        {
          "y": 1,
          "x": 1536564460071
        },
        {
          "y": 1,
          "x": 1536564353175
        },
        {
          "y": 1,
          "x": 1536564233540
        },
        {
          "y": 1,
          "x": 1536506565688
        },
        {
          "y": 1,
          "x": 1536499751813
        },
        {
          "y": 1,
          "x": 1536499710506
        },
        {
          "y": 1,
          "x": 1536499665902
        },
        {
          "y": 1,
          "x": 1536650877325
        },
        {
          "y": 1,
          "x": 1536499581493
        },
        {
          "y": 1,
          "x": 1536499518612
        },
        {
          "y": 1,
          "x": 1536499475613
        },
        {
          "y": 1,
          "x": 1536499431516
        },
        {
          "y": 1,
          "x": 1536492399081
        },
        {
          "y": 1,
          "x": 1536492196541
        },
        {
          "y": 1,
          "x": 1536485014601
        },
        {
          "y": 1,
          "x": 1536481758263
        },
        {
          "y": 1,
          "x": 1536481672623
        },
        {
          "y": 1,
          "x": 1536478157983
        },
        {
          "y": 1,
          "x": 1536477952265
        },
        {
          "y": 1,
          "x": 1536477910616
        },
        {
          "y": 1,
          "x": 1536477867010
        },
        {
          "y": 1,
          "x": 1536575001360
        },
        {
          "y": 1,
          "x": 1536470580814
        },
        {
          "y": 1,
          "x": 1536231223555
        },
        {
          "y": 1,
          "x": 1536230953832
        },
        {
          "y": 1,
          "x": 1536230933971
        },
        {
          "y": 1,
          "x": 1536230912744
        },
        {
          "y": 1,
          "x": 1536230892797
        },
        {
          "y": 1,
          "x": 1536230876376
        },
        {
          "y": 1,
          "x": 1536230790362
        },
        {
          "y": 1,
          "x": 1536651191910
        },
        {
          "y": 1,
          "x": 1536230423395
        },
        {
          "y": 1,
          "x": 1536223898476
        },
        {
          "y": 1,
          "x": 1536564715659
        },
        {
          "y": 1,
          "x": 1536223720094
        },
        {
          "y": 1,
          "x": 1536223703987
        },
        {
          "y": 1,
          "x": 1536223579420
        },
        {
          "y": 1,
          "x": 1536499408473
        },
        {
          "y": 1,
          "x": 1536223418257
        },
        {
          "y": 1,
          "x": 1536223370946
        },
        {
          "y": 1,
          "x": 1536223241000
        },
        {
          "y": 1,
          "x": 1536216337758
        },
        {
          "y": 1,
          "x": 1536216241510
        },
        {
          "y": 1,
          "x": 1536216223983
        },
        {
          "y": 1,
          "x": 1536651155625
        },
        {
          "y": 1,
          "x": 1536216110672
        },
        {
          "y": 1,
          "x": 1536216095541
        },
        {
          "y": 1,
          "x": 1536216079334
        },
        {
          "y": 1,
          "x": 1536212453636
        },
        {
          "y": 1,
          "x": 1536586518282
        },
        {
          "y": 1,
          "x": 1536212387969
        },
        {
          "y": 1,
          "x": 1536212373520
        },
        {
          "y": 1,
          "x": 1536212326094
        },
        {
          "y": 1,
          "x": 1536208837488
        },
        {
          "y": 1,
          "x": 1536208820811
        },
        {
          "y": 1,
          "x": 1536208788145
        },
        {
          "y": 1,
          "x": 1536165508769
        },
        {
          "y": 1,
          "x": 1536162234546
        },
        {
          "y": 1,
          "x": 1536162114008
        },
        {
          "y": 1,
          "x": 1536158847529
        },
        {
          "y": 1,
          "x": 1536158850218
        },
        {
          "y": 1,
          "x": 1536646980987
        },
        {
          "y": 1,
          "x": 1536155123156
        },
        {
          "y": 1,
          "x": 1536148897485
        },
        {
          "y": 1,
          "x": 1536148874348
        },
        {
          "y": 1,
          "x": 1536148775544
        },
        {
          "y": 1,
          "x": 1536148736041
        },
        {
          "y": 1,
          "x": 1536148685245
        },
        {
          "y": 1,
          "x": 1536148481404
        },
        {
          "y": 1,
          "x": 1536596647041
        },
        {
          "y": 1,
          "x": 1536148385708
        },
        {
          "y": 1,
          "x": 1536148364120
        },
        {
          "y": 1,
          "x": 1536148271823
        },
        {
          "y": 1,
          "x": 1536148185233
        },
        {
          "y": 1,
          "x": 1536148137920
        },
        {
          "y": 1,
          "x": 1536148047203
        },
        {
          "y": 1,
          "x": 1536147890904
        },
        {
          "y": 1,
          "x": 1536147870996
        },
        {
          "y": 1,
          "x": 1536147849584
        },
        {
          "y": 1,
          "x": 1536147778774
        },
        {
          "y": 1,
          "x": 1536147695056
        },
        {
          "y": 1,
          "x": 1536145210143
        },
        {
          "y": 1,
          "x": 1536145188327
        },
        {
          "y": 1,
          "x": 1536145098694
        },
        {
          "y": 1,
          "x": 1536144799461
        },
        {
          "y": 1,
          "x": 1536658587864
        },
        {
          "y": 1,
          "x": 1536144729831
        },
        {
          "y": 1,
          "x": 1536144705754
        },
        {
          "y": 1,
          "x": 1536144682596
        },
        {
          "y": 1,
          "x": 1536144471950
        },
        {
          "y": 1,
          "x": 1536144360523
        },
        {
          "y": 1,
          "x": 1536144275893
        },
        {
          "y": 1,
          "x": 1536144230737
        },
        {
          "y": 1,
          "x": 1536148638275
        },
        {
          "y": 1,
          "x": 1536144135936
        },
        {
          "y": 1,
          "x": 1536144074134
        },
        {
          "y": 1,
          "x": 1536141764585
        },
        {
          "y": 1,
          "x": 1536141702869
        },
        {
          "y": 1,
          "x": 1536141547186
        },
        {
          "y": 1,
          "x": 1536141502349
        },
        {
          "y": 1,
          "x": 1536141438149
        },
        {
          "y": 1,
          "x": 1536141388883
        },
        {
          "y": 1,
          "x": 1536141365037
        },
        {
          "y": 1,
          "x": 1536141204039
        },
        {
          "y": 1,
          "x": 1536141181714
        },
        {
          "y": 1,
          "x": 1536140984078
        },
        {
          "y": 1,
          "x": 1536140886117
        },
        {
          "y": 1,
          "x": 1536140794327
        },
        {
          "y": 1,
          "x": 1536140747048
        },
        {
          "y": 1,
          "x": 1536138374051
        },
        {
          "y": 1,
          "x": 1536138262503
        },
        {
          "y": 1,
          "x": 1536138142341
        },
        {
          "y": 1,
          "x": 1536138060099
        },
        {
          "y": 1,
          "x": 1536137806487
        },
        {
          "y": 1,
          "x": 1536481550753
        },
        {
          "y": 1,
          "x": 1536137545962
        },
        {
          "y": 1,
          "x": 1536137522853
        },
        {
          "y": 1,
          "x": 1536137498835
        },
        {
          "y": 1,
          "x": 1536137373370
        },
        {
          "y": 1,
          "x": 1536137353614
        },
        {
          "y": 1,
          "x": 1536137208105
        },
        {
          "y": 1,
          "x": 1536137070702
        },
        {
          "y": 1,
          "x": 1536136961719
        },
        {
          "y": 1,
          "x": 1536136880821
        },
        {
          "y": 1,
          "x": 1536134603369
        },
        {
          "y": 1,
          "x": 1536134559716
        },
        {
          "y": 1,
          "x": 1536134309490
        },
        {
          "y": 1,
          "x": 1536134210984
        },
        {
          "y": 1,
          "x": 1536134148092
        },
        {
          "y": 1,
          "x": 1536134129887
        },
        {
          "y": 1,
          "x": 1536141052511
        },
        {
          "y": 1,
          "x": 1536658439348
        },
        {
          "y": 1,
          "x": 1536127911941
        },
        {
          "y": 1,
          "x": 1536127706912
        },
        {
          "y": 1,
          "x": 1536127623002
        },
        {
          "y": 1,
          "x": 1536127556873
        },
        {
          "y": 1,
          "x": 1536144385775
        },
        {
          "y": 1,
          "x": 1536077123548
        },
        {
          "y": 1,
          "x": 1536077108492
        },
        {
          "y": 1,
          "x": 1536073813596
        },
        {
          "y": 1,
          "x": 1536073790040
        },
        {
          "y": 1,
          "x": 1536073725138
        },
        {
          "y": 1,
          "x": 1536650654040
        },
        {
          "y": 1,
          "x": 1536069984576
        },
        {
          "y": 1,
          "x": 1536059893029
        },
        {
          "y": 1,
          "x": 1536059769038
        },
        {
          "y": 1,
          "x": 1536059724975
        },
        {
          "y": 1,
          "x": 1536059644100
        },
        {
          "y": 1,
          "x": 1536059568090
        },
        {
          "y": 1,
          "x": 1536059496284
        },
        {
          "y": 1,
          "x": 1536230697870
        },
        {
          "y": 1,
          "x": 1536059141644
        },
        {
          "y": 1,
          "x": 1536055716131
        },
        {
          "y": 1,
          "x": 1536049182910
        },
        {
          "y": 1,
          "x": 1536049142336
        },
        {
          "y": 1,
          "x": 1536049122579
        },
        {
          "y": 1,
          "x": 1536049016935
        },
        {
          "y": 1,
          "x": 1536048979803
        },
        {
          "y": 1,
          "x": 1536048943007
        },
        {
          "y": 1,
          "x": 1536048866596
        },
        {
          "y": 1,
          "x": 1536048846021
        },
        {
          "y": 1,
          "x": 1536048786454
        },
        {
          "y": 1,
          "x": 1536048631109
        },
        {
          "y": 1,
          "x": 1536048531027
        },
        {
          "y": 1,
          "x": 1536162085334
        },
        {
          "y": 1,
          "x": 1536048454648
        },
        {
          "y": 1,
          "x": 1536048326042
        },
        {
          "y": 1,
          "x": 1536041402735
        },
        {
          "y": 1,
          "x": 1536586155752
        },
        {
          "y": 1,
          "x": 1536041312464
        },
        {
          "y": 1,
          "x": 1536133346935
        },
        {
          "y": 1,
          "x": 1536041201362
        },
        {
          "y": 1,
          "x": 1536041085532
        },
        {
          "y": 1,
          "x": 1536037766295
        },
        {
          "y": 1,
          "x": 1536037748854
        },
        {
          "y": 1,
          "x": 1536037603128
        },
        {
          "y": 1,
          "x": 1536658467916
        },
        {
          "y": 1,
          "x": 1535987256361
        },
        {
          "y": 1,
          "x": 1535987197012
        },
        {
          "y": 1,
          "x": 1536481715136
        },
        {
          "y": 1,
          "x": 1535987045868
        },
        {
          "y": 1,
          "x": 1535969804725
        },
        {
          "y": 1,
          "x": 1535969591376
        },
        {
          "y": 1,
          "x": 1535969575141
        },
        {
          "y": 1,
          "x": 1535969554741
        },
        {
          "y": 1,
          "x": 1535969774698
        },
        {
          "y": 1,
          "x": 1535969403847
        },
        {
          "y": 1,
          "x": 1535969386491
        },
        {
          "y": 1,
          "x": 1536216128413
        },
        {
          "y": 1,
          "x": 1536151206161
        },
        {
          "y": 1,
          "x": 1535969205579
        },
        {
          "y": 1,
          "x": 1535969130327
        },
        {
          "y": 1,
          "x": 1535969112282
        },
        {
          "y": 1,
          "x": 1536133900566
        },
        {
          "y": 1,
          "x": 1535966618498
        },
        {
          "y": 1,
          "x": 1535966556377
        },
        {
          "y": 1,
          "x": 1535966483446
        },
        {
          "y": 1,
          "x": 1535966450431
        },
        {
          "y": 1,
          "x": 1535966392672
        },
        {
          "y": 1,
          "x": 1535966228279
        },
        {
          "y": 1,
          "x": 1535966170969
        },
        {
          "y": 1,
          "x": 1535966155330
        },
        {
          "y": 1,
          "x": 1535966137837
        },
        {
          "y": 1,
          "x": 1535966117244
        },
        {
          "y": 1,
          "x": 1535966075346
        },
        {
          "y": 1,
          "x": 1535965990369
        },
        {
          "y": 1,
          "x": 1536492418801
        },
        {
          "y": 1,
          "x": 1536133859280
        },
        {
          "y": 1,
          "x": 1535962519294
        },
        {
          "y": 1,
          "x": 1536144050662
        },
        {
          "y": 1,
          "x": 1535888218079
        },
        {
          "y": 1,
          "x": 1536586223341
        },
        {
          "y": 1,
          "x": 1536162136378
        },
        {
          "y": 1,
          "x": 1535812018953
        },
        {
          "y": 1,
          "x": 1535811928848
        },
        {
          "y": 1,
          "x": 1535809004974
        },
        {
          "y": 1,
          "x": 1535808971607
        },
        {
          "y": 1,
          "x": 1535808905061
        },
        {
          "y": 1,
          "x": 1535808883883
        },
        {
          "y": 1,
          "x": 1535808733876
        },
        {
          "y": 1,
          "x": 1535808683791
        },
        {
          "y": 1,
          "x": 1535808659187
        },
        {
          "y": 1,
          "x": 1535808564406
        },
        {
          "y": 1,
          "x": 1535805403802
        },
        {
          "y": 1,
          "x": 1535804731797
        },
        {
          "y": 1,
          "x": 1535802104834
        },
        {
          "y": 1,
          "x": 1535895048946
        },
        {
          "y": 1,
          "x": 1536477932190
        },
        {
          "y": 1,
          "x": 1535800914384
        },
        {
          "y": 1,
          "x": 1536049105294
        },
        {
          "y": 1,
          "x": 1535798044528
        },
        {
          "y": 1,
          "x": 1536567998175
        },
        {
          "y": 1,
          "x": 1536585892324
        },
        {
          "y": 1,
          "x": 1535793583772
        },
        {
          "y": 1,
          "x": 1536564197575
        },
        {
          "y": 1,
          "x": 1535793557942
        },
        {
          "y": 1,
          "x": 1535789536947
        },
        {
          "y": 1,
          "x": 1536499496869
        },
        {
          "y": 1,
          "x": 1535738722865
        },
        {
          "y": 1,
          "x": 1535738651958
        },
        {
          "y": 1,
          "x": 1536134691447
        },
        {
          "y": 1,
          "x": 1536231027118
        },
        {
          "y": 1,
          "x": 1535711341181
        },
        {
          "y": 1,
          "x": 1535708252456
        },
        {
          "y": 1,
          "x": 1535969520747
        },
        {
          "y": 1,
          "x": 1535797235121
        },
        {
          "y": 1,
          "x": 1536134332607
        },
        {
          "y": 1,
          "x": 1535700929504
        },
        {
          "y": 1,
          "x": 1535700798822
        },
        {
          "y": 2,
          "x": 1535700773246
        },
        {
          "y": 1,
          "x": 1535700749037
        },
        {
          "y": 1,
          "x": 1535700643496
        },
        {
          "y": 1,
          "x": 1535700591496
        },
        {
          "y": 1,
          "x": 1535700536121
        },
        {
          "y": 2,
          "x": 1535700353956
        },
        {
          "y": 1,
          "x": 1535700327780
        },
        {
          "y": 1,
          "x": 1535700311304
        },
        {
          "y": 2,
          "x": 1535697428508
        },
        {
          "y": 1,
          "x": 1536216176191
        },
        {
          "y": 2,
          "x": 1535697348496
        },
        {
          "y": 1,
          "x": 1535697266462
        },
        {
          "y": 2,
          "x": 1535696979267
        },
        {
          "y": 1,
          "x": 1536059437127
        },
        {
          "y": 1,
          "x": 1535700952939
        },
        {
          "y": 1,
          "x": 1536568678874
        },
        {
          "y": 1,
          "x": 1536133748705
        },
        {
          "y": 1,
          "x": 1535696759043
        },
        {
          "y": 1,
          "x": 1535696723234
        },
        {
          "y": 1,
          "x": 1536568037260
        },
        {
          "y": 1,
          "x": 1535651091495
        },
        {
          "y": 1,
          "x": 1535651065037
        },
        {
          "y": 1,
          "x": 1536568243966
        },
        {
          "y": 2,
          "x": 1535644092494
        },
        {
          "y": 1,
          "x": 1536499626971
        },
        {
          "y": 2,
          "x": 1535643932877
        },
        {
          "y": 2,
          "x": 1535643913299
        },
        {
          "y": 1,
          "x": 1535640390843
        },
        {
          "y": 1,
          "x": 1535640347165
        },
        {
          "y": 1,
          "x": 1535620889434
        },
        {
          "y": 1,
          "x": 1535620788059
        },
        {
          "y": 1,
          "x": 1536137698973
        },
        {
          "y": 1,
          "x": 1535620694308
        },
        {
          "y": 1,
          "x": 1535620669864
        },
        {
          "y": 1,
          "x": 1535620642493
        },
        {
          "y": 1,
          "x": 1535620444313
        },
        {
          "y": 1,
          "x": 1536592971500
        },
        {
          "y": 1,
          "x": 1536470599811
        },
        {
          "y": 1,
          "x": 1535566613054
        },
        {
          "y": 1,
          "x": 1536586371085
        },
        {
          "y": 1,
          "x": 1536059182644
        },
        {
          "y": 1,
          "x": 1535566597403
        },
        {
          "y": 1,
          "x": 1535566529664
        },
        {
          "y": 1,
          "x": 1535566514223
        },
        {
          "y": 1,
          "x": 1535566496567
        },
        {
          "y": 1,
          "x": 1535563189748
        },
        {
          "y": 1,
          "x": 1535563126398
        },
        {
          "y": 1,
          "x": 1535563110667
        },
        {
          "y": 1,
          "x": 1535562974102
        },
        {
          "y": 1,
          "x": 1536059935527
        },
        {
          "y": 1,
          "x": 1535562961605
        },
        {
          "y": 1,
          "x": 1535562933837
        },
        {
          "y": 1,
          "x": 1535562909819
        },
        {
          "y": 1,
          "x": 1535559927429
        },
        {
          "y": 1,
          "x": 1535559908906
        },
        {
          "y": 1,
          "x": 1535559858568
        },
        {
          "y": 1,
          "x": 1535559830724
        },
        {
          "y": 1,
          "x": 1535559812177
        },
        {
          "y": 1,
          "x": 1535559781569
        },
        {
          "y": 1,
          "x": 1535559734467
        },
        {
          "y": 1,
          "x": 1535559650897
        },
        {
          "y": 1,
          "x": 1535559615323
        },
        {
          "y": 1,
          "x": 1535697209790
        },
        {
          "y": 1,
          "x": 1535559477547
        },
        {
          "y": 1,
          "x": 1535559455203
        },
        {
          "y": 1,
          "x": 1535559422701
        },
        {
          "y": 1,
          "x": 1535559358481
        },
        {
          "y": 1,
          "x": 1535563001239
        },
        {
          "y": 1,
          "x": 1535969538350
        },
        {
          "y": 1,
          "x": 1535549101097
        },
        {
          "y": 1,
          "x": 1535549000536
        },
        {
          "y": 1,
          "x": 1536144030134
        },
        {
          "y": 1,
          "x": 1535548984331
        },
        {
          "y": 1,
          "x": 1535548971358
        },
        {
          "y": 1,
          "x": 1535548957967
        },
        {
          "y": 1,
          "x": 1535548933898
        },
        {
          "y": 1,
          "x": 1536650745097
        },
        {
          "y": 1,
          "x": 1535548892031
        },
        {
          "y": 1,
          "x": 1535548875650
        },
        {
          "y": 1,
          "x": 1535548848808
        },
        {
          "y": 1,
          "x": 1535548658399
        },
        {
          "y": 1,
          "x": 1536147758599
        },
        {
          "y": 1,
          "x": 1535548553047
        },
        {
          "y": 1,
          "x": 1536137333287
        },
        {
          "y": 1,
          "x": 1535530683558
        },
        {
          "y": 1,
          "x": 1535483642645
        },
        {
          "y": 1,
          "x": 1536564605760
        },
        {
          "y": 1,
          "x": 1535483631473
        },
        {
          "y": 1,
          "x": 1536477788731
        },
        {
          "y": 1,
          "x": 1535476741955
        },
        {
          "y": 1,
          "x": 1535476678461
        },
        {
          "y": 1,
          "x": 1535476627483
        },
        {
          "y": 1,
          "x": 1535476503568
        },
        {
          "y": 1,
          "x": 1535476487522
        },
        {
          "y": 1,
          "x": 1535476472102
        },
        {
          "y": 1,
          "x": 1535472993387
        },
        {
          "y": 1,
          "x": 1536586616952
        },
        {
          "y": 1,
          "x": 1535472980119
        },
        {
          "y": 1,
          "x": 1535793843102
        },
        {
          "y": 1,
          "x": 1535466071268
        },
        {
          "y": 1,
          "x": 1535466061210
        },
        {
          "y": 1,
          "x": 1535466048761
        },
        {
          "y": 1,
          "x": 1535465939575
        },
        {
          "y": 1,
          "x": 1535465924664
        },
        {
          "y": 1,
          "x": 1535465912469
        },
        {
          "y": 1,
          "x": 1535465900022
        },
        {
          "y": 1,
          "x": 1535465856044
        },
        {
          "y": 1,
          "x": 1536223403384
        },
        {
          "y": 1,
          "x": 1536137188250
        },
        {
          "y": 1,
          "x": 1535465725784
        },
        {
          "y": 1,
          "x": 1536230480669
        },
        {
          "y": 1,
          "x": 1536651228398
        },
        {
          "y": 1,
          "x": 1535462273151
        },
        {
          "y": 1,
          "x": 1535462127168
        },
        {
          "y": 1,
          "x": 1535808495038
        },
        {
          "y": 1,
          "x": 1535458616997
        },
        {
          "y": 1,
          "x": 1535455161777
        },
        {
          "y": 1,
          "x": 1535455073736
        },
        {
          "y": 1,
          "x": 1536137830909
        },
        {
          "y": 1,
          "x": 1535448079956
        },
        {
          "y": 1,
          "x": 1535448008253
        },
        {
          "y": 1,
          "x": 1535559512727
        },
        {
          "y": 1,
          "x": 1535447994564
        },
        {
          "y": 1,
          "x": 1535447981605
        },
        {
          "y": 1,
          "x": 1535447969611
        },
        {
          "y": 1,
          "x": 1536134517117
        },
        {
          "y": 1,
          "x": 1535447957176
        },
        {
          "y": 1,
          "x": 1535888348680
        },
        {
          "y": 1,
          "x": 1535130209145
        },
        {
          "y": 1,
          "x": 1535130261938
        },
        {
          "y": 1,
          "x": 1535130155528
        },
        {
          "y": 1,
          "x": 1535130140829
        },
        {
          "y": 1,
          "x": 1535129994337
        },
        {
          "y": 1,
          "x": 1535129949316
        },
        {
          "y": 1,
          "x": 1535126657133
        },
        {
          "y": 1,
          "x": 1535126644936
        },
        {
          "y": 1,
          "x": 1535126590223
        },
        {
          "y": 1,
          "x": 1535123142340
        },
        {
          "y": 1,
          "x": 1535123107959
        },
        {
          "y": 1,
          "x": 1535994220703
        },
        {
          "y": 1,
          "x": 1535123014131
        },
        {
          "y": 1,
          "x": 1535123063598
        },
        {
          "y": 1,
          "x": 1535122955656
        },
        {
          "y": 1,
          "x": 1535122968927
        },
        {
          "y": 1,
          "x": 1535119366736
        },
        {
          "y": 1,
          "x": 1535119331824
        },
        {
          "y": 1,
          "x": 1536048360471
        },
        {
          "y": 1,
          "x": 1535115730522
        },
        {
          "y": 1,
          "x": 1535115718587
        },
        {
          "y": 1,
          "x": 1535112473755
        },
        {
          "y": 1,
          "x": 1535112462319
        },
        {
          "y": 1,
          "x": 1536141457094
        },
        {
          "y": 1,
          "x": 1535112282383
        },
        {
          "y": 1,
          "x": 1535112218582
        },
        {
          "y": 1,
          "x": 1536481812666
        },
        {
          "y": 1,
          "x": 1536231155374
        },
        {
          "y": 1,
          "x": 1535105142766
        },
        {
          "y": 1,
          "x": 1535969366537
        },
        {
          "y": 1,
          "x": 1535105076727
        },
        {
          "y": 1,
          "x": 1535105062979
        },
        {
          "y": 1,
          "x": 1535104983508
        },
        {
          "y": 1,
          "x": 1535104908508
        },
        {
          "y": 1,
          "x": 1535104764714
        },
        {
          "y": 1,
          "x": 1536141657186
        },
        {
          "y": 1,
          "x": 1535104753512
        },
        {
          "y": 1,
          "x": 1535104726519
        },
        {
          "y": 1,
          "x": 1535101442240
        },
        {
          "y": 1,
          "x": 1535101416437
        },
        {
          "y": 1,
          "x": 1535101358687
        },
        {
          "y": 1,
          "x": 1535483663734
        },
        {
          "y": 1,
          "x": 1535101243568
        },
        {
          "y": 1,
          "x": 1535563093465
        },
        {
          "y": 1,
          "x": 1535101145018
        },
        {
          "y": 1,
          "x": 1535101081624
        },
        {
          "y": 1,
          "x": 1535097617892
        },
        {
          "y": 1,
          "x": 1535112049128
        },
        {
          "y": 1,
          "x": 1535223419861
        },
        {
          "y": 1,
          "x": 1535219863543
        },
        {
          "y": 1,
          "x": 1536144515176
        },
        {
          "y": 1,
          "x": 1535216571759
        },
        {
          "y": 1,
          "x": 1536223199348
        },
        {
          "y": 1,
          "x": 1535216521516
        },
        {
          "y": 1,
          "x": 1535216492545
        },
        {
          "y": 1,
          "x": 1536123981181
        },
        {
          "y": 1,
          "x": 1535216476918
        },
        {
          "y": 1,
          "x": 1535216435499
        },
        {
          "y": 1,
          "x": 1535115778868
        },
        {
          "y": 1,
          "x": 1535216373325
        },
        {
          "y": 1,
          "x": 1535216358108
        },
        {
          "y": 1,
          "x": 1535808793424
        },
        {
          "y": 1,
          "x": 1535216347370
        },
        {
          "y": 1,
          "x": 1535216296861
        },
        {
          "y": 1,
          "x": 1535216285534
        },
        {
          "y": 1,
          "x": 1535212966568
        },
        {
          "y": 1,
          "x": 1535212941684
        },
        {
          "y": 1,
          "x": 1535212868537
        },
        {
          "y": 1,
          "x": 1535212817924
        },
        {
          "y": 1,
          "x": 1535969754722
        },
        {
          "y": 1,
          "x": 1535212807159
        },
        {
          "y": 1,
          "x": 1535212668240
        },
        {
          "y": 1,
          "x": 1536133326588
        },
        {
          "y": 1,
          "x": 1535884189067
        },
        {
          "y": 1,
          "x": 1535213000754
        },
        {
          "y": 1,
          "x": 1536144640062
        },
        {
          "y": 1,
          "x": 1535700874465
        },
        {
          "y": 1,
          "x": 1535209329514
        },
        {
          "y": 1,
          "x": 1535962188483
        },
        {
          "y": 1,
          "x": 1535209284181
        },
        {
          "y": 1,
          "x": 1535209242294
        },
        {
          "y": 1,
          "x": 1535966411684
        },
        {
          "y": 1,
          "x": 1535209219511
        },
        {
          "y": 1,
          "x": 1535209207916
        },
        {
          "y": 1,
          "x": 1535209198040
        },
        {
          "y": 1,
          "x": 1536137722252
        },
        {
          "y": 1,
          "x": 1535209070606
        },
        {
          "y": 1,
          "x": 1536560782862
        },
        {
          "y": 1,
          "x": 1535205671360
        },
        {
          "y": 1,
          "x": 1535205650930
        },
        {
          "y": 1,
          "x": 1535202255908
        },
        {
          "y": 1,
          "x": 1536144839793
        },
        {
          "y": 1,
          "x": 1535202243638
        },
        {
          "y": 1,
          "x": 1536230988794
        },
        {
          "y": 1,
          "x": 1535216307409
        },
        {
          "y": 1,
          "x": 1535201941246
        },
        {
          "y": 1,
          "x": 1535201923283
        },
        {
          "y": 1,
          "x": 1535778503614
        },
        {
          "y": 1,
          "x": 1536059543465
        },
        {
          "y": 2,
          "x": 1535198721309
        },
        {
          "y": 2,
          "x": 1535198696037
        },
        {
          "y": 2,
          "x": 1535198668949
        },
        {
          "y": 2,
          "x": 1535198616382
        },
        {
          "y": 1,
          "x": 1536059519797
        },
        {
          "y": 1,
          "x": 1535198593015
        },
        {
          "y": 1,
          "x": 1535198544258
        },
        {
          "y": 1,
          "x": 1535198424443
        },
        {
          "y": 1,
          "x": 1535101320690
        },
        {
          "y": 1,
          "x": 1535195110659
        },
        {
          "y": 1,
          "x": 1536059161765
        },
        {
          "y": 1,
          "x": 1535195048106
        },
        {
          "y": 1,
          "x": 1535194963820
        },
        {
          "y": 1,
          "x": 1536144820942
        },
        {
          "y": 1,
          "x": 1535194892532
        },
        {
          "y": 1,
          "x": 1535194821869
        },
        {
          "y": 1,
          "x": 1536661691009
        },
        {
          "y": 1,
          "x": 1536477809588
        },
        {
          "y": 1,
          "x": 1535465791493
        },
        {
          "y": 1,
          "x": 1535194806982
        },
        {
          "y": 1,
          "x": 1535191180592
        },
        {
          "y": 1,
          "x": 1535191089568
        },
        {
          "y": 1,
          "x": 1535187547093
        },
        {
          "y": 1,
          "x": 1535187490625
        },
        {
          "y": 1,
          "x": 1535213023441
        },
        {
          "y": 1,
          "x": 1535187463319
        },
        {
          "y": 1,
          "x": 1535187437263
        },
        {
          "y": 1,
          "x": 1536144539211
        },
        {
          "y": 1,
          "x": 1535183933181
        },
        {
          "y": 1,
          "x": 1535183861817
        },
        {
          "y": 1,
          "x": 1535198450333
        },
        {
          "y": 1,
          "x": 1535133580812
        },
        {
          "y": 1,
          "x": 1535133524680
        },
        {
          "y": 1,
          "x": 1536037645412
        },
        {
          "y": 1,
          "x": 1535133462517
        },
        {
          "y": 1,
          "x": 1536564697675
        },
        {
          "y": 2,
          "x": 1535130182834
        },
        {
          "y": 1,
          "x": 1536134539914
        },
        {
          "y": 2,
          "x": 1535130016565
        },
        {
          "y": 2,
          "x": 1535129914440
        },
        {
          "y": 1,
          "x": 1536137459202
        },
        {
          "y": 1,
          "x": 1535126681506
        },
        {
          "y": 1,
          "x": 1536136899743
        },
        {
          "y": 1,
          "x": 1535198529082
        },
        {
          "y": 1,
          "x": 1536048686771
        },
        {
          "y": 2,
          "x": 1535126425268
        },
        {
          "y": 1,
          "x": 1535548836554
        },
        {
          "y": 2,
          "x": 1535126402930
        },
        {
          "y": 2,
          "x": 1535126394857
        },
        {
          "y": 2,
          "x": 1535126340470
        },
        {
          "y": 2,
          "x": 1535126260747
        },
        {
          "y": 2,
          "x": 1535122672659
        },
        {
          "y": 1,
          "x": 1535119095409
        },
        {
          "y": 1,
          "x": 1536162024598
        },
        {
          "y": 1,
          "x": 1535205444154
        },
        {
          "y": 1,
          "x": 1535119083598
        },
        {
          "y": 2,
          "x": 1535115669599
        },
        {
          "y": 2,
          "x": 1535115637668
        },
        {
          "y": 1,
          "x": 1536133880260
        },
        {
          "y": 2,
          "x": 1535112194932
        },
        {
          "y": 2,
          "x": 1535198488928
        },
        {
          "y": 1,
          "x": 1535112306368
        },
        {
          "y": 1,
          "x": 1535126528200
        },
        {
          "y": 2,
          "x": 1535093837712
        },
        {
          "y": 1,
          "x": 1535047192083
        },
        {
          "y": 1,
          "x": 1535047167386
        },
        {
          "y": 1,
          "x": 1535047132007
        },
        {
          "y": 1,
          "x": 1535047121850
        },
        {
          "y": 1,
          "x": 1535194871518
        },
        {
          "y": 1,
          "x": 1535972688677
        },
        {
          "y": 1,
          "x": 1535043766412
        },
        {
          "y": 1,
          "x": 1535043728369
        },
        {
          "y": 1,
          "x": 1535212882137
        },
        {
          "y": 1,
          "x": 1535043610958
        },
        {
          "y": 1,
          "x": 1535043472722
        },
        {
          "y": 1,
          "x": 1535040119122
        },
        {
          "y": 1,
          "x": 1535040085284
        },
        {
          "y": 1,
          "x": 1535111973501
        },
        {
          "y": 1,
          "x": 1536127814212
        },
        {
          "y": 1,
          "x": 1535040076249
        },
        {
          "y": 1,
          "x": 1535040064237
        },
        {
          "y": 1,
          "x": 1535036501481
        },
        {
          "y": 1,
          "x": 1535036473825
        },
        {
          "y": 1,
          "x": 1535036473066
        },
        {
          "y": 1,
          "x": 1535036472513
        },
        {
          "y": 1,
          "x": 1535195073385
        },
        {
          "y": 1,
          "x": 1535097707414
        },
        {
          "y": 1,
          "x": 1535036468973
        },
        {
          "y": 1,
          "x": 1535097503305
        },
        {
          "y": 1,
          "x": 1535209297310
        },
        {
          "y": 1,
          "x": 1535036303350
        },
        {
          "y": 1,
          "x": 1535036293114
        },
        {
          "y": 1,
          "x": 1536070075432
        },
        {
          "y": 1,
          "x": 1535033033369
        },
        {
          "y": 2,
          "x": 1535198629461
        },
        {
          "y": 1,
          "x": 1535033003137
        },
        {
          "y": 1,
          "x": 1535032983003
        },
        {
          "y": 1,
          "x": 1535032835271
        },
        {
          "y": 1,
          "x": 1535032811694
        },
        {
          "y": 1,
          "x": 1535032788359
        },
        {
          "y": 1,
          "x": 1535212953886
        },
        {
          "y": 1,
          "x": 1535032695651
        },
        {
          "y": 1,
          "x": 1536586672824
        },
        {
          "y": 1,
          "x": 1535030522212
        },
        {
          "y": 1,
          "x": 1535030520107
        },
        {
          "y": 1,
          "x": 1535701084281
        },
        {
          "y": 1,
          "x": 1535030515321
        },
        {
          "y": 1,
          "x": 1535030514361
        },
        {
          "y": 1,
          "x": 1535030511329
        },
        {
          "y": 1,
          "x": 1535030510876
        },
        {
          "y": 1,
          "x": 1535030504954
        },
        {
          "y": 1,
          "x": 1535030522637
        },
        {
          "y": 1,
          "x": 1536603738306
        },
        {
          "y": 1,
          "x": 1535030498638
        },
        {
          "y": 1,
          "x": 1536586292126
        },
        {
          "y": 1,
          "x": 1535104778052
        },
        {
          "y": 1,
          "x": 1536137114141
        },
        {
          "y": 1,
          "x": 1535018598370
        },
        {
          "y": 1,
          "x": 1535032854371
        },
        {
          "y": 1,
          "x": 1536137268808
        },
        {
          "y": 1,
          "x": 1535014873092
        },
        {
          "y": 1,
          "x": 1535123051352
        },
        {
          "y": 1,
          "x": 1535014724801
        },
        {
          "y": 1,
          "x": 1535014704184
        },
        {
          "y": 1,
          "x": 1535014679721
        },
        {
          "y": 1,
          "x": 1535011376318
        },
        {
          "y": 1,
          "x": 1535011326624
        },
        {
          "y": 1,
          "x": 1535011289410
        },
        {
          "y": 1,
          "x": 1535209170356
        },
        {
          "y": 1,
          "x": 1535011255000
        },
        {
          "y": 1,
          "x": 1535011220376
        },
        {
          "y": 1,
          "x": 1535011158612
        },
        {
          "y": 1,
          "x": 1536037687850
        },
        {
          "y": 1,
          "x": 1535011131531
        },
        {
          "y": 2,
          "x": 1535111944588
        },
        {
          "y": 1,
          "x": 1534967800243
        },
        {
          "y": 1,
          "x": 1536215978367
        },
        {
          "y": 1,
          "x": 1534964217785
        },
        {
          "y": 1,
          "x": 1535030495817
        },
        {
          "y": 1,
          "x": 1536041348454
        },
        {
          "y": 1,
          "x": 1535119306333
        },
        {
          "y": 1,
          "x": 1536230517463
        },
        {
          "y": 1,
          "x": 1535559547897
        },
        {
          "y": 1,
          "x": 1534946243673
        },
        {
          "y": 1,
          "x": 1535032912402
        },
        {
          "y": 1,
          "x": 1535696929253
        },
        {
          "y": 1,
          "x": 1536216407268
        },
        {
          "y": 1,
          "x": 1534924818041
        },
        {
          "y": 1,
          "x": 1535111931467
        },
        {
          "y": 1,
          "x": 1536564316441
        },
        {
          "y": 1,
          "x": 1534924726473
        },
        {
          "y": 1,
          "x": 1534924716735
        },
        {
          "y": 1,
          "x": 1534924692711
        },
        {
          "y": 1,
          "x": 1535137023591
        },
        {
          "y": 1,
          "x": 1534921016554
        },
        {
          "y": 1,
          "x": 1536586137534
        },
        {
          "y": 1,
          "x": 1534877851156
        },
        {
          "y": 1,
          "x": 1534924683831
        },
        {
          "y": 1,
          "x": 1536133684629
        },
        {
          "y": 1,
          "x": 1535216557650
        },
        {
          "y": 1,
          "x": 1535191078211
        },
        {
          "y": 1,
          "x": 1534874401678
        },
        {
          "y": 1,
          "x": 1534874388226
        },
        {
          "y": 1,
          "x": 1535111918464
        },
        {
          "y": 1,
          "x": 1534874268465
        },
        {
          "y": 1,
          "x": 1534874258484
        },
        {
          "y": 1,
          "x": 1534874245111
        },
        {
          "y": 1,
          "x": 1534870761698
        },
        {
          "y": 1,
          "x": 1534870715711
        },
        {
          "y": 1,
          "x": 1535191098813
        },
        {
          "y": 1,
          "x": 1534870681691
        },
        {
          "y": 1,
          "x": 1534870647485
        },
        {
          "y": 1,
          "x": 1534870626780
        },
        {
          "y": 1,
          "x": 1534867321434
        },
        {
          "y": 1,
          "x": 1536137046345
        },
        {
          "y": 1,
          "x": 1536070738720
        },
        {
          "y": 1,
          "x": 1535620430364
        },
        {
          "y": 1,
          "x": 1534867264656
        },
        {
          "y": 1,
          "x": 1534867252864
        },
        {
          "y": 1,
          "x": 1536223667497
        },
        {
          "y": 1,
          "x": 1535112375497
        },
        {
          "y": 1,
          "x": 1535801985258
        },
        {
          "y": 1,
          "x": 1534867203285
        },
        {
          "y": 1,
          "x": 1534867158588
        },
        {
          "y": 1,
          "x": 1534867124547
        },
        {
          "y": 1,
          "x": 1534867101769
        },
        {
          "y": 1,
          "x": 1535007405631
        },
        {
          "y": 1,
          "x": 1536492437742
        },
        {
          "y": 1,
          "x": 1534867076728
        },
        {
          "y": 1,
          "x": 1534867067288
        },
        {
          "y": 1,
          "x": 1534863818998
        },
        {
          "y": 1,
          "x": 1534863788710
        },
        {
          "y": 1,
          "x": 1534863780406
        },
        {
          "y": 1,
          "x": 1534863771220
        },
        {
          "y": 1,
          "x": 1534863754826
        },
        {
          "y": 1,
          "x": 1534863712029
        },
        {
          "y": 1,
          "x": 1534863700449
        },
        {
          "y": 1,
          "x": 1534863670659
        },
        {
          "y": 1,
          "x": 1534863662485
        },
        {
          "y": 1,
          "x": 1535530486455
        },
        {
          "y": 1,
          "x": 1536138192814
        },
        {
          "y": 1,
          "x": 1534860355061
        },
        {
          "y": 1,
          "x": 1534860346129
        },
        {
          "y": 1,
          "x": 1534863522198
        },
        {
          "y": 1,
          "x": 1534860315112
        },
        {
          "y": 1,
          "x": 1536059873064
        },
        {
          "y": 1,
          "x": 1534860272390
        },
        {
          "y": 1,
          "x": 1534860241379
        },
        {
          "y": 1,
          "x": 1535032752078
        },
        {
          "y": 1,
          "x": 1534860214181
        },
        {
          "y": 1,
          "x": 1536564426819
        },
        {
          "y": 1,
          "x": 1534860166602
        },
        {
          "y": 1,
          "x": 1536470562543
        },
        {
          "y": 1,
          "x": 1534860157970
        },
        {
          "y": 1,
          "x": 1534860089281
        },
        {
          "y": 1,
          "x": 1534860066296
        },
        {
          "y": 1,
          "x": 1536481863778
        },
        {
          "y": 1,
          "x": 1534860049969
        },
        {
          "y": 1,
          "x": 1536059259603
        },
        {
          "y": 1,
          "x": 1534860041275
        },
        {
          "y": 1,
          "x": 1534859980948
        },
        {
          "y": 1,
          "x": 1535011063611
        },
        {
          "y": 1,
          "x": 1534859972011
        },
        {
          "y": 1,
          "x": 1534859949112
        },
        {
          "y": 1,
          "x": 1534859936950
        },
        {
          "y": 1,
          "x": 1535209112829
        },
        {
          "y": 1,
          "x": 1535563173181
        },
        {
          "y": 1,
          "x": 1534859885144
        },
        {
          "y": 1,
          "x": 1535562918780
        },
        {
          "y": 1,
          "x": 1535112341994
        },
        {
          "y": 1,
          "x": 1535566469051
        },
        {
          "y": 1,
          "x": 1536134583685
        },
        {
          "y": 1,
          "x": 1536037624782
        },
        {
          "y": 1,
          "x": 1534845683045
        },
        {
          "y": 1,
          "x": 1536474171454
        },
        {
          "y": 1,
          "x": 1534842031846
        },
        {
          "y": 1,
          "x": 1536481417965
        },
        {
          "y": 1,
          "x": 1534859958795
        },
        {
          "y": 1,
          "x": 1534838312219
        },
        {
          "y": 1,
          "x": 1534838291441
        },
        {
          "y": 1,
          "x": 1534791415580
        },
        {
          "y": 1,
          "x": 1535951148212
        },
        {
          "y": 1,
          "x": 1535030513360
        },
        {
          "y": 1,
          "x": 1536055856055
        },
        {
          "y": 1,
          "x": 1534787818937
        },
        {
          "y": 1,
          "x": 1534780997002
        },
        {
          "y": 1,
          "x": 1536586022462
        },
        {
          "y": 1,
          "x": 1536148295542
        },
        {
          "y": 1,
          "x": 1534780985432
        },
        {
          "y": 1,
          "x": 1535036470826
        },
        {
          "y": 1,
          "x": 1534780878310
        },
        {
          "y": 1,
          "x": 1536133617929
        },
        {
          "y": 1,
          "x": 1534780857816
        },
        {
          "y": 1,
          "x": 1536216158036
        },
        {
          "y": 1,
          "x": 1534780806224
        },
        {
          "y": 1,
          "x": 1534780795371
        },
        {
          "y": 1,
          "x": 1536492218980
        },
        {
          "y": 1,
          "x": 1534780769874
        },
        {
          "y": 1,
          "x": 1534780721316
        },
        {
          "y": 1,
          "x": 1534780714255
        },
        {
          "y": 1,
          "x": 1536145166472
        },
        {
          "y": 1,
          "x": 1534777767734
        },
        {
          "y": 1,
          "x": 1535030497506
        },
        {
          "y": 1,
          "x": 1534777747138
        },
        {
          "y": 1,
          "x": 1534777731289
        },
        {
          "y": 1,
          "x": 1536070193491
        },
        {
          "y": 1,
          "x": 1534777673465
        },
        {
          "y": 1,
          "x": 1534777662718
        },
        {
          "y": 1,
          "x": 1534780941705
        },
        {
          "y": 1,
          "x": 1534777651752
        },
        {
          "y": 1,
          "x": 1534860368055
        },
        {
          "y": 1,
          "x": 1534777643608
        },
        {
          "y": 1,
          "x": 1535902101772
        },
        {
          "y": 1,
          "x": 1535032973885
        },
        {
          "y": 1,
          "x": 1536133705879
        },
        {
          "y": 1,
          "x": 1534777601029
        },
        {
          "y": 1,
          "x": 1534838374532
        },
        {
          "y": 1,
          "x": 1536223969651
        },
        {
          "y": 1,
          "x": 1534777577195
        },
        {
          "y": 1,
          "x": 1534777569171
        },
        {
          "y": 1,
          "x": 1534777560792
        },
        {
          "y": 1,
          "x": 1534777530771
        },
        {
          "y": 1,
          "x": 1534777438601
        },
        {
          "y": 2,
          "x": 1535115892079
        },
        {
          "y": 1,
          "x": 1536481400118
        },
        {
          "y": 1,
          "x": 1536148611746
        },
        {
          "y": 1,
          "x": 1535119353231
        },
        {
          "y": 1,
          "x": 1534777375376
        },
        {
          "y": 1,
          "x": 1536161995896
        },
        {
          "y": 1,
          "x": 1534777334345
        },
        {
          "y": 1,
          "x": 1534777303669
        },
        {
          "y": 1,
          "x": 1536481437243
        },
        {
          "y": 1,
          "x": 1534777233709
        },
        {
          "y": 1,
          "x": 1534777224996
        },
        {
          "y": 1,
          "x": 1534777212635
        },
        {
          "y": 1,
          "x": 1534874326187
        },
        {
          "y": 1,
          "x": 1534777200943
        },
        {
          "y": 1,
          "x": 1534777177738
        },
        {
          "y": 2,
          "x": 1535198680742
        },
        {
          "y": 1,
          "x": 1534777127580
        },
        {
          "y": 1,
          "x": 1536148407550
        },
        {
          "y": 1,
          "x": 1534773947610
        },
        {
          "y": 1,
          "x": 1535133652535
        },
        {
          "y": 1,
          "x": 1534773897464
        },
        {
          "y": 1,
          "x": 1534773874106
        },
        {
          "y": 1,
          "x": 1534773812419
        },
        {
          "y": 1,
          "x": 1535559385664
        },
        {
          "y": 1,
          "x": 1534773772076
        },
        {
          "y": 1,
          "x": 1535195135959
        },
        {
          "y": 1,
          "x": 1534773721157
        },
        {
          "y": 1,
          "x": 1535563046548
        },
        {
          "y": 1,
          "x": 1534773680527
        },
        {
          "y": 1,
          "x": 1534773601517
        },
        {
          "y": 1,
          "x": 1535030502649
        },
        {
          "y": 1,
          "x": 1536230460473
        },
        {
          "y": 1,
          "x": 1534773548701
        },
        {
          "y": 1,
          "x": 1534773538802
        },
        {
          "y": 1,
          "x": 1534773528215
        },
        {
          "y": 1,
          "x": 1535194914307
        },
        {
          "y": 1,
          "x": 1536127684633
        },
        {
          "y": 1,
          "x": 1534773515760
        },
        {
          "y": 1,
          "x": 1534769960536
        },
        {
          "y": 1,
          "x": 1535111983642
        },
        {
          "y": 1,
          "x": 1534766972690
        },
        {
          "y": 1,
          "x": 1536230572635
        },
        {
          "y": 1,
          "x": 1536586088191
        },
        {
          "y": 1,
          "x": 1536134043852
        },
        {
          "y": 1,
          "x": 1535209060501
        },
        {
          "y": 1,
          "x": 1534766769871
        },
        {
          "y": 1,
          "x": 1535549068946
        },
        {
          "y": 1,
          "x": 1534867275874
        },
        {
          "y": 1,
          "x": 1534766676365
        },
        {
          "y": 1,
          "x": 1534766663877
        },
        {
          "y": 1,
          "x": 1535191259366
        },
        {
          "y": 1,
          "x": 1535563142441
        },
        {
          "y": 1,
          "x": 1534766630474
        },
        {
          "y": 1,
          "x": 1534766611447
        },
        {
          "y": 1,
          "x": 1536144206169
        },
        {
          "y": 1,
          "x": 1534766588830
        },
        {
          "y": 1,
          "x": 1534766420333
        },
        {
          "y": 1,
          "x": 1536133814502
        },
        {
          "y": 1,
          "x": 1534766373673
        },
        {
          "y": 1,
          "x": 1534763097688
        },
        {
          "y": 1,
          "x": 1536231047326
        },
        {
          "y": 1,
          "x": 1534762703976
        },
        {
          "y": 1,
          "x": 1536148573148
        },
        {
          "y": 1,
          "x": 1535040128483
        },
        {
          "y": 1,
          "x": 1535014657106
        },
        {
          "y": 1,
          "x": 1536059957157
        },
        {
          "y": 1,
          "x": 1535183979895
        },
        {
          "y": 1,
          "x": 1534751969121
        },
        {
          "y": 1,
          "x": 1536048471292
        },
        {
          "y": 1,
          "x": 1534697839408
        },
        {
          "y": 1,
          "x": 1534694385986
        },
        {
          "y": 1,
          "x": 1534694361598
        },
        {
          "y": 1,
          "x": 1536208706419
        },
        {
          "y": 1,
          "x": 1535104817607
        },
        {
          "y": 1,
          "x": 1536145145282
        },
        {
          "y": 1,
          "x": 1534694282815
        },
        {
          "y": 1,
          "x": 1534694262329
        },
        {
          "y": 1,
          "x": 1534766924275
        },
        {
          "y": 1,
          "x": 1535548777442
        },
        {
          "y": 1,
          "x": 1535126288014
        },
        {
          "y": 1,
          "x": 1534687343340
        },
        {
          "y": 1,
          "x": 1534687332197
        },
        {
          "y": 1,
          "x": 1534687319325
        },
        {
          "y": 1,
          "x": 1534687225372
        },
        {
          "y": 1,
          "x": 1534687251530
        },
        {
          "y": 1,
          "x": 1534687082195
        },
        {
          "y": 1,
          "x": 1534680303316
        },
        {
          "y": 1,
          "x": 1534680274646
        },
        {
          "y": 1,
          "x": 1534870700770
        },
        {
          "y": 1,
          "x": 1536059280398
        },
        {
          "y": 1,
          "x": 1534838405854
        },
        {
          "y": 1,
          "x": 1534680216216
        },
        {
          "y": 1,
          "x": 1534697821493
        },
        {
          "y": 1,
          "x": 1534680200636
        },
        {
          "y": 1,
          "x": 1534773644694
        },
        {
          "y": 1,
          "x": 1534680163716
        },
        {
          "y": 1,
          "x": 1534680109591
        },
        {
          "y": 1,
          "x": 1534841848605
        },
        {
          "y": 1,
          "x": 1535808710655
        },
        {
          "y": 1,
          "x": 1534679955905
        },
        {
          "y": 1,
          "x": 1534679910827
        },
        {
          "y": 1,
          "x": 1534676505208
        },
        {
          "y": 1,
          "x": 1534676443166
        },
        {
          "y": 1,
          "x": 1536223770199
        },
        {
          "y": 1,
          "x": 1534676338172
        },
        {
          "y": 2,
          "x": 1535122862808
        },
        {
          "y": 1,
          "x": 1534676287438
        },
        {
          "y": 1,
          "x": 1535911426115
        },
        {
          "y": 1,
          "x": 1536059789386
        },
        {
          "y": 1,
          "x": 1535018547989
        },
        {
          "y": 1,
          "x": 1534665826219
        },
        {
          "y": 1,
          "x": 1534679989729
        },
        {
          "y": 1,
          "x": 1534665810899
        },
        {
          "y": 1,
          "x": 1534773995990
        },
        {
          "y": 1,
          "x": 1535032845097
        },
        {
          "y": 1,
          "x": 1536564284670
        },
        {
          "y": 1,
          "x": 1534619150899
        },
        {
          "y": 1,
          "x": 1536133770405
        },
        {
          "y": 1,
          "x": 1534619049088
        },
        {
          "y": 1,
          "x": 1534780835657
        },
        {
          "y": 1,
          "x": 1535030513844
        },
        {
          "y": 1,
          "x": 1534618957072
        },
        {
          "y": 1,
          "x": 1534615319429
        },
        {
          "y": 1,
          "x": 1534611745223
        },
        {
          "y": 1,
          "x": 1536654694527
        },
        {
          "y": 1,
          "x": 1534605305451
        },
        {
          "y": 1,
          "x": 1534605147578
        },
        {
          "y": 1,
          "x": 1536041380892
        },
        {
          "y": 1,
          "x": 1534605130695
        },
        {
          "y": 1,
          "x": 1535122775256
        },
        {
          "y": 1,
          "x": 1536481493785
        },
        {
          "y": 1,
          "x": 1534867308576
        },
        {
          "y": 1,
          "x": 1534604893543
        },
        {
          "y": 1,
          "x": 1534860099075
        },
        {
          "y": 1,
          "x": 1536481778860
        },
        {
          "y": 1,
          "x": 1534604848196
        },
        {
          "y": 1,
          "x": 1536223220693
        },
        {
          "y": 1,
          "x": 1535036285107
        },
        {
          "y": 1,
          "x": 1535465755356
        },
        {
          "y": 1,
          "x": 1534604654578
        },
        {
          "y": 1,
          "x": 1534842011508
        },
        {
          "y": 1,
          "x": 1534604643033
        },
        {
          "y": 1,
          "x": 1534601194947
        },
        {
          "y": 1,
          "x": 1536564268132
        },
        {
          "y": 1,
          "x": 1534595523918
        },
        {
          "y": 1,
          "x": 1535130028651
        },
        {
          "y": 1,
          "x": 1534859914990
        },
        {
          "y": 1,
          "x": 1535563063833
        },
        {
          "y": 1,
          "x": 1534595437266
        },
        {
          "y": 1,
          "x": 1534595425835
        },
        {
          "y": 1,
          "x": 1534863810320
        },
        {
          "y": 1,
          "x": 1534595289295
        },
        {
          "y": 1,
          "x": 1536650724867
        },
        {
          "y": 1,
          "x": 1534595227129
        },
        {
          "y": 1,
          "x": 1535793337593
        },
        {
          "y": 1,
          "x": 1534595182059
        },
        {
          "y": 1,
          "x": 1536037470569
        },
        {
          "y": 1,
          "x": 1534595145020
        },
        {
          "y": 1,
          "x": 1534595128107
        },
        {
          "y": 1,
          "x": 1535465985617
        },
        {
          "y": 1,
          "x": 1535559764902
        },
        {
          "y": 1,
          "x": 1534594963460
        },
        {
          "y": 1,
          "x": 1534594908851
        },
        {
          "y": 1,
          "x": 1535216533104
        },
        {
          "y": 1,
          "x": 1536073602342
        },
        {
          "y": 1,
          "x": 1534669444039
        },
        {
          "y": 1,
          "x": 1536134648968
        },
        {
          "y": 1,
          "x": 1534665724984
        },
        {
          "y": 1,
          "x": 1534594807367
        },
        {
          "y": 1,
          "x": 1534665898485
        },
        {
          "y": 1,
          "x": 1534594794921
        },
        {
          "y": 1,
          "x": 1534592283980
        },
        {
          "y": 1,
          "x": 1536231278391
        },
        {
          "y": 1,
          "x": 1534924659561
        },
        {
          "y": 1,
          "x": 1534592091886
        },
        {
          "y": 1,
          "x": 1536481471098
        },
        {
          "y": 1,
          "x": 1536134669181
        },
        {
          "y": 1,
          "x": 1534769910462
        },
        {
          "y": 1,
          "x": 1536470542011
        },
        {
          "y": 1,
          "x": 1534592053860
        },
        {
          "y": 1,
          "x": 1534592043453
        },
        {
          "y": 1,
          "x": 1535805633279
        },
        {
          "y": 1,
          "x": 1536041181415
        },
        {
          "y": 1,
          "x": 1534592017328
        },
        {
          "y": 1,
          "x": 1534591976594
        },
        {
          "y": 1,
          "x": 1534874459022
        },
        {
          "y": 1,
          "x": 1536059851501
        },
        {
          "y": 1,
          "x": 1535195099767
        },
        {
          "y": 1,
          "x": 1534591786495
        },
        {
          "y": 1,
          "x": 1536478124365
        },
        {
          "y": 1,
          "x": 1534591616487
        },
        {
          "y": 1,
          "x": 1534766504992
        },
        {
          "y": 1,
          "x": 1535030493065
        },
        {
          "y": 1,
          "x": 1534591552404
        },
        {
          "y": 1,
          "x": 1534591510330
        },
        {
          "y": 1,
          "x": 1534591467917
        },
        {
          "y": 1,
          "x": 1534676488119
        },
        {
          "y": 1,
          "x": 1534591445511
        },
        {
          "y": 1,
          "x": 1534591431243
        },
        {
          "y": 1,
          "x": 1534591392782
        },
        {
          "y": 1,
          "x": 1534591354762
        },
        {
          "y": 1,
          "x": 1534766643471
        },
        {
          "y": 1,
          "x": 1534591344461
        },
        {
          "y": 1,
          "x": 1536161934716
        },
        {
          "y": 1,
          "x": 1534751950500
        },
        {
          "y": 1,
          "x": 1534777136694
        },
        {
          "y": 1,
          "x": 1536145036091
        },
        {
          "y": 1,
          "x": 1534591317521
        },
        {
          "y": 1,
          "x": 1534591265321
        },
        {
          "y": 1,
          "x": 1534591251037
        },
        {
          "y": 1,
          "x": 1535805778980
        },
        {
          "y": 1,
          "x": 1534588137550
        },
        {
          "y": 1,
          "x": 1535209436145
        },
        {
          "y": 1,
          "x": 1534694320570
        },
        {
          "y": 1,
          "x": 1534769883300
        },
        {
          "y": 1,
          "x": 1534588072277
        },
        {
          "y": 1,
          "x": 1534588038353
        },
        {
          "y": 1,
          "x": 1534587978542
        },
        {
          "y": 1,
          "x": 1534748216525
        },
        {
          "y": 1,
          "x": 1534766576685
        },
        {
          "y": 1,
          "x": 1536144450429
        },
        {
          "y": 1,
          "x": 1534591590228
        },
        {
          "y": 1,
          "x": 1534587833819
        },
        {
          "y": 1,
          "x": 1536661587458
        },
        {
          "y": 1,
          "x": 1535216506717
        },
        {
          "y": 1,
          "x": 1534592004711
        },
        {
          "y": 1,
          "x": 1534587589278
        },
        {
          "y": 1,
          "x": 1534587564549
        },
        {
          "y": 1,
          "x": 1534838279451
        },
        {
          "y": 1,
          "x": 1536568281786
        },
        {
          "y": 1,
          "x": 1535201992497
        },
        {
          "y": 1,
          "x": 1534584233759
        },
        {
          "y": 1,
          "x": 1535030508408
        },
        {
          "y": 1,
          "x": 1534591631802
        },
        {
          "y": 2,
          "x": 1535140612607
        },
        {
          "y": 1,
          "x": 1534584164792
        },
        {
          "y": 1,
          "x": 1534619073952
        },
        {
          "y": 1,
          "x": 1535212855707
        },
        {
          "y": 1,
          "x": 1534676327541
        },
        {
          "y": 1,
          "x": 1534584002810
        },
        {
          "y": 1,
          "x": 1535105194442
        },
        {
          "y": 1,
          "x": 1534583926200
        },
        {
          "y": 1,
          "x": 1534594919396
        },
        {
          "y": 1,
          "x": 1535962220186
        },
        {
          "y": 1,
          "x": 1535201953599
        },
        {
          "y": 1,
          "x": 1535011119815
        },
        {
          "y": 1,
          "x": 1535014669228
        },
        {
          "y": 1,
          "x": 1534583912215
        },
        {
          "y": 1,
          "x": 1534755469702
        },
        {
          "y": 1,
          "x": 1534580491882
        },
        {
          "y": 1,
          "x": 1534592228075
        },
        {
          "y": 1,
          "x": 1535115609500
        },
        {
          "y": 1,
          "x": 1536141609260
        },
        {
          "y": 1,
          "x": 1534605094194
        },
        {
          "y": 1,
          "x": 1535797834189
        },
        {
          "y": 1,
          "x": 1534576638687
        },
        {
          "y": 1,
          "x": 1535448065314
        },
        {
          "y": 1,
          "x": 1535212987590
        },
        {
          "y": 1,
          "x": 1536037547270
        },
        {
          "y": 2,
          "x": 1535151401704
        },
        {
          "y": 1,
          "x": 1534533486642
        },
        {
          "y": 1,
          "x": 1534533473203
        },
        {
          "y": 1,
          "x": 1534780673326
        },
        {
          "y": 1,
          "x": 1534584108561
        },
        {
          "y": 1,
          "x": 1534529973491
        },
        {
          "y": 1,
          "x": 1534529887957
        },
        {
          "y": 1,
          "x": 1534526413468
        },
        {
          "y": 1,
          "x": 1534676395007
        },
        {
          "y": 1,
          "x": 1534777776117
        },
        {
          "y": 1,
          "x": 1534523119790
        },
        {
          "y": 1,
          "x": 1534522972271
        },
        {
          "y": 1,
          "x": 1535122763581
        },
        {
          "y": 1,
          "x": 1536510146655
        },
        {
          "y": 1,
          "x": 1534522883285
        },
        {
          "y": 1,
          "x": 1534591947725
        },
        {
          "y": 1,
          "x": 1536037565736
        },
        {
          "y": 1,
          "x": 1534605287531
        },
        {
          "y": 1,
          "x": 1534770049337
        },
        {
          "y": 1,
          "x": 1534515147308
        },
        {
          "y": 2,
          "x": 1534515100190
        },
        {
          "y": 1,
          "x": 1536138082016
        },
        {
          "y": 1,
          "x": 1534523280547
        },
        {
          "y": 1,
          "x": 1534515050765
        },
        {
          "y": 1,
          "x": 1534514993076
        },
        {
          "y": 1,
          "x": 1534514979609
        },
        {
          "y": 1,
          "x": 1536144297862
        },
        {
          "y": 1,
          "x": 1534870655330
        },
        {
          "y": 1,
          "x": 1534514897464
        },
        {
          "y": 1,
          "x": 1534841990507
        },
        {
          "y": 1,
          "x": 1534514887108
        },
        {
          "y": 1,
          "x": 1536137853584
        },
        {
          "y": 1,
          "x": 1534514771166
        },
        {
          "y": 1,
          "x": 1534694268766
        },
        {
          "y": 1,
          "x": 1534514714988
        },
        {
          "y": 1,
          "x": 1534514704676
        },
        {
          "y": 1,
          "x": 1534526465091
        },
        {
          "y": 1,
          "x": 1534860107357
        },
        {
          "y": 1,
          "x": 1534514635495
        },
        {
          "y": 1,
          "x": 1535183876575
        },
        {
          "y": 1,
          "x": 1534573023777
        },
        {
          "y": 1,
          "x": 1534514372794
        },
        {
          "y": 1,
          "x": 1534604924016
        },
        {
          "y": 1,
          "x": 1536223436092
        },
        {
          "y": 1,
          "x": 1535793533788
        },
        {
          "y": 1,
          "x": 1535097591843
        },
        {
          "y": 1,
          "x": 1535030501026
        },
        {
          "y": 1,
          "x": 1536134190791
        },
        {
          "y": 1,
          "x": 1536223260978
        },
        {
          "y": 1,
          "x": 1536137674424
        },
        {
          "y": 1,
          "x": 1535198408474
        },
        {
          "y": 1,
          "x": 1534766382740
        },
        {
          "y": 1,
          "x": 1534512595029
        },
        {
          "y": 1,
          "x": 1534514825129
        },
        {
          "y": 1,
          "x": 1534512582586
        },
        {
          "y": 1,
          "x": 1534766342191
        },
        {
          "y": 1,
          "x": 1534512555776
        },
        {
          "y": 1,
          "x": 1534512506562
        },
        {
          "y": 1,
          "x": 1535011207412
        },
        {
          "y": 1,
          "x": 1534766985025
        },
        {
          "y": 1,
          "x": 1534512437148
        },
        {
          "y": 1,
          "x": 1534512398648
        },
        {
          "y": 1,
          "x": 1535030526433
        },
        {
          "y": 1,
          "x": 1535101096079
        },
        {
          "y": 1,
          "x": 1534514651226
        },
        {
          "y": 1,
          "x": 1535209425218
        },
        {
          "y": 1,
          "x": 1535805695506
        },
        {
          "y": 1,
          "x": 1534960771774
        },
        {
          "y": 1,
          "x": 1534687430428
        },
        {
          "y": 1,
          "x": 1535797538856
        },
        {
          "y": 1,
          "x": 1534507900088
        },
        {
          "y": 1,
          "x": 1534587947735
        },
        {
          "y": 1,
          "x": 1534507899738
        },
        {
          "y": 1,
          "x": 1535032716312
        },
        {
          "y": 1,
          "x": 1534701430418
        },
        {
          "y": 1,
          "x": 1534615337761
        },
        {
          "y": 1,
          "x": 1534881399809
        },
        {
          "y": 1,
          "x": 1534580431264
        },
        {
          "y": 1,
          "x": 1534507897752
        },
        {
          "y": 1,
          "x": 1535047146749
        },
        {
          "y": 1,
          "x": 1534507896973
        },
        {
          "y": 1,
          "x": 1534507896622
        },
        {
          "y": 1,
          "x": 1535966027302
        },
        {
          "y": 1,
          "x": 1534507896275
        },
        {
          "y": 1,
          "x": 1534514755430
        },
        {
          "y": 1,
          "x": 1534507895510
        },
        {
          "y": 1,
          "x": 1534514663639
        },
        {
          "y": 1,
          "x": 1534580464913
        },
        {
          "y": 1,
          "x": 1534507895151
        },
        {
          "y": 1,
          "x": 1534769873569
        },
        {
          "y": 1,
          "x": 1534507889087
        },
        {
          "y": 1,
          "x": 1536495793521
        },
        {
          "y": 1,
          "x": 1534780974162
        },
        {
          "y": 1,
          "x": 1534526725332
        },
        {
          "y": 1,
          "x": 1534507885828
        },
        {
          "y": 2,
          "x": 1534515158340
        },
        {
          "y": 1,
          "x": 1536148849629
        },
        {
          "y": 1,
          "x": 1534507892742
        },
        {
          "y": 1,
          "x": 1534507884289
        },
        {
          "y": 1,
          "x": 1534665795099
        },
        {
          "y": 1,
          "x": 1536499453051
        },
        {
          "y": 1,
          "x": 1534514541306
        },
        {
          "y": 1,
          "x": 1534773751063
        },
        {
          "y": 1,
          "x": 1536564736802
        },
        {
          "y": 1,
          "x": 1534874338982
        },
        {
          "y": 1,
          "x": 1534874314802
        },
        {
          "y": 1,
          "x": 1535566658032
        },
        {
          "y": 1,
          "x": 1534604862537
        },
        {
          "y": 1,
          "x": 1534584281517
        },
        {
          "y": 1,
          "x": 1534595576971
        },
        {
          "y": 1,
          "x": 1536658515021
        },
        {
          "y": 1,
          "x": 1534774135168
        },
        {
          "y": 1,
          "x": 1534507887066
        },
        {
          "y": 1,
          "x": 1534766897319
        },
        {
          "y": 1,
          "x": 1534601362147
        },
        {
          "y": 1,
          "x": 1535216461296
        },
        {
          "y": 1,
          "x": 1534587873430
        },
        {
          "y": 1,
          "x": 1535187521138
        },
        {
          "y": 1,
          "x": 1534856297081
        },
        {
          "y": 1,
          "x": 1534587887668
        },
        {
          "y": 1,
          "x": 1534766820683
        },
        {
          "y": 1,
          "x": 1534504307821
        },
        {
          "y": 1,
          "x": 1535462111719
        },
        {
          "y": 1,
          "x": 1534504306217
        },
        {
          "y": 1,
          "x": 1534514405596
        },
        {
          "y": 1,
          "x": 1534687123854
        },
        {
          "y": 1,
          "x": 1534860149359
        },
        {
          "y": 1,
          "x": 1536474224486
        },
        {
          "y": 1,
          "x": 1534515063854
        },
        {
          "y": 1,
          "x": 1536212418883
        },
        {
          "y": 1,
          "x": 1534507901631
        },
        {
          "y": 1,
          "x": 1536048401594
        },
        {
          "y": 1,
          "x": 1535801683347
        },
        {
          "y": 1,
          "x": 1534500722058
        },
        {
          "y": 1,
          "x": 1534580477784
        },
        {
          "y": 1,
          "x": 1534680228892
        },
        {
          "y": 1,
          "x": 1534500695747
        },
        {
          "y": 1,
          "x": 1534523082008
        },
        {
          "y": 1,
          "x": 1534497651401
        },
        {
          "y": 1,
          "x": 1534766812109
        },
        {
          "y": 1,
          "x": 1534595198349
        },
        {
          "y": 1,
          "x": 1534867229717
        },
        {
          "y": 1,
          "x": 1536138239034
        },
        {
          "y": 1,
          "x": 1534777499591
        },
        {
          "y": 1,
          "x": 1534497622829
        },
        {
          "y": 1,
          "x": 1534497625444
        },
        {
          "y": 1,
          "x": 1534766711065
        },
        {
          "y": 1,
          "x": 1534594848857
        },
        {
          "y": 1,
          "x": 1536658499508
        },
        {
          "y": 1,
          "x": 1534497617696
        },
        {
          "y": 1,
          "x": 1534512519205
        },
        {
          "y": 1,
          "x": 1535987122774
        },
        {
          "y": 1,
          "x": 1534497010229
        },
        {
          "y": 1,
          "x": 1534595342226
        },
        {
          "y": 1,
          "x": 1535465871869
        },
        {
          "y": 1,
          "x": 1534687440661
        },
        {
          "y": 1,
          "x": 1534497014189
        },
        {
          "y": 1,
          "x": 1534497014619
        },
        {
          "y": 1,
          "x": 1536141295758
        },
        {
          "y": 1,
          "x": 1534618931347
        },
        {
          "y": 1,
          "x": 1534587782732
        },
        {
          "y": 1,
          "x": 1534435551510
        },
        {
          "y": 1,
          "x": 1534435552372
        },
        {
          "y": 1,
          "x": 1534701412826
        },
        {
          "y": 1,
          "x": 1534591903371
        },
        {
          "y": 1,
          "x": 1534595477237
        },
        {
          "y": 1,
          "x": 1534594990232
        },
        {
          "y": 1,
          "x": 1536568078528
        },
        {
          "y": 1,
          "x": 1534435551099
        },
        {
          "y": 1,
          "x": 1534587757011
        },
        {
          "y": 1,
          "x": 1536661601664
        },
        {
          "y": 1,
          "x": 1536481575835
        },
        {
          "y": 1,
          "x": 1534515130750
        },
        {
          "y": 1,
          "x": 1534497011495
        },
        {
          "y": 1,
          "x": 1534435548838
        },
        {
          "y": 1,
          "x": 1535180208132
        },
        {
          "y": 1,
          "x": 1534780663562
        },
        {
          "y": 1,
          "x": 1535043727181
        },
        {
          "y": 1,
          "x": 1535032678151
        },
        {
          "y": 1,
          "x": 1536070780857
        },
        {
          "y": 1,
          "x": 1536568657864
        },
        {
          "y": 1,
          "x": 1534512713996
        },
        {
          "y": 1,
          "x": 1535097541089
        },
        {
          "y": 1,
          "x": 1534780846956
        },
        {
          "y": 2,
          "x": 1535644113366
        },
        {
          "y": 1,
          "x": 1534514529534
        },
        {
          "y": 1,
          "x": 1534924788070
        },
        {
          "y": 1,
          "x": 1535047040715
        },
        {
          "y": 1,
          "x": 1534435545954
        },
        {
          "y": 1,
          "x": 1536048603377
        },
        {
          "y": 1,
          "x": 1535462263255
        },
        {
          "y": 1,
          "x": 1534924636529
        },
        {
          "y": 1,
          "x": 1535194987184
        },
        {
          "y": 1,
          "x": 1534515034932
        },
        {
          "y": 1,
          "x": 1534777345713
        },
        {
          "y": 2,
          "x": 1535122684686
        },
        {
          "y": 1,
          "x": 1534780889271
        },
        {
          "y": 1,
          "x": 1534421512664
        },
        {
          "y": 1,
          "x": 1534595451027
        },
        {
          "y": 1,
          "x": 1534584094767
        },
        {
          "y": 1,
          "x": 1536141524258
        },
        {
          "y": 1,
          "x": 1534615356759
        },
        {
          "y": 1,
          "x": 1535202088898
        },
        {
          "y": 1,
          "x": 1536658543196
        },
        {
          "y": 1,
          "x": 1534588006368
        },
        {
          "y": 1,
          "x": 1534421508906
        },
        {
          "y": 1,
          "x": 1534773926522
        },
        {
          "y": 1,
          "x": 1534421507715
        },
        {
          "y": 1,
          "x": 1534580310481
        },
        {
          "y": 1,
          "x": 1534421506905
        },
        {
          "y": 1,
          "x": 1534421511414
        },
        {
          "y": 1,
          "x": 1534867049027
        },
        {
          "y": 1,
          "x": 1534421504014
        },
        {
          "y": 1,
          "x": 1534591672780
        },
        {
          "y": 1,
          "x": 1534863539268
        },
        {
          "y": 1,
          "x": 1536147650256
        },
        {
          "y": 1,
          "x": 1536481881756
        },
        {
          "y": 1,
          "x": 1534766440962
        },
        {
          "y": 1,
          "x": 1534522941829
        },
        {
          "y": 1,
          "x": 1535700436901
        },
        {
          "y": 1,
          "x": 1534421500987
        },
        {
          "y": 1,
          "x": 1534500700242
        },
        {
          "y": 1,
          "x": 1536048748415
        },
        {
          "y": 1,
          "x": 1534755479364
        },
        {
          "y": 1,
          "x": 1534421508530
        },
        {
          "y": 1,
          "x": 1534874278524
        },
        {
          "y": 1,
          "x": 1535805274211
        },
        {
          "y": 2,
          "x": 1535126413227
        },
        {
          "y": 1,
          "x": 1534595367865
        },
        {
          "y": 1,
          "x": 1534421493438
        },
        {
          "y": 1,
          "x": 1535018274934
        },
        {
          "y": 1,
          "x": 1536586717042
        },
        {
          "y": 1,
          "x": 1534957119767
        },
        {
          "y": 1,
          "x": 1534591417927
        },
        {
          "y": 1,
          "x": 1534595027985
        },
        {
          "y": 1,
          "x": 1534584028411
        },
        {
          "y": 1,
          "x": 1536216060092
        },
        {
          "y": 1,
          "x": 1534605276688
        },
        {
          "y": 1,
          "x": 1535030501606
        },
        {
          "y": 1,
          "x": 1535965953993
        },
        {
          "y": 1,
          "x": 1534595072185
        },
        {
          "y": 1,
          "x": 1534421490129
        },
        {
          "y": 1,
          "x": 1534680034019
        },
        {
          "y": 1,
          "x": 1535620842127
        },
        {
          "y": 1,
          "x": 1534587719172
        },
        {
          "y": 1,
          "x": 1534773570297
        },
        {
          "y": 1,
          "x": 1534395381180
        },
        {
          "y": 1,
          "x": 1534395380817
        },
        {
          "y": 1,
          "x": 1534595058908
        },
        {
          "y": 1,
          "x": 1534591566916
        },
        {
          "y": 1,
          "x": 1534512423604
        },
        {
          "y": 1,
          "x": 1534697874876
        },
        {
          "y": 1,
          "x": 1534780696688
        },
        {
          "y": 1,
          "x": 1536484996971
        },
        {
          "y": 1,
          "x": 1536223465776
        },
        {
          "y": 1,
          "x": 1534766473690
        },
        {
          "y": 1,
          "x": 1534507885050
        },
        {
          "y": 1,
          "x": 1534395379903
        },
        {
          "y": 1,
          "x": 1534395379537
        },
        {
          "y": 1,
          "x": 1535030505515
        },
        {
          "y": 1,
          "x": 1534435557032
        },
        {
          "y": 1,
          "x": 1534595169271
        },
        {
          "y": 1,
          "x": 1536596672849
        },
        {
          "y": 1,
          "x": 1534395373934
        },
        {
          "y": 1,
          "x": 1534665777108
        },
        {
          "y": 1,
          "x": 1536037490699
        },
        {
          "y": 1,
          "x": 1534395376784
        },
        {
          "y": 1,
          "x": 1534395374727
        },
        {
          "y": 1,
          "x": 1534701421689
        },
        {
          "y": 1,
          "x": 1534504308231
        },
        {
          "y": 1,
          "x": 1536127514352
        },
        {
          "y": 1,
          "x": 1534498303666
        },
        {
          "y": 1,
          "x": 1535697239135
        },
        {
          "y": 1,
          "x": 1534669511350
        },
        {
          "y": 1,
          "x": 1534777364889
        },
        {
          "y": 1,
          "x": 1534395369554
        },
        {
          "y": 1,
          "x": 1535112316291
        },
        {
          "y": 1,
          "x": 1534523343785
        },
        {
          "y": 1,
          "x": 1536037528131
        },
        {
          "y": 1,
          "x": 1534759456040
        },
        {
          "y": 1,
          "x": 1534583961917
        },
        {
          "y": 1,
          "x": 1534359439115
        },
        {
          "y": 1,
          "x": 1534679972480
        },
        {
          "y": 1,
          "x": 1534435550639
        },
        {
          "y": 1,
          "x": 1534863549266
        },
        {
          "y": 1,
          "x": 1535198514400
        },
        {
          "y": 1,
          "x": 1534676632332
        },
        {
          "y": 1,
          "x": 1536134229743
        },
        {
          "y": 1,
          "x": 1534774049031
        },
        {
          "y": 1,
          "x": 1534669426445
        },
        {
          "y": 1,
          "x": 1534359441205
        },
        {
          "y": 1,
          "x": 1535133603180
        },
        {
          "y": 1,
          "x": 1535011339929
        },
        {
          "y": 1,
          "x": 1535036471981
        },
        {
          "y": 1,
          "x": 1535133488663
        },
        {
          "y": 1,
          "x": 1534867140513
        },
        {
          "y": 1,
          "x": 1535896352539
        },
        {
          "y": 1,
          "x": 1534665851720
        },
        {
          "y": 1,
          "x": 1536478012075
        },
        {
          "y": 1,
          "x": 1535969443783
        },
        {
          "y": 1,
          "x": 1534514567562
        },
        {
          "y": 1,
          "x": 1534595330505
        },
        {
          "y": 1,
          "x": 1534766887777
        },
        {
          "y": 1,
          "x": 1534763203330
        },
        {
          "y": 1,
          "x": 1535036322134
        },
        {
          "y": 1,
          "x": 1536568363101
        },
        {
          "y": 1,
          "x": 1534694353056
        },
        {
          "y": 1,
          "x": 1534838323608
        },
        {
          "y": 1,
          "x": 1535483651729
        },
        {
          "y": 1,
          "x": 1534676517926
        },
        {
          "y": 1,
          "x": 1535990633736
        },
        {
          "y": 1,
          "x": 1534852722149
        },
        {
          "y": 1,
          "x": 1534507891086
        },
        {
          "y": 1,
          "x": 1534421492957
        },
        {
          "y": 1,
          "x": 1535130194556
        },
        {
          "y": 1,
          "x": 1535697181581
        },
        {
          "y": 1,
          "x": 1534591380730
        },
        {
          "y": 1,
          "x": 1534588026903
        },
        {
          "y": 1,
          "x": 1534773915675
        },
        {
          "y": 1,
          "x": 1534604821996
        },
        {
          "y": 1,
          "x": 1536070004642
        },
        {
          "y": 1,
          "x": 1534594863873
        },
        {
          "y": 1,
          "x": 1536138165968
        },
        {
          "y": 1,
          "x": 1534580404643
        },
        {
          "y": 1,
          "x": 1536124066248
        },
        {
          "y": 1,
          "x": 1534512698646
        },
        {
          "y": 1,
          "x": 1534877842396
        },
        {
          "y": 1,
          "x": 1534584195463
        },
        {
          "y": 1,
          "x": 1535032667654
        },
        {
          "y": 1,
          "x": 1535205631238
        },
        {
          "y": 1,
          "x": 1535122980738
        },
        {
          "y": 1,
          "x": 1535466011488
        },
        {
          "y": 1,
          "x": 1535640368798
        },
        {
          "y": 1,
          "x": 1534497643681
        },
        {
          "y": 1,
          "x": 1534592142268
        },
        {
          "y": 1,
          "x": 1535133564841
        },
        {
          "y": 1,
          "x": 1534687414727
        },
        {
          "y": 1,
          "x": 1534615305338
        },
        {
          "y": 2,
          "x": 1534584321514
        },
        {
          "y": 1,
          "x": 1534874374784
        },
        {
          "y": 1,
          "x": 1536144863213
        },
        {
          "y": 1,
          "x": 1534595351499
        },
        {
          "y": 1,
          "x": 1534435549245
        },
        {
          "y": 1,
          "x": 1534497015410
        },
        {
          "y": 1,
          "x": 1536568404694
        },
        {
          "y": 1,
          "x": 1534591813681
        },
        {
          "y": 1,
          "x": 1534766933022
        },
        {
          "y": 1,
          "x": 1534514606848
        },
        {
          "y": 1,
          "x": 1535209455658
        },
        {
          "y": 1,
          "x": 1535032948791
        },
        {
          "y": 1,
          "x": 1536560767235
        },
        {
          "y": 1,
          "x": 1535476695066
        },
        {
          "y": 1,
          "x": 1534669410356
        },
        {
          "y": 1,
          "x": 1535030508857
        },
        {
          "y": 1,
          "x": 1535696852285
        },
        {
          "y": 1,
          "x": 1534924776283
        },
        {
          "y": 1,
          "x": 1535011350194
        },
        {
          "y": 1,
          "x": 1534774007429
        },
        {
          "y": 1,
          "x": 1534773782687
        },
        {
          "y": 1,
          "x": 1536137786958
        },
        {
          "y": 1,
          "x": 1534395378363
        },
        {
          "y": 1,
          "x": 1534507894795
        },
        {
          "y": 1,
          "x": 1534601557079
        },
        {
          "y": 1,
          "x": 1535047071671
        },
        {
          "y": 1,
          "x": 1535808842185
        },
        {
          "y": 1,
          "x": 1534595002281
        },
        {
          "y": 1,
          "x": 1535202005668
        },
        {
          "y": 1,
          "x": 1534498310985
        },
        {
          "y": 1,
          "x": 1534766463524
        },
        {
          "y": 1,
          "x": 1535111957254
        },
        {
          "y": 1,
          "x": 1535465842037
        },
        {
          "y": 1,
          "x": 1534507891919
        },
        {
          "y": 1,
          "x": 1534867115084
        },
        {
          "y": 1,
          "x": 1534497009549
        },
        {
          "y": 1,
          "x": 1536133386911
        },
        {
          "y": 1,
          "x": 1536230716947
        },
        {
          "y": 1,
          "x": 1536137002834
        },
        {
          "y": 1,
          "x": 1534687237862
        },
        {
          "y": 1,
          "x": 1536144752533
        },
        {
          "y": 1,
          "x": 1534395377973
        },
        {
          "y": 1,
          "x": 1534591526555
        },
        {
          "y": 1,
          "x": 1534359440799
        },
        {
          "y": 1,
          "x": 1534766394864
        },
        {
          "y": 1,
          "x": 1535014823033
        },
        {
          "y": 1,
          "x": 1535566628887
        },
        {
          "y": 1,
          "x": 1535126468675
        },
        {
          "y": 1,
          "x": 1534694336662
        },
        {
          "y": 1,
          "x": 1534523244946
        },
        {
          "y": 1,
          "x": 1535465956472
        },
        {
          "y": 1,
          "x": 1534595560111
        },
        {
          "y": 1,
          "x": 1535112123670
        },
        {
          "y": 1,
          "x": 1534687137105
        },
        {
          "y": 1,
          "x": 1536223845228
        },
        {
          "y": 2,
          "x": 1535966520085
        },
        {
          "y": 2,
          "x": 1535198605647
        },
        {
          "y": 1,
          "x": 1536571426836
        },
        {
          "y": 1,
          "x": 1534504311405
        },
        {
          "y": 1,
          "x": 1534497619448
        },
        {
          "y": 1,
          "x": 1535126564577
        },
        {
          "y": 1,
          "x": 1535030515766
        },
        {
          "y": 1,
          "x": 1534530027189
        },
        {
          "y": 1,
          "x": 1536586760415
        },
        {
          "y": 1,
          "x": 1535104923748
        },
        {
          "y": 1,
          "x": 1534421495929
        },
        {
          "y": 1,
          "x": 1534605200222
        },
        {
          "y": 1,
          "x": 1534687171780
        },
        {
          "y": 1,
          "x": 1536162058352
        },
        {
          "y": 1,
          "x": 1534605225795
        },
        {
          "y": 1,
          "x": 1534838267126
        },
        {
          "y": 1,
          "x": 1536586414766
        },
        {
          "y": 1,
          "x": 1535209181197
        },
        {
          "y": 1,
          "x": 1535030496360
        },
        {
          "y": 1,
          "x": 1534877808718
        },
        {
          "y": 1,
          "x": 1534604955507
        },
        {
          "y": 1,
          "x": 1534498313031
        },
        {
          "y": 1,
          "x": 1534595464736
        },
        {
          "y": 1,
          "x": 1534773852516
        },
        {
          "y": 1,
          "x": 1534507890725
        },
        {
          "y": 1,
          "x": 1534780953096
        },
        {
          "y": 1,
          "x": 1535802537782
        },
        {
          "y": 1,
          "x": 1536568207013
        },
        {
          "y": 1,
          "x": 1534395373566
        },
        {
          "y": 1,
          "x": 1534676542224
        },
        {
          "y": 1,
          "x": 1534359441628
        },
        {
          "y": 1,
          "x": 1534591495203
        },
        {
          "y": 1,
          "x": 1534507894437
        },
        {
          "y": 1,
          "x": 1535549144418
        },
        {
          "y": 1,
          "x": 1535194995818
        },
        {
          "y": 1,
          "x": 1534523262869
        },
        {
          "y": 1,
          "x": 1535205609188
        },
        {
          "y": 1,
          "x": 1534421496852
        },
        {
          "y": 1,
          "x": 1536477847992
        },
        {
          "y": 1,
          "x": 1536223314301
        },
        {
          "y": 1,
          "x": 1534588108171
        },
        {
          "y": 1,
          "x": 1534580287937
        },
        {
          "y": 1,
          "x": 1534964209996
        },
        {
          "y": 1,
          "x": 1534507883489
        },
        {
          "y": 1,
          "x": 1536568564764
        },
        {
          "y": 1,
          "x": 1534676530223
        },
        {
          "y": 1,
          "x": 1535122743399
        },
        {
          "y": 1,
          "x": 1534512612031
        },
        {
          "y": 1,
          "x": 1534498316106
        },
        {
          "y": 1,
          "x": 1536133306444
        },
        {
          "y": 1,
          "x": 1534595214028
        },
        {
          "y": 1,
          "x": 1535030506007
        },
        {
          "y": 1,
          "x": 1534605063788
        },
        {
          "y": 1,
          "x": 1536137742377
        },
        {
          "y": 1,
          "x": 1534512672077
        },
        {
          "y": 1,
          "x": 1534421509283
        },
        {
          "y": 1,
          "x": 1535969349665
        },
        {
          "y": 1,
          "x": 1535032866996
        },
        {
          "y": 1,
          "x": 1535563034032
        },
        {
          "y": 1,
          "x": 1534595240235
        },
        {
          "y": 1,
          "x": 1535808322350
        },
        {
          "y": 1,
          "x": 1534838447674
        },
        {
          "y": 2,
          "x": 1535122754234
        },
        {
          "y": 1,
          "x": 1534605105682
        },
        {
          "y": 1,
          "x": 1536041441227
        },
        {
          "y": 1,
          "x": 1534777292821
        },
        {
          "y": 1,
          "x": 1536148070631
        },
        {
          "y": 1,
          "x": 1534751829059
        },
        {
          "y": 1,
          "x": 1535815315520
        },
        {
          "y": 1,
          "x": 1534949829795
        },
        {
          "y": 1,
          "x": 1534669496711
        },
        {
          "y": 1,
          "x": 1536148710401
        },
        {
          "y": 1,
          "x": 1534676428255
        },
        {
          "y": 1,
          "x": 1534594872433
        },
        {
          "y": 1,
          "x": 1536499539360
        },
        {
          "y": 1,
          "x": 1536138422289
        },
        {
          "y": 1,
          "x": 1534435557460
        },
        {
          "y": 1,
          "x": 1535036468398
        },
        {
          "y": 1,
          "x": 1534522959063
        },
        {
          "y": 1,
          "x": 1534507888267
        },
        {
          "y": 1,
          "x": 1536145012843
        },
        {
          "y": 1,
          "x": 1535209090180
        },
        {
          "y": 1,
          "x": 1536585999332
        },
        {
          "y": 1,
          "x": 1538390747613
        },
        {
          "y": 1,
          "x": 1538386672485
        },
        {
          "y": 1,
          "x": 1538386668750
        },
        {
          "y": 1,
          "x": 1538385734743
        },
        {
          "y": 4,
          "x": 1538384780981
        },
        {
          "y": 7,
          "x": 1538047285576
        },
        {
          "y": 1,
          "x": 1537970586096
        },
        {
          "y": 3,
          "x": 1536304448168
        },
        {
          "y": 5,
          "x": 1536295277378
        },
        {
          "y": 5,
          "x": 1536171730476
        },
        {
          "y": 4,
          "x": 1538383562931
        },
        {
          "y": 4,
          "x": 1537182118185
        },
        {
          "y": 7,
          "x": 1537178040573
        },
        {
          "y": 1,
          "x": 1535607985645
        },
        {
          "y": 1,
          "x": 1538386309934
        },
        {
          "y": 1,
          "x": 1538385809286
        },
        {
          "y": 4,
          "x": 1538385452813
        },
        {
          "y": 4,
          "x": 1538383580798
        },
        {
          "y": 7,
          "x": 1537167051708
        },
        {
          "y": 5,
          "x": 1538635568588
        },
        {
          "y": 2,
          "x": 1533786525694
        },
        {
          "y": 5,
          "x": 1533713593449
        },
        {
          "y": 1,
          "x": 1533547724845
        },
        {
          "y": 4,
          "x": 1532943189702
        },
        {
          "y": 2,
          "x": 1532942789137
        },
        {
          "y": 4,
          "x": 1532942555923
        },
        {
          "y": 7,
          "x": 1533712649570
        },
        {
          "y": 4,
          "x": 1532941585308
        },
        {
          "y": 1,
          "x": 1533713195192
        },
        {
          "y": 2,
          "x": 1533787235572
        },
        {
          "y": 6,
          "x": 1531481986700
        },
        {
          "y": 1,
          "x": 1533547971282
        },
        {
          "y": 1,
          "x": 1531480514728
        },
        {
          "y": 3,
          "x": 1533787279937
        },
        {
          "y": 1,
          "x": 1531475080410
        },
        {
          "y": 1,
          "x": 1531392202900
        },
        {
          "y": 1,
          "x": 1531392118583
        },
        {
          "y": 3,
          "x": 1533786594313
        },
        {
          "y": 4,
          "x": 1532347492106
        },
        {
          "y": 2,
          "x": 1533786920933
        },
        {
          "y": 3,
          "x": 1531126381312
        },
        {
          "y": 1,
          "x": 1531127756993
        },
        {
          "y": 4,
          "x": 1532351186027
        },
        {
          "y": 9,
          "x": 1532524114670
        },
        {
          "y": 1,
          "x": 1531118518948
        },
        {
          "y": 2,
          "x": 1532942629960
        },
        {
          "y": 1,
          "x": 1531393267729
        },
        {
          "y": 1,
          "x": 1531118284737
        },
        {
          "y": 1,
          "x": 1531059477057
        },
        {
          "y": 1,
          "x": 1530720340819
        },
        {
          "y": 1,
          "x": 1534747042443
        },
        {
          "y": 3,
          "x": 1530701833307
        },
        {
          "y": 5,
          "x": 1533713787162
        },
        {
          "y": 1,
          "x": 1532341617201
        },
        {
          "y": 3,
          "x": 1531126145324
        },
        {
          "y": 2,
          "x": 1530790771485
        },
        {
          "y": 1,
          "x": 1530191655077
        },
        {
          "y": 7,
          "x": 1530177625210
        },
        {
          "y": 1,
          "x": 1530186135547
        },
        {
          "y": 1,
          "x": 1531126960372
        },
        {
          "y": 1,
          "x": 1529923856180
        },
        {
          "y": 1,
          "x": 1530791067193
        },
        {
          "y": 1,
          "x": 1529910126870
        },
        {
          "y": 1,
          "x": 1529909884788
        },
        {
          "y": 1,
          "x": 1529902970829
        },
        {
          "y": 2,
          "x": 1529902701445
        },
        {
          "y": 1,
          "x": 1532518098931
        },
        {
          "y": 1,
          "x": 1529570656371
        },
        {
          "y": 1,
          "x": 1529564594396
        },
        {
          "y": 4,
          "x": 1531460607792
        },
        {
          "y": 1,
          "x": 1529573011371
        },
        {
          "y": 1,
          "x": 1530791252916
        },
        {
          "y": 1,
          "x": 1529563069293
        },
        {
          "y": 2,
          "x": 1529562864322
        }],
        "key": "AmtrustClaimRegister"
      }
    ];
    }
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
