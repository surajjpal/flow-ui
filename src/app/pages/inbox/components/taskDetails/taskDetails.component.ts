declare var designFlowEditor: any;
declare var styleStates: any;

import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { State } from '../../../../models/tasks.model';
import { GraphObject, DataPoint } from '../../../../models/flow.model';

import { StateService, DataSharingService } from '../../inbox.service';

@Component({
  selector: 'api-task-details',
  templateUrl: './taskDetails.component.html',
  styleUrls: ['./taskDetails.scss']
})

export class TaskDetailsComponent implements OnInit {

  selectedState: State;
  graphObject: GraphObject;
  parameterKeys: Map<string, string> = new Map();

  constructor(
    private stateService: StateService,
    private dataSharingService: DataSharingService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.graphObject = this.dataSharingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }

    this.selectedState = this.dataSharingService.getSelectedState();
    if (!this.selectedState) {
      this.selectedState = new State();
    }

    this.getParamsFromGraphObject();

    this.initUI();
  }

  onBack() {
    this.location.back();
  }

  getParamsFromGraphObject() {
    // extract business param from graphObject
    
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
  }
}
