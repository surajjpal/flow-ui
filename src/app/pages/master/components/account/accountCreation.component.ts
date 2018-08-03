import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { Account } from '../../../../models/account.model';
import { User } from '../../../../models/user.model';
import { AccountService } from '../../../../services/setup.service';
import { AuthService } from '../../../../services/auth.service';
import { AlertService,DataSharingService } from '../../../../services/shared.service';

@Component({
  selector: 'api-agent-account',
  templateUrl: './accountCreation.component.html'
})
export class AccountCreationComponent implements OnInit, OnDestroy {

  account: Account;
  createMode: boolean;
  
  private subscription: Subscription;

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private alertService: AlertService,
    private sharingService: DataSharingService
  ) {
    this.account = new Account();
  }

  ngOnInit(): void {
    const account: Account = this.sharingService.getSharedObject();
    if (account) {
      this.createMode = false;
      this.account = account;  
    } else {
      this.createMode = true;
      this.account = new Account();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  createAccount() {
    if(this.createMode)
    {
    this.subscription = this.accountService.saveAccount(this.account)
      .subscribe(response => {
        if (response && response._id) {
            this.createUserForCompany(response);
          
        }
      });
    }
    else{
      this.subscription = this.accountService.updateAccount(this.account)
      .subscribe(response => {
        if (response && response._id) {
            this.createUserForCompany(response);
          
        }
      });
    }
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
