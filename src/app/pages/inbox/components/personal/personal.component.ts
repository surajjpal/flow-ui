declare var closeModal: any;

import { Component, OnInit, OnDestroy,Input, Output,NgZone,EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { State } from '../../../../models/tasks.model';
import { StateService, DataCachingService } from '../../../../services/inbox.service';
import {BaThemeSpinner } from '../../../../theme/services';
import { UserHierarchy } from '../../../../models/user.model';
import { FetchUserService } from '../../../../services/userhierarchy.service';

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
  assignedStates: State[];
  flaggedStates:State[];
  loadingUnassigned: boolean = false;
  loadingAssigned: boolean = false;
  loadingFlagged:boolean = false;
  unassignedHeaderParamList: string[];
  assignedHeaderParamList: string[];
  flaggedHeaderParamList:string[]=[];
  progressBarFlag: boolean = false;
  pageNumber:any;
  fetchRecords:any;
  flagLevel:number;
  FlagReasons: string[] = ['Customer did not answer','Customer not reachable','Customer rescheduled'];

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
     

      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED','ACTIVE',this.pageNumber,this.fetchRecords,'PERSONAL')
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
      this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED','ACTIVE',this.pageNumber,this.fetchRecords,'PERSONAL')
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
  }

  onReasonSelect(reason):void{
    this.selectedStateForFlag.flagReason = reason;
  }

  confirm():void{
    console.log(this.selectedStateForFlag)
    this.selectedStateForFlag.flagged = true;
    this.flagLevel = this.selectedStateForFlag.flagLevel;
    this.flagLevel = this.flagLevel + 1;
    this.selectedStateForFlag.flagLevel = this.flagLevel;
    this.selectedStateForFlag.subStatus = "FLAGGED"
    this.subscriptionXML = this.stateService.saveFlaggedState(this.selectedStateForFlag)
    .subscribe(State => {
      new closeModal('flagModal');
      this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
    });
  }
}
