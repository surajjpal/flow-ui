import { Component, OnInit } from '@angular/core';

import { Account } from '../../agent.model';
import { AgentService } from '../../agent.services';

@Component({
  selector: 'api-agent-account',
  templateUrl: './accountCreation.component.html'
})
export class AccountCreationComponent implements OnInit {

  account: Account;

  constructor(
    private agentService: AgentService
  ) {
    this.account = new Account();
  }

  ngOnInit() {

  }

  resetFields() {
    this.account = new Account();
  }

  createAccount() {
    this.agentService.saveAccount(this.account)
      .then(
        response => {
          if (response) {
            console.log('account created');
            this.resetFields();
          }
        }
      );
  }
}
