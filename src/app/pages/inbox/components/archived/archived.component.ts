import { Component, OnInit } from '@angular/core';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-inbox-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.scss']
})

export class ArchivedComponent implements OnInit {

  private closedStates: State[];

  constructor(private stateService: StateService) {
    this.closedStates = [];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    try {
      this.stateService.getStatesByStatus('CLOSED')
      .then(states => {
        this.closedStates = states;
      });
    } catch (e) {
      alert(e.message);
    }
  }

  onSelect(selectedData: State): void {
    if (selectedData) {
      
    }
  }
}
