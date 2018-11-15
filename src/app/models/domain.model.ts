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
  pickFromNoun: boolean;
  goalValidationTypes: string[];
  dependencyExpression: string;
  responseExpression: string;
  actionHtml: string;
  responses: Response[];

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
    this.pickFromNoun = false;
    this.goalValidationTypes = [];
    this.dependencyExpression = '';
    this.responseExpression = '';
    this.actionHtml = '';
    this.responses = [];
  }
}

export class Goal {
  expression: any;
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
  dependentGoalExpression: string;

  constructor() {
    this.expression = [];
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
    this.dependentGoalExpression = '';
  }
}

export class Stage {
  label: string;
  value: string;

  constructor(label?: string, value?: string) {
    this.label = label ? label : '';
    this.value = value ? value : '';
  }
}

export class ResponseOption {
  value: string;
  label: string;
  url: string;
  agentId: string;
  language: string;

  constructor(value?: string, label?: string, url?: string, agentId?: string, language?: string) {
    this.value = value ? value : '';
    this.label = label ? label : '';
    this.url = url ? url : '';
    this.agentId = agentId ? agentId : '';
    this.language = language ? language : '';
  }
}

export class Document {
  entityType: string;
  functionInstanceName: string;
  entityRef: string;
  version: string;
  fileName: string;
  isPublic: boolean;

  constructor(entityType?: string, functiofunctionInstanceName?: string, fileName?: string, entityRef?: string, isPublic?: boolean) {
    this.entityType = entityType ? entityType : '';
    this.functionInstanceName = functiofunctionInstanceName ? functiofunctionInstanceName : '';
    this.entityRef = entityRef ? entityRef : ''
    this.isPublic = isPublic ? isPublic : true;
  }
}

export class CardData {
  cardName: string;
  templateName: string;
  title: string;
  subTitle: string;
  avatarImageUrl: string;
  imageUrl: string;
  content: string;
  actionable: ResponseData[];
  document: {};
  
  constructor(cardName?: string, templateName?: string, title?: string, subTitle?: string, avatarImageUrl?: string, imageUrl?: string, content?: string, actionable?: ResponseData[]) {
    this.cardName = cardName ? cardName : '';
    this.templateName = templateName ? templateName : '';
    this.title = title ? title : '';
    this.subTitle = subTitle ? subTitle : '';
    this.avatarImageUrl = avatarImageUrl ? avatarImageUrl : '';
    this.imageUrl = imageUrl ? imageUrl : '';
    this.content = content ? content : '';
    this.actionable = actionable ? actionable : [];
    this.document = {};
  }
}

export class ResponseData {
  url: string;
  type: string;
  data: ResponseOption[];
  cardData: string[];

  constructor(url?: string, type?: string, data?: ResponseOption[], cardData?: string[]) {
    this.url = url ? url : '';
    this.type = type ? type : '';
    this.data = data ? data : [];
    this.cardData = cardData ? cardData : [];
  }
}

export class Settings {
  mask: string;
  secured: boolean;
  validationRegex: string;
  placeholder: string;
  errorMessage: string;
  enableDatePicker: boolean;

  constructor() {
    this.mask = '';
    this.secured = false;
    this.validationRegex = '';
    this.placeholder = '';
    this.errorMessage = '';
    this.enableDatePicker = false;
  }
}

export class Response {
  uniqueId:string;
  sequence: number;
  level: number;
  actionHTML: string;
  expression: any;
  lang: string;
  response: string;
  request:string;
  stage: string;
  disableUserInput: boolean;
  options: ResponseData[];
  settings: Settings;
  selectionExpression: string;
  uploadDocument: {};
  contextExpression: string;
  faqResponse:boolean;
  features:any;

  constructor(expression?: string[], lang?: string, response?: string,request?: string, actionHTML?: string, sequence?: number, stage?: string, disableUserInput?: boolean,
      options?: ResponseData[], settings?: Settings, selectionExpression?: string, contextExpression?: string,faqResponse?:boolean,features?:any,uniqueId?:string) {
    this.level = 1;

    this.expression = expression ? expression : [];
    this.lang = lang ? lang : '';
    this.response = response ? response : '';
    this.request = request ? request : '';
    this.actionHTML = actionHTML ? actionHTML : '';
    this.sequence = sequence ? sequence : 0;
    this.stage = stage ? stage : '';
    this.disableUserInput = disableUserInput ? disableUserInput : false;
    this.options = options ? options : [];
    this.settings = settings ? settings : new Settings();
    this.selectionExpression = selectionExpression ? selectionExpression : '';
    this.uploadDocument = {};
    this.contextExpression = contextExpression ? contextExpression : '';
    this.faqResponse = faqResponse ? faqResponse : false;
    this.features = features ? features : [];
    this.uniqueId = uniqueId ? uniqueId : '';
  }
}

export class Domain {
  _id: string;
  previousDomainId:string;
  statusCd:string;
  version:number;
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
  cards: CardData[];

  constructor() {
    this._id = null;
    this.previousDomainId = '';
    this.statusCd = '';
    this.version = 0;
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
    this.cards = [];
  }
}
