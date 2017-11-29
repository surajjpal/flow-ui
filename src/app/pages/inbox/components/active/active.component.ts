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
  private groupStates: State[];
  private personalStates: State[];

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
    this.subscriptionGroup = this.stateService.getStatesByFolder('Group')
    .subscribe(states => {
      this.groupStates = states;
    });

    this.subscriptionPersonal = this.stateService.getStatesByFolder('Personal')
    .subscribe(states => {
      this.personalStates = states;
    });
  }

  onSelect(selectedData: State): void {
    
  }
}
