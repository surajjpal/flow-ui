import { BaseModel } from './base.model';

export class Account extends BaseModel {
  loginId: string;
  companyName: string;
  createdDt: Date;
  companyDesc: string;
  s3: boolean;
  apiKey: string;

  constructor() {
    super();
  
    this.loginId = '';
    this.companyName = '';
    this.createdDt = new Date();
    this.companyDesc = '';
    this.s3 = false;
    this.apiKey = '';
  }
}
