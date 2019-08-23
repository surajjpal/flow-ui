import { BaseModel } from './base.model';
import { UserHierarchy } from './user.model';

export class Chronology {
  id: string;
  calendarType: string;
}


export class EmailPersister {
  to: string;
  from: string;
  subject: string;
  cc: string;
  htmlText: any;
  parsedBody: string;
  entityId: string;
  fileUrls: any;
  emailType: string;
  dataModel: any;
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

export class Amount {
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
  assignedUserDisplayName: string;
  assignedUserGroupCd: string;
  assignedUserId: string;
  flagReason: string;
  assignedUserName: string;
  startTime: Time;
  endTime: Time;
  allocatedTime: Time;
  reservedTime: Time;
  payload: string;
  fromStateCd: string;
  parameters: Map<string, string>;
  predictedParameters: Map<string, string>;
  businessCost: Amount;
  errorMessageMap: any;
  headerParamList: string[];
  flagged: boolean;
  iterationLevel: number;
  autoAllocation: boolean;
  assignedDueToFlagged: boolean;
  stateEntryTypeCd: string;
  assignedVirtualAgentId: string;
  taskStatus: string = null;
  taskRemarks: string = null;
  documents: DocumentSubSet[] = [];

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
  closedStatus: number;
  fromDate: string;
  toDate: string;
  frDt: any;
  toDt: any;
  bussinessKeyMobile: string;
  reportStartTime: string;
  reportEndTime: string;
  reportStatusCd: string;
  reportSubStatusCd: string;
  tatTime: any;
  reportTatTime: string;
  chatType: string;
  businessKeyImeiEmail: string;
  assignedList: string[] = [];
}

export class TimelineStateAuditData extends BaseModel {
  stateCd: string;
  assignedUserGroupCd: string;
  assignedUserName: string;
  assignedUserDisplayName: string;
  assignedUserId: string;
  startTimeLong: number;
  endTimeLong: number;
  parameters: TimelineStateParameterData[];
  escalatedFlag: boolean;
	flagged: boolean;
	flagReason: string;
	assignedDueToFlagged: boolean;
	taskStatus: string;
	taskRemarks: string;
  documents: Document[];
  
  constructor() {
    super()
    this.stateCd = null;
    this.assignedUserGroupCd = null;
    this.assignedUserName = null;
    this.assignedUserDisplayName = null;
    this.assignedUserId = null;
    this.startTimeLong = null;
    this.endTimeLong = null;
    this.parameters = [];
    this.escalatedFlag = false;
    this.flagged = false;
    this.flagReason = null;
    this.assignedDueToFlagged = false;
    this.taskStatus = null;
    this.taskRemarks = null;
    this.documents = [];
  }
}

export class TimelineStateParameterData extends BaseModel {
  key: string;
  value: string;
}

export class DocumentSubSet {
  documentName: string;
	fileName: string;
	mandatory: boolean;
	documentType: string;
  status: string;
  
  constructor(documentName?: string, fileName?: string, mandatory?: boolean, documentType?: string, status?: string) {
    this.documentName = documentName;
    this.fileName = fileName;
    this.mandatory = mandatory;
    this.documentType = documentType;
    this.status = status;
  }
}

export class Document extends BaseModel {
  flowInstanceId: string;
	stateInstanceId: string;
	documentName: string;
	fileName: string;
	userFileName: string;
	downloadFileUrl: string;
	fullDataUrl: string;
	fullFileUrl: string;
	url: string;
	mandatory: boolean;
	allowedFileTypes: string[];
	documentType: string;
  status: string;
  uploadTime: Date;
  createdTime: Date;
  updatedTime: Date;
  description: string;

  constructor(flowInstanceId?: string, stateInstanceId?: string, documentName?: string, fileName?: string, userFileName?: string,
    downloadFileUrl?: string, fullDataUrl?: string, fullFileUrl?: string, url?: string, mandatory?: boolean, allowedFileTypes?: string[], documentType?: string, status?: string,
    uploadTime?: null, createdTime?: null, updatedTime?: null, description?: null
    )
    {
      super();
      this.flowInstanceId = flowInstanceId ? flowInstanceId : null;
      this.stateInstanceId = stateInstanceId ? stateInstanceId : null;
      this.documentName = documentName ? documentName : null;
      this.fileName = fileName ? fileName : null;
      this.userFileName = userFileName ? userFileName : null;
      this.downloadFileUrl = downloadFileUrl ? downloadFileUrl : null;
      this.fullDataUrl = fullDataUrl ? fullDataUrl : null;
      this.url = url ? url : null;
      this.mandatory = mandatory ? mandatory : false;
      this.allowedFileTypes = allowedFileTypes ? allowedFileTypes : [];
      this.documentType = documentType ? documentType : null;
      this.status = status ? status : null;
      this.uploadTime = this.uploadTime ? uploadTime : null;
      this.createdTime = this.createdTime ? createdTime : null;
      this.description = this.description ? description : null;
    }
}


export class TaskDecision {

  TAB_ASSIGNED = 'ASSIGNED';
  TAB_UNASSIGNED = 'UNASSIGNED';
  TAB_FLAGGED = 'FLAGGED';
  

  isUpdateAllow(stateDetails: State, taskType: string) {

    if (taskType == this.TAB_ASSIGNED) {
      if (stateDetails.stateEntryTypeCd && stateDetails.stateEntryTypeCd == "VirtualAgentStateEntryAction") {
        return false;
      }
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && stateDetails.assignedUserGroupCd === 'Personal'
    }
  }

  isAllocateAllow(stateDetails: State, tasktype: string, users: UserHierarchy[]) {
    if (tasktype == this.TAB_ASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && users.length > 0
    }
    if (tasktype == this.TAB_UNASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && users.length > 0
    }
  }

  isReserveAllow(stateDetails: State, taskType: String) {
    if (taskType == this.TAB_ASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && stateDetails.assignedUserGroupCd !== 'Personal' 
    }
    if (taskType == this.TAB_UNASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && stateDetails.assignedUserGroupCd !== 'Personal' 
    }
  }

  isEscalteAllow(stateDetails: State, taskType: string, userHierarchy: UserHierarchy) {
    if (taskType == this.TAB_ASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && stateDetails.assignedUserGroupCd === 'Personal' && userHierarchy.parentUserId.length > 0
    }
  }

  isFlagAllow(stateDetails: State, taskType: string) {
    if (taskType == this.TAB_ASSIGNED) {
      return stateDetails.statusCd !== ('CLOSED' || 'ARCHIVE') && stateDetails.assignedUserGroupCd == 'Personal' && stateDetails.subStatus !== 'FLAGGED'
    }
  }

  isArchiveAllow(stateDetails: State, taskType: string) {
    if (taskType == this.TAB_ASSIGNED) {
      return stateDetails.statusCd ==='ACTIVE' && stateDetails.assignedUserGroupCd == 'Personal' 
    }
  }

  isAssistAllow(stateDetails: State, taskType: string) {
    if (taskType == this.TAB_ASSIGNED) {
      return stateDetails.stateEntryTypeCd && stateDetails.stateEntryTypeCd === 'VirtualAgentStateEntryAction'
    }
  }
}