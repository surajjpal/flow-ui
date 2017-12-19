declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var exportGraphXml: any;
declare var updateNewEdge: any;
declare var deleteNewEdge: any;
declare var updateStateTrigger: any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
// import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject, DataPoint, Classifier, StateModel,
   EventModel, Expression, Transition, ManualAction } from '../../../../models/flow.model';
import { ApiConfig, ApiKeyExpressionMap } from '../../../../models/setup.model';

// Service Imports
import { GraphService, CommunicationService } from '../../../../services/flow.service';

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
  stateDialogTitle: string = "Add State";
  stateDialogButtonName: string = "Add";
  
  // Dropdown source list
  sourceStatusCodes: string[] = ['DRAFT', 'ACTIVE', 'ARCHIVE'];
  sourceStateTypes: string[] = ['Manual', 'Auto', 'Cognitive'];
  allocationTypes: string[] = ['Group','Least_Allocated','Maximum_Efficiency','API','User'];
  amountTypes: string[] = ['FIXED','DERIVED','API'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[];
  sourceEntryActionList: string[];
  sourceApiConfigList: ApiConfig[];
  sourceManualActionType: string[] = ['STRING', 'BOOLEAN', 'NUMBER', 'SINGLE_SELECT', 'MULTI_SELECT'];
  sourceEvents: EventModel[];
  sourceChildStates: StateModel[];
  masterEventsList: EventModel[];
  
  // Models to bind with html
  readOnly: boolean;
  graphObject: GraphObject;
  tempGraphObject: GraphObject;
  tempState: StateModel;
  tempParentState: StateModel;
  tempEvent: EventModel;
  tempEdgeEvent: EventModel;
  childStateEventMap: any;

  // Warning Modal properties
  warningHeader: string;
  warningBody: string;
  
  private subscription: Subscription;
  private subscriptionEntryAction: Subscription;
  private subscriptionApiConfig: Subscription;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
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
  }

  load(): void {
    this.getSourceEntryActions();
    this.getApiConfigLookup();

    if (!this.graphObject || this.graphObject === null) {
      this.graphObject = new GraphObject();
      this.graphObject.statusCd = this.sourceStatusCodes[0],
      this.addNewDataPoint(true);
    }  

    new designFlowEditor(this.graphObject.xml, this.readOnly);
  }  

  getSourceEntryActions() {
    this.subscriptionEntryAction = this.graphService.getEntryActions()
      .subscribe(entryActionList => {
        if (entryActionList) {
          this.sourceEntryActionList = entryActionList;
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
    this.sourceEvents = sourceEvents;

    this.stateDialogTitle = "Add State";
    this.stateDialogButtonName = "Add";

    this.tempState = new StateModel();
    this.tempState.type = this.sourceStateTypes[0];
    this.tempState.allocationModel.allocationType = this.allocationTypes[0];
    
    if (this.sourceEvents && this.sourceEvents.length > 0) {
      this.tempState.trigger.push(this.sourceEvents[0]);
      this.tempState.initialState = false;
    } else {
      this.tempState.initialState = true;
    }
  }

  updateState(state: StateModel): void {
    this.stateDialogTitle = "Update State";
    this.stateDialogButtonName = "Update";
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
    console.log(this.tempEdgeEvent);
    new updateNewEdge(this.tempEdgeEvent);
  }

  deleteEdge() {
    new deleteNewEdge();
  }

  eventsMismatch(newEvents: EventModel[], eventChildMap: any) {
    this.masterEventsList = newEvents;
    this.childStateEventMap = eventChildMap;
    this.sourceEvents = this.fetchUniqueEvents(this.masterEventsList, this.childStateEventMap);
    console.log(newEvents);
    console.log(eventChildMap);
    console.log(this.sourceEvents);
  }

  assignEventToChild(event: EventModel, key: string) {
    this.childStateEventMap[key] = event;
    this.sourceEvents = this.fetchUniqueEvents(this.masterEventsList, this.childStateEventMap);
  }

  fetchUniqueEvents(eventList: EventModel[], eventStateMap: any) {
    const uniqueEventList: EventModel[] = [];

    for (const key in eventStateMap) {
      let unique = true;
      for (const event of eventList) {
        if (key && eventStateMap[key] && eventStateMap[key].eventCd && event && event.eventCd && eventStateMap[key].eventCd === event.eventCd) {
          unique = false;
          break;
        }
      }

      if (unique) {
        uniqueEventList.push(eventStateMap[key].eventCd);
      }
    }

    return uniqueEventList;
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
      this.stateCount++;
      this.tempState.stateId = 'state' + this.stateCount;
      const customObject: Object = JSON.parse(JSON.stringify(this.tempState));  // Very important line of code, don't remove
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

  showAppJSWarning(header: string, body: string) {
    this.warningHeader = header;
    this.warningBody = body;
  }
}
