import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConnectorInfoService } from '../../../../services/setup.service';
import { DataSharingService, AlertService } from '../../../../services/shared.service';

import { ConnectorInfo, TaskConfigAttribute } from '../../../../models/setup.model';


@Component({
  selector: 'connector-connectorInfoDetail',
  templateUrl: './connectorInfoDetail.component.html',
  providers: [ConnectorInfoService, AlertService]
})
export class ConnectorInfoDetailComponent implements OnInit, OnDestroy {

  connectorInfo: ConnectorInfo;
  createMode: boolean;
  configList: any[];
  payloadList: any[];
  types: string[];
  taskTypes:string[];
  private subscription: Subscription;

  constructor(
    private connectorInfoService: ConnectorInfoService,
    private alertService: AlertService,
    private sharingService: DataSharingService
  ) {
    this.connectorInfo = new ConnectorInfo();
    this.configList = [];
    this.payloadList = [];
    this.types = ['list', 'string', 'encrypted', 'boolean', 'file'];
    this.taskTypes = ['BEAN', 'API', 'PARENT'];
  }

  ngOnInit(): void {
    const connectorInfo: ConnectorInfo = this.sharingService.getSharedObject();
    if (connectorInfo) {
      this.createMode = false;
      this.connectorInfo = connectorInfo;
      console.log(connectorInfo);
      this.populateConfigList();
      this.populatePayloadList();

    } else {
      this.createMode = true;
      this.connectorInfo = new ConnectorInfo();
    }
  }

  populateConfigList() {
    for (const key in this.connectorInfo.metaData) {
      if (key) {
        const configParam = new Map();
        configParam.set('key', key);
        configParam.set('value', this.connectorInfo.metaData[key]);
        this.configList.push(configParam);
      }
    
    }
  }

  populatePayloadList() {
    for (const key in this.connectorInfo.payload) {
      if (key) {
          const map = new Map();
          map.set('key', key);
          map.set('value', this.connectorInfo.payload[key]);
          this.payloadList.push(map);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  createConnectorInfo() {
    this.addDataToConnectorInfo();
    if (this.createMode) {
      this.subscription = this.connectorInfoService.createConnectorInfo(this.connectorInfo)
        .subscribe(response => {
          if (response && response._id) {
            this.connectorInfo = response;
            this.alertService.success("Connector Created successfully", false, 2000);
          }
        });
    }
    else {
      this.subscription = this.connectorInfoService.updateConnectorInfo(this.connectorInfo)
        .subscribe(response => {
          if (response && response._id) {
            console.log("success");
            this.connectorInfo = response;
            this.alertService.success("Connector Updated successfully", false, 2000);
          }
        });
    }
  }

  addConfigParam() {
    const configParam = new Map();
    configParam.set('key', '');
    const map = new Map();
    map['mandatory'] = false;
    map['type'] = '';
    map['valueList'] = [];
    map['validationExpr'] = '';
    configParam.set('value', map);
    this.configList.push(configParam);
  }

  removeConfigParam(index: any) {
      this.configList.splice(index, 1);
    }

  addPayloadParam() {
    const payloadParam = new Map();
    payloadParam.set('key', '');
    payloadParam.set('value', '');
    this.payloadList.push(payloadParam);
  }

  removePayloadParam(payloadParam: any) {
    if (payloadParam && this.payloadList && this.payloadList.includes(payloadParam)) {
      const index = this.payloadList.indexOf(payloadParam);
      this.payloadList.splice(index, 1);
    }
  }

  addDataToConnectorInfo() {
    const metaData = {};
    const payload = {};
    const taskAttrArr = [];
    if ( this.configList.length > 0){
      for ( const configParam of this.configList){
          let taskAttr = new TaskConfigAttribute();
          metaData[configParam.get('key')] = configParam.get('value');
        }
      }
    if ( this.payloadList.length > 0){
      for ( const payloadParam of this.payloadList){
        payload[payloadParam.get('key')] = payloadParam.get('value');
      }
    }
    this.connectorInfo.metaData = metaData;
    this.connectorInfo.payload = payload;
    this.connectorInfo.taskConfigAttributeList = taskAttrArr;

    
  }
}
