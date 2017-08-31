export class User {
  _id: string;
  username: string;
  password: string;
  email: string;
  name: string;
  enabled: boolean;
  authorities: string[];

  constructor() {
    this._id = '';
    this.username = '';
    this.password = '';
    this.email = '';
    this.name = '';
    this.enabled = false;
    this.authorities = [];
  }
}
