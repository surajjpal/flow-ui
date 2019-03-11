declare var designFlowEditor: any;
declare var styleStates: any;
declare var showModal: any;
declare var graphTools: any;
declare var styleInfo:any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import {User, UserHierarchy, UserGroup,UserGraphObject} from '../../../../models/user.model';
import { State,CommonInsightWrapper, EmailPersister } from '../../../../models/tasks.model';
import { GraphObject, DataPoint, StateModel, ManualAction,StateInfoModel } from '../../../../models/flow.model';
import { Episode, ChatMessage } from '../../../../models/conversation.model';

import { StateService, DataCachingService, EmailService } from '../../../../services/inbox.service';
import { ConversationService } from '../../../../services/agent.service';
import { FetchUserService, UserGraphService ,AllocateTaskToUser} from '../../../../services/userhierarchy.service';
import { UniversalUser } from '../../../../services/shared.service';
import { Map } from 'd3';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'api-task-details',
  templateUrl: './taskDetails.component.html',
  styleUrls: ['./taskDetails.scss'],
  providers: [FetchUserService,AllocateTaskToUser,EmailService]
})

export class TaskDetailsComponent implements OnInit, OnDestroy {

  ZOOM_IN = 'ZOOM_IN';
  ZOOM_OUT = 'ZOOM_OUT';
  ZOOM_ACTUAL = 'ZOOM_ACTUAL';
  PRINT_PREVIEW = 'PRINT_PREVIEW';
  POSTER_PRINT = 'POSTER_PRINT';

  isButtonEnabled: boolean = true;

  selectedState: State;
  dataPoints: DataPoint[];
  actionMap: any;
  graphObject: GraphObject;
  responseError: string;
  fieldKeyMap: any;
  userId:string;
  selectedEpisode: Episode;
  chatMessageList: ChatMessage[];
  Users: UserHierarchy[] = [];
  allocatedUserId:string = "";
  userHierarchy:UserHierarchy = new UserHierarchy();
  commonInsightWrapper: CommonInsightWrapper;
  stateInfoModels:StateInfoModel[];
  orPayload:any; 
  selectedModel:StateInfoModel;
  iterationLevel:number;
  tempUser:User;
  FlagReasons: string[] = ['Customer did not answer','Customer not reachable','Customer rescheduled'];
  arrayTableHeaders = {};
  sourceEmailTrailList:EmailPersister[] = [];
  
  private subscription: Subscription;
  private subscriptionEpisode: Subscription;
  private subscriptionChatMessages: Subscription;
  private subscriptionUsers: Subscription;
  private subscriptionInsight: Subscription;
  private subscriptionXML: Subscription;
  private subscriptionEmail:Subscription;

  constructor(
    private zone: NgZone,
    private router: Router, 
    private route: ActivatedRoute,
    private stateService: StateService,
    private emailService:EmailService,
    private conversationService: ConversationService,
    private dataCachingService: DataCachingService,
    private location: Location,
    private fetchUserService:FetchUserService,
    private allocateTaskToUser:AllocateTaskToUser,
    private universalUser: UniversalUser,
    private sanitizer: DomSanitizer
  ) { 
    this.sourceEmailTrailList = [];
    window['taskDetailsRef'] = { component: this, zone: zone };
  }

  ngOnInit(): void {
    //document.getElementById('#alocateButton').style.visibility = 'hidden';
    
    this.selectedState = this.dataCachingService.getSelectedState();
    if (!this.selectedState) {
      this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
      return;
    }
    
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }

    this.fetchInsight();
    //this.fetchStatesOrPayload();
    this.getEpisode();
    this.extractParams();
    this.initUI();
    this.fetchEmailTrail();
   

    this.userId = this.universalUser.getUser()._id
    this.getUserList();
    this.getParentUser();
    // this.initUI();

  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionEpisode && !this.subscriptionEpisode.closed) {
      this.subscriptionEpisode.unsubscribe();
    }
    if (this.subscriptionChatMessages && !this.subscriptionChatMessages.closed) {
      this.subscriptionChatMessages.unsubscribe();
    }

    if (this.subscriptionInsight && !this.subscriptionInsight.closed) {
      this.subscriptionInsight.unsubscribe();
    }
  }

  fetchEmailTrail(){
    this.subscriptionEmail = this.emailService.getEmailTrail(this.selectedState.entityId)
      .subscribe(emailTrail => {
        if (emailTrail) {
          this.sourceEmailTrailList = emailTrail;
        }
      });
  }

  fetchInsight(){
    this.subscriptionInsight = this.stateService.getInsightForState(this.selectedState._id)
      .subscribe(commonInsightWrapper => {
        if (commonInsightWrapper) {
          this.commonInsightWrapper = commonInsightWrapper;
        }
      });
    }

  fetchStatesOrPayload(){
    this.subscriptionInsight = this.stateService.getStates(this.selectedState.stateMachineInstanceModelId)
    .subscribe(stateInfoModels => {
      if (stateInfoModels) {
        this.stateInfoModels = stateInfoModels;
        new styleInfo(this.stateInfoModels,"archive");
      }
      else{
        this.stateInfoModels = null;
      }
    });
    
  }

  storeModel(model){
    
    this.selectedModel = model;
  }
  setFlagReason(){
    this.selectedState.flagReason = this.FlagReasons[0];
  }

  flagClose(){
    this.selectedState.flagReason = "";
  }



  getUserList(){
    
    this.subscriptionUsers = this.fetchUserService.fetchChildUsers(this.userId)
      .subscribe(userList => {
        if (userList && userList.length > 0) {
          //document.getElementById('#alocateButton').style.visibility = 'visible';
          this.Users = userList;
          
             
        }
      });
    }

  getParentUser(){
    this.subscriptionUsers = this.fetchUserService.getUserHierarchy(this.userId)
    .subscribe(userHierarchyObject => {
      
      if (userHierarchyObject) {
        //document.getElementById('#alocateButton').style.visibility = 'visible';
        this.userHierarchy = userHierarchyObject;

           
      }
      
    });

  }


    allocate(){
      
      this.isButtonEnabled = false;
      console.log(this.allocatedUserId)
      if(this.allocatedUserId.length > 0){
        this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.allocatedUserId,this.selectedState._id,"Allocate")
      .subscribe(any => {

        this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
    });
      }
      else{
        new closeModal('userModal');
        new showModal('userNotSelected');
        this.isButtonEnabled = true;
      }
      
    }

    escalate(){
      this.isButtonEnabled = false;
      this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.userHierarchy.parentUserId,this.selectedState._id,"Escalate")
      .subscribe(any => {
        

        this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
        
    });
    }

    reserve(){
      this.isButtonEnabled = false;
      this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.userId,this.selectedState._id,"Reserve")
      .subscribe(any => {
        

        this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
        
    });

    }


    onUserSelect(user){
      
      this.allocatedUserId = user.userId;
      
    }
  

  onBack() {
    this.location.back();
  }

  getEpisode() {
    this.subscriptionEpisode = this.conversationService.getEpisode(this.selectedState.entityId)
    .subscribe(episode => {
      if (episode) {
        this.selectedEpisode = episode;
        this.getChatMessages();
      }
    });
  }

  getChatMessages() {
    this.subscriptionChatMessages = this.conversationService.getChat(this.selectedState.entityId)
    .subscribe(chatMessages => {
      if (chatMessages) {
        this.chatMessageList = chatMessages;
      }
    });
  }

  extractParams() {
    if (this.selectedState) {
      if (!this.actionMap) {
        this.actionMap = {};
      }
      if (!this.fieldKeyMap) {
        this.fieldKeyMap = {};
      }
      if (!this.dataPoints) {
        this.dataPoints = [];
      }

      if (this.selectedState.parameters && this.selectedState.parameters["mailTrail"]) {
        const emailTrail = JSON.parse(JSON.stringify(this.selectedState.parameters["mailTrail"]));

        if (emailTrail != null && emailTrail.length > 0) {
          this.sourceEmailTrailList = emailTrail;
        }
      }

      if (this.selectedState.parameters && this.graphObject.dataPointConfigurationList) {
        console.log("dataconfigList");
        console.log(this.graphObject.dataPointConfigurationList);
        for (const dataPoint of this.graphObject.dataPointConfigurationList) {
          const paramValue: any = this.selectedState.parameters[dataPoint.dataPointName];

          if (dataPoint.dataType === 'STRING') {
            dataPoint.value = paramValue ? paramValue : '';
          } else if (dataPoint.dataType === 'BOOLEAN') {
            dataPoint.value = (paramValue !== null && (typeof paramValue === 'boolean' || paramValue instanceof Boolean)) ? paramValue : false;
          } else if (dataPoint.dataType === 'NUMBER') {
            dataPoint.value = (paramValue && (typeof paramValue === 'number' || paramValue instanceof Number)) ? paramValue : 0;
          } else if (dataPoint.dataType === 'SINGLE_SELECT') {
            if (paramValue && !(paramValue instanceof Array) && !dataPoint.inputSource.includes(paramValue)) {
              dataPoint.inputSource.push(paramValue);
            }
            
            dataPoint.value = paramValue;
          } else if (dataPoint.dataType === 'MULTI_SELECT') {
            const uniqueValues: string[] = [];
            
            if (paramValue && paramValue instanceof Array && paramValue.length > 0) {
              for (const value of paramValue) {
                if (!dataPoint.inputSource.includes(value)) {
                  uniqueValues.push(value);
                }
                
              }
              
              dataPoint.inputSource = dataPoint.inputSource.concat(uniqueValues);
            }
            
            dataPoint.value = paramValue;
          } else if (dataPoint.dataType === 'ARRAY') {
            dataPoint.value = (paramValue && paramValue instanceof Array) ? paramValue : [];
          } else if (dataPoint.dataType === 'ANY') {
            dataPoint.value = paramValue;
          } else {
            dataPoint.dataType = 'STRING';
            dataPoint.value = '';
          }
          
          /** ---------------------- IMPORTANT ----------------------
           * This is done on purpose, please don't remove.
           * Required for UI -> Inline form -> Label & Value
           * Object at even indices are used to create label div
           * Object at odd indices are used to create input field
           * while updating info on server only odd indices objects are selected
           **/
          this.dataPoints.push(dataPoint);
          if(dataPoint.dataType == 'ARRAY' && dataPoint.value.length>0 && !this.isString(dataPoint.value[0])) {
            this.dataPoints.push(dataPoint);
          }
          else {
            this.dataPoints.push(dataPoint);
          }

          this.fieldKeyMap[dataPoint.dataPointName] = dataPoint.dataPointLabel;
          
        }
      }
    }
  }

  getUniqueDataPoints() {
    return Array.from(new Set(this.dataPoints ));
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
    new graphTools('ZOOM_ACTUAL');
  }

  toolsChoice(choice: string): void {
    new graphTools(choice);
  }


  getInputMap(){
    this.isButtonEnabled = false;
    
    if (!this.actionMap) {
      this.actionMap = {};
    }

    for (let index = 0; index < this.dataPoints.length; index++) {
      if (index % 2 === 1) {
        const dataPoint = this.dataPoints[index];
        if (dataPoint.dataType === 'NUMBER' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = +dataPoint.value;
        } else if (dataPoint.dataType === 'BOOLEAN' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = (dataPoint.value === 'true');
        }
        this.actionMap[dataPoint.dataPointName] = dataPoint.value;
      }
    }


  }

  updateFlow() {

    this.isButtonEnabled = false;
    
    this.actionMap = JSON.parse(JSON.stringify(this.selectedState.parameters));

    for (let index = 0; index < this.dataPoints.length; index++) {
      if (index % 2 === 1) {
        const dataPoint = this.dataPoints[index];
        if (dataPoint.dataType === 'NUMBER' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = +dataPoint.value;
        } else if (dataPoint.dataType === 'BOOLEAN' && (typeof dataPoint.value === 'string' || dataPoint.value instanceof String)) {
          dataPoint.value = (dataPoint.value === 'true');
        }
        this.actionMap[dataPoint.dataPointName] = dataPoint.value;
      }
    }

    this.subscription = this.stateService.update(this.selectedState.machineType, this.selectedState.entityId, this.actionMap)
      .subscribe(response => {
        this.responseError = '';

        const state: State = response;

        if (state) {
          this.isButtonEnabled = true;
          if (state.errorMessageMap) {
            for (const key in state.errorMessageMap) {
              if (key) {
                const errorList: string[] = state.errorMessageMap[key];

                this.responseError += `${this.fieldKeyMap[key]}<br>`;
                for (const error of errorList) {
                  this.responseError += `  - ${error}<br>`;
                }
              }
            }

            if (!this.responseError || this.responseError.length <= 0) {
              new showModal('successModal');
            }
          } else {
            new showModal('successModal');
          }
        } else {
          new showModal('successModal');
        }
      });
  }

  onReasonSelect(reason):void{
    this.selectedState.flagReason = reason;
  }

  confirm():void{
    this.isButtonEnabled = false;
    this.selectedState.flagged = true;
    this.iterationLevel = this.selectedState.iterationLevel;
    this.iterationLevel = this.iterationLevel + 1;
    this.selectedState.iterationLevel = this.iterationLevel;
    this.selectedState.subStatus = "FLAGGED"

    this.extractParams();
    this.getInputMap();
    this.subscriptionXML = this.stateService.saveFlaggedState(this.selectedState,this.actionMap)
    .subscribe(state => {
     this.selectedState = state;
     new closeModal('flagTaskModal');
     new showModal('flagSuccessModal');
     
    });
  }

  archive():void{
    this.isButtonEnabled = false;
    this.subscription = this.stateService.saveArchivedState(this.selectedState)
    .subscribe(State => {
      new closeModal('flagTaskModal');
      this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
    });
  }

  isString(value) {
    return typeof value === 'string';
  }

  getKeysForArrayDataType(data, dataPointName) {
    this.arrayTableHeaders[dataPointName] = [];
    for(let key in data[0]) {
      this.arrayTableHeaders[dataPointName].push(key);
    }
    return this.arrayTableHeaders[dataPointName];
    
  }

  getValueForArraydatatype(data, dataPointName) {
    let values = []
    for(let d of data) {
      let headerValue = []
      for (let key of this.arrayTableHeaders[dataPointName]) {
        headerValue.push(d[key]);
      }
      values.push(headerValue);
    }
    return values;
  }

  sanitizeHTML(htmlContent) {
    if (htmlContent) {
      return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    }

    return "";
  }
}
