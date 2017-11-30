import { BaseModel } from './base.model';

export class Account extends BaseModel {
  loginId: string;
  companyName: string;
  createdDt: Date;
  companyDesc: string;
  flashInfo: string[];
  s3: boolean;
  apiKey: string;
  agentName: string[];

  constructor() {
    super();
  
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
