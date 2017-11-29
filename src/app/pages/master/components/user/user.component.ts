import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataSharingService } from '../../../../services/shared.service';
import { AuthService } from '../../../../services/auth.service';

import { User } from '../../../../models/user.model';

@Component({
  selector: 'api-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.scss']
})

export class UserComponent implements OnInit, OnDestroy {
  userList: User[];
  filterQuery: string;
  selectedUser: User;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sharingService: DataSharingService
  ) {
    this.userList = [];
    this.filterQuery = '';
    this.selectedUser = new User();
  }

  ngOnInit(): void {
    this.subscription = this.authService.getAllUsers()
      .subscribe(userList => {
        if (userList) {
          this.userList = userList;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  onSelect(user: User) {
    if (user && user._id && user._id.length > 0) {
      this.selectedUser = user;

      this.sharingService.setSharedObject(this.selectedUser);
      this.router.navigate(['/pages/master/updateUser'], { relativeTo: this.route });
    }
  }

  createUser() {
    this.router.navigate(['/pages/master/updateUser'], { relativeTo: this.route });
  }
}
