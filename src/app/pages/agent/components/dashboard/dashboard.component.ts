import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Agent, Plugin, Classifier } from '../../../../models/agent.model';
import { AgentDashboardService,AgentService } from '../../../../services/agent.service';
import { ConversationSummary, Dashboard } from '../../../../models/dashboard.model';
import { DomainService } from '../../../../services/domain.service';
import { Domain, Goal } from '../../../../models/domain.model';

declare let d3: any;
declare let moment: any;

@Component({
  selector: 'api-auto-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {

  conversationSummary: ConversationSummary;
  
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

  CONVERSATION_SUMMARY_FLAG = false;
  EPISODE_TIMELINE_FLAG = false;
  INTENT_COUNT_FLAG = false;
  ENTITY_COUNT_FLAG = false;
  SENTIMENT_COUNT_FLAG = false;
  GOAL_COUNT_AND_EFFICIENCY_FLAG = false;
  MESSAGES_IN_EPISODE_FLAG = false;
  selectedDate:any;
  agentSource: Agent[] = [];
  selectedAgents:Agent[] = [];
  domainSource: Domain[] = [];
  selectedDomains:Domain[] = [];
  selectedSources:string[] = [];
  selectedLanguages:string[] = [];
  Sources = ["WEB"];
  Language:string[]=[];
  domain:Domain;

  private conversationSubscription: Subscription;
  private episodeSubscription: Subscription;
  private intentSubscription: Subscription;
  private entitySubscription: Subscription;
  private sentimentSubscription: Subscription;
  private goalSubscription: Subscription;
  private messagesSubscription: Subscription;
  
  constructor(private dashboardService: AgentDashboardService, private slimLoadingBarService: SlimLoadingBarService,private agentService: AgentService,private domainService: DomainService) {}

  ngOnInit(): void {
    // this.fetchAutoStats();
    this.setupChartOptions();
    this.fetchAgents();
    this.fetchDomains();
  }

  ngOnDestroy() {
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

    this.slimLoadingBarService.complete();
  }

  private subscription: Subscription;
  fetchAgents() {
    this.subscription = this.agentService.agentLookup()
      .subscribe(
        agents => {
          if (agents) {
            this.agentSource = agents;
            this.selectedAgents.push(agents[0])
          }
        }
      );
  }

  fetchDomains() {
    this.subscription = this.domainService.domainLookup()
      .subscribe(
        domains => {
          if (domains) {
            this.domainSource = domains;
            this.selectedDomains.push(domains[0]);
            domains.forEach( (element) => {
              for(let lang of element.langSupported){
                this.Language.push(lang);
              }
          });
            this.Language = this.removeDuplicates(this.Language)
            this.selectedLanguages.push(this.Language[0]);
          }
        }
      );
  }

  selectDate(date:any){
    this.selectedDate = date;
}

  submit(){
    
    let fromDate = this.selectedDate.start.format('DD/MM/YYYY');
    let toDate = this.selectedDate.end.format('DD/MM/YYYY');
    console.log(fromDate)
    let agentIds:string[] = []
    let domainIds:string[] = []
    let companyId:string;
    for (let agent of this.selectedAgents) {
        agentIds.push(agent._id);
        companyId = agent.companyId
    }
    for (let domain of this.selectedDomains) {
      domainIds.push(domain.name);
      
    }
    let body = {}
    body['startDate'] = fromDate;
    body['endDate'] = toDate;
    body['agent'] = agentIds;
    body['domain'] = domainIds;
    body['language'] = this.selectedLanguages;
    body['source'] = this.selectedSources;
    body['companyId'] = companyId;
    console.log(body)
    this.fetchAutoStats(body)
   
  }

  fetchAutoStats(body: any) {

    this.slimLoadingBarService.color = '#2DACD1'; // Primary color
    this.slimLoadingBarService.height = '10px';
    this.slimLoadingBarService.stop();
    

    this.conversationSubscription = this.dashboardService.fetchSummary(body)
      .subscribe(summary => {
        this.CONVERSATION_SUMMARY_FLAG = true;
        this.updateProgressBar();
        this.conversationSummary = summary['result']
      }, err => {
        this.CONVERSATION_SUMMARY_FLAG = true;
        this.updateProgressBar();
      }
    );
  
    this.episodeSubscription = this.dashboardService.fetchEpisodeTimeline(body)
      .subscribe(autoDashboard => {
        this.EPISODE_TIMELINE_FLAG = true;
        this.updateProgressBar();
        this.episodeCountData = autoDashboard['result'];
      }, err => {
        this.EPISODE_TIMELINE_FLAG = true;
        this.updateProgressBar();
      }
    );
    this.intentSubscription = this.dashboardService.fetchIntentCount(body)
      .subscribe(autoDashboard => {
        this.INTENT_COUNT_FLAG = true;
        this.updateProgressBar();
        this.intentCountData = autoDashboard['result'][0].values;
      }, err => {
        this.INTENT_COUNT_FLAG = true;
        this.updateProgressBar();
      }
    );
    this.entitySubscription = this.dashboardService.fetchEntityCount(body)
      .subscribe(autoDashboard => {
        this.ENTITY_COUNT_FLAG = true;
        this.updateProgressBar();
        this.entityCountData = autoDashboard['result'][0].values;
      }, err => {
        this.ENTITY_COUNT_FLAG = true;
        this.updateProgressBar();
      }
    );
    this.sentimentSubscription = this.dashboardService.fetchSentimentCount(body)
      .subscribe(autoDashboard => {
        this.SENTIMENT_COUNT_FLAG = true;
        this.updateProgressBar();
        this.sentimentCountData = autoDashboard['result'][0].values;
      }, err => {
        this.SENTIMENT_COUNT_FLAG = true;
        this.updateProgressBar();
      }
    );
    this.goalSubscription = this.dashboardService.fetchGoalCount(body)
      .subscribe(autoDashboard => {
        this.GOAL_COUNT_AND_EFFICIENCY_FLAG = true;
        this.updateProgressBar();
        this.parseGoalsCountAndEfficiency(autoDashboard['result']);
      }, err => {
        this.GOAL_COUNT_AND_EFFICIENCY_FLAG = true;
        this.updateProgressBar();
      }
    );
    this.messagesSubscription = this.dashboardService.fetchEpisodeMessages(body)
      .subscribe(autoDashboard => {
        this.MESSAGES_IN_EPISODE_FLAG = true;
        this.updateProgressBar();
        this.messagesInEpisodeData = autoDashboard['result'];
      }, err => {
        this.MESSAGES_IN_EPISODE_FLAG = true;
        this.updateProgressBar();
      }
    );
   }

  updateProgressBar() {
    this.slimLoadingBarService.progress = this.slimLoadingBarService.progress + (100 / 7);
    if ( this.CONVERSATION_SUMMARY_FLAG && this.EPISODE_TIMELINE_FLAG  
      && this.INTENT_COUNT_FLAG && this.ENTITY_COUNT_FLAG && this.SENTIMENT_COUNT_FLAG
       && this.GOAL_COUNT_AND_EFFICIENCY_FLAG && this.MESSAGES_IN_EPISODE_FLAG) {
      this.slimLoadingBarService.complete();
    }
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

  parseGoalsCountAndEfficiency(autoDashboard: any) {
    this.goalsCountData = autoDashboard[0].values;
    this.goalsEfficiencyData = autoDashboard[1];
  }

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
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d));
          }
        },
        x2Axis: {
          tickFormat: function(d) {
            return d3.time.format('%x')(new Date(d));
          },
          showMaxMin: false
        },
        yAxis: {
          axisLabel: "Episode Count",
          axisLabelDistance: -15,
          tickFormat: function(d) {
            return d3.format('d')(d)
          }
        },
        lines: {
          dispatch: {
            elementClick: function (e) {
             // console.log('click');
             // console.log(e);
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
        margin : {
          top: 35,
          right: 20,
          bottom: 70,
          left: 50
        },
        clipEdge: true,
        staggerLabels: true,
        duration: 500,
        stacked: true,
        forceY:[0],
        reduceXTicks: false,
        xAxis: {
          axisLabel: 'Episodes',
          showMaxMin: true,
          axisLabelDistance: 10,
          tickFormat: function(d){
            return d;
          }
        },
        yAxis: {
          axisLabel: 'Message Count',
          axisLabelDistance: -15,
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

  goalEfficiencyBarChartOptions() {
    return {
      chart: {
        type: 'multiBarChart',
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
          axisLabel: 'Goals',
          showMaxMin: true,
          tickFormat: function(d){
             return d3.format('d')(d)
          }
        },
        yAxis: {
          axisLabel: 'Efficiency',
          tickFormat: function(d){
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

  parseData(autoDashboard: AutoDashboard) {
    this.data = autoDashboard.nvd3ChartInputList[0].map(function(series) {
      let clone = JSON.parse(JSON.stringify(series.values));
      series.values = null;
      series.values = clone.map(function(d) { return {x: +d.label, y: +d.value } });
      return series;
    });
  }
  */

  removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

}
