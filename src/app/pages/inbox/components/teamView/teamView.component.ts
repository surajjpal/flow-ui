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
    selector: 'api-inbox-team-view',
    templateUrl: './teamView.component.html',
    providers: [FetchUserService],
    styleUrls: ['./teamView.scss'],
  })
  
  export class TeamViewComponent implements OnInit, OnDestroy {

    sortBy = '';
    sortOrder = 'asc';
    filterQuery = '';
  
    @Input()
    rawDataArray: Map<string, string>[];
  
    @Input()
    isLoading: Boolean = false;
  
    @Output()
    selectedData: EventEmitter<any> = new EventEmitter<any>();
  
    selectedState: State;
    selectedFlagState:State;
    selectedStateCd: string;
    assignedStates: State[];
    unassignedStates: State[];
    flaggedStates: State[];
    UserChildren:UserHierarchy[];
    loadingAssigned: boolean = false;
    loadingUnassigned: boolean = false;
    loadingFlagged: boolean = false;
    unassignedHeaderParamList: string[];
    assignedHeaderParamList: string[];
    flaggedHeaderParamList:string[]=[];
    progressBarFlag: boolean = false;
    pageNumber :any;
    fetchRecords:any;
    type:string;
    
    private subscriptionGroup: Subscription;
    private subscriptionPersonal: Subscription;
    private subscriptionUsers: Subscription;
    private subscriptionXML: Subscription;

    constructor(private stateService: StateService, private baThemeSpinner: BaThemeSpinner,private fetchUserService: FetchUserService,private dataCachingService: DataCachingService,private router: Router,private route: ActivatedRoute) {
        
      this.assignedStates = [];
      this.unassignedStates = [];
      this.flaggedStates = [];
      this.UserChildren = [];
      this.unassignedHeaderParamList = [];
      this.assignedHeaderParamList = [];
      
      
    }
  

    ngOnInit(): void {
        this.getUserChildren()
        this.progressBarFlag = true;
        //this.baThemeSpinner.show();
        this.pageNumber = 0
        this.fetchRecords = 10
        this.type = "TEAM"

        
    }
    
    ngOnDestroy(): void {
        
    }

    fetchData():void{
        this.loadingAssigned = true;
        this.loadingUnassigned = true;
        this.loadingFlagged = true;
        this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('ASSIGNED','ACTIVE',this.pageNumber,this.fetchRecords,this.type)
          .subscribe(states => {
            this.loadingAssigned = false;
            this.assignedStates = states;
            
            if (this.assignedStates != null && this.assignedStates.length > 0 && this.assignedStates[0].headerParamList != null) {
              this.unassignedHeaderParamList = this.assignedStates[0].headerParamList;
            }
    
            if (!this.loadingAssigned && !this.loadingUnassigned && !this.loadingFlagged) {
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
    
        this.subscriptionPersonal = this.stateService.getStatesBySubStatusAndFolder('UNASSIGNED','ACTIVE',this.pageNumber,this.fetchRecords,this.type)
          .subscribe(states => {
            this.loadingUnassigned = false;
            this.unassignedStates = states;
            if (this.unassignedStates != null && this.unassignedStates.length > 0 && this.unassignedStates[0].headerParamList != null) {
              this.assignedHeaderParamList = this.unassignedStates[0].headerParamList;
            }
    
            if (!this.loadingAssigned && !this.loadingUnassigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
          }, error => {
            this.loadingUnassigned = false;
            if (!this.loadingAssigned && !this.loadingUnassigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
          });

          this.subscriptionGroup = this.stateService.getStatesBySubStatusAndFolder('FLAGGED','CLOSED',this.pageNumber,this.fetchRecords,this.type)
          .subscribe(states => {
            this.loadingFlagged = false;
            this.flaggedStates = states;
            
            if (this.flaggedStates != null && this.flaggedStates.length > 0 && this.flaggedStates[0].headerParamList != null) {
              this.flaggedHeaderParamList = this.flaggedStates[0].headerParamList;
            }
    
            if (!this.loadingAssigned && !this.loadingUnassigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
    
          }, error => {
            this.loadingUnassigned = false;
            if (!this.loadingAssigned && !this.loadingUnassigned && !this.loadingFlagged) {
              this.progressBarFlag = false;
              // this.baThemeSpinner.hide();
            }
          });
    
    }

    getUserChildren():void{
        this.subscriptionUsers = this.fetchUserService.getUserChildren()
        .subscribe(userChildren => {
          if (userChildren && userChildren.length > 0) {
            this.UserChildren = userChildren;
            this.fetchData()
          }
          else{
            this.progressBarFlag = false;
          }
        });
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

    loadMore(substatus):void{
          
        this.pageNumber = this.pageNumber + 1; 

        if (substatus == 'FlAGGED'){
          this.subscriptionPersonal = this.stateService.getStatesBySubStatusAndFolder(substatus,'CLOSED',this.pageNumber,this.fetchRecords,this.type)
          
            .subscribe(states => {
              this.assignedStates = this.assignedStates.concat(states)
           });
          }

        else{
          this.subscriptionPersonal = this.stateService.getStatesBySubStatusAndFolder(substatus,'ACTIVE',this.pageNumber,this.fetchRecords,this.type)
        
          .subscribe(states => {
            
            if(substatus=='ASSIGNED'){
              this.assignedStates = this.assignedStates.concat(states)
            }
            else if(substatus=='UNASSIGNED'){
              this.unassignedStates = this.unassignedStates.concat(states)
            }
          });
        }
        }

        onSelectUnFlag(state):void{
          this.selectedFlagState = state
          this.selectedFlagState.statusCd = "CLOSED"
          
        }

        moveToArchive():void{
          this.subscriptionXML = this.stateService.saveFlaggedState(this.selectedFlagState)
          .subscribe(State => {
            new closeModal('flagWarningModal');
            this.router.navigate(['/pg/tsk/pervi'], { relativeTo: this.route });
          });
        }
  }