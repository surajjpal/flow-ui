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
  }
}

export class UserGroup{
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
