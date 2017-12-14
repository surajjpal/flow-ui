export class Intent {
  intentCd: string;
  intentParent: string;
  tags: string[];
  weight: number;

  constructor() {
    this.intentCd = '';
    this.intentParent = '';
    this.tags = [];
    this.weight = 0;
  }
}

export class Entity {
  entityCd: string;
  entityParent: string;
  tags: string[];
  transactionValue: number;

  constructor() {
    this.entityCd = '';
    this.entityParent = '';
    this.tags = [];
    this.transactionValue = 0;
  }
}

export class GoalStep {
  goalExpression: string;
  sequence: number;
  goalResponse: string;
  lang: string;
  api: string;
  key: string;
  authRequired: boolean;
  mandatory: boolean;
  ignoreIntent: boolean;
  goalValidationTypes: string[];
  dependencyExpression: string;
  responseExpression: string;
  actionHtml: string;

  constructor() {
    this.goalExpression = '';
    this.goalResponse = 'New Goal Response';
    this.lang = '';
    this.sequence = 0;
    this.api = '';
    this.key = '';
    this.authRequired = false;
    this.mandatory = false;
    this.ignoreIntent = false;
    this.goalValidationTypes = [];
    this.dependencyExpression = '';
    this.responseExpression = '';
    this.actionHtml = '';
  }
}

export class Goal {
  expression: string;
  goalName: string;
  domainGoalSteps: GoalStep[];
  model: any;
  api: string;
  responseExpression: string;
  validationCheck: boolean;
  flowFlag: boolean;
  htmlFlag: boolean;
  responseChange: boolean;
  responseDependent: boolean;
  valueExpression: string;
  tagExpression: string;

  constructor() {
    this.expression = '';
    this.goalName = '';
    this.domainGoalSteps = [];
    this.model = {};
    this.api = '';
    this.responseExpression = '';
    this.validationCheck = false;
    this.flowFlag = true;
    this.htmlFlag = true;
    this.responseChange = false;
    this.responseDependent = false;
    this.valueExpression = '';
    this.tagExpression = '';
  }
}

export class Response {
  level: number;
  actionHTML: string;
  expression: string;
  lang: string;
  response: string;

  constructor(expression?: string, lang?: string, response?: string, actionHTML?: string) {
    this.level = 1;

    this.expression = expression ? expression : '';
    this.lang = lang ? lang : '';
    this.response = response ? response : '';
    this.actionHTML = actionHTML ? actionHTML : '';
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
