import { ApiConfig } from '../master/master.model';

export class ConversationSummary {
  goals_met_count: number;
  user_messages_count: number;
  conversation_count: number;
  episodes_count: number;
  auto_messages_count: number;
  goals_count: number;
  avg_time: number;
  episode_percentage_change: number;
  user_percentage_change: number;
  avg_time_percentage_change: number;
  goals_count_percentage_change: number
  auto_messages_percentage_change: number;
  user_messages_percentage_change: number;
  goal_met_percentage_change: number;

  constructor() {
    this.goals_met_count = 0;
    this.user_messages_count = 0;
    this.conversation_count = 0;
    this.episodes_count = 0;
    this.auto_messages_count = 0;
    this.goals_count = 0;
    this.avg_time = 0;
    this.episode_percentage_change = 0;
    this.user_percentage_change = 0;
    this.avg_time_percentage_change = 0;
    this.goals_count_percentage_change = 0;
    this.auto_messages_percentage_change = 0;
    this.user_messages_percentage_change = 0;
    this.goal_met_percentage_change = 0;
  }
}

export class NVD3Chart {
  key: string;
  values: [string, any][];

  constructor() {
    this.key = '';
    this.values = [];
  }
}

export class Dashboard {
  conversationSummary: ConversationSummary;
  nvd3ChartInputList: NVD3Chart[];

  constructor() {
    this.conversationSummary = new ConversationSummary();
    this.nvd3ChartInputList = [];
  }
}

export class DataPoint {
  dataPointName: string;
  expression: string;
  machineType: string;

  constructor() {
    this.dataPointName = '';
    this.expression = '';
    this.machineType = '';
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
  apiConfigurationList: ApiConfig[];

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

export class GraphObject {
  _id: string;
  statusCd: string;
  machineLabel: string;
  machineType: string;
  version: number;
  xml: string;
  dataPointConfigurationList: DataPoint[];
  states: StateModel[];
  transitions: Transition[];

  constructor() {
    this._id = null;
    this.statusCd = '';
    this.machineLabel = '';
    this.machineType = '';
    this.version = 0;
    this.xml = '';
    this.dataPointConfigurationList = [];
    this.states = [];
    this.transitions = [];
  }
}
