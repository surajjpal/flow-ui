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
}

export class NVD3Chart {
  key: string;
  values: [string, any][];
}

export class Dashboard {
  conversationSummary: ConversationSummary;
  nvd3ChartInputList: NVD3Chart[];
}

export class DataPoint {
  dataPointName: string;
  expression: string;
  paramTargetList: string[];
  inputTarget: string;
  machineType: string;
}

export class Classifier {
  apiName: string;
  url: string;
}

export class Expression {
  value: string;
  target: string;
  expectedResult: string;
}

export class EventModel {
  eventCd: string;
  expressions: Expression[];
  operand: string;
}

export class StateModel {
  id: string;
  stateCd: string;
  name: string;
  type: string;
  trigger: EventModel;
  events: EventModel[];
  classifiers: Classifier[];
}

export class GraphObject {
  _id: string;
  statusCd: string;
  machineType: string;
  version: string;
  xml: string;
  dataPointConfigurationList: DataPoint[];
}
