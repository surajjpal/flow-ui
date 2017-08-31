import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { AuthService, AlertService, UniversalUser } from '../../../../shared/shared.service';
import { DataSharingService } from '../../../../shared/shared.service';

import { User } from '../../../../shared/shared.model';

@Component({
  selector: 'api-update-user',
  templateUrl: './updateUser.component.html'
})

export class UpdateUserComponent implements OnInit {
  selectedUser: User;
  authorityList: string[];

  passwordPlaceholder: string;
  formHeader: string;
  buttonName: string;

  updateMode: boolean;
  profileEditMode: boolean = false;

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

  initUI() {
    this.route
      .params
      .subscribe(params => {
        this.profileEditMode = (params['profile'] === 'profile');
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
        this.buttonName = 'Update User';
        this.updateMode = true;
      } else {
        this.selectedUser = new User();
        this.passwordPlaceholder = 'Password';
        this.formHeader = 'Create User';
        this.buttonName = 'Create User';
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
    this.authService.getAuthorities()
      .then(
      authorityList => {
        if (authorityList) {
          this.authorityList = authorityList;


        }
      },
      error => {

      }
      )
      .catch(
      error => {

      }
      );
  }

  updateUser() {
    this.selectedUser.username = this.selectedUser.email;

    if (this.validateUser(this.selectedUser)) {
      if (this.updateMode || this.profileEditMode) {
        this.authService.update(this.selectedUser)
          .subscribe(
          data => {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            this.alertService.success('User updated successfully', true);
            this.location.back();
          },
          error => {
            this.alertService.error(error);
          });
      } else {
        this.authService.register(this.selectedUser)
          .subscribe(
          data => {
            // set success message and pass true paramater to persist the message after redirecting to the login page
            this.alertService.success('User created successfully', true);
            this.location.back();
          },
          error => {
            this.alertService.error(error);
          });
      }
    }
  }

  deleteUser() {
    if (this.selectedUser && this.selectedUser._id && this.selectedUser._id.length > 0) {
      this.authService.delete(this.selectedUser._id)
        .subscribe(
        data => {
          // set success message and pass true paramater to persist the message after redirecting to the login page
          this.alertService.success('User deleted successfully', true);
          this.location.back();
        },
        error => {
          this.alertService.error(error);
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
