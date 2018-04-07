import { BaseModel } from './base.model';

export class Chronology {
  id: string;
  calendarType: string;
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
  flagLevel:number;
  autoAllocation:boolean;
}

export class CommonInsightWrapper extends BaseModel {
  insightType: string;
  insightMap: any;
  reference_id: string;
  createdTime: Time;

}
