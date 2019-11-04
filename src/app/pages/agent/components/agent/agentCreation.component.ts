declare var showModal: any;
declare let moment: any;
import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Agent, Plugin, Classifier, UIComponent } from '../../../../models/agent.model';
import { Domain, Goal } from '../../../../models/domain.model';
import { GraphObject,CommonSearchModel } from '../../../../models/flow.model';

import { AgentService } from '../../../../services/agent.service';
import { DomainService } from '../../../../services/domain.service';
import { GraphService } from '../../../../services/flow.service';
import { DataSharingService } from '../../../../services/shared.service';
import { AnalyticsService } from '../../../../services/analytics.service';
import {IMyDpOptions} from 'mydatepicker';
import { environment } from 'environments/environment';


@Component({
  selector: 'api-agent-agent',
  templateUrl: './agentCreation.component.html',
  styleUrls: ['./agent.scss'],
  providers:[DatePipe]
})
export class AgentCreationComponent implements OnInit, OnDestroy {
  
  agentCreateMode: boolean;
  showCronDate:boolean;
  isCreated: boolean;
  modalHeader: string;
  createMode: boolean;
  autoUrl: string;
  selectedAgent: Agent;
  selectedDomain: Domain;
  domainSource: Domain[];
  supportedLanguageSource: string[];
  selectedDomainList: Domain[];
  flowSource: GraphObject[];

  isWatsonEnabled: boolean;
  isApiEnabled: boolean;
  watsonClassifier: Classifier;
  apiClassifier: Classifier;

  facebookPlugin: Plugin;
  myDate:any;

  @ViewChild('successModal') successModal: ElementRef;
  facebookIntegrated: boolean;
  webhook: string;
  isSuccess: boolean;
  errorMessage: string;

  private subscriptionDomain: Subscription;
  private subscriptionGraph: Subscription;
  private subscription: Subscription;

  public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy'
    };

  

  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private route: ActivatedRoute,
    private agentService: AgentService,
    private domainService: DomainService,
    private graphService: GraphService,
    private sharingService: DataSharingService,
    private analyticsReportService: AnalyticsService,
  ) {
    this.modalHeader = '';
    this.createMode = true;
    this.showCronDate = false;
    this.selectedAgent = new Agent();
    this.domainSource = [];
    this.selectedDomainList = [];
    this.flowSource = [];
    this.myDate = this.setCronStartDate(new Date());
    this.isWatsonEnabled = false;
    this.watsonClassifier = new Classifier();
    this.watsonClassifier.classifierServiceName = 'WATSON';
    this.watsonClassifier.classifierServiceUrl = null;
    this.watsonClassifier.classifierServiceToken = null;

    this.isApiEnabled = false;
    this.apiClassifier = new Classifier();
    this.apiClassifier.classifierServiceName = 'API';
    this.apiClassifier.classifierWorkspaceId = null;
    this.apiClassifier.classifierUsername = null;
    this.apiClassifier.classifierPassword = null;
    this.apiClassifier.classifierVersion = null;

    this.facebookPlugin = new Plugin();
    this.facebookPlugin.messengerName = 'FBMESSENGER';

    this.facebookIntegrated = false;
    this.webhook = '';
    this.isSuccess = true;
    this.errorMessage = '';
  }

  ngOnInit() {
    this.fetchLookups();
    this.isCreated = false;
    const agent: Agent = this.sharingService.getSharedObject();
    if (agent) {
      this.selectedAgent = agent;
      this.agentCreateMode = false;

      if(this.selectedAgent.uiComponent.cronEnabled){
        this.showCronDate = true;
        if(!this.selectedAgent.uiComponent.startTime || this.selectedAgent.uiComponent.startTime === null)
        {
          this.setCronStartDate(new Date());
          this.selectedAgent.uiComponent.startTime = new Date();
        }
        else{
          let date = new Date(this.selectedAgent.uiComponent.startTime);
          this.setCronStartDate(date);
        }
      }
      else{
        this.showCronDate = false;
      }

      if (!this.selectedAgent.uiComponent) {
        this.selectedAgent.uiComponent = new UIComponent();
      }
      if (!this.selectedAgent.autodetectLanguage || this.selectedAgent.autodetectLanguage === null) {
        this.selectedAgent.autodetectLanguage = false;
      }
      if (!this.selectedAgent.defaultLanguage || this.selectedAgent.defaultLanguage === null) {
        this.selectedAgent.defaultLanguage = '';
      }
      if (!this.selectedAgent.disabled || this.selectedAgent.disabled === null) {
        this.selectedAgent.disabled = false;
      }
      if (!this.selectedAgent.debugMode || this.selectedAgent.debugMode === null) {
        this.selectedAgent.debugMode = false;
      }
      if (!this.selectedAgent.uiComponent.placeHolderText) {
        this.selectedAgent.uiComponent.placeHolderText = 'Type your query...';
      }
      if (!this.selectedAgent.uiComponent.episodeIdleTimeout) {
        this.selectedAgent.uiComponent.episodeIdleTimeout = 240;
      }
      if (!this.selectedAgent.uiComponent.episodeCloseTimeout) {
        this.selectedAgent.uiComponent.episodeCloseTimeout = 2880;
      }
      if (!this.selectedAgent.uiComponent.isBargeable || this.selectedAgent.uiComponent.isBargeable === null) {
        this.selectedAgent.uiComponent.isBargeable = false;
      }
      if (!this.selectedAgent.uiComponent.initMessage || this.selectedAgent.uiComponent.initMessage === null) {
        this.selectedAgent.uiComponent.initMessage = '';
      }

      if (this.selectedAgent.agentPlugins && this.selectedAgent.agentPlugins.length > 0) {
        const pluginsToBeRemoved: Plugin[] = [];
        for (const plugin of this.selectedAgent.agentPlugins) {
          if (plugin && plugin.messengerName === 'FBMESSENGER') {
            this.facebookPlugin = JSON.parse(JSON.stringify(this.selectedAgent.agentPlugins[0]));
            pluginsToBeRemoved.push(plugin);
          }
        }

        for (const plugin of pluginsToBeRemoved) {
          const index: number = this.selectedAgent.agentPlugins.indexOf(plugin);
          if (index !== -1) {
            this.selectedAgent.agentPlugins.splice(index, 1);
          }
        }
      }

      if (this.selectedAgent.agentClassifier && this.selectedAgent.agentClassifier.length > 0) {
        const classifiersToBeRemoved: Classifier[] = [];
        for (const classifier of this.selectedAgent.agentClassifier) {
          if (classifier && classifier.classifierServiceName && classifier.classifierServiceName.length > 0) {
            if (classifier.classifierServiceName === 'WATSON') {
              this.watsonClassifier = JSON.parse(JSON.stringify(classifier));
              this.isWatsonEnabled = true;
              classifiersToBeRemoved.push(classifier);
            } else if (classifier.classifierServiceName === 'API') {
              this.apiClassifier = JSON.parse(JSON.stringify(classifier));
              this.isApiEnabled = true;
              classifiersToBeRemoved.push(classifier);
            }
          }
        }

        for (const classifier of classifiersToBeRemoved) {
          const index: number = this.selectedAgent.agentClassifier.indexOf(classifier);
          if (index !== -1) {
            this.selectedAgent.agentClassifier.splice(index, 1);
          }
        }
      }
    } else {
      this.selectedAgent = new Agent();
      this.setCronStartDate(new Date());
      this.selectedAgent.uiComponent.startTime = new Date();
      this.agentCreateMode = true;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionDomain && !this.subscriptionDomain.closed) {
      this.subscriptionDomain.unsubscribe();
    }
    if (this.subscriptionGraph && !this.subscriptionGraph.closed) {
      this.subscriptionGraph.unsubscribe();
    }
  }

  fetchLookups() {
    let payload = { "$or": [ {"statusCd":"ACTIVE"}, { "statusCd": { "$exists": false } } ] }
    this.subscriptionDomain = this.domainService.domainLookup(payload, null, null, ["_id", "name", "langSupported"])
      .subscribe(
        domainList => {
          if (domainList) {
            this.domainSource = domainList;

            if (!this.agentCreateMode) {
              if (this.selectedAgent.domainNameList && this.selectedAgent.domainNameList.length > 0) {
                for (const domainName of this.selectedAgent.domainNameList) {
                  for (const domain of this.domainSource) {
                    //console.log(domain.name + " " + domainName);
                    if (domainName === domain.name) {
                      this.addDomain(domain);
                      break;
                    }
                  }
                }
              }
            }
          }
        }
      );
    let commonsearchModel = new CommonSearchModel();
    commonsearchModel.searchParams = [{"statusCd":"ACTIVE"}];
    commonsearchModel.returnFields = ["version","machineType"]
    this.subscriptionGraph = this.graphService.fetch(commonsearchModel)
      .subscribe(flowSource => {
        if (flowSource) {
          this.flowSource = flowSource;
        }
      });
  }

  resetAgentFields() {
    this.selectedAgent = new Agent();
  }

  createAgent() {
    
    if (this.selectedAgent) {
      if (this.selectedDomainList) {
        this.selectedAgent.domainNameList = [];
        for (const domain of this.selectedDomainList) {
          this.selectedAgent.domainNameList.push(domain.name);
        }
      }

      if (!this.selectedAgent.langSupported || this.selectedAgent.langSupported === null) {
        this.selectedAgent.langSupported = [];
      }

      if (this.isApiEnabled && this.apiClassifierValidator()) {
        this.selectedAgent.agentClassifier.push(this.apiClassifier);
      }

      if (this.isWatsonEnabled && this.watsonClassifierValidator()) {
        this.selectedAgent.agentClassifier.push(this.watsonClassifier);
      }

      if (this.facebookPluginValidator()) {
        this.selectedAgent.agentPlugins.push(this.facebookPlugin);
      }
      
      this.subscription = this.agentService.saveAgent(this.selectedAgent)
        .subscribe(
          createdAgent => {
            this.isSuccess = true;
            this.isCreated = true;
            this.autoUrl = `${environment.autourl}${createdAgent._id}`;
            if (this.selectedAgent._id == null && createdAgent) {
              this.analyticsReportService.scheduleDailyReportForAgent(this.selectedAgent)
              .subscribe(
                response => {
                  
                },
                error => {

                }
              )
              if (createdAgent.agentPlugins && createdAgent.agentPlugins.length > 0) {
                const facebookPlugin: Plugin = createdAgent.agentPlugins[0];

                if (facebookPlugin && facebookPlugin.webhook && facebookPlugin.webhook.length > 0) {
                  this.facebookIntegrated = true;
                  this.webhook = facebookPlugin.webhook;
                  new showModal('successModal');
                  return;
                }

              }

              this.facebookIntegrated = false;
              this.webhook = '';
              new showModal('successModal');
            }
          }, error => {
            this.isSuccess = false;
          }
        );
    }
  }

  onDomainSelect(domain: Domain) {
    if (domain) {
      this.selectedDomain = domain;
    }
  }

  arrayToString(array: string[]) {
    let arrayString: string = 'none';
    if (array) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (i === 0) {
          arrayString = '';
        }
  
        arrayString += array[i];
  
        if (i < (len - 1)) {
          arrayString += ', ';
        }
      }
  
    }
    
    return arrayString;
  }

  domainGoalsToString(goals: Goal[]) {
    let goalString: string = 'none';

    if (goals) {
      for (let i = 0, len = goals.length; i < len; i++) {
        if (i === 0) {
          goalString = '';
        }

        if (goals[i] && goals[i].goalName && goals[i].goalName.length > 0) {
          goalString += goals[i].goalName;
        }

        if (i < (len - 1)) {
          goalString += ', ';
        }
      }
    }

    return goalString;
  }

  containsAll() {
    let containsAll: boolean = true;

    for (const domain of this.domainSource) {
      containsAll = containsAll && this.domainAddedToList(domain);
    }

    return containsAll;
  }

  domainAddedToList(domain?: Domain) {
    if (domain) {
      return this.selectedDomainList && this.selectedDomainList.length > 0
        && domain && this.selectedDomainList.includes(domain);
    } else {
      return this.selectedDomainList && this.selectedDomainList.length > 0
        && this.selectedDomain && this.selectedDomainList.includes(this.selectedDomain);
    }
  }

  addDomain(domain?: Domain) {
    if (domain) {
      this.selectedAgent.domainId = domain._id;
      if (!this.domainAddedToList(domain)) {
        this.selectedDomainList.push(domain);
      }
    } else {
      this.selectedAgent.domainId = this.selectedDomain._id;
      if (!this.domainAddedToList()) {
        this.selectedDomainList.push(this.selectedDomain);
      }
    }

    this.updateLanguageLookup();
  }

  removeDomain() {
    if (this.domainAddedToList()) {
      const index: number = this.selectedDomainList.indexOf(this.selectedDomain);
      if (index !== -1) {
        this.selectedDomainList.splice(index, 1);
        this.selectedAgent.domainId = '';
      }
    }

    this.updateLanguageLookup();
  }

  addAllDomain() {
    if (this.selectedDomainList && this.domainSource) {
      for (const domain of this.domainSource) {
        if (!this.domainAddedToList(domain)) {
          this.selectedDomainList.push(domain);
        }
      }
    }

    this.updateLanguageLookup();
  }

  removeAllDomain() {
    if (this.selectedDomainList && this.domainSource) {
      for (const domain of this.domainSource) {
        if (this.domainAddedToList(domain)) {
          const index: number = this.selectedDomainList.indexOf(domain);
          if (index !== -1) {
            this.selectedDomainList.splice(index, 1);
          }
        }
      }
    }

    this.updateLanguageLookup();
  }

  updateLanguageLookup() {
    if (this.selectedDomainList) {
      this.supportedLanguageSource = [];
      for (const domain of this.selectedDomainList) {
        if (domain && domain.langSupported && domain.langSupported) {
          for (const lang of domain.langSupported) {
            if (lang && !this.supportedLanguageSource.includes(lang)) {
              this.supportedLanguageSource.push(lang);
            }
          }
        }
      }

      if (!this.supportedLanguageSource.includes(this.selectedAgent.defaultLanguage)) {
        if (this.supportedLanguageSource.length > 0) {
          this.selectedAgent.defaultLanguage = this.supportedLanguageSource[0];
        } else {
          this.selectedAgent.defaultLanguage = '';
        }
      }
    }
  }

  apiClassifierValidator() {
    return this.apiClassifier && this.apiClassifier.classifierServiceUrl && this.apiClassifier.classifierServiceToken
      && this.apiClassifier.classifierServiceUrl.length > 0 && this.apiClassifier.classifierServiceToken.length > 0;
  }

  watsonClassifierValidator() {
    return this.watsonClassifier && this.watsonClassifier.classifierWorkspaceId
      && this.watsonClassifier.classifierUsername && this.watsonClassifier.classifierPassword
      && this.watsonClassifier.classifierVersion && this.watsonClassifier.classifierWorkspaceId.length > 0
      && this.watsonClassifier.classifierUsername.length > 0 && this.watsonClassifier.classifierPassword.length > 0
      && this.watsonClassifier.classifierVersion.length > 0;
  }

  facebookPluginValidator() {
    return this.facebookPlugin && this.facebookPlugin.apitoken && this.facebookPlugin.validation
      && this.facebookPlugin.serviceDownMsg && this.facebookPlugin.apitoken.length > 0
      && this.facebookPlugin.validation.length > 0 && this.facebookPlugin.serviceDownMsg.length > 0;
  }

  goToAgentsListing() {
    if (this.isSuccess) {
      this.router.navigate(['/pg/agnt/ags'], { relativeTo: this.route });
    }
  }

  goBack() {
    this.router.navigate(['/pg/agnt/agsr'], { relativeTo: this.route });
  }

  onCronChange(event){
    if (event){
      this.setCronStartDate(new Date());
      this.selectedAgent.uiComponent.startTime = new Date();
      this.showCronDate = event;
    }
    else{
      this.selectedAgent.uiComponent.startTime = null;
      this.showCronDate = event;
    }
  }

  onDateChanged(event){
    if(event){
      this.selectedAgent.uiComponent.startTime = event["jsdate"];
    }
  }
  
  setCronStartDate(date){
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let dt = date.getDate();
    this.myDate = {"date":{"year":year,"day":dt,"month":month}}
  }

}
