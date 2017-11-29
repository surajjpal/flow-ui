export class UserGroup {
  userGroupCd: string;
  expression: string;
  parentUserGroupCd: string;
  escalationUserGroupCd: string;

  constructor() {
    this.userGroupCd = '';
    this.expression = '';
    this.parentUserGroupCd = '';
    this.escalationUserGroupCd = '';
  }
}

export class User {
  _id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  enabled: boolean;
  authorities: string[];
  groups: UserGroup[];
  groupAsStringList: string[];
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  accountNonExpired: boolean;

  constructor() {
    this._id = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.enabled = false;
    this.authorities = [];
    this.groups = [];
    this.groupAsStringList = [];
    this.credentialsNonExpired = true;
    this.accountNonLocked = true;
    this.accountNonExpired = true;
  }
}
