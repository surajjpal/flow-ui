import { Component, OnInit } from '@angular/core';

import { State } from '../../inbox.model';
import { StateService } from '../../inbox.service';

@Component({
  selector: 'api-inbox-archived',
  templateUrl: './archived.component.html',
  styleUrls: ['./archived.scss']
})

export class ArchivedComponent implements OnInit {

  private states: Map<string, string>[];
  private parameterKeys: Map<string, string>;
  private objectKeys: any;
  private selectedData: State;

  constructor(private stateService: StateService) {
    this.states = [];
    this.parameterKeys = new Map();
    this.objectKeys = Object.keys;
    this.selectedData = new State();
  }

  ngOnInit(): void {
    // this.fetchData();
  }

  fetchData(): void {
    try {
      this.stateService.getStatesByFolder('lead')
      .then(states => {
        this.states = states;
      });
    } catch (e) {
      alert(e.message);
    }
  }

  onSelect(selectedData: State): void {
    if (selectedData) {
      this.selectedData = selectedData;
    }
  }
}
