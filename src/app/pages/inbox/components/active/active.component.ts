import { Component, OnInit } from '@angular/core';

import { State } from '../../../../models/tasks.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-inbox-active',
  templateUrl: './active.component.html',
  styleUrls: ['./active.scss']
})

export class ActiveComponent implements OnInit {
  private groupStates: State[];
  private personalStates: State[];

  constructor(private stateService: StateService) {
    this.groupStates = [];
    this.personalStates = [];
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    try {
      this.stateService.getStatesByFolder('Group')
      .then(states => {
        this.groupStates = states;
      });

      this.stateService.getStatesByFolder('Personal')
      .then(states => {
        this.personalStates = states;
      });
    } catch (e) {
      alert(e.message);
    }
  }

  onSelect(selectedData: State): void {
    
  }
}
