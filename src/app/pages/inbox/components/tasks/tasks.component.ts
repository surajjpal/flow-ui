import { Component, OnInit } from '@angular/core';

import { State } from '../../inbox.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-tasks',
  templateUrl: './tasks.component.html'
})

export class TasksComponent implements OnInit {

  tableTitle: string = '';
  states: Map<string, string>[] = [];
  parameterKeys: Map<string, string> = new Map();
  objectKeys = Object.keys;
  selectedData: State;

  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    this.tableTitle = 'Queue';
    this.fetchData();
  }

  fetchData(): void {
    try {
      this.stateService.getStatesforfolder('lead')
      .then(states => {
        this.states = states;
      });

      this.stateService.getParamforfolder('lead')
      .then(parameterKeys => {
        this.parameterKeys = parameterKeys;
      });
    } catch (e) {
      alert(e.message);
    }
  }
  onSelect(selectedData: any): void {

  }
}
