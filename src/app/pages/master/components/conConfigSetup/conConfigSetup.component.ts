declare var showModal: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { ApiConfigService,ConnectorConfigService,FileService } from '../../../../services/setup.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { ApiConfig,ConnectorInfo,ConnectorConfig, ApiResponse,ApiKeyExpressionMap } from '../../../../models/setup.model';

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
  Connectors:ConnectorInfo[] = [];
  connector:string;
  selected:boolean=false;
  createMode:boolean=true;
  connectorsInfo:ConnectorInfo[] = [];
  conInfo:ConnectorInfo;
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
  selectedResponse:ApiResponse;
  responseTypeSource: string[];
  paramsToSelectSource: string[];
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
    this.conInfo = new ConnectorInfo();
    this.responseTypeSource = ['PAYLOAD', 'PARAM'];
    this.paramsToSelectSource = ['SELECTIVE', 'ALL'];
  }

  ngOnInit(): void {

    const conConfig: ConnectorConfig = this.sharingService.getSharedObject();
    if (conConfig) {
      this.createMode = false;
      this.selected = true;
      this.conConfig = conConfig;  
      this.conInfo.displayName =conConfig.displayName;
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
    console.log("calllinggggggg")
    this.subscription = this.connectorConfigService.getConnecterInfo()
      .subscribe(connectorInfos => {
        console.log(connectorInfos)
        if (connectorInfos && connectorInfos.length > 0) {
          this.connectorsInfo = connectorInfos;
          for (let entry of connectorInfos) {
            const configList = [];
            const mandatoryList = []
            if (!entry.taskType){
              this.Connectors.push(entry);
            }
             // 1, "string", false
            for (const property in entry.metaData)
            {
              const map = new Map();
              map.set('key', property);
              if(entry.metaData[property]["mandatory"] == true){
                //entry.metaData['configMap'][property] = "";
                mandatoryList.push(property);
              }
              map.set('value', "");
              configList.push(map);
            }
            this.mainConfigMap[entry.type] = configList;
            this.mainMandatoryMap[entry.type] = mandatoryList;

            
            
        }
        
         }
      });
  }


  // populateSelectedResponse() {
  //   if (this.conConfig && this.conConfig._id && this.conConfig._id.length > 0
  //     && this.conConfig.responseList && this.conConfig.responseList.length > 0) {
  //     this.selectedResponse = this.conConfig.responseList[0];
  //   } else {
  //     this.conConfig.responseList = [];
  //     this.addResponse();
  //     this.selectedResponse = this.conConfig.responseList[0];
  //   }
  // }

  // addResponse(response?: ApiResponse) {
  //   let newResponse = null;
  //   if (response) {
  //     newResponse = response;
  //   } else {
  //     newResponse = new ApiResponse(this.responseTypeSource[0], this.paramsToSelectSource[0]);
  //   }

  //   if (newResponse.keyExpressionList && newResponse.keyExpressionList.length  === 0) {
  //     this.addExpression(newResponse);
  //   }
  //   this.conConfig.responseList.push(newResponse);
  // }


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


  // removeResponse() {
  //   if (this.selectedResponse && this.conConfig.responseList
  //     && this.conConfig.responseList.includes(this.selectedResponse)) {
  //     const index = this.conConfig.responseList.indexOf(this.selectedResponse);
  //     this.conConfig.responseList.splice(index, 1);
  //   }
  // }

  // cloneResponse() {
  //   if (this.selectedResponse) {
  //     const clonedResponse = JSON.parse(JSON.stringify(this.selectedResponse));
  //     this.addResponse(clonedResponse);
  //   }
  // }
  
  populateConnector(conConfig){
    this.Connectors.push(conConfig)
    this.conInfo.displayName = conConfig.displayName;
    this.subscription = this.connectorConfigService.getConnecterInfo()
      .subscribe(connectorInfos => {
      
        if (connectorInfos && connectorInfos.length > 0) {
          for (let entry of connectorInfos) {
            
            const mandatoryList = []
            for (const property in entry.metaData)
            {
              if(entry.metaData[property]["mandatory"] == true){
               // entry.metaData['configMap'][property] = "";
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
    // for (const property in conConfig.requiredConfigMap)
    // {
    //   const newmap = new Map();
    //   newmap.set('key', property);
    //   newmap.set('value', conConfig.requiredConfigMap[property]);
    //   this.requiredConfigList.push(newmap);
    // }

    

  }

  onConfigSelect(con){
    this.conConfig.displayName = con.displayName;
    this.configList = this.mainConfigMap[con.type]
    // for (const property in this.requiredConfig[con]){
    //   const map = new Map();
    //   map.set('key', property);
    //   map.set('value', this.requiredConfig[con][property]);
    //   this.requiredConfigList.push(map);
    // }
    
    this.conConfig.configType = con.type;
    this.conConfig.connectorInfoRef = con.type
    console.log(this.conConfig)
    this.selected = true;
    
  }

  saveConnectorConfiguration(){
    this.conConfig.configMap = {};
      for (const con of this.configList) {
        if (con.get('key') && con.get('key').trim().length > 0) {
          this.conConfig.configMap[con.get('key')] = con.get('value');
        }
      }

      // for (const con of this.requiredConfigList) {
      //   if (con.get('key') && con.get('key').trim().length > 0) {
      //     this.conConfig.requiredConfigMap[con.get('key')] = con.get('value');
      //   }
      // }
      // if(this.conConfig.configType == "email-out"){
      //   this.conConfig.connectorConfigRef = "emailOutConfig"
      // }

      this.checkValidation(this.conConfig.configMap,this.conConfig.configType)
      if(this.mandatorySatisfied){
        if (this.conConfig._id && this.conConfig._id.length > 0) {
          this.updateConConfig();
        } else {
          this.createConConfig();
        }
      }
      else{
        showModal("validationModal");
      }
      
      
    }

    checkValidation(configMap,configType){
          this.notSatisfiedDataPoints = [];
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
    }

    // responseKeyValidator() {
    //   const responseList = this.conConfig.responseList;
  
    //   const duplicateResponseCodes = [];
    //   for (let index = 0; index < responseList.length; index++) {
    //     for (let innerIndex = index + 1; innerIndex < responseList.length; innerIndex++) {
    //       if (responseList[index].responseCode === responseList[innerIndex].responseCode) {
    //         if (!duplicateResponseCodes.includes(responseList[index].responseCode)) {
    //           duplicateResponseCodes.push(responseList[index].responseCode);
    //         }
    //       }
    //     }
    //   }
      
    //   if (duplicateResponseCodes && duplicateResponseCodes.length > 0) {
    //     const error = `Duplicate response codes found: ${duplicateResponseCodes}`;
    //     this.alertService.error(error, false, 5000);
  
    //     return false;
    //   }
  
    //   const duplicateKeys = [];
    //   for (const response of responseList) {
    //     for (let index = 0; index < response.keyExpressionList.length; index++) {
    //       for (let innerIndex = index + 1; innerIndex < response.keyExpressionList.length; innerIndex++) {
    //         if (response.keyExpressionList[index].key === response.keyExpressionList[innerIndex].key) {
    //           if (!duplicateKeys.includes(response.keyExpressionList[index].key)) {
    //             duplicateKeys.push(response.keyExpressionList[index].key);
    //           }
    //         }
    //       }
    //     }
  
    //     if (duplicateKeys && duplicateKeys.length > 0) {
    //       const error = `Duplicate param keys found in response with code ${(response.responseCode)}: ${duplicateKeys}`;
    //       this.alertService.error(error, false, 5000);
  
    //       return false;
    //     }
    //   }
  
    //   return true;
    // }

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
          console.log(data)
          this.alertService.success('Connector Config created successfully', true);
          this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
        });
  }

  updateConConfig(){
    this.subscription = this.connectorConfigService.updateConConfig(this.conConfig)
    .subscribe(
      data => {
        this.alertService.success('Connector Config updated successfully', true);
        this.router.navigate(['/pg/stp/stcc'], { relativeTo: this.route });
      });
  }

  // fileEvent(event){
    
  //   const input = new FormData();
  //   const file: File = event.target.files[0];
  //   console.log(file)
  //   input.append("file",event.target.files[0])
  //   input.append("fileName",file.name)
  //   this.fileSelected = true;
  //   this.selectedFile = input;
  //   for (let config of this.requiredConfigList){
  //     if (config.get('key') == "file-upload"){
  //       config.set('value',file.name);
  //     }
  //   }
  //   this.upload();
    
  // }

  // upload(){
  //   if (this.selectedFile) {
  //     showModal("fileUploadModel");
  //     this.selectedFile.append("functionInstanceName", "emailTemplate");
  //     this.selectedFile.append("entityType","templateUplaod");
  //     this.selectedFile.append("entityRef", "emailTemplate");
  //     console.log(this.selectedFile)
  //     this.subscription =  this.fileService.upload(this.selectedFile)

  //       .subscribe (
  //         response => {
  //           if (response && response["url"] && response["fileName"]) {
  //             let url = `${environment.interfaceService}` +  response["url"]
  //             this.conConfig.templateUrl = url;
  //             this.fileUploaded = true;
  //             closeModal("fileUploadModel");
  //             this.alertService.success('File uploaded successfully', true);
  //           }
  //         })
  //   }
  // }

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