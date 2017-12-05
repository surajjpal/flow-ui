import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Account } from '../../../../models/account.model';
import { User } from '../../../../models/user.model';
import { AccountService } from '../../../../services/setup.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService } from '../../../../services/shared.service';

@Component({
  selector: 'api-agent-account',
  templateUrl: './accountCreation.component.html'
})
export class AccountCreationComponent implements OnInit, OnDestroy {

  account: Account;

  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private alertService: AlertService
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

  createAccount() {
    this.subscription = this.accountService.saveAccount(this.account)
      .subscribe(response => {
        if (response && response._id) {
          this.createUserForCompany(response);
        }
      });
  }

  createUserForCompany(account: Account) {
    const map = {};
    map['companyId'] = account._id;
    map['email'] = account.loginId;

    this.subscription = this.authService.createCompanyAdmin(map)
      .subscribe(response => {
        if (response && response._id) {
          this.alertService.success('Company account created successfully');
          this.resetFields();
        }
      });
  }

  resetFields() {
    this.account = new Account();
  }
}
