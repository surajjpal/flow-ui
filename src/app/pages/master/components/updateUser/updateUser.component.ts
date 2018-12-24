import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { DataSharingService, AlertService, UniversalUser } from '../../../../services/shared.service';
import { AuthService } from '../../../../services/auth.service';

import { User } from '../../../../models/user.model';

import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'api-update-user',
  templateUrl: './updateUser.component.html'
})

export class UpdateUserComponent implements OnInit, OnDestroy {
  selectedUser: User;
  authorityList: string[];

  passwordPlaceholder: string;
  formHeader: string;
  buttonName: string;

  slaUnitType: string[] = ['MINUTE', 'HOUR', 'WEEK', 'MONTH', 'YEAR'];


  updateMode: boolean;
  profileEditMode: boolean = false;

  private userSubscription: Subscription;
  private routeSubscription: Subscription;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
    private sharingService: DataSharingService,
    private universalUser: UniversalUser,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.selectedUser = new User();
  }

  ngOnInit() {
    this.initUI();
  }

  ngOnDestroy() {
    if (this.userSubscription && !this.userSubscription.closed) {
      this.userSubscription.unsubscribe();
    }
    if (this.routeSubscription && !this.routeSubscription.closed) {
      this.routeSubscription.unsubscribe();
    }
  }

  initUI() {
    this.routeSubscription = this.route
      .params
      .subscribe(params => {
        this.profileEditMode = (params['prf'] === 'prf');
        this.goAhead();
      });
  }

  goAhead() {
    if (!this.profileEditMode) {
      const user = this.sharingService.getSharedObject();
      if (user && user._id) {
        this.selectedUser = user;
        this.selectedUser.password = '';
        this.passwordPlaceholder = 'Password (keep blank for unchanged)';
        this.formHeader = 'Update User';
        this.buttonName = 'Update';
        this.updateMode = true;
      } else {
        this.selectedUser = new User();
        this.passwordPlaceholder = 'Password';
        this.formHeader = 'Create User';
        this.buttonName = 'Create';
        this.updateMode = false;
      }

      this.getAuthorities();
    } else {
      this.selectedUser = this.universalUser.getUser();
      this.selectedUser.password = '';
      this.buttonName = 'Update Profile';
      this.formHeader = 'Update Profile';
      this.passwordPlaceholder = 'Password (keep blank for unchanged)';
    }
  }

  getAuthorities() {
    this.userSubscription = this.authService.getAuthorities()
      .subscribe(
        authorityList => {
          if (authorityList) {
            this.authorityList = authorityList;
          }
        });
  }

  updateUser() {
    this.selectedUser.username = this.selectedUser.email;

    if (this.validateUser(this.selectedUser)) {
      if (this.updateMode || this.profileEditMode) {
        this.userSubscription = this.authService.update(this.selectedUser)
          .subscribe(
            data => {
              // set success message and pass true paramater to persist the message after redirecting to the login page
              if (data && data.username === this.universalUser.getUser().username) {
                // this is just update operation thus sending false to prevent storage event broadcast
                this.universalUser.setUser(data, false);
              }
              this.alertService.success('User updated successfully', true, 5000);
              this.location.back();
            });
      } else {
        this.userSubscription = this.authService.register(this.selectedUser)
          .subscribe(
            data => {
              // set success message and pass true paramater to persist the message after redirecting to the login page
              this.alertService.success('User created successfully', true, 5000);
              this.location.back();
            });
      }
    }
  }

  deleteUser() {
    if (this.selectedUser && this.selectedUser._id && this.selectedUser._id.length > 0) {
      this.userSubscription = this.authService.delete(this.selectedUser._id)
        .subscribe(
          data => {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            this.alertService.success('User deleted successfully', true, 5000);
            this.location.back();
          });
    }
  }

  goBack() {
    this.location.back();
  }

  validateUser(user: User) {
    if (!user) {
      this.alertService.error('User cannot be null');
      return false;
    }

    if (this.updateMode && (!user._id || user._id.length <= 0)) {
      this.alertService.error('Id cannot be null or empty');
      return false;
    }

    if (!user.name || user.name.length <= 0) {
      this.alertService.error('Name cannot be null or empty');
      return false;
    }

    if (!this.updateMode && !this.profileEditMode && (!user.password || user.password.length <= 0)) {
      this.alertService.error('Password cannot be null or empty');
      return false;
    }

    if (!user.username || user.username.length <= 0) {
      this.alertService.error('Email cannot be null or empty'); // as Email is Username
      return false;
    }

    if (!user.email || user.email.length <= 0) {
      this.alertService.error('Email cannot be null or empty');
      return false;
    }

    if (!user.authorities || user.authorities.length <= 0) {
      this.alertService.error('You must select atleast one authority');
      return false;
    }

    return true;
  }
}
