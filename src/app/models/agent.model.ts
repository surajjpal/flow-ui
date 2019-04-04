import { Domain } from './domain.model';

export class UIComponent {
  colorCss: string;
  font: string;
  logoUrl: string;
  typingGif: string;
  avatarUrl: string;
  placeHolderText: string;
  episodeIdleTimeout: number;
  delayInMessages: boolean;
  episodeCloseTimeout: number;
  cronEnabled: boolean;
  isBargeable: boolean;
  conversationWindowTitlePrefix: string;
  startTime:any;
  initMessage: string;

  constructor() {
    this.colorCss = '';
    this.font = '';
    this.logoUrl = '';
    this.typingGif = '';
    this.avatarUrl = '';
    this.placeHolderText = 'Type your query...';
    this.episodeIdleTimeout = 240;      // In minutes - default 4hrs - 240 mins
    this.delayInMessages = false;
    this.episodeCloseTimeout = 2880;
    this.cronEnabled = false;
    this.isBargeable = false;
    this.conversationWindowTitlePrefix = 'Chatting with';
    this.startTime = null;
    this.initMessage = '';
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
  uiComponent: UIComponent;
  domainId: string;
  autodetectLanguage: boolean;
  defaultLanguage: string;
  disabled: boolean;
  debugMode: boolean;
  companyTestingAgent:boolean;

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
    this.uiComponent = new UIComponent();
    this.domainId = '';
    this.autodetectLanguage = false;
    this.defaultLanguage = '';
    this.disabled = false;
    this.debugMode = false;
    this.companyTestingAgent = false;
  }
}
