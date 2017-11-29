import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Account } from '../../../../models/account.model';
import { AccountService } from '../../../../services/setup.service';

@Component({
  selector: 'api-agent-account',
  templateUrl: './accountCreation.component.html'
})
export class AccountCreationComponent implements OnInit, OnDestroy {

  account: Account;

  private subscription: Subscription;

  constructor(
    private accountService: AccountService
  ) {
    this.account = new Account();
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  resetFields() {
    this.account = new Account();
  }

  createAccount() {
    this.subscription = this.accountService.saveAccount(this.account)
      .subscribe(response => {
        if (response) {
          this.resetFields();
        }
      });
  }
}
