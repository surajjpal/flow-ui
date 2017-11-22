import { Component, OnInit } from '@angular/core';

import { Account } from '../../../../models/account.model';
import { AccountService } from '../../master.service';

@Component({
  selector: 'api-agent-account',
  templateUrl: './accountCreation.component.html'
})
export class AccountCreationComponent implements OnInit {

  account: Account;

  constructor(
    private accountService: AccountService
  ) {
    this.account = new Account();
  }

  ngOnInit() {

  }

  resetFields() {
    this.account = new Account();
  }

  createAccount() {
    this.accountService.saveAccount(this.account)
      .then(
        response => {
          if (response) {
            this.resetFields();
          }
        }
      );
  }
}
