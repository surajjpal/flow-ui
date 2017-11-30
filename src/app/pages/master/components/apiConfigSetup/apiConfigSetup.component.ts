import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiConfigService } from '../../../../services/setup.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { ApiConfig, ApiResponse, ApiKeyExpressionMap } from '../../../../models/setup.model';

@Component({
  selector: 'api-apiConfigSetup',
  templateUrl: './apiConfigSetup.component.html',
  styleUrls: ['./apiConfigSetup.scss']
})

export class ApiConfigSetupComponent implements OnInit, OnDestroy {
  // For UI elements
  createMode: boolean;
  isBodyTextEditor: boolean;
  isDataFormatJson: boolean;
  methodSource: string[];
  selectedResponse: ApiResponse;
  responseTypeSource: string[];
  paramsToSelectSource: string[];

  // Actual ApiConfig variables
  apiConfig: ApiConfig;
  headers: any;
  headersList: any[];
  textBody: string;
  bodyList: any[];

  private subscription: Subscription;
  private subscriptionMethods: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private sharingService: DataSharingService,
    private alertService: AlertService
  ) {
    this.createMode = true;
    this.isBodyTextEditor = false;
    this.isDataFormatJson = true;
    this.methodSource = [];
    this.responseTypeSource = ['PAYLOAD', 'PARAM'];
    this.paramsToSelectSource = ['SELECTIVE', 'ALL'];
  }

  ngOnInit() {
    this.subscriptionMethods = this.apiConfigService.getSupportedMethods()
      .subscribe(methods => {
        if (methods && methods.length > 0) {
          this.methodSource = methods;
          if (this.apiConfig.method && this.apiConfig.method.length <= 0) {
            this.apiConfig.method = this.methodSource[0];
          }
        }
      });

    // Init methods for UI
    const apiConfig: ApiConfig = this.sharingService.getSharedObject();
    if (apiConfig) {
      this.createMode = false;
      this.apiConfig = apiConfig;  
    } else {
      this.createMode = true;
      this.apiConfig = new ApiConfig();
    }

    this.populateHeaderList();
    this.populateBody();
    this.populateSelectedResponse();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionMethods && !this.subscriptionMethods.closed) {
      this.subscriptionMethods.unsubscribe();
    }
  }

  populateHeaderList() {
    this.isDataFormatJson = true;
    this.headersList = [];

    if (this.apiConfig && this.apiConfig._id && this.apiConfig._id.length > 0 && this.apiConfig.headers) {
      for (const property in this.apiConfig.headers) {
        if (property) {
          if (property === 'Content-Type') {
            if (this.apiConfig.headers[property] === 'application/json') {
              this.isDataFormatJson = true;
            } else {
              this.isDataFormatJson = false;
            }

            continue;
          }

          const map = new Map();
          map.set('key', property);
          map.set('value', this.apiConfig.headers[property]);
          this.headersList.push(map);
        }
      }
    }

    if (this.headersList.length <= 0) {
      this.addHeader();
    }
  }

  populateBody() {
    this.isBodyTextEditor = false;
    
    if (this.apiConfig && this.apiConfig._id && this.apiConfig._id.length > 0 && this.apiConfig.body) {
      if (this.apiConfig.body instanceof String || typeof this.apiConfig.body === 'string'
        || typeof this.apiConfig.body === 'number') {
        this.isBodyTextEditor = true;

        this.textBody = this.apiConfig.body.toString();
        this.bodyList = [];
      } else {
        this.isBodyTextEditor = false;

        this.textBody = '';
        this.bodyList = [];

        for (const property in this.apiConfig.body) {
          if (property) {
            const map = new Map();
            map.set('key', property);
            map.set('value', this.apiConfig.body[property]);
            this.bodyList.push(map);
          }
        }

        if (this.bodyList.length <= 0) {
          this.addBody();
        }
      }
    } else {
      this.textBody = '';
      this.bodyList = [];
      this.addBody();
    }
  }

  populateSelectedResponse() {
    if (this.apiConfig && this.apiConfig._id && this.apiConfig._id.length > 0
      && this.apiConfig.responseList && this.apiConfig.responseList.length > 0) {
      this.selectedResponse = this.apiConfig.responseList[0];
    } else {
      this.apiConfig.responseList = [];
      this.addResponse();
      this.selectedResponse = this.apiConfig.responseList[0];
    }
  }

  addHeader() {
    const header = new Map();
    header.set('key', '');
    header.set('value', '');
    this.headersList.push(header);
  }

  removeHeader(header: any) {
    if (header && this.headersList && this.headersList.includes(header)) {
      const index = this.headersList.indexOf(header);
      this.headersList.splice(index, 1);
    }
  }

  addBody() {
    const body = new Map();
    body.set('key', '');
    body.set('value', '');
    this.bodyList.push(body);
  }

  removeBody(body: any) {
    if (body && this.bodyList && this.bodyList.includes(body)) {
      const index = this.bodyList.indexOf(body);
      this.bodyList.splice(index, 1);
    }
  }

  addResponse(response?: ApiResponse) {
    let newResponse = null;
    if (response) {
      newResponse = response;
    } else {
      newResponse = new ApiResponse(this.responseTypeSource[0], this.paramsToSelectSource[0]);
    }

    if (newResponse.keyExpressionList && newResponse.keyExpressionList.length  === 0) {
      this.addExpression(newResponse);
    }
    this.apiConfig.responseList.push(newResponse);
  }

  removeResponse() {
    if (this.selectedResponse && this.apiConfig.responseList
      && this.apiConfig.responseList.includes(this.selectedResponse)) {
      const index = this.apiConfig.responseList.indexOf(this.selectedResponse);
      this.apiConfig.responseList.splice(index, 1);
    }
  }

  cloneResponse() {
    if (this.selectedResponse) {
      const clonedResponse = JSON.parse(JSON.stringify(this.selectedResponse));
      this.addResponse(clonedResponse);
    }
  }

  addExpression(response?: ApiResponse) {
    if (response) {
      response.keyExpressionList.push(new ApiKeyExpressionMap());
    } else if (this.selectedResponse) {
      this.selectedResponse.keyExpressionList.push(new ApiKeyExpressionMap());
    }
  }

  removeExpression(expression: ApiKeyExpressionMap) {
    if (expression && this.selectedResponse && this.selectedResponse.keyExpressionList
      && this.selectedResponse.keyExpressionList.includes(expression)) {
        const index = this.selectedResponse.keyExpressionList.indexOf(expression);
        this.selectedResponse.keyExpressionList.splice(index, 1);
    }
  }

  saveApiConfiguration() {
    if (this.basicValidator() && this.keyValidator(this.headersList, true) && this.keyValidator(this.bodyList, false)
      && this.responseKeyValidator()) {

      this.apiConfig.headers = {};
      for (const header of this.headersList) {
        if (header.get('key') && header.get('key').trim().length > 0) {
          this.apiConfig.headers[header.get('key')] = header.get('value');
        }
      }

      if (this.apiConfig.method === 'POST' || this.apiConfig.method === 'PUT') {
        // For some reason, direct boolean comparison isn't working
        if (this.isDataFormatJson.toString() === 'true') {
          this.apiConfig.headers['Content-Type'] = 'application/json';
        } else {
          this.apiConfig.headers['Content-Type'] = 'text/plain';
        }

        this.apiConfig.body = null;
        // For some reason, direct boolean comparison isn't working
        if (this.isBodyTextEditor.toString() === 'true') {
          this.apiConfig.body = this.textBody;
        } else {
          this.apiConfig.body = {};
          for (const body of this.bodyList) {
            this.apiConfig.body[body.get('key')] = body.get('value');
          }
        }
      } else {
        this.apiConfig.body = null;
      }

      if (this.apiConfig._id && this.apiConfig._id.length > 0) {
        this.updateApiConfig();
      } else {
        this.createApiConfig();
      }
    }
  }

  updateApiConfig() {
    this.subscription = this.apiConfigService.updateApiConfig(this.apiConfig)
      .subscribe(
        data => {
          this.alertService.success('API Config updated successfully', true);
          this.router.navigate(['/pages/master/apiConfig'], { relativeTo: this.route });
        });
  }

  createApiConfig() {
    this.subscription = this.apiConfigService.createApiConfig(this.apiConfig)
    .subscribe(
      data => {
        this.alertService.success('API Config created successfully', true);
        this.router.navigate(['/pages/master/apiConfig'], { relativeTo: this.route });
      });
  }

  onResponseTypeChange() {
    if (this.selectedResponse) {
      this.selectedResponse.keyExpressionList = [];
      this.addExpression();
    }
  }

  basicValidator() {
    if (this.apiConfig) {
      if (!this.apiConfig.name || this.apiConfig.name.trim().length <= 0) {
        this.alertService.error('Name can\'t be empty', false, 5000);
        return false;
      }
      if (!this.apiConfig.url || this.apiConfig.url.trim().length <= 0) {
        this.alertService.error('URL can\'t be empty', false, 5000);
        return false;
      }
      if (!this.apiConfig.method || this.apiConfig.method.trim().length <= 0) {
        this.alertService.error('Method can\'t be empty', false, 5000);
        return false;
      }

      return true;
    }
    
    return false;
  }

  keyValidator(paramList: any[], isHeader: boolean) {
    const duplicateKeys = [];
    for (let index = 0; index < paramList.length; index++) {
      for (let innerIndex = index + 1; innerIndex < paramList.length; innerIndex++) {
        if (paramList[index].get('key') === paramList[innerIndex].get('key')) {
          if (!duplicateKeys.includes(paramList[index].get('key'))) {
            duplicateKeys.push(paramList[index].get('key'));
          }
        }
      }
    }

    if (duplicateKeys && duplicateKeys.length > 0) {
      const error = `Duplicate ${(isHeader ? 'header' : 'body')} keys found: ${duplicateKeys}`;
      this.alertService.error(error, false, 5000);

      return false;
    }

    return true;
  }

  responseKeyValidator() {
    const responseList = this.apiConfig.responseList;

    const duplicateResponseCodes = [];
    for (let index = 0; index < responseList.length; index++) {
      for (let innerIndex = index + 1; innerIndex < responseList.length; innerIndex++) {
        if (responseList[index].responseCode === responseList[innerIndex].responseCode) {
          if (!duplicateResponseCodes.includes(responseList[index].responseCode)) {
            duplicateResponseCodes.push(responseList[index].responseCode);
          }
        }
      }
    }
    
    if (duplicateResponseCodes && duplicateResponseCodes.length > 0) {
      const error = `Duplicate response codes found: ${duplicateResponseCodes}`;
      this.alertService.error(error, false, 5000);

      return false;
    }

    const duplicateKeys = [];
    for (const response of responseList) {
      for (let index = 0; index < response.keyExpressionList.length; index++) {
        for (let innerIndex = index + 1; innerIndex < response.keyExpressionList.length; innerIndex++) {
          if (response.keyExpressionList[index].key === response.keyExpressionList[innerIndex].key) {
            if (!duplicateKeys.includes(response.keyExpressionList[index].key)) {
              duplicateKeys.push(response.keyExpressionList[index].key);
            }
          }
        }
      }

      if (duplicateKeys && duplicateKeys.length > 0) {
        const error = `Duplicate param keys found in response with code ${(response.responseCode)}: ${duplicateKeys}`;
        this.alertService.error(error, false, 5000);

        return false;
      }
    }

    return true;
  }
}
