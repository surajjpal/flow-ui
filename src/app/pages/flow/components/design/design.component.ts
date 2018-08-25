declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var showModal: any;
declare var exportGraphXml: any;
declare var updateNewEdge: any;
declare var deleteNewEdge: any;
declare var updateStateTrigger: any;
declare var styleInfo:any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/switchMap';

// Model Imports
import {
  GraphObject, DataPoint, Classifier, StateModel,
  EventModel, Expression, Transition, ManualAction, DataPointValidation,StateInfoModel
} from '../../../../models/flow.model';
import {ConnectorConfig, ConnectorInfo, TaskObject} from '../../../../models/setup.model';
import { ApiConfig, ApiKeyExpressionMap,ApiResponse } from '../../../../models/setup.model';

// Service Imports
import { GraphService, CommunicationService } from '../../../../services/flow.service';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import {ConnectorConfigService,FileService} from  '../../../../services/setup.service';
import { environment } from '../../../../../environments/environment';
@Component({
  selector: 'api-flow-design',
  templateUrl: './design.component.html',
  styleUrls: ['./design.scss'],
  providers:[ConnectorConfigService,FileService]
})

export class DesignComponent implements OnInit, OnDestroy {

  // Final strings used in html as method parameter
  ZOOM_IN = 'ZOOM_IN';
  ZOOM_OUT = 'ZOOM_OUT';
  ZOOM_ACTUAL = 'ZOOM_ACTUAL';
  PRINT_PREVIEW = 'PRINT_PREVIEW';
  POSTER_PRINT = 'POSTER_PRINT';

  // List counts
  dataPointCount: number = 0;
  stateCount: number = 0;

  // Dynamic html titles for dialogs
  stateCreateMode: boolean = true;
  updateStateFlag: boolean = true;
  
  // Dropdown source list
  sourceStatusCodes: string[] = ['DRAFT', 'ACTIVE', 'ARCHIVE'];
  sourceStateTypes: string[] = ['Manual', 'Auto', 'Cognitive'];
  allocationTypes: string[] = ['Group', 'Least_Allocated', 'Maximum_Efficiency', 'API', 'User','Round_Robin','Auto_Agent_Allocation','Allocate_To_TeamLeader'];
  amountTypes: string[] = ['FIXED', 'DERIVED', 'API'];
  timerUnitType: string[] = ['MINUTE','HOUR','DAY','WEEK','MONTH','YEAR'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[] = [];
  sourceEntryActionList: string[] = [];
  sourceApiConfigList: ApiConfig[] = [];
  sourceConConfigList:ConnectorConfig[]=[];
  sourceManualActionType: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT'];
  sourceEvents: EventModel[] = [];
  sourceDataTypes: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT', 'ARRAY', 'ANY'];
  sourceTimerUnitList: string[] = [];
  graphtypList = [ null,"PIE_CHART", "BAR_GRAPH"];
  
  // Models to bind with html
  bulkEdit: boolean = false;
  readOnly: boolean;
  graphObject: GraphObject;
  tempGraphObject: GraphObject;
  tempState: StateModel;
  tempParentState: StateModel;
  tempEvent: EventModel;
  tempEdgeEvent: EventModel;
  childStateEventMap: any;
  childStateList: string[];
  selectedEvent: EventModel;
  bulkExpressions: string = '';
  orPayload:any; 
  stateInfoModels:StateInfoModel[];
  selectedModel:StateInfoModel;
  // Warning Modal properties
  warningHeader: string;
  warningBody: string;
  conInfoList:ConnectorInfo[] = [];
  //connectors
  configList:any = [];
  typeConfigList:any = [];
  payloadList:any = [];
  apiConfig:ApiConfig;
  conConfig:ConnectorConfig;
  tempConConfig:ConnectorConfig;
  selectedConInfo:ConnectorInfo;
  selectedResponse:ApiResponse;
  responseTypeSource: string[];
  paramsToSelectSource: string[];
  conInfoOfNoMetadata:ConnectorInfo;
  gotConInfo:boolean = false;
  loadingConfigMap:boolean = false;
  temp:any;

  //file
  fileSelected:boolean;
  selectedFile:FormData;
  fileUploaded:boolean;
  fileUploadedUrl:string;
  fileName:string;

  progressBarFlag: boolean = false;
  selectedConfig: boolean = false;
  specificConfigSelected: boolean = false;

  private subscription: Subscription;
  private subscriptionEntryAction: Subscription;
  private subscriptionApiConfig: Subscription;
  private subscriptionOrPayload: Subscription;
  private subscriptionTimerUnit: Subscription;
  private subscriptionConConfig:Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private stateService: StateService,
    private graphService: GraphService,
    private communicationService: CommunicationService,
    private connectorConfigService:ConnectorConfigService,
    private fileService:FileService
  ) {
    window['flowComponentRef'] = { component: this, zone: zone };

    this.readOnly = this.communicationService.isReadOnly();
    if (this.readOnly) {
      this.communicationService.setReadOnly(false);
    }

    this.graphObject = this.communicationService.getGraphObject();
    if (this.graphObject) {
      this.communicationService.sendGraphObject(null);
    }
    this.selectedFile = new FormData();
    this.tempGraphObject = new GraphObject();
    this.tempState = new StateModel();
    this.tempParentState = new StateModel();
    this.tempEvent = new EventModel();
    this.apiConfig = new ApiConfig();
    this.tempConConfig = new ConnectorConfig();
    this.conConfig = new ConnectorConfig();
    this.conInfoOfNoMetadata = new ConnectorInfo();
    this.sourceClassifiers = [new Classifier(), new Classifier()];
    this.sourceApiConfigList = [];
    this.sourceConConfigList = [];
    this.temp = {};
    this.responseTypeSource = ['PAYLOAD', 'PARAM'];
    this.paramsToSelectSource = ['SELECTIVE', 'ALL'];
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    window['flowComponentRef'] = null;

    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionEntryAction && !this.subscriptionEntryAction.closed) {
      this.subscriptionEntryAction.unsubscribe();
    }
    if (this.subscriptionApiConfig && !this.subscriptionApiConfig.closed) {
      this.subscriptionApiConfig.unsubscribe();
    }
    if (this.subscriptionTimerUnit && !this.subscriptionTimerUnit.closed) {
      this.subscriptionTimerUnit.unsubscribe();
    }
  }

  load(): void {
    this.getSourceEntryActions();
    this.getTimerUnits();
    this.getApiConfigLookup();
    this.getConList();
    

    if (!this.graphObject || this.graphObject === null) {
      this.graphObject = new GraphObject();
      this.graphObject.statusCd = this.sourceStatusCodes[0],
        this.addNewDataPoint(true);
    }

    new designFlowEditor(this.graphObject.xml, this.readOnly);
    //this.fetchStatesOrPayload();
  }

  fetchStatesOrPayload(){
    this.subscriptionOrPayload = this.stateService.getStatesByMachineType(this.graphObject.machineType)
    .subscribe(stateInfoModels => {
      if (stateInfoModels) {
        this.stateInfoModels = stateInfoModels;
        new styleInfo(this.stateInfoModels,"design");
      }
      else{
        this.stateInfoModels = null;
      }
     });
    
  }

  storeModel(model){
    
    this.selectedModel = model;
  }

  getSourceEntryActions() {
    this.subscriptionEntryAction = this.graphService.getEntryActions()
      .subscribe(entryActionList => {
        if (entryActionList) {
          this.sourceEntryActionList = entryActionList;
        }
      });
  }

  getTimerUnits() {
    this.subscriptionTimerUnit = this.graphService.getTimerUnits()
      .subscribe(sourceTimerUnitList => {
        if (sourceTimerUnitList) {
          this.sourceTimerUnitList = sourceTimerUnitList;
        }
      });
  }


  getApiConfigLookup() {
    this.subscriptionApiConfig = this.graphService.apiConfigLookup()
      .subscribe(apiConfigList => {
        if (apiConfigList && apiConfigList.length > 0) {
          for (let api of apiConfigList){
            if(!api.taskConConfigApi)
            this.sourceApiConfigList.push(api);
          }
          
        }
      });
  }

  getConList(){
    this.subscriptionConConfig = this.connectorConfigService.getAllCons()
        .subscribe(conConfigList => {
          if (conConfigList) {
            for (let con of conConfigList){
              if(!con.taskConfig)
              this.sourceConConfigList.push(con)
            }
          }
        });
    }

  prepareDummyObject() {
    if (this.graphObject) {
      this.tempGraphObject = JSON.parse(JSON.stringify(this.graphObject));
    } else {
      this.tempGraphObject = new GraphObject();
    }
  }

  toolsChoice(choice: string): void {
    new graphTools(choice);
  }

  addState(sourceEvents: EventModel[]): void {
    this.stateCreateMode = true;
    this.selectedConfig =false;
    this.specificConfigSelected = false;
    this.configList = [];
    this.payloadList = [];
    this.conConfig.taskObject = new TaskObject();
    
    this.sourceEvents = sourceEvents;

    this.tempState = new StateModel();
    this.tempState.type = this.sourceStateTypes[0];
    this.tempState.allocationModel.allocationType = this.allocationTypes[0];
    
    if (this.sourceEvents && this.sourceEvents.length > 0) {
      this.tempState.trigger = this.sourceEvents[0];
      this.tempState.initialState = false;
    } else {
      this.tempState.trigger = null;
      this.tempState.initialState = true;
    }
  }

  updateState(state: StateModel): void {
    this.stateCreateMode = false;
    this.specificConfigSelected = false;
    this.selectedConfig = false;
    this.gotConInfo = false;

    this.tempState = JSON.parse(JSON.stringify(state));
    if(this.tempState.connectorConfig){
      if(this.tempState.connectorConfig.length > 0){
        this.onConfigSelect(this.tempState.connectorConfig);
      }
    }
  }
  

  addEdge(sourceEvents: EventModel[]) {
    if (sourceEvents && sourceEvents.length > 0) {
      this.sourceEvents = sourceEvents;
      this.tempEdgeEvent = this.sourceEvents[0];
    } else {
      this.sourceEvents = [];
    }
  }

  saveEdge() {
    new updateNewEdge(this.tempEdgeEvent);
  }

  deleteEdge() {
    new deleteNewEdge();
  }

  eventsMismatch(state: StateModel, newEvents: EventModel[], childStateList: string[], modalHeader: string, modalBody: string) {
    this.warningHeader = modalHeader;
    this.warningBody = modalBody;

    this.tempState = state;
    this.sourceEvents = newEvents;
    this.childStateList = childStateList;
    this.childStateEventMap = {};
    
    for (const stateCd of childStateList) {
      if (stateCd) {
        this.childStateEventMap[stateCd] = null;
      }
    }
  }

  updateStateTriggers() {
    new updateStateTrigger(this.childStateEventMap, this.tempState);
  }

  addEvent(): void {
    const tempEvent: EventModel = new EventModel();
    tempEvent.eventCd = 'Event';
    tempEvent.operand = this.sourceOperands[0];
    tempEvent.expressionList = [];

    this.addExpression(tempEvent);

    this.tempState.events.push(tempEvent);
  }

  addExpression(event: EventModel): void {
    const tempExpression: Expression = new Expression();
    tempExpression.value = 'Expression';

    event.expressionList.push(tempExpression);
  }

  deleteExpression(expression: Expression, event: EventModel): void {
    const index = event.expressionList.indexOf(expression);
    event.expressionList.splice(index, 1);
  }

  deleteEvent(event: EventModel): void {
    const index = this.tempState.events.indexOf(event);
    this.tempState.events.splice(index, 1);
  }

  saveEvent(): void {
    this.tempState.events.push(this.tempEvent);
  }

  saveConConfig():void{
    if(this.specificConfigSelected){
      this.savetaskConfig()
    }
    else{
      this.saveState()
    }
  }

  saveState(): void {
    
    this.tempState.endState = (this.tempState.events.length === 0);
    if (!this.isStateApiCompatible()) {
      this.tempState.apiConfigurationList = [];
    }

    if (!this.isStateRuleCompatible()) {
      this.tempState.ruleList = [];
    }

    if(!this.isStateConnectorCompatible()){
      this.tempState.connectorConfig = [];
      this.tempState.taskConfig = [];
    }

    if (this.tempState.stateId && this.tempState.stateId.toString().trim().length > 0) {
      const customObject: Object = JSON.parse(JSON.stringify(this.tempState));  // Very important line of code, don't remove
      new updateStateObject(customObject);
    } else {
      const newState = JSON.parse(JSON.stringify(this.tempState));

      this.stateCount++;
      newState.stateId = 'state' + this.stateCount;
      const customObject: Object = JSON.parse(JSON.stringify(newState));  // Very important line of code, don't remove
      new saveStateObject(customObject);
    }
  }

  save(): void {
    this.graphObject = this.tempGraphObject;
  }

  saveOnServer() {
    // This will call a method in app.js and it will convert mxGraph into xml
    // and send it back to this component in method saveGraphXml(xml: string)
    new exportGraphXml();
  }

  addNewDataPoint(isInit?: boolean) {
    this.dataPointCount++;

    const dataPoint: DataPoint = new DataPoint();
    dataPoint.dataPointName = 'Data Point' + this.dataPointCount;

    if (isInit) {
      this.graphObject.dataPointConfigurationList.push(dataPoint);
    } else {
      this.tempGraphObject.dataPointConfigurationList.push(dataPoint);
    }
  }

  deleteDataPoint(dataPoint: DataPoint) {
    const index = this.tempGraphObject.dataPointConfigurationList.indexOf(dataPoint);
    this.tempGraphObject.dataPointConfigurationList.splice(index, 1);
  }

  addDataPointValidation(dataPoint: DataPoint) {
    const validation = new DataPointValidation();
    dataPoint.validations.push(validation);
  }

  removeDataPointValidation(validation: DataPointValidation, dataPoint: DataPoint) {
    const index = dataPoint.validations.indexOf(validation);
    dataPoint.validations.splice(index, 1);
  }

  isStateApiCompatible() {
    // TODO: improve the mechanism to differentiate API State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('APIStateEntryAction');
  }

  isStateRuleCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('RuleStateEntryAction');
  }

  isStateConnectorCompatible() {
    // TODO: improve the mechanism to differentiate Rule State with other states
    return this.tempState && this.tempState.entryActionList && this.tempState.entryActionList.length > 0
      && this.tempState.entryActionList.includes('ConnectorStateEntryAction');
  }

  addRule() {
    if (!this.tempState) {
      this.tempState = new StateModel();
    }
    if (!this.tempState.ruleList) {
      this.tempState.ruleList = [];
    }

    this.tempState.ruleList.push(new ApiKeyExpressionMap());
  }

  removeRule(rule: ApiKeyExpressionMap) {
    if (rule && this.tempState && this.tempState.ruleList && this.tempState.ruleList.includes(rule)) {
      const index = this.tempState.ruleList.indexOf(rule);
      this.tempState.ruleList.splice(index, 1);
    }
  }

  addManualAction() {
    if (!this.tempState) {
      this.tempState = new StateModel();
    }
    if (!this.tempState.manualActions) {
      this.tempState.manualActions = [];
    }

    this.tempState.manualActions.push(new ManualAction());
  }

  removeManualAction(manualAction: ManualAction) {
    if (manualAction && this.tempState && this.tempState.manualActions && this.tempState.manualActions.includes(manualAction)) {
      const index = this.tempState.manualActions.indexOf(manualAction);
      this.tempState.manualActions.splice(index, 1);
    }
  }

  saveGraphXml(xml: string, states: StateModel[], transitions: Transition[]): void {
    if (xml && this.graphObject) {
      this.graphObject.xml = xml;
      this.graphObject.states = states;
      this.graphObject.transitions = transitions;

      this.graphObject.dataPointConfigurationList = this.graphObject.dataPointConfigurationList.sort((dp1, dp2) => {
        if (dp1.sequence > dp2.sequence) {
          return 1;
        } else if (dp1.sequence < dp2.sequence) {
            return -1;
        } else {
          return 0;
        }
      });

      for (const dataPoint of this.graphObject.dataPointConfigurationList) {
        dataPoint.validations = dataPoint.validations.sort((v1, v2) => {
          if (v1.sequence > v2.sequence) {
            return 1;
          } else if (v1.sequence < v2.sequence) {
            return -1;
          } else {
            return 0;
          }
        });

        if (dataPoint.dataType !== 'SINGLE_SELECT' && dataPoint.dataType !== 'MULTI_SELECT') {
          dataPoint.inputSource = [];
        }

        for (const validation of dataPoint.validations) {
          validation.dataPointKey = dataPoint.dataPointName;
        }
      }

      this.subscription = this.graphService.save(this.graphObject)
        .subscribe(graphObject => {
          this.graphObject = graphObject;
          this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
        });
    }
  }

  discardChanges(): void {
    this.router.navigate(['/pg/flw/flsr'], { relativeTo: this.route });
  }

  deepCopy(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }

  enableBulkEdit(selectedEvent: EventModel) {
    if (this.bulkEdit) {
      return;
    }
    this.bulkEdit = true;
    this.selectedEvent = selectedEvent;
    this.bulkExpressions = '';

    if (this.selectedEvent && this.selectedEvent.expressionList && this.selectedEvent.expressionList.length > 0) {
      for (let index = 0; index < this.selectedEvent.expressionList.length; index++) {
        this.bulkExpressions += this.selectedEvent.expressionList[index].value;

        if (index < this.selectedEvent.expressionList.length - 1) {
          this.bulkExpressions += '\n';
        }
      }
    }
  }

  disableBulkEdit() {
    if (!this.bulkEdit) {
      return;
    }
    
    this.bulkEdit = false;
    this.selectedEvent.expressionList = [];

    if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
      for (const expression of this.bulkExpressions.split('\n')) {
        this.selectedEvent.expressionList.push(new Expression(expression));
      }
    } else {
      this.addExpression(this.selectedEvent);
    }

    this.selectedEvent = null;
    this.bulkExpressions = '';
  }

  onConfigSelect(event){
    
    this.specificConfigSelected = false;
    this.selectedConfig = false;
    this.gotConInfo = false;
    //this.conInfoOfNoMetadata = new ConnectorInfo();
    this.configList = [];
    this.payloadList = [];
    this.typeConfigList = [];
    this.fileName = "please upload a file..."
    this.tempConConfig = event[0]
    this.loadingConfigMap = true;
    
    if(this.tempConConfig._id.length > 0){
      this.subscriptionConConfig = this.connectorConfigService.getConnectorInfos(event[0].configType)
    .subscribe(conInfoList => {
      this.loadingConfigMap = false;
      if (conInfoList) {

        this.conInfoList = conInfoList;
        if(conInfoList.length == 1){
          this.selectedConfig = false;
          this.specificConfigSelected = true;
          //
          if(!this.stateCreateMode){
            if(this.tempState.connectorConfig[0].configType!=this.tempConConfig.configType){
              this.conConfig = new ConnectorConfig()
              this.connectorSelected(conInfoList[0])
            }
            else{
              for(let conInfo of conInfoList ){
                if(conInfo.type == this.tempState.taskConfig[0].connectorInfoRef){
                  this.conConfig = this.tempState.taskConfig[0]
                  this.connectorSelected(conInfo)
                }
                else{
                  this.conConfig = new ConnectorConfig()
                  this.connectorSelected(conInfoList[0])
                }
              }
            }
          }
          else{
            this.conConfig = new ConnectorConfig()
            this.connectorSelected(conInfoList[0])
          }
        }
        else{
          this.selectedConfig = true;
          if(!this.stateCreateMode){
              if(this.tempState.connectorConfig[0].configType!=this.tempConConfig.configType){
                this.conConfig = new ConnectorConfig()
              }
              else{
                for(let conInfo of conInfoList ){
                  if(conInfo.type == this.tempState.taskConfig[0].connectorInfoRef){
                    this.specificConfigSelected = true;
                    this.conConfig = this.tempState.taskConfig[0]
                    this.connectorSelected(conInfo)
                  }
                }
              }
            }
          }
        }
      });
    }
    
  }

  getConInfoByType(type){
    this.subscriptionConConfig = this.connectorConfigService.getConInfoByType(type)
    .subscribe(conInfo => {
      if (conInfo) {
      console.log(conInfo)
      this.conInfoOfNoMetadata = conInfo;
      this.addConfigParamsForNoMetatData();
    }
  });
  }

  connectorSelected(conInfo){
    this.specificConfigSelected = true;
    this.selectedConInfo = conInfo;
    this.configList = [];
    this.payloadList = [];
    this.typeConfigList = [];
    this.populateSelectedResponse()

    if(this.isEmpty(conInfo.metaData) == false){
      for (const property in conInfo.metaData)
      {
        const map = new Map();
        const typeMap = new Map();

        map.set('key', property);
        typeMap.set('key', property);
        typeMap.set('value',conInfo.metaData[property]["type"])
        if(conInfo.metaData[property]["mandatory"] == true){
          //entry.metaData['configMap'][property] = "";
          //mandatoryList.push(property);
        }
        if(this.stateCreateMode){
          map.set('value', "");
          if (conInfo.metaData[property]["type"] == 'file'){
            this.fileName = "Please upload a file"
          }
          
          if (conInfo.metaData[property]["type"] == 'list'){

            map.set('values',conInfo.metaData[property]["valueList"] )
          }
          
        }
        else{
          let value = this.tempState.taskConfig[0].configMap[property];
          if(this.tempState.taskConfig[0].configType == conInfo.type){
            if (conInfo.metaData[property]["type"] == 'file'){
              let urlArr = value.split("/")
              this.fileName = urlArr[urlArr.length - 1]
            }
            if (conInfo.metaData[property]["type"] == 'list'){
              if(value == 1){
                value =true
              }
              else if(value == 0){
                value =false
              }
              this.temp[property] = value;
              map.set('values',conInfo.metaData[property]["valueList"] )
            }
            map.set('value', value);
          }
          else{
            map.set('value', "");
            this.fileName = "Please upload a file"
          }
        }
        this.configList.push(map);
        this.typeConfigList.push(typeMap);

      }
    }
    else{
      if(this.conInfoOfNoMetadata._id != null ){
        if(this.conInfoOfNoMetadata.type == this.tempConConfig.configType){
          this.addConfigParamsForNoMetatData();
        }
        else{
          this.getConInfoByType(this.tempConConfig.configType)
        }
        
      }
      else{
        this.getConInfoByType(this.tempConConfig.configType);
        
      }
    }

    if(this.isEmpty(conInfo.payload) == false){
      
      for (const property in conInfo.payload)
      {
        const map = new Map();
        map.set('key', property);
       
        if(this.stateCreateMode){
          map.set('value', "");
        }
        else{
          let value = this.tempState.taskConfig[0].taskObject.body[property];
          if(this.tempState.taskConfig[0].configType == conInfo.type){
            map.set('value', value);
          }
          else{
            map.set('value', "");
          }
        }
        this.payloadList.push(map);
      }
   }
    else{
      
     
      if(!this.stateCreateMode){
        if(this.tempState.taskConfig){
          if(this.tempState.taskConfig.length > 0){
            if(this.tempState.taskConfig[0].configType == conInfo.type){
            for(let property in this.tempState.taskConfig[0].taskObject.body){
              const map = new Map();
              map.set('key', property);
              map.set('value',this.tempState.taskConfig[0].taskObject.body[property])
              this.payloadList.push(map);
            }
            }
          }
        }
        
      }
    }
    
  }

  addConfigParamsForNoMetatData(){
    for (const property in this.tempConConfig.configMap)
      {
          const map = new Map();
          const typeMap = new Map();
          typeMap.set('key', property);
          typeMap.set('value',this.conInfoOfNoMetadata.metaData[property]["type"])
          map.set('key', property);
          map.set('value', this.tempConConfig.configMap[property] );
          if(this.conInfoOfNoMetadata.metaData[property]["type"] == "list"){
            let value  = this.tempConConfig.configMap[property];
            if(value == 1){
              value =true
            }
            else if(value == 0){
              value =false
            }
            this.temp[property] = value;
            map.set('values',this.conInfoOfNoMetadata.metaData[property]["valueList"] );
          }
          this.configList.push(map);
          this.typeConfigList.push(typeMap);
      }
  }

  addConfigParam() {
    const body = new Map();
    const typeBody = new Map();
    body.set('key', '');
    body.set('value', '');
    typeBody.set('key', '');
    typeBody.set('value', 'string');
    this.configList.push(body);
    this.typeConfigList.push(typeBody)
  }
  removeConfigBody(body: any) {
    if (body && this.configList && this.configList.includes(body)) {
      const index = this.configList.indexOf(body);
      this.configList.splice(index, 1);
    }
    if (body && this.typeConfigList && this.typeConfigList.includes(body)) {
      const index = this.typeConfigList.indexOf(body);
      this.typeConfigList.splice(index, 1);
    }
  }

  addPayloadParam() {
    const body = new Map();
    body.set('key', '');
    body.set('value', '');
    this.payloadList.push(body);
  }
  removePayloadBody(body: any) {
    if (body && this.payloadList && this.payloadList.includes(body)) {
      const index = this.payloadList.indexOf(body);
      this.payloadList.splice(index, 1);
    }
  }
  

  isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
  }

  savetaskConfig(){
    
     //this.conConfig.configMap = {};
      for (const con of this.configList) {
        if (con.get('key') && con.get('key').trim().length > 0) {
          this.conConfig.configMap[con.get('key')] = con.get('value');
        }
      }

      for (const con of this.payloadList) {
        if (con.get('key') && con.get('key').trim().length > 0) {
          this.conConfig.taskObject.body[con.get('key')] = con.get('value');
        }
      }
      this.conConfig.connectorConfigRef = this.tempConConfig.functionInstanceName;
      this.conConfig.configName = this.tempState.stateCd;
      this.conConfig.connectorInfoRef = this.selectedConInfo.type;
      this.conConfig.configType = this.selectedConInfo.type;
      this.conConfig.taskObject.responseList = this.conConfig.taskObject.responseList;
      
      
      if(this.stateCreateMode){
        this.conConfig.functionInstanceName = "";
        this.createConConfig();
      }
     
      else{
        this.conConfig.functionInstanceName = this.tempState.taskConfig[0].functionInstanceName;
        this.conConfig._id = this.tempState.taskConfig[0]._id;
        this.updateConConfig()
    }
    


      // this.checkValidation(this.conConfig.configMap,this.conConfig.configType)
      // if(this.mandatorySatisfied){
      //   if (this.conConfig._id && this.conConfig._id.length > 0) {
      //     this.updateApiConfig();
      //   } else {
      //     this.createConConfig();
      //   }
      // }
      // else{
      //   showModal("validationModal");
      // }
      
      
    }

    // checkValidation(configMap,configType){
    //       this.notSatisfiedDataPoints = [];
    //       if(this.conConfig.configName.length == 0){
    //         this.notSatisfiedDataPoints.push("name");
    //       }
    //       for(let mandatory of this.mainMandatoryMap[configType]){
    //         if(configMap[mandatory].length == 0){
    //           this.notSatisfiedDataPoints.push(mandatory);
    //         }
    //       }
    //       if(this.notSatisfiedDataPoints.length > 0){
    //         this.mandatorySatisfied = false;
    //       }
    //       else{
    //         this.mandatorySatisfied = true;
    //       }
    // }

    createConConfig(){
      this.subscription = this.connectorConfigService.createConConfig(this.conConfig)
      .subscribe(
        data => {
          this.tempState.taskConfig = [data];
          this.saveState()
          // this.alertService.success('Connector Config created successfully', true);
          // this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
      }

      updateConConfig(){
        this.subscription = this.connectorConfigService.updateConConfig(this.conConfig)
        .subscribe(
          data => {
            this.tempState.taskConfig = [data];
            this.saveState()
            //this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
          });
      }





       removeResponse() {
          if (this.selectedResponse && this.conConfig.taskObject.responseList
            && this.conConfig.taskObject.responseList.includes(this.selectedResponse)) {
            const index = this.conConfig.taskObject.responseList.indexOf(this.selectedResponse);
            this.conConfig.taskObject.responseList.splice(index, 1);
          }
        }
      
        cloneResponse() {
          if (this.selectedResponse) {
            const clonedResponse = JSON.parse(JSON.stringify(this.selectedResponse));
            this.addResponse(clonedResponse);
          }
        }

      populateSelectedResponse() {
          if (this.conConfig && this.conConfig._id && this.conConfig._id.length > 0
            && this.conConfig.taskObject.responseList && this.conConfig.taskObject.responseList.length > 0) {
            this.selectedResponse = this.conConfig.taskObject.responseList[0];
          } else {
            this.conConfig.taskObject.responseList = [];
            this.addResponse();
            this.selectedResponse = this.conConfig.taskObject.responseList[0];
          }
        }
      
        addResponse(response?: ApiResponse) {
          let newResponse = null;
          if (response) {
            newResponse = response;
          } else {
            newResponse = new ApiResponse(this.responseTypeSource[0], this.paramsToSelectSource[0]);
          }
      
          if (newResponse.keyExpressionList && newResponse.keyExpressionList.length  === 0) {
            this.addResponseExpression(newResponse);
          }
          this.conConfig.taskObject.responseList.push(newResponse);
        }


        addResponseExpression(response?: ApiResponse) {
          if (response) {
            response.keyExpressionList.push(new ApiKeyExpressionMap());
          } else if (this.selectedResponse) {
            this.selectedResponse.keyExpressionList.push(new ApiKeyExpressionMap());
          }
        }
      
        removeExpression(expression: ApiKeyExpressionMap) {
          if (expression && this.selectedResponse && this.selectedResponse.keyExpressionList
            && this.selectedResponse.keyExpressionList.includes(expression)) {
              const index = this.selectedResponse.keyExpressionList.indexOf(expression);
              this.selectedResponse.keyExpressionList.splice(index, 1);
          }
        }

//********************** File uplodaing *******************

    fileEvent(event,config){
     
    const input = new FormData();
    const file: File = event.target.files[0];
    input.append("file",event.target.files[0])
    input.append("fileName",file.name)
    this.fileSelected = true;
    this.selectedFile = input;
    this.fileName = file.name;
    // for (let config of this.requiredConfigList){
    //   if (config.get('key') == "file-upload"){
    //     config.set('value',file.name);
    //   }
    // }
    this.upload(config,file.name);
    
  }

  upload(config,filename){
    if (this.selectedFile) {
      this.progressBarFlag = true;
      showModal("fileUploadModel");
      this.selectedFile.append("functionInstanceName", "emailTemplate");
      this.selectedFile.append("entityType","templateUplaod");
    
      this.selectedFile.append("entityRef",filename);
      this.subscription =  this.fileService.upload(this.selectedFile)

        .subscribe (
          response => {
            if (response && response["url"] && response["fileName"]) {
              let url = `${environment.interfaceService}` +  response["url"]
              this.fileUploaded = true;
              this.fileUploadedUrl = url;
              for (const con of this.configList) {
                if (con.get('key') && con.get('key').trim().length > 0 && con.get('key') == config.get('key')) {
                  if (con && this.configList && this.configList.includes(con)) {
                    const index = this.configList.indexOf(con);
                    const body = new Map()
                    body.set('key', config.get('key'));
                    body.set('value',url)
                    this.configList.splice(index, 1,body);
                  }
                }
              }
              this.progressBarFlag = false;
              closeModal("fileUploadModel");
            }
          })
    }
  }
  uuid(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
      let random = Math.random() * 16 | 0; 
      let value = char === "x" ? random : (random % 4 + 8); 
      return value.toString(16);
    });
  }
  onAddChildDataPoint(dataPoint: DataPoint) {
    dataPoint.childdataPoints.push(new DataPoint());
  }

  deleteChildDataPoint(data, childDataPoint) {
    const index: number = data.indexOf(childDataPoint);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }

  onValueSelect(event,config){
    for (const con of this.configList) {
      if (con.get('key') && con.get('key').trim().length > 0 && con.get('key') == config.get('key')) {
        if (con && this.configList && this.configList.includes(con)) {
          const index = this.configList.indexOf(con);
          const body = new Map()
          body.set('key', config.get('key'));
          body.set('value',event)
          body.set('values',config.get('values'));
          if(event in this.temp  == false){
            this.temp[config.get('key')] = event
          }
          this.configList.splice(index, 1,body);
        }
      }
    }
  }

  
}
