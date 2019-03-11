import { BaseModel } from './base.model';

export class Chronology {
  id: string;
  calendarType: string;
}


export class EmailPersister{
  to:string;
  from:string;
  subject:string;
  cc:string;
  htmlText:any;
  parsedBody:string;
  entityId:string;
  fileUrls:any;
  emailType:string;
  dataModel:any;
}

export class Time {
  hour: string;
  minute: string;
  nano: string;
  second: string;
  dayOfMonth: string;
  dayOfWeek: string;
  dayOfYear: string;
  month: string;
  monthValue: string;
  year: string;
  chronology: Chronology;
}

export class Amount{
  typecd: string;
  amount: number;
  currency: string;
}

export class State extends BaseModel {
  machineType: string;
  machineLabel: string;
  entityId: string;
  stateCd: string;
  stageCd: string;
  stateMachineInstanceModelId: string;
  assignedUserDisplayName:string;
  assignedUserGroupCd: string;
  assignedUserId: string;
  flagReason:string;
  assignedUserName: string;
  startTime: Time;
  endTime: Time;
  allocatedTime: Time;
  reservedTime: Time;
  payload: string;
  fromStateCd: string;
  parameters: Map<string,string>;
  predictedParameters: Map<string,string>;
  businessCost: Amount;
  errorMessageMap: any;
  headerParamList: string[];
  flagged:boolean;
  iterationLevel:number;
  autoAllocation:boolean;
  assignedDueToFlagged:boolean;
  
}

export class CommonInsightWrapper extends BaseModel {
  insightType: string;
  insightMap: any;
  reference_id: string;
  createdTime: Time;

}


export class StateReportModel extends BaseModel {
  activeStatusCount: number;
  flaggedStatusCount: number;
  archiveStatusCount: number;
  pendingStatusCount: number;
  assignedUserName: string;
  assignedUserId: string;
  closedStatus:number;
  fromDate: string;
  toDate: string;
  frDt:any;
  toDt: any;
  bussinessKeyMobile: string;
  reportStartTime: string;
  reportEndTime:string;
  reportStatusCd:string;
  reportSubStatusCd:string;
  tatTime:any;
  reportTatTime:string;
  chatType:string;
  businessKeyImeiEmail:string;
  assignedList:string[] = [];
}
