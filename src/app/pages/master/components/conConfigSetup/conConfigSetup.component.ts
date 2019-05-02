declare var showModal: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { ApiConfigService, ConnectorConfigService, FileService } from '../../../../services/setup.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { ApiConfig, ConnectorInfo, ConnectorConfig, ApiResponse, ApiKeyExpressionMap, TaskConfigAttribute } from '../../../../models/setup.model';

@Component({
  selector: 'con-conConfigSetup',
  templateUrl: './conConfigSetup.component.html',
  styleUrls: ['./conConfigSetup.scss'],
  providers: [ConnectorConfigService, AlertService, FileService]
})

export class ConConfigSetupComponent implements OnInit, OnDestroy {

  taskConfigAttributeList: TaskConfigAttribute[];
  configList: any[];
  typeConfigList: any[];
  requiredConfigList: any[];
  filterQuery: string;
  selectedApiConfig: ApiConfig;
  Connectors: ConnectorInfo[] = [];
  connector: string;
  selected: boolean = false;
  createMode: boolean = true;
  connectorsInfo: ConnectorInfo[] = [];
  conInfo: ConnectorInfo;
  conConfig: ConnectorConfig;
  mainConfigMap: any;
  requiredMap: any;
  fileSelected: boolean;
  selectedFile: FormData;
  requiredList: any;
  requiredConfig: any;
  uploadSucess: boolean;
  mainMandatoryMap: any;
  mandatorySatisfied: boolean;
  fileUploaded: boolean;
  notSatisfiedDataPoints: string[];
  selectedResponse: ApiResponse;
  responseTypeSource: string[];
  paramsToSelectSource: string[];
  tempConfigMapKeys: string[];
  mainConfigTypeMap: any;
  selectedConnector: ConnectorConfig;
  fileName: string;
  temp: any;


  private subscription: Subscription;
  private subscriptionConConfig: Subscription;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private sharingService: DataSharingService,
    private connectorConfigService: ConnectorConfigService,
    private alertService: AlertService,
    private fileService: FileService
  ) {
    this.taskConfigAttributeList = [];
    this.selectedFile = new FormData();
    this.configList = [];
    this.typeConfigList = [];
    this.requiredConfigList = [];
    this.mainMandatoryMap = {};
    this.mainConfigMap = {};
    this.mainConfigTypeMap = {};
    this.requiredMap = {};
    this.requiredList = {};
    this.requiredConfig = {};
    this.filterQuery = '';
    this.temp = {};
    this.mandatorySatisfied = true;
    this.selectedApiConfig = new ApiConfig();
    this.conConfig = new ConnectorConfig();
    this.conInfo = new ConnectorInfo();
    this.responseTypeSource = ['PAYLOAD', 'PARAM'];
    this.paramsToSelectSource = ['SELECTIVE', 'ALL'];
    this.tempConfigMapKeys = [];
  }

  ngOnInit(): void {
    const conConfig: ConnectorConfig = this.sharingService.getSharedObject();
    if (conConfig) {
      this.createMode = false;
      this.selected = true;
      this.conConfig = conConfig;
      this.conInfo.displayName = conConfig.displayName;
      this.getConnecterInfo();

    } else {
      this.fileName = "Please upload a file"
      this.createMode = true;
      this.conConfig = new ConnectorConfig();
      this.getConnecterInfo();
    }
  }

  ngOnDestroy(): void {

  }

  getConnecterInfo() {
    this.subscription = this.connectorConfigService.getConnecterInfo()
      .subscribe(connectorInfos => {
        if (connectorInfos && connectorInfos.length > 0) {
          this.connectorsInfo = connectorInfos;
          for (let entry of connectorInfos) {
            if (!entry.taskType || entry.taskType === 'PARENT') {
              this.Connectors.push(entry);
              if (!this.createMode) {
                this.populateConnector(this.conConfig);
              }
            }
          }
        }
      });
  }


  populateConnector(conConfig: ConnectorConfig) {
    this.selectedConnector = conConfig;
    this.selected = true;
    for(const connectorInfo of this.Connectors){
      if(this.selectedConnector.displayName === connectorInfo.displayName){
        this.conInfo = connectorInfo;
      }
    }
    this.conInfo.displayName = conConfig.displayName;

    this.subscriptionConConfig = this.connectorConfigService.getConInfoByType(conConfig.configType)
      .subscribe(connectorInfo => {
        if (connectorInfo) {
          this.Connectors.push(connectorInfo);
          this.taskConfigAttributeList = connectorInfo.taskConfigAttributeList;

          for (const taskConfigAttribute of this.taskConfigAttributeList) {
            if (conConfig && conConfig.configMap && conConfig.configMap[taskConfigAttribute.key]) {
              taskConfigAttribute.value = conConfig.configMap[taskConfigAttribute.key];
              this.tempConfigMapKeys.push(taskConfigAttribute.key);
            }
          }
          for (const property in conConfig.configMap) {
            if (this.tempConfigMapKeys.indexOf(property) == -1) {
              const taskConfigAttribute = new TaskConfigAttribute();
              taskConfigAttribute.key = property;
              taskConfigAttribute.value = conConfig.configMap[property];
              taskConfigAttribute.type = 'string';
              this.taskConfigAttributeList.push(taskConfigAttribute);
            }
          }
        }
      });
  }

  onConfigSelect(config?:ConnectorInfo) {
    console.log(config.taskConfigAttributeList);
    this.conConfig.displayName = config.displayName;
    this.taskConfigAttributeList = config.taskConfigAttributeList;
    this.conConfig.configType = config.type;
    this.conConfig.connectorInfoRef = config.referenceType;
    this.selected = true;
    console.log(this.taskConfigAttributeList);
  }

  saveConnectorConfiguration() {
    this.conConfig.configMap = {};
    for (const taskConfigAttribute of this.taskConfigAttributeList) {
      if(taskConfigAttribute.value!==null){
        if (taskConfigAttribute.key && taskConfigAttribute.value.trim().length > 0) {
          this.conConfig.configMap[taskConfigAttribute.key] = taskConfigAttribute.value;
        }
      }
    }

    this.checkValidation(this.conConfig.configMap);

    if (this.mandatorySatisfied) {
      if (this.conConfig._id && this.conConfig._id.length > 0) {
        this.updateConConfig();
      } else {
        this.createConConfig();
      }
    }
    else {
      showModal("validationModal");
    }
  }

  checkValidation(configMap) {

    this.notSatisfiedDataPoints = [];

    if (this.conConfig.configName.length == 0) {
      this.notSatisfiedDataPoints.push("name");
    }
    
    for (let mandatory of this.taskConfigAttributeList) {
      if(configMap[mandatory.key]){
        if (mandatory.mandatory && configMap[mandatory.key].length == 0) {
          this.notSatisfiedDataPoints.push(mandatory.key);
        }
      }
    }
    if (this.notSatisfiedDataPoints.length > 0) {
      this.mandatorySatisfied = false;
    }
    else {
      this.mandatorySatisfied = true;
    }
  }

  deleteConnectorConfig() {
    this.subscription = this.connectorConfigService.deleteConConfig(this.conConfig)
      .subscribe(
        data => {
          this.alertService.success('Connector Config deleted successfully', true);
          this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }

  createConConfig() {
    this.subscription = this.connectorConfigService.createConConfig(this.conConfig)
      .subscribe(
        data => {
          this.alertService.success('Connector Config created successfully', true);
          this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }

  updateConConfig() {
    this.subscription = this.connectorConfigService.updateConConfig(this.conConfig)
      .subscribe(
        data => {
          this.alertService.success('Connector Config updated successfully', true);
          this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }


  addParam() {
    const taskConfigAttribute = new TaskConfigAttribute();
    taskConfigAttribute.type = "string";
    this.taskConfigAttributeList.push(taskConfigAttribute);

  }


  removeBody(taskConfigAttribute) {
    if (taskConfigAttribute && this.taskConfigAttributeList && this.taskConfigAttributeList.includes(taskConfigAttribute)) {
      const index = this.taskConfigAttributeList.indexOf(taskConfigAttribute);
      this.taskConfigAttributeList.splice(index, 1);
    }
  }

  onValueSelect(eventValue, taskConfigAttribute) {
    taskConfigAttribute.value = eventValue;
  }



}