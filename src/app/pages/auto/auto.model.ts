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

export class Intent {
  status: string;
  episodeId: string;
  intentTime: Date;
  intentName: string;
  goals: any[];                                    // -------------- TODO: confirm datatype associated -------------- //
  messageId: string;
}

export class EpisodeBody {
  status: string;
  intents: Intent[];
  name: string;
  userHash: string;
  conversationId: string;
  entities: string[];                              // -------------- TODO: confirm datatype associated -------------- //
  mode: string;
  startTime: Date;
  endTime: Date;
  lastEpisodeStatus: string;
  goalStatus: string;
  goals: any[];                                    // -------------- TODO: confirm datatype associated -------------- //
}

export class Episode {
  _score: number;
  _type: string;
  _id: string;
  _source: EpisodeBody;
  _index: string;
}

export class Sentiment {
  emotion: string;
  classifier_reference: string;
  probability: number;
}

export class Context {
  entities: string[];
  sentiment__: string;
  intent: Intent;
  level: number;
}

export class ChatMessage {
  messageFrom: string;
  sentiment: Sentiment;
  messageTime: Date;
  episodeId: string;
  context: Context;
  userHash: string;
  inputText: string;
}

export class TrainingData {
  id: string;
  intent: string;
  sentiments: string[];
  language: string;
  entity: string;
  sentenceType: string;
  level: number;
  thirdPartyEntity: string;
  responseMessage: string;
  actionHtml: string;
}
