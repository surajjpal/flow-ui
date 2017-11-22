export class Account {
  _id: string;
  loginId: string;
  companyName: string;
  createdDt: Date;
  companyDesc: string;
  flashInfo: string[];
  s3: boolean;
  apiKey: string;
  agentName: string[];

  constructor() {
    this._id = null;
    this.loginId = '';
    this.companyName = '';
    this.createdDt = new Date();
    this.companyDesc = '';
    this.flashInfo = [];
    this.s3 = false;
    this.apiKey = '';
    this.agentName = [];
  }
}
