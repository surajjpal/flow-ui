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

  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  progressBarFlag: boolean = false;

  constructor(private stateService: StateService) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {
    this.progressBarFlag = true;
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.subscriptionGroup && !this.subscriptionGroup.closed) {
      this.subscriptionGroup.unsubscribe();
    }
    if (this.subscriptionPersonal && !this.subscriptionPersonal.closed) {
      this.subscriptionPersonal.unsubscribe();
    }
  }

  fetchData(): void {
    this.loadingPersonal = true;
    this.loadingGroup = true;

    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('CLOSED', 'Group')
      .subscribe(states => {
        this.loadingGroup = false;
        this.groupStates = states;

        if (!this.loadingGroup && !this.loadingPersonal) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }

      }, error => {
        this.loadingGroup = false;

        if (!this.loadingGroup && !this.loadingPersonal) {
          this.progressBarFlag = false;
          // this.baThemeSpinner.hide();
        }

      });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('CLOSED', 'Personal')
      .subscribe(states => {
        this.loadingPersonal = false;
        this.personalStates = states;

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

  onSelect(selectedData: State): void {

  }
}
