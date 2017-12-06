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
  authRequired: boolean;
  mandatory: boolean;
  ignoreIntent: boolean;
  goalValidationTypes: string[];
  dependancyExpression: string;

  constructor() {
    this.goalExpression = '';
    // this.createdDt = new Date();
    this.goalResponse = 'New Goal Response';
    this.lang = '';
    this.sequence = 0;
    this.api = '';
    this.key = '';
    this.authRequired = false;
    this.mandatory = false;
    this.ignoreIntent = false;
    this.goalValidationTypes = [];
    this.dependancyExpression = '';
  }
}

export class Goal {
  // intentName: string;
  // entityName: string;
  expression: string;
  goalName: string;
  // createdDt: Date;
  domainGoalSteps: GoalStep[];
  model: any;
  api: string;
  triggerFlow: boolean;

  constructor() {
    // this.intentName = '';
    // this.entityName = '';
    this.expression = '';
    this.goalName = '';
    // this.createdDt = new Date();
    this.domainGoalSteps = [];
    this.model = {};
    this.api = '';
    this.triggerFlow = true;
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
