import { BaseModel } from './base.model';
import { ApiConfig, ApiKeyExpressionMap } from './setup.model';
import { values } from 'd3';

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
  capabilities:string[];
	stickyStates:string[];
	emailerAPI:string;

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
    this.costType = '';
    this.apiCd = '';
    this.currency = '';
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
  manualActions: ManualAction[];
  mandatoryDataPoints: DataPoint[];
  timerUnitType: string;
  timerUnit: number;
 

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
    this.mandatoryDataPoints = [];
    this.timerUnitType = '';
    this.timerUnit = 0;
   
  }
}


export class StateInfoModel{

	name:string; 
	duration:any;
	is_critical:boolean;
	earlyfinish:any;
	slack:any;
	latefinish:any;
	predecessors:string[];
	predecessor_ids:string[];
	earlystart:any;
	latestart:any;
	flowId:string;
	machineType:string;
  type:string;
  constructor(){
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
  }
}
