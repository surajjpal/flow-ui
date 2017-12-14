import { BaseModel } from './base.model';
import { ApiConfig, ApiKeyExpressionMap } from './setup.model';

export class DataPoint {
  dataPointName: string;
  expression: string;

  constructor() {
    this.dataPointName = '';
    this.expression = '';
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
  
  constructor() {
    this.value = '';
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

  constructor() {
    this.allocationGroup = '';
    this.groups = [];
    this.allocationType = '';
    this.api = '';
    this.allocatedUserCd = '';
  }
}

export class CostModel{
  expression: string;
  costType: string;
  amount: number;
  apiCd: string;
  currency: string;

  constructor() {
    this.expression = '';
    this.amount = 0.0;
    this.costType = '';
    this.apiCd = '';
    this.currency = '';
  }
}

export class ManualAction {
  key: string;
  value: any;
  type: string;

  constructor(key?: string, value?: any, type?: string) {
    this.key = key ? key :'';
    this.value = value ? value : '';
    this.type = type ? type : '';
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
  manualActions: ManualAction[];

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
    this.manualActions = [];
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

export class GraphObject extends BaseModel {
  machineLabel: string;
  machineType: string;
  version: number;
  xml: string;
  dataPointConfigurationList: DataPoint[];
  states: StateModel[];
  transitions: Transition[];
  activeStateIdList: string[];
  closedStateIdList: string[];

  constructor() {
    super();
    
    this.machineLabel = '';
    this.machineType = '';
    this.version = 0;
    this.xml = '';
    this.dataPointConfigurationList = [];
    this.states = [];
    this.transitions = [];
    this.activeStateIdList = [];
    this.closedStateIdList = [];
  }
}
