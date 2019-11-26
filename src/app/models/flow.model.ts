import { BaseModel } from './base.model';
import { ApiConfig, ApiKeyExpressionMap, ConnectorConfig } from './setup.model';
import { values } from 'd3';
import { DataModel } from './datamodel.model';

export class DataPointValidation {
  sequence: number;
  dataPointKey: string;
  expression: string;
  errorMessage: string;

  constructor(dataPointKey?: string) {
    this.sequence = 0;
    this.dataPointKey = dataPointKey ? dataPointKey : '';
    this.expression = '';
    this.errorMessage = '';
  }
}

export class TaskValidation {
  sequence: number;
  validationExpression: string;
  errorMessage: string;

  constructor(sequence?: number, validationExpression?: string, errorMessage?: string) {
    this.sequence = sequence ? sequence : 0;
    this.validationExpression = validationExpression ? validationExpression : null;
    this.errorMessage = errorMessage ? errorMessage : null;
  }
}

export class DataPoint {
  sequence: number;
  dataPointName: string;
  expression: string;
  dataPointLabel: string;
  description: string;
  dataType: string;
  inputSource: string[];
  validations: DataPointValidation[];
  operand: string;
  value: any;
  headerFlag: boolean;
  businessKeyFlag: boolean;
  businessMonitorKey: boolean;
  percentageChange: boolean;
  graphType: string;
  reportDataKey: boolean;
  childdataPoints: DataPoint[];

  constructor() {
    this.sequence = 0;
    this.dataPointName = '';
    this.expression = '';
    this.dataPointLabel = '';
    this.description = '';
    this.dataType = 'STRING';
    this.inputSource = [];
    this.validations = [];
    this.operand = 'AND';
    this.value = null;
    this.headerFlag = false;
    this.businessKeyFlag = false;
    this.graphType = null;
    this.businessKeyFlag = false;
    this.percentageChange = false;
    this.reportDataKey = false;
    this.childdataPoints = [];
  }
}

export class DataPointAccess {
  dataPointName: string;
  dataPointLabel: string;
  writeAccess: boolean;
  readAcsess: boolean;
  hide: boolean;

  constructor(dataPointName?: string, dataPointLabel?: string, writeAccess?: boolean, readAcsess?: boolean, hide?: boolean) {
    this.dataPointName = dataPointName ? dataPointName : null;
    this.dataPointLabel = dataPointLabel ? dataPointLabel : null;
    this.writeAccess = writeAccess ? writeAccess : true;
    this.readAcsess = readAcsess ? readAcsess : true;
    this.hide = hide ? hide : false;
  }
}


export class Classifier {
  apiName: string;
  url: string;

  constructor() {
    this.apiName = '';
    this.url = '';
  }
}

export class Expression {
  value: string;

  constructor(value?: string) {
    this.value = value ? value : '';
  }
}

export class EventModel {
  eventCd: string;
  expressionList: Expression[];
  operand: string;
  sortPriority: number;

  constructor() {
    this.eventCd = '';
    this.expressionList = [];
    this.operand = '';
    this.sortPriority = 0;
  }
}

export class AllocationModel {
  allocationGroup: string;
  allocationType: string;
  groups: string[];
  api: string;
  allocatedUserCd: string;
  capabilities: string[];
  stickyStates: string[];
  emailerAPI: string;

  constructor() {
    this.allocationGroup = '';
    this.groups = [];
    this.allocationType = '';
    this.api = '';
    this.allocatedUserCd = '';
    this.capabilities = [];
    this.stickyStates = [];
    this.emailerAPI = '';
  }
}

export class CostModel {
  expression: string;
  costType: string;
  amount: number;
  apiCd: string;
  currency: string;

  constructor() {
    this.expression = '';
    this.amount = 0;
    this.costType = "FIXED";
    this.apiCd = '';
    this.currency = '';
  }
}

export class SubprocessData {
  parentProcessUpdateEvent: string;
  toTriggerMachineType: string;

  constructor() {
    this.parentProcessUpdateEvent = 'Closure';
    this.toTriggerMachineType = '';
  }
}

export class ManualAction {
  sequence: number;
  key: string;
  value: any;
  type: string;
  label: string;
  description: string;

  constructor(sequence?: number, key?: string, value?: any, type?: string, label?: string, description?: string) {
    this.sequence = sequence ? sequence : 0;
    this.key = key ? key : '';
    this.value = value ? value : '';
    this.type = type ? type : '';
    this.label = label ? label : '';
    this.description = description ? description : '';
  }
}

export class StateModel {
  stateId: string;
  stateCd: string;
  initialState: boolean;
  endState: boolean;
  events: EventModel[];
  type: string;
  trigger: EventModel;
  classifiers: Classifier[];
  entryActionList: string[];
  apiConfigurationList: string[];
  ruleList: ApiKeyExpressionMap[];
  allocationModel: AllocationModel;
  costModel: CostModel;
  subprocessData: SubprocessData;
  manualActions: ManualAction[];
  mandatoryDataPoints: DataPoint[];
  timerUnitType: string;
  timerUnit: number;
  runAtDateExpression: string;
  runAtTimeExpression: string;
  taskConfig: ConnectorConfig[];
  taskConfigList: string[];
  connectorConfig: ConnectorConfig[];
  connectorConfigList: string[];
  reportFlag: boolean;
  businessMonitorFlag: boolean;
  virtualAgentId: string;
  statusList: LabelValue[];
  statusDisable: boolean;
  documentEvalExp: string;
  converseRequestExp: string;
  taskValidations: TaskValidation[];
  dataPointAccessList: DataPointAccess[];
  mwRouteCd:string;
  decisionTabelHeaders: DecisionTableHeader[];
  decisionTabelRuleList: ApiKeyExpressionMap[][];

  constructor() {
    this.stateId = '';
    this.stateCd = '';
    this.initialState = false;
    this.endState = false;
    this.events = [];
    this.type = '';
    this.trigger = new EventModel();
    this.classifiers = [];
    this.entryActionList = [];
    this.apiConfigurationList = [];
    this.ruleList = [];
    this.allocationModel = new AllocationModel();
    this.costModel = new CostModel();
    this.subprocessData = new SubprocessData();
    this.manualActions = [];
    this.mandatoryDataPoints = [];
    this.timerUnit = 0;
    this.runAtDateExpression = '';
    this.runAtTimeExpression = '';
    this.taskConfig = [];
    this.taskConfigList = [];
    this.connectorConfig = [];
    this.connectorConfigList = [];
    this.reportFlag = false;
    this.businessMonitorFlag = false;
    this.virtualAgentId = '';
    this.statusList = [];
    this.statusDisable = false;
    this.documentEvalExp = null;
    this.converseRequestExp = null;
    this.taskValidations = [];
    this.dataPointAccessList = [];
    this.mwRouteCd = '';
    this.decisionTabelHeaders = [];
    this.decisionTabelRuleList = [];
  }
}


export class StateInfoModel {

  name: string;
  duration: any;
  is_critical: boolean;
  earlyfinish: any;
  slack: any;
  latefinish: any;
  predecessors: string[];
  predecessor_ids: string[];
  earlystart: any;
  latestart: any;
  flowId: string;
  machineType: string;
  type: string;
  constructor() {
    this.name = "";
    this.duration = 0.0;
    this.is_critical = false;
    this.earlyfinish = 0.0;
    this.slack = 0.0;
    this.latefinish = 0.0;
    this.predecessors = [];
    this.predecessor_ids = [];
    this.earlystart = 0.0;
    this.latestart = 0.0;
    this.flowId = "";
    this.machineType = "";
    this.type = "";
  }

}

export class Transition {
  sourceStateCd: string;
  targetStateCd: string;
  eventCd: string;

  constructor() {
    this.sourceStateCd = '';
    this.targetStateCd = '';
    this.eventCd = '';
  }
}


export class ProcessModel extends BaseModel {
  status: string;
  endTime: any;
  startTimeLong: any;
  operationType: any;
  processOwner: string;
  endState: any;
  businessValue: any;
  subStatus: string;
  resourceCost: any;
  flowId: string;
  businessCost: any;
  startTime: any;
  flowVersion: string;
  entityId: string;
  processType: string;
  endTimeLong: any;
  statusCd: string;
  parameters: any;
  states: any;
  highlights: any[] = [];
}

export class GraphObject extends BaseModel {
  machineLabel: string;
  machineType: string;
  version: number;
  xml: string;
  processOwner: string;
  primaryEntity: string;
  dataPointConfigurationList: DataPoint[];
  states: StateModel[];
  transitions: Transition[];
  activeStateIdList: string[];
  closedStateIdList: string[];
  entity: DataModel;

  constructor() {
    super();

    this.machineLabel = '';
    this.machineType = '';
    this.processOwner = '';
    this.primaryEntity = '';
    this.version = 0;
    this.xml = '';
    this.dataPointConfigurationList = [];
    this.states = [];
    this.transitions = [];
    this.activeStateIdList = [];
    this.closedStateIdList = [];
    this.entity = new DataModel();
  }
}


export class CommonSearchModel {
  searchParams: any;
  returnFields: any;

  constructor() {
    this.searchParams = [];
    this.returnFields = [];

  }

}

export class LabelValue {

  
  label: string;
  value: string;
  disabled: boolean;
 
  constructor(label?: string, value?: string, disabled?: boolean) {
    this.label = label ? label : null;
    this.value = value ? value : null;
    this.disabled = disabled ? disabled : false;  
  }
}

export class DecisionTableHeader{
  label:String;
	value:String;
	requestType: String;
  disabled: boolean;
  
  constructor(label?: string, value?: string, requestType?: string, disabled?: boolean) {
    this.label = label ? label : null;
    this.value = value ? value : null;
    this.requestType = value ? requestType : null;
    this.disabled = disabled ? disabled : false;  
  }
}

