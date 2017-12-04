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

export class WorkflowSummary {
  no_of_closed_business_process: number;
  no_of_active_business_process: number;
  no_of_active_states: number;
  no_of_closed_states: number;
  res_allocated_efficiency: number;
}

export class StateConsumingMaxResTimeTransaction {
  stateConsumeMaxRes: string;
	stateConsumeMaxtime: string;
	stateConsumeMaxTransaction: string;
	resources: string;
	resourceCount: number;
	averageTime: number;
	transactionValues: string;
	totalTransactionValue: number;
}

export class NVD3Chart {
  key: string;
  values: [string, any][];
}

export class Dashboard {
  conversationSummary: ConversationSummary;
  workflowSummary: WorkflowSummary;
  nvd3ChartInputList: NVD3Chart[];
  stateConsumingMaxResTimeTransaction: StateConsumingMaxResTimeTransaction;
}
