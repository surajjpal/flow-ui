declare var designFlowEditor: any;
declare var styleStates: any;
declare var showModal: any;
declare var graphTools: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import {User, UserHierarchy, UserGroup,UserGraphObject} from '../../../../models/user.model';
import { State } from '../../../../models/tasks.model';
import { GraphObject, DataPoint, StateModel, ManualAction } from '../../../../models/flow.model';
import { Episode, ChatMessage } from '../../../../models/conversation.model';

import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { ConversationService } from '../../../../services/agent.service';
import { FetchUserService, UserGraphService ,AllocateTaskToUser} from '../../../../services/userhierarchy.service';
import { UniversalUser } from '../../../../services/shared.service';

@Component({
  selector: 'api-task-details',
  templateUrl: './taskDetails.component.html',
  styleUrls: ['./taskDetails.scss'],
  providers: [FetchUserService,AllocateTaskToUser]
})

export class TaskDetailsComponent implements OnInit, OnDestroy {

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
  allocatedUserId:string;
  userHierarchy:UserHierarchy = new UserHierarchy();
  private subscription: Subscription;
  private subscriptionEpisode: Subscription;
  private subscriptionChatMessages: Subscription;
  private subscriptionUsers: Subscription;
  

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private stateService: StateService,
    private conversationService: ConversationService,
    private dataCachingService: DataCachingService,
    private location: Location,
    private fetchUserService:FetchUserService,
    private allocateTaskToUser:AllocateTaskToUser,
    private universalUser: UniversalUser
  ) { }

  ngOnInit(): void {
    //document.getElementById('#alocateButton').style.visibility = 'hidden';
    this.selectedState = this.dataCachingService.getSelectedState();
    if (!this.selectedState) {
      this.router.navigate(['/pg/tsk/tact'], { relativeTo: this.route });
      return;
    }
    
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }

    this.getEpisode();
    this.extractParams();
    this.initUI();

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
      
      this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.allocatedUserId,this.selectedState._id,"allocate")
      .subscribe(any => {
        this.router.navigate(['/pg/tsk/tact'], { relativeTo: this.route });
    });
    }

    escalate(){
      
      this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.userHierarchy.parentUserId,this.selectedState._id,"escalate")
      .subscribe(any => {
        
        this.router.navigate(['/pg/tsk/tact'], { relativeTo: this.route });
        
    });
    }

    reserve(){
      this.subscriptionUsers = this.allocateTaskToUser.allocateTask(this.userId,this.selectedState._id,"reserve")
      .subscribe(any => {
        
        this.router.navigate(['/pg/tsk/tact'], { relativeTo: this.route });
        
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
    this.subscriptionChatMessages = this.conversationService.getChat(this.selectedEpisode._id)
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

      if (this.selectedState.parameters && this.graphObject.dataPointConfigurationList) {
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
          this.dataPoints.push(dataPoint);

          this.fieldKeyMap[dataPoint.dataPointName] = dataPoint.dataPointLabel;
        }
      }
    }
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
    new graphTools('ZOOM_ACTUAL');
  }

  updateFlow() {
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

    this.subscription = this.stateService.update(this.selectedState.machineType, this.selectedState.entityId, this.actionMap)
      .subscribe(response => {
        this.responseError = '';

        const state: State = response;

        if (state) {
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
}
