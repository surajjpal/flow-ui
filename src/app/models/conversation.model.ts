export class ConversationIntent {
  status: string;
  episodeId: string;
  intentTime: Date;
  intentName: string;
  goals: any[];                                    // -------------- TODO: confirm datatype associated -------------- //
  messageId: string;
}

export class EpisodeBody {
  status: string;
  intents: ConversationIntent[];
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
  intent: ConversationIntent;
  level: number;
}

export class ChatMessage {
  from: string;
  messageFrom: string;
  sentiment: Sentiment;
  messageTime: Date;
  episodeId: string;
  context: Context;
  userHash: string;
  inputText: string;
}

export class EntityDataBody {
  name: string;
  parent: string;
  tags: string[];

  constructor() {
    this.name = '';
    this.parent = '';
    this.tags = [];
  }
}
