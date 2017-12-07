declare var designFlowEditor: any;
declare var styleStates: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { GraphObject, DataPoint, StateModel, ManualAction } from '../../../../models/flow.model';

import { StateService, DataCachingService } from '../../../../services/inbox.service';

@Component({
  selector: 'api-task-details',
  templateUrl: './taskDetails.component.html',
  styleUrls: ['./taskDetails.scss']
})

export class TaskDetailsComponent implements OnInit, OnDestroy {

  selectedState: State;
  manualActions: ManualAction[];
  actionMap: any;
  graphObject: GraphObject;
  parameterKeys: Map<string, string> = new Map();

  private subscription: Subscription;

  constructor(
    private stateService: StateService,
    private dataCachingService: DataCachingService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }

    this.selectedState = this.dataCachingService.getSelectedState();
    if (!this.selectedState) {
      this.selectedState = new State();
    }

    this.extractManualActionForCurrentState();

    this.initUI();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  onBack() {
    this.location.back();
  }

  extractManualActionForCurrentState() {
    if (this.graphObject.states) {
      for (const state of this.graphObject.states) {
        if (state && state.stateCd && state.manualActions && this.selectedState.stateCd && this.selectedState.stateCd === state.stateCd) {
          this.manualActions = state.manualActions;
          break;
        }
      }
    }

    if (!this.manualActions) {
      this.manualActions = [];
    }

    if (!this.actionMap) {
      this.actionMap = {};
    }

    for (const action of this.manualActions) {
      this.actionMap[action.key] = '';
    }
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
  }

  updateFlow() {
    if (!this.actionMap) {
      this.actionMap = {};
    }

    this.subscription = this.stateService.update(this.selectedState.machineType,
      this.selectedState.entityId, this.actionMap)
      .subscribe(state => {
        this.onBack();
      });
  }
}
