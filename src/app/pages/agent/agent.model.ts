export class UIComponent {
  colorCss: string[];
  font: string[];
  logoUrl: string;
  typingGif: string;

  constructor() {
    this.colorCss = [];
    this.font = [];
    this.logoUrl = '';
    this.typingGif = '';
  }
}

export class Account {
  _id: string;
  loginId: string;
  companyName: string;
  createdDt: Date;
  companyDesc: string;
  flashInfo: string[];
  s3: boolean;
  apiKey: string;
  agentName: string[];
  ui: UIComponent;

  constructor() {
    this._id = null;
    this.loginId = '';
    this.companyName = '';
    this.createdDt = new Date();
    this.companyDesc = '';
    this.flashInfo = [];
    this.s3 = false;
    this.apiKey = '';
    this.agentName = [];
    this.ui = new UIComponent();
  }
}

export class Intent {
  // intentName: string;
  // createdDt: Date;
  intentCd: string;
  intentParent: string;
  tags: string[];
  weight: number;
  // defaultResponse: string;

  constructor() {
    // this.intentName = '';
    // this.createdDt = new Date();
    this.intentCd = '';
    this.intentParent = '';
    this.tags = [];
    this.weight = 0;
    // this.defaultResponse = '';
  }
}

export class Entity {
  // entityName: string;
  // createdDt: Date;
  entityCd: string;
  entityParent: string;
  tags: string[];
  transactionValue: number;
  // defaultResponse: string;

  constructor() {
    // this.entityName = '';
    // this.createdDt = new Date();
    this.entityCd = '';
    this.entityParent = '';
    this.tags = [];
    this.transactionValue = 0;
    // this.defaultResponse = '';
  }
}

export class GoalStep {
  goalExpression: string;
  // createdDt: Date;
  sequence: number;
  goalResponse: string;
  lang: string;
  api: string;
  key: string;
  parameters: string[];

  constructor() {
    this.goalExpression = '';
    // this.createdDt = new Date();
    this.goalResponse = 'New Goal Response';
    this.lang = '';
    this.sequence = 0;
    this.api = '';
    this.key = '';
    this.parameters = [];
  }
}

export class Goal {
  // intentName: string;
  // entityName: string;
  expression: string;
  goalName: string;
  // createdDt: Date;
  authRequired: boolean;
  domainGoalSteps: GoalStep[];
  model: any;
  api: string;

  constructor() {
    // this.intentName = '';
    // this.entityName = '';
    this.expression = '';
    this.goalName = '';
    // this.createdDt = new Date();
    this.domainGoalSteps = [];
    this.model = {};
    this.api = '';
  }
}

export class Response {
  // intentName: string;
  // entityName: string;
  level: number;
  actionHTML: string;
  expression: string;
  lang: string;
  // createdDt: Date;
  response: string;

  constructor(expression?: string, lang?: string, response?: string) {
    // this.intentName = '';
    // this.entityName = '';
    this.level = 1;
    this.actionHTML = '';

    if (expression && lang && response) {
      this.expression = expression;
      this.lang = lang;
      this.response = response;
    } else {
      this.expression = '';
      this.lang = '';
      this.response = '';
    }

    // this.createdDt = new Date();
  }
}

export class Domain {
  _id: string;
  name: string;
  createdDt: Date;
  desc: string;
  langSupported: string[];
  flowName: string;
  common: boolean;
  domainIntents: Intent[];
  domainEntities: Entity[];
  domainGoals: Goal[];
  domainResponse: Response[];

  constructor() {
    this._id = null;
    this.name = '';
    this.createdDt = new Date();
    this.desc = '';
    this.langSupported = [];
    this.flowName = '';
    this.common = false;
    this.domainIntents = [];
    this.domainEntities = [];
    this.domainGoals = [];
    this.domainResponse = [];
  }
}

export class Plugin {
  messengerName: string;
  // createdDt: Date;
  webhook: string;
  apitoken: string;
  validation: string;
  serviceDownMsg: string;

  constructor() {
    this.messengerName = '';
    // this.createdDt = new Date();
    this.webhook = '';
    this.apitoken = '';
    this.validation = '';
    this.serviceDownMsg = '';
  }
}

export class Classifier {
  classifierServiceName: string;
  classifierServiceUrl: string;
  classifierServiceToken: string;
  classifierWorkspaceId: string;
  classifierUsername: string;
  classifierPassword: string;
  classifierVersion: string;

  constructor() {
    this.classifierServiceName = '';
    this.classifierServiceUrl = '';
    this.classifierServiceToken = '';
    this.classifierWorkspaceId = '';
    this.classifierUsername = '';
    this.classifierPassword = '';
    this.classifierVersion = '';
  }
}

export class Agent {
  _id: string;
  name: string;
  agenturl: string;
  createdDt: Date;
  desc: string;
  langSupported: string[];
  agentFlow: string[];
  domainNameList: string[];
  agentDomain: Domain[];
  common: boolean;
  agentPlugins: Plugin[];
  agentClassifier: Classifier[];
  companyId: string;

  constructor() {
    this._id = null;
    this.agenturl = null;
    this.name = '';
    this.createdDt = new Date();
    this.desc = '';
    this.langSupported = [];
    this.agentFlow = [];
    this.domainNameList = [];
    this.agentDomain = [];
    this.common = false;
    this.agentPlugins = [];
    this.agentClassifier = [];
    this.companyId = '';
  }
}
