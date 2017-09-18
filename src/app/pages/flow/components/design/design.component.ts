declare var graphTools: any;
declare var saveStateObject: any;
declare var updateStateObject: any;
declare var designFlowEditor: any;
declare var closeModal: any;
declare var exportGraphXml: any;

import { Component, Input, OnInit, OnDestroy, NgZone } from '@angular/core';
import 'rxjs/add/operator/switchMap';

// Model Imports
import { GraphObject, DataPoint, Classifier, StateModel, EventModel, Expression } from '../../flow.model';

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

  // Models to bind with html
  graphObject: GraphObject;
  tempState: StateModel;
  tempParentState: StateModel;
  tempEvent: EventModel;

  constructor(
    private zone: NgZone,
    private graphService: GraphService,
    private communicationService: CommunicationService
  ) {
    window['flowComponentRef'] = { component: this, zone: zone };

    this.graphObject = this.communicationService.getGraphObject();
    if (this.graphObject) {
      this.communicationService.sendGraphObject(null);
    }
  }

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.tempState = {
      id: '',
      stateCd: '',
      name: '',
      type: '',
      trigger: null,
      events: [],
      classifiers: []
    };
    this.tempParentState = {
      id: '',
      stateCd: '',
      name: '',
      type: null,
      trigger: null,
      events: [],
      classifiers: null
    };
    this.tempEvent = {
      eventCd: '',
      operand: '',
      expressions: []
    };
    this.sourceClassifiers = [{
      apiName: 'Temp',
      url: 'temp url'
    }];

    if (!this.graphObject || this.graphObject == null) {
      this.graphObject = {
        _id: null,
        statusCd: this.sourceStatusCodes[0],
        machineType: '',
        version: '',
        xml: '',
        dataPointConfigurationList: []

      };
      this.addNewDataPoint();
    }

    new designFlowEditor(this.graphObject.xml);
  }

  toolsChoice(choice: string): void {
    new graphTools(choice);
  }

  addState(state: StateModel, parentState: StateModel): void {
    if (parentState) {
      this.tempParentState = parentState;
    } else {
      this.tempParentState = {
        id: '',
        stateCd: '',
        name: '',
        type: null,
        trigger: null,
        events: [],
        classifiers: null
      };
    }

    if (state) {
      this.stateDialogTitle = "Update State";
      this.stateDialogButtonName = "Update";
      this.tempState = state;
    } else {
      this.stateDialogTitle = "Add State";
      this.stateDialogButtonName = "Add";

      this.tempState = {
        id: '',
        stateCd: 'State Cd',
        name: 'State Name',
        type: this.sourceStateTypes[0],
        trigger: this.tempParentState.events[0],
        events: [],
        classifiers: this.sourceClassifiers
      };

      this.addEvent();
    }
  }

  addEvent(): void {
    let tempEvent: EventModel = <EventModel>{
      eventCd: 'Event',
      operand: this.sourceOperands[0],
      expressions: []
    };

    this.addExpression(tempEvent);

    this.tempState.events.push(tempEvent);
  }

  addExpression(event: EventModel): void {
    let tempExpression: Expression = <Expression>{
      value: 'Expression',
      target: this.sourceInputTargets[0],
      expectedResult: ''
    };

    event.expressions.push(tempExpression);
  }

  deleteExpression(expression: Expression, event: EventModel): void {
    let index = event.expressions.indexOf(expression);
    event.expressions.splice(index, 1);
  }

  deleteEvent(event: EventModel): void {
    let index = this.tempState.events.indexOf(event);
    this.tempState.events.splice(index, 1);
  }

  saveEvent(): void {
    // console.log(this.tempEvent);
    this.tempState.events.push(this.tempEvent);
  }

  saveState(): void {
    if (this.tempState.id && this.tempState.id.length > 0) {
      new updateStateObject(this.tempState);
    } else {
      this.stateCount++;
      this.tempState.id = 'state' + this.stateCount;
      new saveStateObject(this.tempState);
    }
  }

  save(): void {
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

    let dataPoint: DataPoint = <DataPoint>{
      dataPointName: 'Data Point' + this.dataPointCount,
      expression: '',
      paramTargetList: [this.sourceParamTargets[0]],
      inputTarget: this.sourceInputTargets[0],
      machineType: null
    };

    this.graphObject.dataPointConfigurationList.push(dataPoint);
  }

  deleteDataPoint(dataPoint: DataPoint) {
    let index = this.graphObject.dataPointConfigurationList.indexOf(dataPoint);
    this.graphObject.dataPointConfigurationList.splice(index, 1);
  }

  saveGraphXml(xml: string): void {
    if (xml && this.graphObject) {
      this.graphObject.xml = xml;
      // console.log(this.graphObject);

      this.graphService.save(this.graphObject)
        .then(graphObject => this.graphObject = graphObject);
    }
  }

  clearAllData(): void {
    location.reload();
  }
}
