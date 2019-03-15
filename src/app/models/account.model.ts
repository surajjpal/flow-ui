import { BaseModel } from './base.model';

export class Account extends BaseModel {
  loginId: string;
  companyName: string;
  createdDt: Date;
  companyDesc: string;
  s3: boolean;
  apiKey: string;
  trainingModeFl:boolean;
  companyAgentId:string;

  constructor() {
    super();
  
    this.loginId = '';
    this.companyName = '';
    this.createdDt = new Date();
    this.companyDesc = '';
    this.s3 = false;
    this.apiKey = '';
    this.trainingModeFl = true;
    this.companyAgentId = '';
  }
}
