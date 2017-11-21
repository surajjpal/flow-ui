import { Component, OnInit } from '@angular/core';

import { State } from '../../inbox.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.scss']
})

export class TasksComponent implements OnInit {

  states: State[] = [];

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    try {
      this.stateService.getStatesByFolder('Group')
      .then(states => {
        this.states = states;
      });
    } catch (e) {
      alert(e.message);
    }
  }
  onSelect(selectedData: any): void {

  }
}
