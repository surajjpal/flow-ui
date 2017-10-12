declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var exportGraphXml: any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject, DataPoint, Classifier, StateModel, EventModel, Expression, Transition } from '../../flow.model';

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
  sourceInputTargets: string[] = ['PAYLOAD', 'PARAM'];
  sourceParamTargets: string[] = ['Client', 'Transaction', 'Entity'];
  sourceStateTypes: string[] = ['Manual', 'Auto', 'Cognitive'];
  sourceOperands: string[] = ['AND', 'OR'];
  sourceClassifiers: Classifier[];
  sourceEntryActionList: string[];

  // Models to bind with html
  readOnly: boolean;
  graphObject: GraphObject;
  tempGraphObject: GraphObject;
  tempState: StateModel;
  tempParentState: StateModel;
  tempEvent: EventModel;

  constructor(
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
  }

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.tempGraphObject = new GraphObject();
    this.tempState = new StateModel();
    this.tempParentState = new StateModel();
    this.tempEvent = new EventModel();
    this.sourceClassifiers = [new Classifier(), new Classifier()];

    this.getSourceEntryActions();

    if (!this.graphObject || this.graphObject === null) {
      this.graphObject = new GraphObject();
      this.graphObject.statusCd = this.sourceStatusCodes[0],
      this.addNewDataPoint();
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
    tempExpression.target = this.sourceInputTargets[0];
    tempExpression.expectedResult = '';

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

  addNewDataPoint() {
    this.dataPointCount++;

    const dataPoint: DataPoint = new DataPoint();
    dataPoint.dataPointName = 'Data Point' + this.dataPointCount;
    dataPoint.paramTargetList = [this.sourceParamTargets[0]];
    dataPoint.inputTarget = this.sourceInputTargets[0];

    this.graphObject.dataPointConfigurationList.push(dataPoint);
  }

  deleteDataPoint(dataPoint: DataPoint) {
    const index = this.graphObject.dataPointConfigurationList.indexOf(dataPoint);
    this.graphObject.dataPointConfigurationList.splice(index, 1);
  }

  saveGraphXml(xml: string, states: StateModel[], transitions: Transition[]): void {
    if (xml && this.graphObject) {
      this.graphObject.xml = xml;
      this.graphObject.states = states;
      this.graphObject.transitions = transitions;

      this.graphService.save(this.graphObject)
        .then(graphObject => this.graphObject = graphObject);
    }
  }

  clearAllData(): void {
    location.reload();
  }

  deepCopy(object: Object) {
    return JSON.parse(JSON.stringify(object));
  }
}
