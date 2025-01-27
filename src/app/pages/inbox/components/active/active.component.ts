import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';
import { BaThemeSpinner } from '../../../../theme/services';

@Component({
  selector: 'api-inbox-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.scss']
})

export class ActiveComponent implements OnInit, OnDestroy {
  groupStates: State[];
  personalStates: State[];
  loadingGroup: boolean = false;
  loadingPersonal: boolean = false;
  groupHeaderParamList: string[];
  personalHeaderParamList: string[];
  progressBarFlag: boolean = false;
  pageNumber: any;
  fetchRecords: any;
  personalFetched: boolean = false;
  groupFetched: boolean = false;

  TAB_GROUP = 'Group';
  TAB_PERSONAL = 'Personal';

  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  constructor(private stateService: StateService, private baThemeSpinner: BaThemeSpinner) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {

    //this.baThemeSpinner.show();
    this.progressBarFlag = true;
    //this.baThemeSpinner.show();
    this.pageNumber = 0
    this.fetchRecords = 10
    // this.fetchData(this.pageNumber, this.fetchRecords);
    this.fetchRecordsFor(this.TAB_PERSONAL, this.personalStates);
  }

  ngOnDestroy(): void {
    if (this.subscriptionGroup && !this.subscriptionGroup.closed) {
      this.subscriptionGroup.unsubscribe();
    }
    if (this.subscriptionPersonal && !this.subscriptionPersonal.closed) {
      this.subscriptionPersonal.unsubscribe();
    }
  }

  fetchData(pageNumber, fetchRecords): void {
    this.loadingPersonal = true;
    this.loadingGroup = true;

    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Group', pageNumber, fetchRecords)
      .subscribe(states => {
        this.loadingGroup = false;
        this.groupStates = states;

        if (!this.loadingGroup && !this.loadingPersonal) {
          this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingGroup = false;
        if (!this.loadingGroup && !this.loadingPersonal) {
          this.baThemeSpinner.hide();
        }
      });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Personal', pageNumber, fetchRecords)
      .subscribe(states => {
        this.loadingPersonal = false;
        this.personalStates = states;
        if (this.personalStates != null && this.personalStates.length > 0 && this.personalStates[0].headerParamList != null) {
          this.personalHeaderParamList = this.personalStates[0].headerParamList;
        }

        if (!this.loadingGroup && !this.loadingPersonal) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      }, error => {
        this.loadingPersonal = false;
        if (!this.loadingGroup && !this.loadingPersonal) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }
      });

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
        if (!this.loadingGroup && !this.loadingPersonal) {
          this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingGroup = false;
        if (!this.loadingGroup && !this.loadingPersonal) {
          this.baThemeSpinner.hide();
        }
      });
  }

  onSelect(selectedData: State): void {

  }

  fetchRecordsFor(tabName: string, existingRecords: State[]) {
    if (!tabName || tabName == null || tabName.trim().length == 0) {
      return;
    }
    else if (tabName === this.TAB_PERSONAL) {
      if (this.personalFetched) {
        return;
      } else {
        this.personalFetched = true;
      }
    }
    else if (tabName === this.TAB_GROUP) {
      if (this.groupFetched) {
        return;
      } else {
        this.groupFetched = true;
      }
    }

    if (existingRecords == null) {
      existingRecords = [];
    }

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', tabName, 0, this.fetchRecords)
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
