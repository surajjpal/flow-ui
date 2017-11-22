declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var exportGraphXml: any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject, DataPoint, Classifier, StateModel,
   EventModel, Expression, Transition } from '../../../../models/flow.model';
import { ApiConfig, ApiKeyExpressionMap } from '../../../../models/setup.model';

// Service Imports
import { GraphService, CommunicationService } from '../../flow.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs';

@Component({
  selector: 'api-flow-design',
  templateUrl: './design.component.html'
})

export class DesignComponent implements OnInit, OnDestroy {

  // Service components
  subscription: Subscription;

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
  allocationTypes: string[] = ['Group','Least_Allocated','Maximum_Efficiency','API'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[];
  sourceEntryActionList: string[];
  sourceApiConfigList: ApiConfig[];

  // Models to bind with html
  readOnly: boolean;
  graphObject: GraphObject;
  tempGraphObject: GraphObject;
  tempState: StateModel;
  tempParentState: StateModel;
  tempEvent: EventModel;

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
    this.graphService.getEntryActions()
      .then(
        entryActionList => {
          if (entryActionList) {
            this.sourceEntryActionList = entryActionList;
          }
        },
        error => {
          
        }
      );
  }

  getApiConfigLookup() {
    this.graphService.apiConfigLookup()
    .then(
      apiConfigList => {
        if (apiConfigList && apiConfigList.length > 0) {
          this.sourceApiConfigList = apiConfigList;
        }
      }
    );
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

  addState(state: StateModel, parentState: StateModel): void {
    if (parentState) {
      this.tempParentState = parentState;
    } else {
      this.tempParentState = new StateModel();
    }

    if (state) {
      this.stateDialogTitle = "Update State";
      this.stateDialogButtonName = "Update";
      this.tempState = state;
    } else {
      this.stateDialogTitle = "Add State";
      this.stateDialogButtonName = "Add";

      this.tempState = new StateModel();
      this.tempState.type = this.sourceStateTypes[0];
      this.tempState.allocationModel.allocationType = this.allocationTypes[0];
      this.tempState.trigger = this.tempParentState.events[0];

      if (this.tempParentState.events && this.tempParentState.events.length > 0) {
        this.tempState.initialState = false;
      } else {
        this.tempState.initialState = true;
      }
      // this.addEvent();
    }
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

    if (this.tempState.stateId && this.tempState.stateId.length > 0) {
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

  ngOnDestroy() {
    window['flowComponentRef'] = null;

    // prevent memory leak when component destroyed
    //this.subscription.unsubscribe();
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

  saveGraphXml(xml: string, states: StateModel[], transitions: Transition[]): void {
    if (xml && this.graphObject) {
      this.graphObject.xml = xml;
      this.graphObject.states = states;
      this.graphObject.transitions = transitions;

      this.graphService.save(this.graphObject)
        .then(graphObject => {
          this.graphObject = graphObject;
          this.router.navigate(['/pages/flow/search'], { relativeTo: this.route });
        });
    }
  }

  clearAllData(): void {
    location.reload();
  }

  deepCopy(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }
}
