declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
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
import { ApiConfig, ApiKeyExpressionMap } from '../../../../models/setup.model';

// Service Imports
import { GraphService, CommunicationService } from '../../../../services/flow.service';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
@Component({
  selector: 'api-flow-design',
  templateUrl: './design.component.html'
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
  allocationTypes: string[] = ['Group', 'Least_Allocated', 'Maximum_Efficiency', 'API', 'User','Round_Robin','Auto_Agent_Allocation'];
  amountTypes: string[] = ['FIXED', 'DERIVED', 'API'];
  timerUnitType: string[] = ['MINUTE','HOUR','DAY','WEEK','MONTH','YEAR'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[] = [];
  sourceEntryActionList: string[] = [];
  sourceApiConfigList: ApiConfig[] = [];
  sourceManualActionType: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT'];
  sourceEvents: EventModel[] = [];
  sourceDataTypes: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT', 'ARRAY', 'ANY'];
  sourceTimerUnitList: string[] = [];

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

  progressBarFlag: boolean = false;
  
  private subscription: Subscription;
  private subscriptionEntryAction: Subscription;
  private subscriptionApiConfig: Subscription;
  private subscriptionOrPayload: Subscription;
  private subscriptionTimerUnit: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private stateService: StateService,
    private graphService: GraphService,
    private communicationService: CommunicationService
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

    this.tempGraphObject = new GraphObject();
    this.tempState = new StateModel();
    this.tempParentState = new StateModel();
    this.tempEvent = new EventModel();
    this.sourceClassifiers = [new Classifier(), new Classifier()];
    this.sourceApiConfigList = [];
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
          this.sourceApiConfigList = apiConfigList;
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

    this.tempState = JSON.parse(JSON.stringify(state));
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

  saveState(): void {
    this.tempState.endState = (this.tempState.events.length === 0);
    if (!this.isStateApiCompatible()) {
      this.tempState.apiConfigurationList = [];
    }

    if (!this.isStateRuleCompatible()) {
      this.tempState.ruleList = [];
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
}
