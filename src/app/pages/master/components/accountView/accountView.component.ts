import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Account } from '../../../../models/account.model';
import { AccountService } from '../../../../services/setup.service';
import { DataSharingService } from '../../../../services/shared.service';


@Component({
  selector: 'account-accountView',
  templateUrl: './accountView.component.html',
  styleUrls: ['./accountView.scss'],
  providers:[AccountService]
})

export class AccountViewComponent implements OnInit, OnDestroy {
  companyList: Account[];
  filterQuery: string;
  selectedCompany: Account;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private sharingService: DataSharingService
  ) {
    this.companyList = [];
    this.filterQuery = '';
    this.selectedCompany = new Account();
  }

  ngOnInit(): void {
    this.subscription = this.accountService.getAllAccounts()
      .subscribe(companyList => {
        if (companyList) {
          this.companyList = companyList;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  onSelect(account: Account) {
    if (account && account._id && account._id.length > 0) {
      this.selectedCompany = account;

      this.sharingService.setSharedObject(this.selectedCompany);
      this.router.navigate(['/pg/stp/stacs'], { relativeTo: this.route });
    }
  }

  createAccount() {
    this.router.navigate(['/pg/stp/stacs'], { relativeTo: this.route });
  }

  publishAccount(account) {
    this.subscription = this.accountService.publishAccount(account)
      .subscribe(response => {
        if (response && response._id) {
         console.log("account published successfully")
          
        }
      });
  }
}
