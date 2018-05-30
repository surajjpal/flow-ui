declare var closeModal: any;
declare var showModal: any;

import { Component, OnInit, OnDestroy,Input, Output,NgZone,EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from '../../../../models/tasks.model';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import {BaThemeSpinner } from '../../../../theme/services';
import { UserHierarchy } from '../../../../models/user.model';
import { FetchUserService } from '../../../../services/userhierarchy.service';
import { GraphObject, DataPoint, StateModel, ManualAction,StateInfoModel } from '../../../../models/flow.model';

@Component({
  selector: 'api-inbox-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.scss']
})

export class PersonalComponent implements OnInit, OnDestroy {
  sortBy = '';
  sortOrder = 'asc';
  filterQuery = '';

  @Input()
  rawDataArray: Map<string, string>[];

  @Input()
  isLoading: Boolean = false;

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();
  
  
  selectedStateForFlag: State;
  selectedState: State;
  selectedStateCd: string;
  unassignedStates: State[];
  actionMap: any;
  fieldKeyMap:any;
  assignedStates: State[];
  flaggedStates:State[];
  loadingUnassigned: boolean = false;
  loadingAssigned: boolean = false;
  loadingFlagged:boolean = false;
  unassignedHeaderParamList: string[];
  assignedHeaderParamList: string[];
  flaggedHeaderParamList:string[]=[];
  dataPoints: DataPoint[];
  progressBarFlag: boolean = false;
  pageNumber:any;
  fetchRecords:any;
  graphObject: GraphObject;
  iterationLevel:number;
  responseError: string;
  FlagReasons: string[] = ['Customer did not answer','Customer not reachable','Customer rescheduled'];

  private subscription: Subscription;
  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;
  private subscriptionXML: Subscription;

  constructor(private stateService: StateService, private baThemeSpinner: BaThemeSpinner,private dataCachingService: DataCachingService,private router: Router,private route: ActivatedRoute) {
    this.unassignedStates = [];
    this.assignedStates = [];
    this.unassignedHeaderParamList = [];
    this.assignedHeaderParamList = [];
    this.flaggedStates = [];
    //this.selectedStateForFlag = State;
  }

  ngOnInit(): void {
    //this.baThemeSpinner.show();
    this.progressBarFlag = true;
    //this.baThemeSpinner.show();
    this.pageNumber = 0
    this.fetchRecords = 10
    this.fetchData(this.pageNumber,this.fetchRecords);
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }
  }

  refresh(){
    this.progressBarFlag = true;
    this.pageNumber = 0
    this.fetchRecords = 10
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
    this.loadingAssigned = true;
    this.loadingUnassigned = true;
    this.loadingFlagged = true
    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Group',pageNumber,fetchRecords)
      .subscribe(states => {
        this.loadingUnassigned = false;
        this.unassignedStates = states;
        if (this.unassignedStates != null && this.unassignedStates.length > 0 && this.unassignedStates[0].headerParamList != null) {
          this.unassignedHeaderParamList = this.unassignedStates[0].headerParamList;
        }

        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingUnassigned = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Personal',pageNumber,fetchRecords)
      .subscribe(states => {
        this.loadingAssigned = false;
        this.assignedStates = states;
        if (this.assignedStates != null && this.assignedStates.length > 0 && this.assignedStates[0].headerParamList != null) {
          this.assignedHeaderParamList = this.assignedStates[0].headerParamList;
        }

        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged)  {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      }, error => {
        this.loadingAssigned = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });
     

      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED','CLOSED',this.pageNumber,this.fetchRecords,'PERSONAL')
      .subscribe(states => {
        this.loadingFlagged = false;
        this.flaggedStates = states;
        if (this.flaggedStates != null && this.flaggedStates.length > 0 && this.flaggedStates[0].headerParamList != null) {
          this.flaggedHeaderParamList = this.flaggedStates[0].headerParamList;
        }

        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingUnassigned = false;
        if (!this.loadingUnassigned && !this.loadingAssigned && !this.loadingFlagged) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });

  }

  
  loadMore(status,type):void{
    this.loadingAssigned = true;
    this.loadingUnassigned = true;
    this.pageNumber = this.pageNumber + 1; 
    if (status!="FLAGGED"){
      this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status,type,this.pageNumber,this.fetchRecords)
      .subscribe(states => {
        
        
        if(type=='Group'){
          this.unassignedStates = this.unassignedStates.concat(states)
          this.loadingUnassigned = false;
        }
        else if(type=='Personal'){
          this.assignedStates = this.assignedStates.concat(states)
          this.loadingAssigned = false;
        }
        if(!this.loadingUnassigned && !this.loadingAssigned){
          this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingUnassigned = false;
        if(!this.loadingUnassigned && !this.loadingAssigned){
          this.baThemeSpinner.hide();
        }
      });
    }
    else{
      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED','CLOSED',this.pageNumber,this.fetchRecords,'PERSONAL')
      .subscribe(states => {
      this.flaggedStates = this.flaggedStates.concat(states) 
      });

    }
  }
  onSelect(selectedData: any): void {
    this.selectedData.emit(selectedData);
    this.selectedState = selectedData;
    this.selectedStateCd = selectedData.stateCd;

    this.subscriptionXML = this.stateService.getXMLforActiveState(selectedData.stateMachineInstanceModelId)
      .subscribe(graphObject => {
        this.dataCachingService.setSharedObject(graphObject, this.selectedState);
        this.router.navigate(['/pg/tsk/tdts'], { relativeTo: this.route });
      });
  }

  goBack(): void {
    new closeModal('detailsModal');
    this.ngOnInit();
  }


  selectedForFlag(state):void{
    this.selectedStateForFlag = state;
    this.subscriptionXML = this.stateService.getXMLforActiveState(state.stateMachineInstanceModelId)
    .subscribe(graphObject => {
      this.dataCachingService.setSharedObject(graphObject, state);
      this.graphObject = graphObject
      
    });
  }

  onReasonSelect(reason):void{
    this.selectedStateForFlag.flagReason = reason;
  }


  extractParams() {
    if (this.selectedStateForFlag) {
      if (!this.actionMap) {
        this.actionMap = {};
      }
      if (!this.fieldKeyMap) {
        this.fieldKeyMap = {};
      }
      if (!this.dataPoints) {
        this.dataPoints = [];
      }

      if (this.selectedStateForFlag.parameters && this.graphObject.dataPointConfigurationList) {
        for (const dataPoint of this.graphObject.dataPointConfigurationList) {
          const paramValue: any = this.selectedStateForFlag.parameters[dataPoint.dataPointName];

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
          this.dataPoints.push(dataPoint);

          this.fieldKeyMap[dataPoint.dataPointName] = dataPoint.dataPointLabel;
        }
      }
    }
  }

  updateFlow() {
    if (!this.actionMap) {
          this.actionMap = {};
        }
    
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
        
        // this.subscription = this.stateService.update(this.selectedStateForFlag.machineType, this.selectedStateForFlag.entityId, this.actionMap)
        //   .subscribe(response => {
        //     this.responseError = '';
    
        //     const state: State = response;
    
        //     if (state) {
        //       if (state.errorMessageMap) {
        //         for (const key in state.errorMessageMap) {
        //           if (key) {
        //             const errorList: string[] = state.errorMessageMap[key];
    
        //             this.responseError += `${this.fieldKeyMap[key]}<br>`;
        //             for (const error of errorList) {
        //               this.responseError += `  - ${error}<br>`;
        //             }
        //           }
        //         }
    
        //         if (!this.responseError || this.responseError.length <= 0) {
        //           new showModal('successModalPersonal');
        //         }
        //       } else {
        //         new showModal('successModalPersonal');
        //       }
        //     } else {
        //       new showModal('successModalPersonal');
        //     }
        //   });
      }
  
  onBack() {
   
  }

  confirm():void{
    this.selectedStateForFlag.flagged = true;
    this.iterationLevel = this.selectedStateForFlag.iterationLevel;
    this.iterationLevel = this.iterationLevel + 1;
    this.selectedStateForFlag.iterationLevel = this.iterationLevel;
    this.selectedStateForFlag.subStatus = "FLAGGED"
    this.extractParams();
    this.updateFlow();
    this.subscriptionXML = this.stateService.saveFlaggedState(this.selectedStateForFlag,this.actionMap)
    .subscribe(state => {
      
      console.log(state)
     // this.selectedStateForFlag = state;
      new closeModal('flagModal');
      new showModal('successModalPersonal');
    });
  }
}
