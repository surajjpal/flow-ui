export class EpisodeGoalStep {
  statusCd: string;
  goalExpression: string;
  sequence: number;
  goalResponse: any;
  lang: any;
  api: string;
  apiResponseKey: string;
  apiResponseValue: any;
  key: string;
  value: any;
  authRequired: boolean;
  mandatory: boolean;
  ignoreIntent: boolean;
  goalValidationTypes: string[];
  dependencyExpression: string;
  dependencyResult: any;
  responseExpression: string;
  actionHtml: string;
  isUniquePerGoal: boolean;
  startTriggerMessageId: string;
  endTriggerMessageId: string;
  startTriggerTime: Date;
  endTriggerTime: Date;
  hybridResponseExpression: string;
  pickFromNoun: boolean;
  skipped: boolean;
}

export class EpisodeGoal {
  _id: string;
  companyId: string;
  statusCd: string;
  episodeId: string;
  expression: string;
  goalName: string;
  domainGoalSteps: EpisodeGoalStep[];
  model: any;
  api: string;
  apiResponseKey: string;
  apiResponseValue: any;
  flowResponseValue: any;
  responseExpression: string;
  responseChangeExpression: string;
  validationCheck: any;
  flowFlag: boolean;
  htmlFlag: boolean;
  responseChange: boolean;
  responseDependent: boolean;
  valueExpression: string;
  tagExpression: string;
  startTriggerMessageId: string;
  endTriggerMessageId: string;
  startTriggerTime: Date;
  endTriggerTime: Date;
  isClosureGoal: boolean;
}

export class EpisodeContext {
  model: any;
  goalStack: EpisodeGoal[];
  lastUserMessageId: string;
  lastAutoMessageId: string;
  userMessageCount: number;
  autoMessageCount: number;
}

export class Episode {
  _id: string;
  companyId: string;
  statusCd: string;
  source: string;
  agentId: string;
  campaignCd: string;
  userId: string;
  conversationId: string;
  langDetected: string[];
  langSelected: string;
  lastMessageId: string;
  mode: string;
  intents: string[];
  entities: string[];
  sentiments: string[];
  goals: EpisodeGoal[];
  stages: string[];
  lastStage: string;
  transactionValue: number;
  startTime: Date;
  endTime: Date;
  modifiedTime: Date;
  currentGoal: EpisodeGoal;
  currentGoalStep: EpisodeGoalStep;
  episodeContext: EpisodeContext;
  flowTriggered: boolean;
}

export class Phrase {
  phraseText: string;
  intentResult: any;
  entityResult: any;
  sentimentResult: any;
  intents: string;
  entities: string;
  sentiments: string;
  expression: string;
  language: string;
  nouns: string;
  result: string;
  retryDetected: string;  
  pos: any;
}

export class ChatMessage {
  agentId: string;
  messageText: string;
  displayText: string;
  episodeStatus: string;
  episodeId: string;
  conversationId: string;
  from: string;
  options: any[];
  settings: any;
  language: string;
  newLanguage: string;
  to: string;
  messageTime: Date;
  contextMessageId: string;
  messageType: string;
  phrases: Phrase[];
  onlyEntityFound: string[];
  onlyIntentFound: string[];
  disableUserInput: boolean;
  debugData: any;
}
