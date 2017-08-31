import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../master.service';
import { DataSharingService } from '../../../../shared/shared.service';

import { User } from '../../../../shared/shared.model';

@Component({
  selector: 'api-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.scss']
})

export class UserComponent implements OnInit {
  userList: User[];
  filterQuery: string;
  selectedUser: User;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private sharingService: DataSharingService
  ) {
    this.userList = [];
    this.filterQuery = '';
    this.selectedUser = new User();
  }

  ngOnInit() {
    this.userService.getAllUsers()
      .then(
        userList => {
          if (userList) {
            this.userList = userList;
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
