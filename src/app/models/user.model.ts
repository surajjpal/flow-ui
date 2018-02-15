import { BaseModel } from './base.model';

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

export class User extends BaseModel {
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
    super();
    
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.enabled = true;
    this.authorities = [];
    this.groups = [];
    this.groupAsStringList = [];
    this.credentialsNonExpired = true;
    this.accountNonLocked = true;
    this.accountNonExpired = true;
  }
}
  export class UserHierarchy extends BaseModel {
    
    parentUserId: string;
    userId:string;
    userName: string;
    parentUserName: string;
    reportingUserId:string
    reportingUserName: string;
    companyId: string;

    constructor() {
      super();
      this.parentUserId = '';
      this.userName = '';
      this.parentUserName = '';
      this.reportingUserId = '';
      this.reportingUserName = '';
      this.userId = "";
      
}
  }

  export class UserGraphObject extends BaseModel {
    
    xml:string;
    userHierarchy:UserHierarchy[];

    constructor() {
      super();
      this.xml = "";
      this.userHierarchy=[];
      }
  }



