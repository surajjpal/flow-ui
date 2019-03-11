declare var designFlowEditor: any;
declare var styleProcessAuditStates: any;
declare var graphTools: any;

import { Component, OnInit, OnDestroy,NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, transition, animate, style } from '@angular/animations'


import { Subscription } from 'rxjs/Subscription';
import {User, UserHierarchy, UserGroup,UserGraphObject} from '../../../../models/user.model';
import { State,CommonInsightWrapper } from '../../../../models/tasks.model';
import { GraphObject, DataPoint, StateModel, ManualAction,StateInfoModel, ProcessModel } from '../../../../models/flow.model';
import { Episode, ChatMessage } from '../../../../models/conversation.model';

import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { FetchUserService, UserGraphService ,AllocateTaskToUser} from '../../../../services/userhierarchy.service';
import { CommunicationService,ProcessService } from '../../../../services/flow.service';

@Component({
  selector: 'api-flow-processaudit',
  templateUrl: './processaudit.component.html',
  styleUrls: ['./processaudit.scss'],
  providers: [FetchUserService,AllocateTaskToUser,ProcessService],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({transform: 'translateY(-100%)'}),
        animate('200ms ease-in', style({transform: 'translateY(0%)'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})

export class ProcessAuditComponent implements OnInit, OnDestroy {

  ZOOM_IN = 'ZOOM_IN';
  ZOOM_OUT = 'ZOOM_OUT';
  ZOOM_ACTUAL = 'ZOOM_ACTUAL';
  PRINT_PREVIEW = 'PRINT_PREVIEW';
  POSTER_PRINT = 'POSTER_PRINT';

  isButtonEnabled: boolean = true;
  visible: boolean = false;
  selectedProcess: ProcessModel;
  selectedState:State;
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
  arrayTableHeaders = {};
  flowId: string;
  entityId: string;
  
  private subscription: Subscription;
  

  constructor(
    private processService: ProcessService,
    private zone: NgZone,
    private router: Router, 
    private route: ActivatedRoute,
    private dataCachingService: DataCachingService,
    private stateService: StateService
    
  ) { 
    this.flowId = null;
    this.entityId = null;
    window['processAuditRef'] = { component: this, zone: zone };
  }

  ngOnInit(): void {
    //document.getElementById('#alocateButton').style.visibility = 'hidden';
    this.flowId = this.route.snapshot.paramMap.get('flowId');
    this.entityId = this.route.snapshot.paramMap.get('entityId');
    if (this.flowId && this.entityId) {
      const subscriptionXML = this.stateService.getXMLforActiveState(this.flowId)
        .subscribe(graphObject => {
            this.graphObject = graphObject
            this.initUI();
        });
    }
    else {
      this.selectedProcess = this.dataCachingService.getSelectedState();
      if (!this.selectedProcess) {
        this.router.navigate(['/pg/flw/flpsr'], { relativeTo: this.route });
        return;
      }
      
      this.graphObject = this.dataCachingService.getGraphObject();
      if (!this.graphObject) {
        this.graphObject = new GraphObject();
      }

      this.initUI();
    }
    
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleProcessAuditStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
    new graphTools('ZOOM_ACTUAL');
  }

  showStateInfo(state){
     
      this.close();
      let body = {};
      if (this.flowId) {
        body["machineId"] = this.flowId;  
      }
      else{
        body["machineId"] = this.selectedProcess.flowId;
      }
      body["stateCd"] = state.stateCd;
      if (this.entityId) {
        body["entityId"] = this.entityId;
      }
      else {
        body["entityId"] = this.selectedProcess.entityId;
      }
      //body["entityId"] = "5b9254e2393380118dcf294c";

      this.subscription = this.processService.getSelectedState(body)
      .subscribe(stateInstance => {
        if (stateInstance) {
          this.selectedState = stateInstance;
          this.extractParams();
          this.visible=true;
        }
      });
    }
      
  

  close(){
    this.visible = false;
    this.dataPoints = [];
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
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

  

  toolsChoice(choice: string): void {
    new graphTools(choice);
  }


  getInputMap(){
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
}
