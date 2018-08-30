import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';
import { ActivityMonitorService } from 'app/services/activitymonitor.service';
import { DataPoint, GraphObject } from 'app/models/flow.model';


@Component({
    selector: 'apiarchivedmaster',
    templateUrl: './archivedmaster.component.html',
    styleUrls: ['./archivedmaster.scss']
  })
export class ArchiveMasterComponent implements OnInit, OnDestroy {

    className = "tablinks active";

    groupStates: State[];
  personalStates: State[];
  loadingGroup: boolean = false;
  loadingPersonal: boolean = false;
  pageNumber :any;
  fetchRecords:any;
  personalStatesTabClass: string[];
  personalTaskDetail: State;
  businessDataPoints: DataPoint[];
  graphObjects = new Map();
  graphObject: GraphObject;
  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  progressBarFlag: boolean = false;

  constructor
  (
      private stateService: StateService,
      private activityMonitorService: ActivityMonitorService
  ) {
    this.groupStates = [];
    this.personalStates = [];
    this.personalStatesTabClass = [];
    this.personalTaskDetail = new State();
    this.graphObject = new GraphObject();
  }

  ngOnInit(): void {
    this.pageNumber= 0;
    this.fetchRecords = 1;
    this.fetchData(this.pageNumber,this.fetchRecords);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGroup && !this.subscriptionGroup.closed) {
      this.subscriptionGroup.unsubscribe();
    }
    if (this.subscriptionPersonal && !this.subscriptionPersonal.closed) {
      this.subscriptionPersonal.unsubscribe();
    }
  }

  fetchData(pageNumber,fetchRecords): void {
    this.loadingPersonal = true;
    this.loadingGroup = true;

    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('CLOSED', 'Group',pageNumber,fetchRecords)
    .subscribe(states => {
      this.loadingGroup = false;
      this.groupStates = states;

    }, error => {
      this.loadingGroup = false;
    });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('CLOSED', 'Personal',pageNumber,fetchRecords)
    .subscribe(states => {
      this.loadingPersonal = false;
      this.setFirstElementValues(states);
      this.personalStates = states;
      
    }, error => {
      this.loadingPersonal = false;
    });
  }

  setFirstElementValues(states) {
    if (states != null && states.length > 0) {
        this.personalTaskDetail = states[0];
        this.personalStatesTabClass.push("tablinks active");
        this.stateService.getDataPointconfigurationFromFlowInstanceId(this.personalTaskDetail.stateMachineInstanceModelId)
                .subscribe(
                    response => {
                        this.graphObjects.set(this.personalTaskDetail.stateMachineInstanceModelId, response);
                        this.graphObject = response;
                        for(let i=1; i<states.length; i++) {
                            this.personalStatesTabClass[i] = "tablinks";
                            this.setGraphObjects(states[i]);
                        }
                    },
                    error => {
                        console.log("graph object not found");
                    }
                )

    }
    
  }

  loadMore(status,type):void{
    this.loadingPersonal = true;
    this.loadingGroup = true;
    this.pageNumber = this.pageNumber + 1; 
    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status,type,this.pageNumber,this.fetchRecords)
    .subscribe(states => {
      this.loadingGroup = false;
      if(type=='Group'){
        this.groupStates = this.groupStates.concat(states)
      }
      else if(type=='Personal'){
        for(let i=this.personalStates.length; i<this.personalStates.length + states.length; i++) {
            console.log(i);
            if (i != 0) {
                this.personalStatesTabClass[i] = "tablinks";
                this.setGraphObjects(states[this.personalStates.length - i]);
            }
            
        }
        this.personalStates = this.personalStates.concat(states)
        
      }
      
     

    }, error => {
      this.loadingGroup = false;
     
    });
  }

  onSelect(selectedData: State): void {

  }

    onPersonalSubjectSelect(stateId) {
        for (let i=0; i<this.personalStates.length; i++) {
            if (this.personalStates[i]._id == stateId) {
                this.personalTaskDetail = this.personalStates[i];
                this.personalStatesTabClass[i] = "tablinks active";
                this.graphObject = this.graphObjects.get(this.personalStates[i].stateMachineInstanceModelId);
            }
            else {
                this.personalStatesTabClass[i] = "tablinks";
            }
        }
        
    }

    getBusinessKey(stateMachineInstanceModelId: string) {
        if (this.graphObjects.get(stateMachineInstanceModelId) != null) {
            const dataPoints = this.graphObjects.get(stateMachineInstanceModelId).dataPointConfigurationList;
            for(let data of dataPoints) {
                if (data.businessKeyFlag) {
                    return data.dataPointLabel;
                }
            }
        }
        return "Business key";
    }

    setGraphObjects(state: State) {
        if (this.graphObjects.get(state.stateMachineInstanceModelId) == null) {
            this.stateService.getDataPointconfigurationFromFlowInstanceId(state.stateMachineInstanceModelId)
            .subscribe(
                response => {
                    this.graphObjects.set(state.stateMachineInstanceModelId, response);
                    
                },
                error => {
                    
                }
            )
        }
        else {
            this.graphObjects.set(state.stateMachineInstanceModelId, new GraphObject);
        }
        
    }

    getHeaderFlags() {
        let headerFlags: DataPoint[];
        headerFlags = [];
        for (let dataPoint of this.graphObject.dataPointConfigurationList) {
            if (dataPoint.headerFlag) {
                headerFlags.push(dataPoint);
            }
        }
        return headerFlags;
    }


}  