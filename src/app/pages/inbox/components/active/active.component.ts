import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';
import {BaThemeSpinner } from '../../../../theme/services';

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

  private subscriptionGroup: Subscription;
  private subscriptionPersonal: Subscription;

  constructor(private stateService: StateService,private baThemeSpinner: BaThemeSpinner) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {
    this.baThemeSpinner.show();
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

    this.subscriptionGroup = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Group')
    .subscribe(states => {
      this.loadingGroup = false;
      this.groupStates = states;

      if(!this.loadingGroup && !this.loadingPersonal){
        this.baThemeSpinner.hide();
      }

    }, error => {
      this.loadingGroup = false;
      if(!this.loadingGroup && !this.loadingPersonal){
        this.baThemeSpinner.hide();
      }
    });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Personal')
    .subscribe(states => {
      this.loadingPersonal = false;
      this.personalStates = states;
      if(!this.loadingGroup && !this.loadingPersonal){
        this.baThemeSpinner.hide();
      }
    }, error => {
      this.loadingPersonal = false;
      if(!this.loadingGroup && !this.loadingPersonal){
        this.baThemeSpinner.hide();
      }
    });
  }

  onSelect(selectedData: State): void {
    
  }
}
