import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';

@Component({
  selector: 'api-inbox-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.scss']
})

export class ArchivedComponent implements OnInit, OnDestroy {
  groupStates: State[];
  personalStates: State[];
  loadingGroup: boolean = false;
  loadingPersonal: boolean = false;
  pageNumber :any;
  fetchRecords:any;
  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  constructor(private stateService: StateService) {
    this.groupStates = [];
    this.personalStates = [];
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
}
