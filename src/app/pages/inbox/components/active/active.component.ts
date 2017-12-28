import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../../../services/inbox.service';

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

  constructor(private stateService: StateService) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {
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
    }, error => {
      this.loadingGroup = false;
    });

    this.subscriptionPersonal = this.stateService.getStatesByStatusAndFolder('ACTIVE', 'Personal')
    .subscribe(states => {
      this.loadingPersonal = false;
      this.personalStates = states;
    }, error => {
      this.loadingPersonal = false;
    });
  }

  onSelect(selectedData: State): void {
    
  }
}
