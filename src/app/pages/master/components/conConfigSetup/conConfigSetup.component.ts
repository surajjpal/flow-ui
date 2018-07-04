declare var showModal: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { ApiConfigService,ConnectorConfigService,FileService } from '../../../../services/setup.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { ApiConfig,ConnectorInfo,ConnectorConfig } from '../../../../models/setup.model';

@Component({
  selector: 'con-conConfigSetup',
  templateUrl: './conConfigSetup.component.html',
  styleUrls: ['./conConfigSetup.scss'],
  providers: [ConnectorConfigService,AlertService,FileService]
})

export class ConConfigSetupComponent implements OnInit, OnDestroy {
  configList: any[];
  requiredConfigList:any[];
  filterQuery: string;
  selectedApiConfig: ApiConfig;
  Connectors:string[] = [];
  connector:string;
  selected:boolean=false;
  createMode:boolean=true;
  connectorInfo:ConnectorInfo[];
  conConfig:ConnectorConfig;
  mainConfigMap:any;
  requiredMap:any;
  fileSelected:boolean;
  selectedFile:FormData;
  requiredList:any;
  requiredConfig:any;
  uploadSucess:boolean;
  mainMandatoryMap:any;
  mandatorySatisfied:boolean;
  fileUploaded:boolean;
  notSatisfiedDataPoints:string[];
  private subscription: Subscription;
  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private sharingService: DataSharingService,
    private connectorConfigService:ConnectorConfigService,
    private alertService:AlertService,
    private fileService:FileService
  ) {
    this.selectedFile = new FormData();
    this.configList = [];
    this.requiredConfigList = [];
    this.mainMandatoryMap = {};
    this.mainConfigMap = {};
    this.requiredMap = {};
    this.requiredList = {};
    this.requiredConfig = {};
    this.filterQuery = '';
    this.mandatorySatisfied = true;
    this.selectedApiConfig = new ApiConfig();
    this.conConfig = new ConnectorConfig();
  }

  ngOnInit(): void {

    const conConfig: ConnectorConfig = this.sharingService.getSharedObject();
    if (conConfig) {
      this.createMode = false;
      this.selected = true;
      this.conConfig = conConfig;  
      this.populateConnector(conConfig);
    } else {
      this.createMode = true;
      this.conConfig = new ConnectorConfig();
      this.getConnecterInfo();
    }

    
    
    
  }

  ngOnDestroy(): void {

    
  }
  getConnecterInfo(){
    this.subscription = this.connectorConfigService.getConnecterInfo()
      .subscribe(connectorInfos => {
        if (connectorInfos && connectorInfos.length > 0) {
          this.connectorInfo = connectorInfos;
          for (let entry of connectorInfos) {
            const configList = [];
            const mandatoryList = []
            this.Connectors.push(entry.type); // 1, "string", false
            for (const property in entry.metaData['configMap'])
            {
              const map = new Map();
              map.set('key', property);
              if(entry.metaData['configMap'][property] == "mandatory"){
                entry.metaData['configMap'][property] = "";
                mandatoryList.push(property);
              }
              map.set('value', entry.metaData['configMap'][property]);
              configList.push(map);
            }
            this.mainConfigMap[entry.type] = configList;
            this.mainMandatoryMap[entry.type] = mandatoryList;
            for( let required of entry.metaData['required']){
              this.requiredList[required] = "";
            }
            this.requiredConfig[entry.type] = this.requiredList;
        }
        
        }
      });
  }
  
  populateConnector(conConfig){
    this.Connectors.push(conConfig.configType)
    this.subscription = this.connectorConfigService.getConnecterInfo()
      .subscribe(connectorInfos => {
      
        if (connectorInfos && connectorInfos.length > 0) {
          for (let entry of connectorInfos) {
            
            const mandatoryList = []
            for (const property in entry.metaData['configMap'])
            {
              if(entry.metaData['configMap'][property] == "mandatory"){
                entry.metaData['configMap'][property] = "";
                mandatoryList.push(property);
              }
            }
            this.mainMandatoryMap[entry.type] = mandatoryList;
          }
        }
      });
    for (const property in conConfig.configMap)
    {
      const map = new Map();
      map.set('key', property);
      map.set('value', conConfig.configMap[property]);
      this.configList.push(map);
    }
    for (const property in conConfig.requiredConfigMap)
    {
      const newmap = new Map();
      newmap.set('key', property);
      newmap.set('value', conConfig.requiredConfigMap[property]);
      this.requiredConfigList.push(newmap);
    }

    

  }

  onConfigSelect(con){
    console.log(this.mainConfigMap)
    this.configList = this.mainConfigMap[con]
    console.log(this.requiredConfig)
    for (const property in this.requiredConfig[con]){
      const map = new Map();
      map.set('key', property);
      map.set('value', this.requiredConfig[con][property]);
      this.requiredConfigList.push(map);
    }
    this.conConfig.configType = con;
    this.selected = true;
    
  }

  saveConnectorConfiguration(){
    this.conConfig.configMap = {};
      for (const con of this.configList) {
        if (con.get('key') && con.get('key').trim().length > 0) {
          this.conConfig.configMap[con.get('key')] = con.get('value');
        }
      }

      for (const con of this.requiredConfigList) {
        if (con.get('key') && con.get('key').trim().length > 0) {
          this.conConfig.requiredConfigMap[con.get('key')] = con.get('value');
        }
      }
      if(this.conConfig.configType == "email-out"){
        this.conConfig.connectorConfigRef = "emailOutConfig"
      }
      this.checkValidation(this.conConfig.configMap,this.conConfig.configType)
      if(this.mandatorySatisfied){
        if(this.fileUploaded){
        if (this.conConfig._id && this.conConfig._id.length > 0) {
          this.updateApiConfig();
        } else {
          this.createConConfig();
        }
      }
      else{
        showModal("fileNotUploaded");
      }
      }
      else{
        showModal("validationModal");
      }
      
      
    }

    checkValidation(configMap,configType){
      this.notSatisfiedDataPoints = [];
      console.log(this.mainMandatoryMap[configType])
      if(this.conConfig.configName.length == 0){
        this.notSatisfiedDataPoints.push("name");
      }
      for(let mandatory of this.mainMandatoryMap[configType]){
        if(configMap[mandatory].length == 0){
          this.notSatisfiedDataPoints.push(mandatory);
        }
      }
      if(this.notSatisfiedDataPoints.length > 0){
        this.mandatorySatisfied = false;
      }
      else{
        this.mandatorySatisfied = true;
      }
      if(this.mandatorySatisfied){
      for (let config of this.requiredConfigList){
        if (config.get('key') == "file-upload"){
         if(config.get('value').length == 0){
           this.fileUploaded = false
           
         }
        }
      }
    }
    }

    deleteConnectorConfig(){
      this.subscription = this.connectorConfigService.deleteConConfig(this.conConfig)
    .subscribe(
      data => {
        this.alertService.success('Connector Config deleted successfully', true);
        this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
      });
    }
    
    createConConfig(){
    this.subscription = this.connectorConfigService.createConConfig(this.conConfig)
    .subscribe(
      data => {
        this.alertService.success('Connector Config created successfully', true);
        this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
      });
  }

  updateApiConfig(){
    this.subscription = this.connectorConfigService.updateConConfig(this.conConfig)
    .subscribe(
      data => {
        this.alertService.success('Connector Config updated successfully', true);
        this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
      });
  }

  fileEvent(event){
    
    const input = new FormData();
    const file: File = event.target.files[0];
    console.log(file)
    input.append("file",event.target.files[0])
    input.append("fileName",file.name)
    this.fileSelected = true;
    this.selectedFile = input;
    for (let config of this.requiredConfigList){
      if (config.get('key') == "file-upload"){
        config.set('value',file.name);
      }
    }
    this.upload();
    
  }

  upload(){
    if (this.selectedFile) {
      showModal("fileUploadModel");
      this.selectedFile.append("functionInstanceName", "emailTemplate");
      this.selectedFile.append("entityType","templateUplaod");
      this.selectedFile.append("entityRef", "emailTemplate");
      console.log(this.selectedFile)
      this.subscription =  this.fileService.upload(this.selectedFile)

        .subscribe (
          response => {
            if (response && response["url"] && response["fileName"]) {
              let url = `${environment.interfaceService}` +  response["url"]
              this.conConfig.templateUrl = url;
              this.fileUploaded = true;
              closeModal("fileUploadModel");
              this.alertService.success('File uploaded successfully', true);
            }
          })
    }
  }

  addParam() {
    const body = new Map();
    body.set('key', '');
    body.set('value', '');
    this.configList.push(body);
  }
  removeBody(body: any) {
    if (body && this.configList && this.configList.includes(body)) {
      const index = this.configList.indexOf(body);
      this.configList.splice(index, 1);
    }
  }

}