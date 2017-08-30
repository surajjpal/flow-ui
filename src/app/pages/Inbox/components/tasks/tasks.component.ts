import { Component, OnInit } from '@angular/core';

import { State } from '../../inbox.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-tasks',
  templateUrl: './tasks.component.html',
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

    // for (let i = 0; i < 10; i++) {
    //   const dict: Map<string, string> = new Map();
    //   dict.set('name', 'Swami Naik ' + i);
    //   dict.set('email', i + 'swami@automatapi.com');

    //   this.states.push(dict);
    // }

    // this.parameterKeys.set('Name', 'name');
    // this.parameterKeys.set('Email Address', 'email');

    // for (const key of this.objectKeys(this.parameterKeys)) {
    //   console.log('Special: ' + key);
    // }
  }

  fetchData(): void {
    try {
      this.stateService.getStatesforfolder('conversation')
      .then(states => {
        this.states = states;
        console.log(this.states);
      });

      this.stateService.getParamforfolder('conversation')
      .then(parameterKeys => {
        this.parameterKeys = parameterKeys;
        console.log(this.parameterKeys);
      });
    } catch (e) {
      alert(e.message);
    }
  }
  onSelect(selectedData: any): void {

  }
}
