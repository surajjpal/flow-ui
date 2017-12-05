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

  private closedStates: State[];

  private subscription: Subscription;

  constructor(private stateService: StateService) {
    this.closedStates = [];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  fetchData(): void {
    this.subscription = this.stateService.getStatesByStatus('CLOSED')
      .subscribe(states => {
        this.closedStates = states;
      });
  }

  onSelect(selectedData: State): void {
    if (selectedData) {

    }
  }
}
