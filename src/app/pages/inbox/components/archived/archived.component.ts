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
  pageNumber: any;
  fetchRecords: any;
  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  progressBarFlag: boolean = false;

  TAB_ASSIGNED = 'Personal';
  TAB_UNASSIGNED = 'Group';
  personalFetched = false;
  groupFetched = false;

  constructor(private stateService: StateService) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {
    this.pageNumber = 0;
    this.fetchRecords = 10;
    this.fetchRecordsFor(this.TAB_ASSIGNED, this.personalStates);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGroup && !this.subscriptionGroup.closed) {
      this.subscriptionGroup.unsubscribe();
    }
    if (this.subscriptionPersonal && !this.subscriptionPersonal.closed) {
      this.subscriptionPersonal.unsubscribe();
    }
  }

  loadMore(status, type): void {
    this.loadingPersonal = true;
    this.loadingGroup = true;
    this.pageNumber = this.pageNumber + 1;
    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder(status, type, this.pageNumber, this.fetchRecords)
      .subscribe(states => {
        this.loadingGroup = false;
        if (type == 'Group') {
          this.groupStates = this.groupStates.concat(states)
        }
        else if (type == 'Personal') {
          this.personalStates = this.personalStates.concat(states)
        }



      }, error => {
        this.loadingGroup = false;

      });
  }

  onSelect(selectedData: State): void {

  }

  fetchRecordsFor(tabName: string, existingRecords: State[]) {
    if (!tabName || tabName == null || tabName.trim().length == 0) {
      return;
    }
    else if (tabName === this.TAB_ASSIGNED) {
      if (this.personalFetched) {
        return;
      } else {
        this.personalFetched = true;
      }
    }
    else if (tabName === this.TAB_UNASSIGNED) {
      if (this.groupFetched) {
        return;
      } else {
        this.groupFetched = true;
      }
    } else {
      return;
    }

    if (existingRecords == null) {
      existingRecords = [];
    }

    this.progressBarFlag = true;
    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('CLOSED', tabName, 0, this.fetchRecords)
      .subscribe(states => {
        this.progressBarFlag = false;
        for (const state of states) {
          existingRecords.push(state);
        }
      }, error => {
        this.progressBarFlag = false;
      });
  }
}
