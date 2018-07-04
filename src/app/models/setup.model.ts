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

  constructor() {
    super();
    
    this.name = '';
    this.url = '';
    this.method = '';
    this.headers = {};
    this.body = {};
    this.responseList = [];
  }
}

export class ConnectorInfo extends BaseModel {
  type: string;
  metaData: any;
  
  constructor() {
    super();
    this.type = '';
    this.metaData = {};
  }
}

export class ConnectorConfig extends BaseModel {
  configName: string;
  configType: string;
  configMap:any;
  requiredConfigMap:any;
  templateUrl: string;
  connectorConfigRef:string;
  

  constructor() {
    super();
    
    this.configName = '';
    this.configType = '';
    this.templateUrl = '';
    this.configMap = {};
    this.requiredConfigMap = {};
    this.connectorConfigRef = "";
    
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
