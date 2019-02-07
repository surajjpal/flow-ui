declare var closeModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription';
import { DomSanitizer } from '@angular/platform-browser';
import { Domain, Intent, Entity, Goal, GoalStep, Response, Stage, ResponseData, ResponseOption, Settings, CardData } from '../../../../models/domain.model';

import { DomainService } from '../../../../services/domain.service';
import { AlertService, DataSharingService,UniversalUser } from '../../../../services/shared.service';
import { AgentService } from '../../../../services/agent.service';
import { Agent } from '../../../../models/agent.model';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Body } from '@angular/http/src/body';

@Component({
  selector: 'api-agent-domain',
  templateUrl: './domainSetup.component.html',
  styleUrls: ['./domainSetup.scss']
})
export class DomainSetupComponent implements OnInit, OnDestroy {
  entityUploaderOptions: NgUploaderOptions;
  faqUploaderOptions:NgUploaderOptions;

  domainCreateMode: boolean;
  isAddFileUploadResponse: boolean;
  modalHeader: string;
  createMode: boolean;
  languageSource: string[];
  modelKeysSource: string[];
  validationKeysSource: string[];
  stagesSource: Stage[];
  templateNames: string[];
  suggestedTags:string[];
  globalIntents:string[];

  intentFilterQuery: string;
  entityFilterQuery: string;
  goalFilterQuery: string;
  responseFilterQuery: string;
  cardsFilterQuery: string;

  selectedDomain: Domain;
  tempIntent: Intent;
  selectedIntent: Intent;
  tempEntity: Entity;
  selectedEntity: Entity;
  tempGoal: Goal;
  selectedGoal: Goal;
  tempResponse: Response;
  selectedResponse: Response;
  selectedCard: CardData;
  tempCard: CardData;
  domainUpdate: string;
  domainBody: string;
  domainSucess: boolean;
  operandSource: string[];
  bulkExpressions: string;
  featureList:any[];
  faqDomain:boolean;
  response:string;
  request:string;

  //chat constants
  agentLogoShadowColor:string;
  marginBottom:string;
  marginRight:string;
  agentLogoUrl:string;
  showTags:boolean;
  botHtml:any;
  companyAgentId:string;
  showTestButton:boolean;
  showAutoCon:boolean;
  updateForTest:boolean;

  private subscription: Subscription;
  private subscriptionModelKeys: Subscription;
  private subscriptionValidationKeys: Subscription;
  private agentSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private domainService: DomainService,
    private sharingService: DataSharingService,
    private slimLoadingBarService: SlimLoadingBarService,
    private sanitizer: DomSanitizer,
    private user:UniversalUser,
    private agentService: AgentService,
  ) {
    this.agentLogoShadowColor  = "#666";
    this.marginBottom  = "15px";
    this.marginRight = "15px"
    this.agentLogoUrl = "https://automatapi.com/images/autobot.jpg";
    this.botHtml = "";
    this.companyAgentId = "";
    this.showTestButton = false;
    this.showAutoCon = false;
    this.updateForTest = false;        
    this.isAddFileUploadResponse = false;
    this.domainCreateMode = true;
    this.modalHeader = '';
    this.createMode = false;
    this.showTags = false;
    this.languageSource = ['ENG', 'HIN', 'MAR', 'ID', 'ML', 'ARA'];
    this.operandSource = ['AND', 'OR'];
    this.modelKeysSource = [];
    this.domainUpdate = 'Domain';
    this.domainBody = 'Please wait updating domain........';
    this.response = 'Please feel free to ask anything';
    this.request = '';
    this.domainSucess = false;
    this.templateNames = ["default"]
    this.stagesSource = [];
    this.featureList = [];
    this.faqDomain = false;
    this.suggestedTags = [];
    this.globalIntents = ["closure","apiIdle","negation","skip","cancel","apiRetry","affirmation","default","apiInit","initiation"]
    
    this.stagesSource.push(new Stage('Initialization', 'INIT'));
    this.stagesSource.push(new Stage('Context Setting', 'CONTEXT'));
    this.stagesSource.push(new Stage('Information Input', 'INFO'));
    this.stagesSource.push(new Stage('Goal Seek', 'GOAL'));
    this.stagesSource.push(new Stage('Summarize', 'CLOSURE'));

    this.intentFilterQuery = '';
    this.entityFilterQuery = '';
    this.goalFilterQuery = '';
    this.responseFilterQuery = '';
    this.cardsFilterQuery = '';

    this.selectedDomain = new Domain();
    this.tempIntent = new Intent();
    this.selectedIntent = new Intent();
    this.tempEntity = new Entity();
    this.selectedEntity = new Entity();
    this.tempGoal = new Goal();
    this.selectedGoal = new Goal();
    this.tempResponse = new Response();
    this.selectedResponse = new Response();
    this.selectedCard = new CardData();
    this.tempCard = new CardData();

    const uploadIntentUrl = `${environment.autoServer}${environment.uploadintentexcelurl}`;
    this.intentUploaderOptions = {
      url: uploadIntentUrl
    
    };

    const uploadEntityUrl = `${environment.autoServer}${environment.uploadentityexcelurl}`;
    this.entityUploaderOptions = {
      url: uploadEntityUrl
    };

    const uploadFaqUrl = `${environment.faqupload}`;
    this.faqUploaderOptions = {
      url:uploadFaqUrl,
      data:{"file":"UploadedFile"}
    }

    this.slimLoadingBarService.color = '#2DACD1'; // Primary color
    this.slimLoadingBarService.height = '4px';
  }

  ngOnInit() {
    
    this.fetchValidationKeys();
    

    const domain: Domain = this.sharingService.getSharedObject();
    if (domain) {
      console.log("==========================domain=============================");
      this.companyAgentId = this.user.getAgentId();
      if (this.companyAgentId){
        this.showTestButton = true;
      }
      this.selectedDomain = domain;
      this.domainCreateMode = false;
    } else {
      this.selectedDomain = new Domain();
      this.domainCreateMode = true;
    }

    this.removeGoalStepResponseFromDomainResponse();
  }

  getCompanyAgent(){

  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionModelKeys && !this.subscriptionModelKeys.closed) {
      this.subscriptionModelKeys.unsubscribe();
    }
    if (this.subscriptionValidationKeys && !this.subscriptionValidationKeys.closed) {
      this.subscriptionValidationKeys.unsubscribe();
    }
    if(this.showAutoCon){
      this.exitTesting();
    }
  }

  intentUploaderOptions: NgUploaderOptions;

  fetchValidationKeys() {
    this.validationKeysSource = ['dobdate', 'phonenumber', 'email', 'otp', 'incidentdate', 'incidentdescreption', 'pincode', 'imeiemail', 'incidenttime', 'imei', 'emailmobile'];
  }

  resetFields() {
    this.selectedDomain = new Domain();
  }

  onIntentSelect(intent?: Intent) {
    this.suggestedTags = [];
    this.showTags = false;
    if (intent) {
      this.modalHeader = 'Update Intent';
      this.createMode = false;
      this.selectedIntent = intent;
      this.tempIntent = JSON.parse(JSON.stringify(this.selectedIntent));
    } else {
      this.modalHeader = 'Create Intent';
      this.createMode = true;
      this.selectedIntent = null;
      this.tempIntent = new Intent();
    }
  }

  addIntent() {
      if(this.tempIntent.tags.length >= 8)
      {
        if (this.selectedIntent) {
          const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
          if (index !== -1) {
            this.selectedDomain.domainIntents[index] = this.tempIntent;
          }
        } else {
          this.selectedDomain.domainIntents.push(this.tempIntent);
        }
    
        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.intentFilterQuery = (` ${this.intentFilterQuery}`);
        setTimeout(() => {
          this.intentFilterQuery = this.intentFilterQuery.slice(1);
        }, 10);
      }
      else{
          if(!this.globalIntents.includes(this.tempIntent.intentCd))
          {
            new showAlertModal('Error! Unable to save', "Number of tags should be atleast 8");
          }
          else{
            if (this.selectedIntent) {
              const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
              if (index !== -1) {
                this.selectedDomain.domainIntents[index] = this.tempIntent;
              }
            } else {
              this.selectedDomain.domainIntents.push(this.tempIntent);
            }
            this.intentFilterQuery = (` ${this.intentFilterQuery}`);
            setTimeout(() => {
              this.intentFilterQuery = this.intentFilterQuery.slice(1);
            }, 10);
          }
      }
    }
   
  

  removeIntent() {
    if (this.selectedIntent) {
      const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
      if (index !== -1) {
        this.selectedDomain.domainIntents.splice(index, 1);
      }

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.intentFilterQuery = (` ${this.intentFilterQuery}`);
      setTimeout(() => {
        this.intentFilterQuery = this.intentFilterQuery.slice(1);
      }, 10);
    }
  }

  onEntitySelect(entity?: Entity) {
    this.suggestedTags = [];
    this.showTags = false;
    if (entity) {
      this.modalHeader = 'Update Entity';
      this.createMode = false;
      this.selectedEntity = entity;
      this.tempEntity = JSON.parse(JSON.stringify(this.selectedEntity));
    } else {
      this.modalHeader = 'Create Entity';
      this.createMode = true;
      this.selectedEntity = null;
      this.tempEntity = new Entity();
    }
  }

  addEntity() {
    if(this.tempEntity.tags.length >= 8){
      if (this.selectedEntity) {
        const index: number = this.selectedDomain.domainEntities.indexOf(this.selectedEntity);
        if (index !== -1) {
          this.selectedDomain.domainEntities[index] = this.tempEntity;
        }
      } else {
        this.selectedDomain.domainEntities.push(this.tempEntity);
      }
  
      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.entityFilterQuery = (` ${this.entityFilterQuery}`);
      setTimeout(() => {
        this.entityFilterQuery = this.entityFilterQuery.slice(1);
      }, 10);
    }
    else{
      new showAlertModal('Error! Unable to save', "Number of tags should be atleast 8");
    }
    
  }

  removeEntity() {
    if (this.selectedEntity) {
      const index: number = this.selectedDomain.domainEntities.indexOf(this.selectedEntity);
      if (index !== -1) {
        this.selectedDomain.domainEntities.splice(index, 1);
      }

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.entityFilterQuery = (` ${this.entityFilterQuery}`);
      setTimeout(() => {
        this.entityFilterQuery = this.entityFilterQuery.slice(1);
      }, 10);
    }
  }

  onGoalSelect(goal?: Goal) {
    if (goal) {
      this.modalHeader = 'Update Goal';
      this.createMode = false;
      this.selectedGoal = goal;
      this.tempGoal = JSON.parse(JSON.stringify(this.selectedGoal));
      this.populateBulkExpressions(this.tempGoal.expression);
    } else {
      this.modalHeader = 'Create Goal';
      this.createMode = true;
      this.selectedGoal = null;
      this.tempGoal = new Goal();
      this.populateBulkExpressions(this.tempGoal.expression);
    }
  }

  addGoal() {
    this.tempGoal.expression = this.readBulkExpressions();

    let error = this.isInvalidGoalSteps(this.tempGoal.domainGoalSteps);
    if (error) {
      new showAlertModal('Error', error);
    }

    error = this.checkStageCodeInGoalResponses(this.tempGoal.domainGoalSteps);
    if (error) {
      new showAlertModal('Error', error);
    } else {
      this.tempGoal.model = '{}';

      if (this.tempGoal && this.tempGoal.domainGoalSteps) {
        const tempMap: any = {};

        for (const goalStep of this.tempGoal.domainGoalSteps) {
          if (goalStep.key && goalStep.key.length > 0) {
            tempMap[goalStep.key] = 'NOTMET';
          }

          if (goalStep.responses) {
            for (const goalStepResponse of goalStep.responses) {
              goalStepResponse.expression = [goalStep.goalExpression];
            }
          }
        }

        this.tempGoal.model = JSON.stringify(tempMap);
      }

      if (this.selectedGoal) {
        const index: number = this.selectedDomain.domainGoals.indexOf(this.selectedGoal);
        if (index !== -1) {
          this.selectedDomain.domainGoals[index] = this.tempGoal;
        }
      } else {
        this.selectedDomain.domainGoals.push(this.tempGoal);
      }

      new closeModal('goalModal');

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.goalFilterQuery = (` ${this.goalFilterQuery}`);
      setTimeout(() => {
        this.goalFilterQuery = this.goalFilterQuery.slice(1);
      }, 10);
    }

  }

  checkStageCodeInGoalResponses(goalSteps: GoalStep[]) {
    const errorExpressionList: string[] = [];
    if (goalSteps && goalSteps.length > 0) {
      for (const goalStep of goalSteps) {
        if (goalStep && goalStep.responses && goalStep.responses.length > 0) {
          for (const response of goalStep.responses) {
            if (response) {
              if (!response.stage || response.stage.trim().length === 0) {
                errorExpressionList.push(response.expression != null && response.expression.length > 0 ? response.expression[0] : response.response);
              }
            }
          }
        }
      }
    }

    if (errorExpressionList && errorExpressionList.length > 0) {
      return `Stage is missing in the responses of the following goal steps: ${errorExpressionList}`;
    } else {
      return null;
    }
  }

  removeGoal() {
    if (this.selectedGoal) {
      const index: number = this.selectedDomain.domainGoals.indexOf(this.selectedGoal);
      if (index !== -1) {
        this.selectedDomain.domainGoals.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.goalFilterQuery = (` ${this.goalFilterQuery}`);
    setTimeout(() => {
      this.goalFilterQuery = this.goalFilterQuery.slice(1);
    }, 10);
  }

  addNewGoalStep() {
    if (this.tempGoal && this.tempGoal.domainGoalSteps) {
      this.tempGoal.domainGoalSteps.push(new GoalStep());
    }
  }

  deleteGoalStep(goalStep: GoalStep) {
    if (goalStep) {
      const index: number = this.tempGoal.domainGoalSteps.indexOf(goalStep);
      if (index !== -1) {
        this.tempGoal.domainGoalSteps.splice(index, 1);
      }
    }
  }

  goalStepToString(goalSteps: GoalStep[]) {
    let toString = '';

    if (goalSteps) {
      for (let i = 0, len = goalSteps.length; i < len; i++) {
        if (goalSteps[i] && goalSteps[i].responses) {
          for (let j = 0, innerLength = goalSteps[i].responses.length; j < innerLength; j++) {
            toString += goalSteps[i].responses[j].response;
            if (i < (len - 1) || j < (innerLength - 1)) {
              toString += ', ';
            }
          }
        }
      }
    }

    return toString;
  }

  removeGoalStepResponseFromDomainResponse() {
    if (this.selectedDomain && this.selectedDomain.domainGoals && this.selectedDomain.domainResponse) {
      if (this.selectedDomain.domainGoals.length > 0) {
        const responsesToBeRemoved: Response[] = [];

        for (const goal of this.selectedDomain.domainGoals) {
          if (goal.expression && (typeof goal.expression === 'string' || goal.expression instanceof String)) {
            goal.expression = [goal.expression];
          }

          goal.domainGoalSteps = goal.domainGoalSteps.sort((gs1, gs2) => {
            if (gs1.sequence > gs2.sequence) {
              return 1;
            } else if (gs1.sequence < gs2.sequence) {
              return -1;
            } else {
              return 0;
            }
          });

          for (const goalStep of goal.domainGoalSteps) {
            goalStep.responses = [];
            for (const response of this.selectedDomain.domainResponse) {
              if (!response.sequence || response.sequence === null) {
                response.sequence = 0;
              }
              if (!response.disableUserInput || response.disableUserInput === null) {
                response.disableUserInput = false;
              }
              if (!response.stage || response.stage === null) {
                response.stage = '';
              }

              if (!response.settings || response.settings === null) {
                response.settings = new Settings();
              }

              if (!response.selectionExpression || response.selectionExpression === null) {
                response.selectionExpression = '';
              }

              if (!response.options || response.options === null) {
                response.options = [];
              }

              if (!response.contextExpression || response.contextExpression === null) {
                response.contextExpression = '';
              }

              if (response.expression && (typeof response.expression === 'string' || response.expression instanceof String)) {
                response.expression = [response.expression];
              }

              if (!response.uploadDocument || response.uploadDocument === null) {
                response.uploadDocument = {};
              }

              for (const option of response.options) {
                if (!option.type || option.type === null) {
                  option.type = '';
                }
                if (!option.url || option.url === null) {
                  option.url = '';
                }
                if (!option.data || option.data === null) {
                  option.data = [];
                }

                for (const d of option.data) {
                  if (!d.label || d.label === null) {
                    d.label = '';
                  }
                  if (!d.value || d.value === null) {
                    d.value = '';
                  }
                  if (!d.url || d.url === null) {
                    d.url = '';
                  }
                  if (!d.language || d.language === null) {
                    d.language = '';
                  }
                  if (!d.agentId || d.agentId === null) {
                    d.agentId = '';
                  }
                  if (!d.fileSize || d.fileSize === null) {
                    d.fileSize = '';
                  }
                  if (!d.fileType || d.fileType === null) {
                    d.fileType = '';
                  }
                  if (!d.fileReference || d.fileReference === null) {
                    d.fileReference = '';
                  }
                }
              }

              if (response.expression && response.expression.length === 1 && response.expression[0] && goalStep.goalExpression && response.expression[0].trim().toLowerCase() === goalStep.goalExpression.trim().toLowerCase()) {
                responsesToBeRemoved.push(response);
                goalStep.responses.push(response);
              }
            }

            goalStep.responses = goalStep.responses.sort((gsr1, gsr2) => {
              if (gsr1.sequence > gsr2.sequence) {
                return 1;
              } else if (gsr1.sequence < gsr2.sequence) {
                return -1;
              } else {
                return 0;
              }
            });
          }
        }

        for (const response of responsesToBeRemoved) {
          this.removeResponse(response);
        }
      }
    }
  }

  isInvalidGoalSteps(goalSteps: GoalStep[]) {
    const tempGoalSteps = JSON.parse(JSON.stringify(goalSteps));
    for (const goalStep of goalSteps) {
      let occurance = 0;
      for (const tempGoalStep of tempGoalSteps) {
        if (goalStep.goalExpression === tempGoalStep.goalExpression) {
          occurance++;
        }
      }

      if (occurance > 1) {
        return `Duplicate goal response code: ${goalStep.goalExpression}`;
      }
    }

    for (const goal of this.selectedDomain.domainGoals) {
      if (goal !== this.selectedGoal) {
        for (const goalStep of goal.domainGoalSteps) {
          for (const tempGoalStep of goalSteps) {
            if (goalStep.goalExpression === tempGoalStep.goalExpression) {
              return `Duplicate goal response code present in other than current goal: ${goalStep.goalExpression}`;
            }
          }
        }
      }
    }

    return null;
  }

  onResponseSelect(response?: Response) {
    if (response) {
      this.modalHeader = 'Update Response';
      this.createMode = false;
      this.selectedResponse = response;
      this.tempResponse = JSON.parse(JSON.stringify(this.selectedResponse));
      if(this.tempResponse.faqResponse){
        this.tempResponse.features
      }
      if (this.tempResponse.uploadDocument) {
        this.isAddFileUploadResponse = true;
      }
      this.populateBulkExpressions(this.tempResponse.expression);
    } else {
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedResponse = null;
      this.tempResponse = new Response();
      this.populateBulkExpressions(this.tempResponse.expression);
    }
  }

  onFaqResponseSelect(response?: Response) {
    if (response) {
      this.featureList = [];
      this.modalHeader = 'Update Response';
      this.createMode = false;
      this.selectedResponse = response;
      this.tempResponse = JSON.parse(JSON.stringify(this.selectedResponse));
      
      for(let feature of this.tempResponse.features){
        for (const property in feature) {
          if (property) {
            const map = new Map();
            map.set('key', property);
            map.set('value', feature[property]);
            this.featureList.push(map);
          }
        }
      }
      if (this.tempResponse.uploadDocument) {
        this.isAddFileUploadResponse = true;
      }
      this.populateBulkExpressions(this.tempResponse.expression);
    } else {
      this.featureList = [];
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedResponse = null;
      this.tempResponse = new Response();
      this.populateBulkExpressions(this.tempResponse.expression);
    }
  }

  onAddFileUploadResponse() {
    this.isAddFileUploadResponse = true;
  }

  onCardSelect(card?: CardData) {
    if (card) {
      this.modalHeader = 'Update Card';
      this.createMode = false;
      this.selectedCard = card;
      this.tempCard = card;
    }
    else {
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedCard = null;
      this.tempCard = new CardData();
    }
  }

  addFaqResponse(response?: Response) {
    let domainId = null;
    let version = null;
    // if(this.selectedDomain!=null && this.selectedDomain._id){
    //   domainId = this.selectedDomain._id;
    //   version = this.selectedDomain.version;
    // }
    // else{
    //   domainId = this.saveDomain(this.selectedDomain);
    //   version = 1;
    // }
    if (response) {
      response.faqResponse = true;
      this.selectedDomain.domainResponse.push(response);
    } else if (this.selectedResponse) {
        let features = [];
        for (const feature of this.featureList){
          let map = new Map();
          map[feature.get('key')] = feature.get('value');
          features.push(map);
          
        }
        this.tempResponse.features = features;
        this.tempResponse.faqResponse = true;
        if(!this.tempResponse.uniqueId || this.tempResponse.uniqueId.trim().length === 0){
             this.tempResponse.uniqueId = this.newGuid();
           }
        const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
        if (index !== -1) {
          this.selectedDomain.domainResponse[index] = this.tempResponse;
        }
        if (domainId!=null){
          //this.trainDomain(domainId,version);
        }
        new closeModal('faqResponseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
    } else {
        console.log(this.featureList);
        let features = [];
        for (const feature of this.featureList){
          let map = new Map();
          map[feature.get('key')] = feature.get('value');
          features.push(map);
          
        }
        this.tempResponse.features = features;
        this.tempResponse.faqResponse = true;
        this.tempResponse.uniqueId = this.newGuid();
        this.selectedDomain.domainResponse.push(this.tempResponse);
        // if(!this.selectedDomain.name || this.selectedDomain.name.trim().length === 0){
        //   new showAlertModal('Error', 'Please specify the domain name and language first');
        // }
        // else{
        //   this.saveDomain(this.selectedDomain)
        // }
        
        // if(this.selectedDomain.domainResponse.length == 1){

        // }
       
        // if (domainId!=null){
        // //  this.trainDomain(domainId,version);
        // }
        
        new closeModal('faqResponseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
      }
    }

  newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });
  }

    addFeature() {
      const body = new Map();
      body.set('key', '');
      body.set('value', '');
      this.featureList.push(body);
    }

    removeFeature(body: any) {
      if (body && this.featureList && this.featureList.includes(body)) {
        const index = this.featureList.indexOf(body);
        this.featureList.splice(index, 1);
      }
    }
    saveDomain(domain?: Domain,modalName?:string){
      let domainId = null;
      domain.statusCd = "DRAFT"
      domain.version = 1
      this.subscription = this.domainService.saveDomain(domain)
        .subscribe(
          response => {
            domainId = response._id;
            this.selectedDomain = response;
          },
          error => {
            
          }
        );
        return domainId;
    }

  addResponse(response?: Response) {
    if (response) {
      this.selectedDomain.domainResponse.push(response);
    } else if (this.selectedResponse) {
      this.tempResponse.expression = this.readBulkExpressions();

      if (!this.tempResponse.stage || this.tempResponse.stage.trim().length === 0) {
        new showAlertModal('Error', 'Stage can\'t be left empty.');
      } else {
        const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
        if (index !== -1) {
          this.selectedDomain.domainResponse[index] = this.tempResponse;
        }
        new closeModal('responseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
      }
    } else {
      if (!this.tempResponse.stage || this.tempResponse.stage.trim().length === 0) {
        new showAlertModal('Error', 'Stage can\'t be left empty.');
      } else {
        this.tempResponse.expression = this.readBulkExpressions();

        this.selectedDomain.domainResponse.push(this.tempResponse);
        new closeModal('responseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
      }
    }

  }

  removeResponse(response?: Response) {
    if (response) {
      const index: number = this.selectedDomain.domainResponse.indexOf(response);
      if (index !== -1) {
        this.selectedDomain.domainResponse.splice(index, 1);
      }
    } else if (this.selectedResponse) {
      const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
      if (index !== -1) {
        this.selectedDomain.domainResponse.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.responseFilterQuery = (` ${this.responseFilterQuery}`);
    setTimeout(() => {
      this.responseFilterQuery = this.responseFilterQuery.slice(1);
    }, 10);
  }

  removeCard(card?: CardData) {
    if (card) {
      const index: number = this.selectedDomain.cards.indexOf(card);
      if (index !== -1) {
        this.selectedDomain.cards.splice(index, 1);
      }
    } else if (this.selectedResponse) {
      const index: number = this.selectedDomain.cards.indexOf(this.selectedCard);
      if (index !== -1) {
        this.selectedDomain.cards.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
    setTimeout(() => {
      this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
    }, 10);
  }

  addCard(card?: CardData) {
    if (card) {
      this.selectedDomain.cards.push(card);
    }
    else if (this.selectedCard) {
      if (!this.tempCard.cardName || !this.tempCard.templateName) {
        new showAlertModal('Error', 'card name can not be blank');
      }
      else {
        const index: number = this.selectedDomain.cards.indexOf(this.selectedCard);
        if (index !== -1) {
          this.selectedDomain.cards[index] = this.tempCard;
        }
        new closeModal('cardModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
        setTimeout(() => {
          this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
        }, 10);
      }

    }
    else {
      if (!this.tempCard.cardName || this.tempCard.cardName.trim().length === 0) {
        new showAlertModal('Error', 'card name can\'t be left empty.');
      } else {
        if (!this.selectedDomain.cards) {
          this.selectedDomain.cards = [];
        }
        this.selectedDomain.cards.push(this.tempCard);
        new closeModal('cardModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
        setTimeout(() => {
          this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
        }, 10);
      }
    }

  }

  createDomain() {
    if (this.selectedDomain) {
      if (this.selectedDomain.domainGoals) {
        for (const goal of this.selectedDomain.domainGoals) {
          if (goal && goal.domainGoalSteps) {
            for (const goalStep of goal.domainGoalSteps) {
              if (goalStep && goalStep.responses) {
                for (const response of goalStep.responses) {
                  if (response) {
                    this.selectedDomain.domainResponse.push(response);
                  }
                }
                goalStep.responses = null;
              }
            }
          }
        }
      }
      
      // if(!this.selectedDomain.statusCd){
      //   this.selectedDomain.statusCd = "ACTIVE"
      //   this.selectedDomain.version = 1
       
      // }
      if(!this.updateForTest){
          if(this.selectedDomain.statusCd == "DRAFT"){
            this.selectedDomain.version = this.selectedDomain.version + 1
          }
          if(this.selectedDomain.statusCd == "CLONED"){
            this.selectedDomain.version = 1
          }
      }
      console.log("-----------------DOMAIN------------------------------------")
      console.log(this.selectedDomain)
      this.subscription = this.domainService.saveDomain(this.selectedDomain)
      
        .subscribe(
          response => {
            console.log("=======SAVED RESPONSE===============");
            // console.log(response);
            // this.selectedDomain = response;
            
            this.updateClassifierTraining(response);
            
          },
          error => {
            this.domainBody = `Something went wrong please try again!!`;
            this.domainSucess = true;
          }
        );
    }
  }

  trainDt(id,version){
    let payload = {"domainId":id,"version":version}
    this.subscription = this.domainService.trainDt(payload)
        .subscribe(
          response => {
            console.log("pppppppppppppppppppppppppppppppp")
            console.log(response);
            new closeModal('domainUpdateModal');
            console.log(response);
          },
          error => {
          }
        );
  }

  updateClassifierTraining(updatedDomain: Domain) {
    this.subscription = this.domainService.updateDomainClassifierTraining(updatedDomain)
      .subscribe(
        response => {
          if (response) {
            this.selectedDomain = updatedDomain;
            if(this.updateForTest){
              this.getAndUpdateAgent();
            }
            else{
              this.domainBody = `Domain updated successfully!!`;
              this.domainSucess = true;
            }
            
          } else {
            if(this.updateForTest){
              this.updateForTest = false;
            }
            else{
              this.domainBody = `Something went wrong please try again!!`;
            this.domainSucess = true;
            }
            
          }
          //this.updateEntityTrainingData();
          //this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      )
  }

  updateIntenTrainingData() {
    this.subscription = this.domainService.updateIntentTraining(this.selectedDomain)
      .subscribe(
        response => {
          this.updateEntityTrainingData();
          // this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      );
  }

  updateEntityTrainingData() {
    this.subscription = this.domainService.updateEntityTraining(this.selectedDomain)
      .subscribe(
        response => {
          this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      );
  }

  toggleCheck(checkBox: string, checked: boolean) {
    if (checkBox) {
      this.tempGoal.htmlFlag = checkBox === 'HTML_FLAG' && checked;
      this.tempGoal.responseChange = checkBox === 'RESPONSE_CHANGE' && checked;
      this.tempGoal.responseDependent = checkBox === 'RESPONSE_DEPENDENT' && checked;
    }
  }

  getLangSpecificResponses(responses: Response[], language: string) {
    const langResponse: Response[] = [];

    for (const response of responses) {
      if (response && response.lang && language && response.lang === language) {
        langResponse.push(response);
      }
    }

    return langResponse;
  }

  addNewGoalStepResponse(goalStep, language) {
    if (goalStep && language) {
      const gsResponse = new Response(goalStep.goalExpression, language);

      if (goalStep.responses) {
        goalStep.responses.push(gsResponse);
      } else {
        goalStep.responses = [];
        goalStep.responses.push(gsResponse);
      }
    }
  }

  deleteGoalStepResponse(goalStep, gsResponse) {
    if (goalStep && goalStep.responses && gsResponse) {
      const index: number = goalStep.responses.indexOf(gsResponse);
      if (index !== -1) {
        goalStep.responses.splice(index, 1);
      }
    }
  }

  // -------------------------------------------------------------------------------------------------

  onExcelUpload(event: any) {
    if (event) {
      if (event.hasOwnProperty('progress') && event['progress'].hasOwnProperty('percent')) {
        const percent = (event['progress'])['percent'];
        if (percent) {
          if (percent < 100) {
            this.slimLoadingBarService.progress = percent;
          } else {
            this.slimLoadingBarService.complete();
          }
        }
      }
    }
  }

  onExcelUploadComplete(event: UploadedFile) {
    this.slimLoadingBarService.complete();

    if (event.response && event.response.length > 0) {
      const responseObject = JSON.parse(event.response);

      if (responseObject) {
        if (responseObject.hasOwnProperty('domainIntents')) {
          const excelIntents: Intent[] = responseObject['domainIntents'];

          if (excelIntents && excelIntents.length > 0) {
            for (const intent of excelIntents) {
              this.selectedDomain.domainIntents.push(intent);
            }
          }
        } else if (responseObject.hasOwnProperty('domainEntities')) {
          const excelEntities: Entity[] = responseObject['domainEntities'];

          if (excelEntities && excelEntities.length > 0) {
            for (const entity of excelEntities) {
              this.selectedDomain.domainEntities.push(entity);
            }
          }
        }
      }
    }
  }


  onFaqExcelUpload(event: any) {
    if (event) {
      if (event.hasOwnProperty('progress') && event['progress'].hasOwnProperty('percent')) {
        const percent = (event['progress'])['percent'];
        if (percent) {
          if (percent < 100) {
            this.slimLoadingBarService.progress = percent;
          } else {
            this.slimLoadingBarService.complete();
          }
        }
      }
    }
  }

  onFaqExcelUploadComplete(event: UploadedFile) {
    this.slimLoadingBarService.complete();
    console.log(event);
    if (event.response && event.response.length > 0) {
      const responseObject = JSON.parse(event.response);
    }

    //   if (responseObject) {
    //     if (responseObject.hasOwnProperty('domainIntents')) {
    //       const excelIntents: Intent[] = responseObject['domainIntents'];

    //       if (excelIntents && excelIntents.length > 0) {
    //         for (const intent of excelIntents) {
    //           this.selectedDomain.domainIntents.push(intent);
    //         }
    //       }
    //     } else if (responseObject.hasOwnProperty('domainEntities')) {
    //       const excelEntities: Entity[] = responseObject['domainEntities'];

    //       if (excelEntities && excelEntities.length > 0) {
    //         for (const entity of excelEntities) {
    //           this.selectedDomain.domainEntities.push(entity);
    //         }
    //       }
    //     }
    //   }
    // }
  }


  onFaqFileUpload(fileData: FormData) {
    console.log("onFileUpload");
    console.log(fileData);
    this.subscription = this.domainService.uploadFaq(fileData)
      .subscribe(
        response => {
          
        }
      );
    //console.log(fileData);
 
    
  }

  


  onAddResponseOption(response) {
    if (!response.options) {
      response.options = [];
    }
    response.options.push(new ResponseData());
  }

  onAddData(option) {
    option.data.push(new ResponseOption());
  }

  onAddCardActinableData(option) {
    option.data.push(new ResponseOption());
  }

  onAddCardData(option) {
    option.cardData.push('');
  }

  onAddCardActionOption(cardData) {
    if (!cardData.actionable) {
      cardData.actionable = [];
    }
    cardData.actionable.push(new ResponseData())
  }



  deleteCardData(cardData, row) {
    const index: number = cardData.indexOf(row);
    if (index !== -1) {
      cardData.slice(index, 1);
    }
  }

  delete(data, row) {
    const index: number = data.indexOf(row);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }

  onAddSelectionExpression(expressionList) {
    if (expressionList) {
      expressionList.push('');
    }
  }

  // Don't remove. Very important.
  // Being used by for loop in html to keep track of a string in array of strings
  customTrackBy(index: number, obj: any): any {
    return index;
  }


  testFaq()
  {
    this.response = "Please feel free to ask anything";
  }
  converse(){
    let payload = {"text":this.request,"domainId":this.selectedDomain._id}
    this.subscription = this.domainService.converse(payload)
    .subscribe(
      res => {
        console.log(res) ;
        if(res){
          this.response = res['result'][0];
          this.request = "";
        }
      }
    );
  }
  getFeatures(){
    let payload = {"text":this.tempResponse.request}
    this.subscription = this.domainService.getFeatures(payload)
      .subscribe(
        features => {
          console.log(features)
          if (features) {
            for(let feature of features){
              console.log(feature)
              for (const property in feature) {
                if (property) {
                  const map = new Map();
                  map.set('key', property);
                  map.set('value', feature[property]);
                  this.featureList.push(map);
                }
              }
            }
          }
        }
      );
  }

  populateBulkExpressions(expressions) {
    this.bulkExpressions = '';
    if (expressions) {
      for (const exp of expressions) {
        if (exp) {
          if (this.bulkExpressions.length > 0) {
            this.bulkExpressions = this.bulkExpressions + '\n' + exp;
          } else {
            this.bulkExpressions = exp;
          }
        }
      }
    }
  }

  readBulkExpressions() {
    let expressions = [];
    if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
      expressions = this.bulkExpressions.split("\n");
    }
    this.bulkExpressions = '';
    return expressions;
  }

  getIntentSynonyms(){
    if(this.tempIntent.tags.length > 0){
      if (!this.suggestedTags.includes(this.tempIntent.tags[this.tempIntent.tags.length-1])){
        this.subscription = this.domainService.getSynonyms(this.tempIntent.tags[this.tempIntent.tags.length-1])
        .subscribe(
          response => {
            this.showTags = true;
            this.suggestedTags = response["synonyms"];
          }
        );
      }
      }
      
    }

    getEntitySynonyms(){
      if(this.tempEntity.tags.length > 0){
        if (!this.suggestedTags.includes(this.tempEntity.tags[this.tempEntity.tags.length-1])){
          this.subscription = this.domainService.getSynonyms(this.tempEntity.tags[this.tempEntity.tags.length-1])
          .subscribe(
            response => {
              this.showTags = true;
              this.suggestedTags = response["synonyms"];
            }
          );
        }
        }
        
      }

      createBotHtml(domain?:Domain,companyAgent?:Agent){
        const autoUrl = `${environment.autourl}${this.companyAgentId}`
        const html = '<div id="autoButton" style="text-align: center; background-color: transparent; position: fixed; right: ' + this.marginRight + '; bottom: ' + this.marginBottom + '; width: auto; height: auto; z-index:9999"><div style="margin-bottom: 8px;"><a href="javascript:toggleChat()"><img src="' + this.agentLogoUrl + '" style="width: 60px; height: 60px; border-radius: 50%; box-shadow: 0px 0px 10px ' + this.agentLogoShadowColor + ';"></img></a></div>' +
        '</div>' +
        '<div id="automataPi" class="containerStyle" role="dialog" z-index="9999"><iframe id="' + "autoBot" + '" src="' + autoUrl +'" class="iframeStyle" frameborder="0"></iframe></div>'
        this.botHtml= this.sanitizer.bypassSecurityTrustHtml(html);
        this.showAutoCon = true;
        this.updateForTest = false;
      }


    
      testDomain(){
        
        if(!this.selectedDomain._id){
          this.updateForTest = true;
          this.createDomain();
        }
        else{
          this.getAndUpdateAgent();
        }
        
      }

      getAndUpdateAgent(){
        this.agentSubscription = this.agentService.getAgentById(this.companyAgentId).subscribe(receivedAgent=> {
          if(receivedAgent) {
            receivedAgent.domainId = this.selectedDomain._id;
            this.updateDomainOnAgent(receivedAgent);
          }
        });
      }

      updateDomainOnAgent(agent?:Agent){

        this.agentSubscription = this.agentService.saveAgent(agent).subscribe(receivedAgent=> {
          if(receivedAgent) {
            this.createBotHtml(this.selectedDomain,receivedAgent);
          }
        });
      }

    exitTesting(){
      if(this.updateForTest){
        this.subscription = this.domainService.deleteDomain(this.selectedDomain._id)
        .subscribe(
          response => {
            this.showAutoCon = false;
            this.updateForTest =false;
          },
          error => {
            this.showAutoCon = false;
            this.updateForTest =false;
          }
        );
      }
      else{
        this.showAutoCon = false;
        this.updateForTest =false;
      }
      
      }
    

}
