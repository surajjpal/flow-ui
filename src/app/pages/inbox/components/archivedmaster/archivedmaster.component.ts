import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';
import { ActivityMonitorService } from 'app/services/activitymonitor.service';
import { DataPoint } from 'app/models/flow.model';


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
  }

  ngOnInit(): void {
    this.pageNumber= 0;
    this.fetchRecords = 10;
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
      this.personalStates = states;
      if (this.personalStates != null && this.personalStates.length > 0) {
          this.personalTaskDetail = this.personalStates[0];
          this.personalStatesTabClass.push("tablinks active");
          for(let i=1; i<this.personalStates.length; i++) {
              this.personalStatesTabClass[i] = "tablinks";
          }
      }
    }, error => {
      this.loadingPersonal = false;
    });
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
            }
            else {
                this.personalStatesTabClass[i] = "tablinks";
            }
        }
        
    }

    getBusinessKey(parameters) {
        return "Contract No";
    }

    getBusinessDataPoints(machinetype: string) {
        this.activityMonitorService.getDataPoints(machinetype)
            .subscribe(
                response => {
                    this.businessDataPoints = response;
                    
                },
                error => {
                    
                }
            )
    }
}  