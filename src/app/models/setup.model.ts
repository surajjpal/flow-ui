import { BaseModel } from './base.model';

export class RoleRouteMap {
  _id: string;
  roleCd: string;
  entityId: string;
  entityTypeCd: string;

  constructor() {
    this._id = null;
    this.roleCd = '';
    this.entityId = '';
    this.entityTypeCd = 'Route';
  }
}

export class ApiConfig extends BaseModel {
  name: string;
  url: string;
  method: string;
  headers: any;
  body: any;
  responseList: ApiResponse[];
  taskConConfigApi: boolean;

  constructor() {
    super();

    this.name = '';
    this.url = '';
    this.method = '';
    this.headers = {};
    this.body = {};
    this.responseList = [];
    this.taskConConfigApi = false;
  }
}

export class ConnectorInfo extends BaseModel {
  type: string;
  metaData: any;
  taskConfigAttributeList: TaskConfigAttribute[];
  displayName: string;
  taskType: String;
  referenceType: string;
  payload: any;


  constructor() {
    super();
    this.type = '';
    this.metaData = null;
    this.taskConfigAttributeList = [];
    this.displayName = "";
    this.taskType = "";
    this.referenceType = "";
    this.payload = {};
  }
}

export class TaskConfigAttribute {
  key: string;
  mandatory: boolean;
  type: string;
  validationExpr: string;
  value: string;

  constructor() {
    this.key = "";
    this.type = "";
    this.mandatory = false;
    this.validationExpr = "";
    this.value = "";
  }
}

export class TaskObject {
  responseList: ApiResponse[];
  body: any;

  constructor() {
    this.responseList = [];
    this.body = {};
  }
}

export class ConnectorConfig extends BaseModel {
  configName: string;
  configType: string;
  connectorInfoRef: string;
  configMap: any;
  connectorConfigRef: string;
  displayName: string;
  functionInstanceName: string;
  taskObject: TaskObject;
  taskConfig: boolean;

  constructor() {
    super();

    this.configName = '';
    this.configType = '';
    this.configMap = {};
    this.connectorConfigRef = "";
    this.displayName = "";
    this.functionInstanceName = "";
    this.taskObject = new TaskObject();
    this.taskConfig = false;

  }
}



export class TempConnectorConfig extends BaseModel {
  configName: string;
  configType: string;
  connectorInfoRef: string;
  connectorConfigRef: string;
  connectorConfRefName: string;
  displayName: string;
  functionInstanceName: string;
  taskConfig: boolean;
  configMap: any;
  taskObjectBody: any;
  taskObjectResponseList: ApiResponse[];

  constructor() {
    super();
    this.configName = null;
    this.configType = null;
    this.connectorInfoRef = null;
    this.connectorConfigRef = null;
    this.connectorConfRefName = null;
    this.displayName = null;
    this.functionInstanceName = null;
    this.taskConfig = false;
    this.configMap = [];
    this.taskObjectBody = [];
    this.taskObjectResponseList = [];

  }
}



export class ApiResponse {
  responseCode: number;
  responseType: string;
  paramsToSelect: string;
  keyExpressionList: ApiKeyExpressionMap[];

  constructor(responseType: string, paramsToSelect: string) {
    this.responseCode = 0;
    this.responseType = responseType;
    this.paramsToSelect = paramsToSelect;
    this.keyExpressionList = [];
  }
}

export class ApiKeyExpressionMap {
  key: string;
  expression: string;

  constructor() {
    this.key = '';
    this.expression = '';
  }
}

export class MVELObject {
  input: string;
  expression: string;
  result: string;

  constructor() {
    this.input = '';
    this.expression = '';
    this.result = '';
  }
}
