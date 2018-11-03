declare var closeModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription';
import { HttpHeaders } from '@angular/common/http'


import { AlertService, DataSharingService } from '../../../../services/shared.service';
import { FileUploaderService } from '../../../../shared/services/file-uploader.service'
import { ApiDesignService } from '../../../../services/apidesign.service'
import { UniversalUser} from '../../../../services/shared.service'
import { environment } from '../../../../../environments/environment';
import { error } from 'selenium-webdriver';
import { Algorithm, BusinessObject, BusinessObjectAlgorithm, ConfigParams, Training } from '../../../../models/businessobject.model';


@Component({
  selector: 'api-apidesign-setup',
  templateUrl: './apidesignSetup.component.html',
  styleUrls: ['./apidesignSetup.scss']
})
export class ApiDesignSetupComponent implements OnInit, OnDestroy {
    apiDesignCreateMode: boolean;
    algorithmAddUpdateMode: boolean;
    private subscription: Subscription;
    definedAlgorithms: Algorithm[];
    selectedBusinessObject: BusinessObject;
    selectedBusinessObjectAlgorithm: BusinessObjectAlgorithm;
    tempBusinessAlgorithm: BusinessObjectAlgorithm;
    selectedAlgorithmName: string;
    trainingFilterQuery: string;
    apiEndPoint: string;
    fileUploadUrl: string;
    selectedConfigList: ConfigParams[];
    trainingDataUploaderOptions: NgUploaderOptions;

    businessObjectUpdateCreateMsg = '';
    algorithmsModalHeader = '';
    functionInstanceName = "automatonsApi";
    
    supportedAlgorithmCategory = ["CLASSIFIER", "REGRESSION"];

    testRequestData: string = "";
    testRequestdataResult = null;

    constructor(
          private apiDesignService: ApiDesignService,
          private router: Router,
          private route: ActivatedRoute,
          private alertService: AlertService,
          private sharingService: DataSharingService,
          private fileUploaderService: FileUploaderService,
          private universalUser: UniversalUser
        ) {
        this.apiDesignCreateMode = true;
        this.algorithmAddUpdateMode = true;
        this.definedAlgorithms = [];
        this.selectedBusinessObject = new BusinessObject();
        this.businessObjectUpdateCreateMsg = '';
        this.selectedAlgorithmName = '';
        this.trainingFilterQuery = '';
        this.apiEndPoint = '';
        this.tempBusinessAlgorithm = new BusinessObjectAlgorithm();
        this.selectedBusinessObjectAlgorithm = new BusinessObjectAlgorithm();
        this.selectedConfigList = [];
        this.fileUploadUrl = '';
        this.trainingDataUploaderOptions = {
          url: ''
        };
    }

  ngOnInit() {
    console.log("apidesign setup on init");
    this.subscription = this.apiDesignService.getAlgorithms()
    .subscribe(
      response => {
        console.log(response);
        this.definedAlgorithms = response;
      }, error => {
        this.definedAlgorithms = [];
      }
    );
    const businessObject: BusinessObject = this.sharingService.getSharedObject();
    if (businessObject) {
      this.selectedBusinessObject = businessObject;
      this.apiDesignCreateMode = false;
      this.apiEndPoint = `${environment.interfaceService + "/automatons/businessobject/predict/" + this.selectedBusinessObject.code}`;
      if (this.selectedBusinessObject.training) {
        const requestData = {};
        for(let train of this.selectedBusinessObject.training) {
          if (train.status == "ACTIVE") {
            requestData["payload"] = [];
            let data = {}
            for (let inputLabel of  train.inputLabels) {
              data[inputLabel] = "<" + inputLabel +"_value>";
            requestData["payload"] = requestData["payload"].concat(data);
              //requestData["testData"][inputLabel] = [ "<" + inputLabel +"_value>1", "<" + inputLabel +"_value>2" ]
            }
            
          }
        }
        this.testRequestData = JSON.stringify(requestData, undefined, 4);
      }
    }
    else {
      this.selectedBusinessObject = new BusinessObject();
      this.apiDesignCreateMode = true;
    }

  }

  ngOnDestroy(): void {
    console.log("apidesign setup on destroy");
  }

  createBusinesObject() {
    this.businessObjectUpdateCreateMsg = "business object created successfully";
  }

  onAlgorithmAdd(businessAlgorithm?: BusinessObjectAlgorithm) {
    if(businessAlgorithm) {
      this.algorithmsModalHeader = 'Update Algorithm';
      this.selectedBusinessObjectAlgorithm = businessAlgorithm;
      this.tempBusinessAlgorithm = JSON.parse(JSON.stringify(businessAlgorithm));
      this.algorithmAddUpdateMode = false;
      console.log("onAlgorithmAdd");
      console.log(businessAlgorithm.configParametrs);
      if(businessAlgorithm.configParametrs) {
        if(this.tempBusinessAlgorithm.configList.length == 0) {
          for(let key in businessAlgorithm.configParametrs) {
            this.tempBusinessAlgorithm.configList.push(new ConfigParams(key, businessAlgorithm.configParametrs[key]));
            this.selectedConfigList.push(new ConfigParams(key, businessAlgorithm.configParametrs[key]));
          }
        }
        // businessAlgorithm.configParametrs.forEach((value, key) => {
        //   if(this.tempBusinessAlgorithm.configList.length == 0) {
        //     this.tempBusinessAlgorithm.configList.push(new ConfigParams(key, value));
        //   }
        // })
      }
      
    }
    else{
      this.algorithmsModalHeader = 'Add Algorithm';
      this.selectedAlgorithmName = '';
      this.tempBusinessAlgorithm = new BusinessObjectAlgorithm();
      this.algorithmAddUpdateMode = true;
    }
  }

  addConfigParameters(tempBusinessAlgorithm) {
    if(tempBusinessAlgorithm.configList) {
      tempBusinessAlgorithm.configList.push(new ConfigParams());
    }
    else {
      tempBusinessAlgorithm.configList = [];
    }
  }

  addAlgorithm() {
    this.tempBusinessAlgorithm.configParametrs = new Map<string, any>();
    if(this.tempBusinessAlgorithm.configList.length > 0) {
      for (let configParam of this.tempBusinessAlgorithm.configList) {
        this.tempBusinessAlgorithm.configParametrs[configParam.param] = configParam.value;
      }
    }
    this.tempBusinessAlgorithm.configList = [];
    console.log("tempbusinessobjectalgorithm");
    console.log(this.tempBusinessAlgorithm);
    if (this.algorithmAddUpdateMode) {
      this.selectedBusinessObject.algorithms.push(this.tempBusinessAlgorithm);
    }
    else {
      const index: number = this.selectedBusinessObject.algorithms.indexOf(this.selectedBusinessObjectAlgorithm);
      if (index !== -1) {
        this.selectedBusinessObject.algorithms[index] = this.tempBusinessAlgorithm;
      }
    }
    console.log("addAlgorithm");
    console.log(this.tempBusinessAlgorithm.configParametrs);
    new closeModal('algorithmModal');
  }

  removeAlgorithm() {
    const index: number = this.selectedBusinessObject.algorithms.indexOf(this.selectedBusinessObjectAlgorithm);
    if (index != -1) {
      this.selectedBusinessObject.algorithms.splice(index, 1);
    }
  }

  getAlgorithmName(algorithmId) {
      for(let exalgo of this.definedAlgorithms) {
        if (exalgo._id == algorithmId) {
          return exalgo.name;
        }
      }
      return '';
  }
  

  createBusinessObject() {
    console.log("createbusinessobject");
    console.log(this.selectedBusinessObject);
    if (this.apiDesignCreateMode) {
      this.subscription = this.apiDesignService.createBusinessObject(this.selectedBusinessObject)
        .subscribe(
          response => {
            console.log(response);
            this.selectedBusinessObject = response;
            new showAlertModal('Create', "successfully created");
          }, error => {
            console.log(error);
            new showAlertModal('Error', error);
          }
        );
    }
    else {
      this.subscription = this.apiDesignService.updateBusinessObject(this.selectedBusinessObject)
        .subscribe(
          response => {
            console.log("success update");
            console.log(response);
            this.selectedBusinessObject = response;
            new showAlertModal('Update', "successfully updated");
          },
          error => {
            console.log("error update");
            console.log(error);
            new showAlertModal('Error', error);
          }
        )
    }
  }

  activateTriner(trainer: Training) {
    console.log("activate trainer");
    console.log(trainer);
    this.subscription = this.apiDesignService.activateBusinessObjectTraining(this.selectedBusinessObject, trainer.version)
      .subscribe(
        response => {
          console.log(response)
          this.selectedBusinessObject = response;
        },
        error => {
          console.log(error);
          new showAlertModal('Error', error);
        }
      )
  }

  deactivateTriner(trainer: Training) {
    console.log("desctiavte trainer");
    console.log(trainer);
    this.subscription = this.apiDesignService.deactivateBusinessObjectTraining(this.selectedBusinessObject, trainer.version)
      .subscribe(
        response => {
          console.log(response)
          this.selectedBusinessObject = response;
        },
        error => {
          console.log(error);
          new showAlertModal('Error', error);
        }
      )
  }

  onBusinessAlgorithmChange() {
    console.log("on change");
    console.log(this.selectedBusinessObjectAlgorithm.algorithmId)
    this.tempBusinessAlgorithm.configList = []
    if (this.selectedBusinessObjectAlgorithm && this.selectedBusinessObjectAlgorithm.algorithmId == this.tempBusinessAlgorithm.algorithmId) {
      for (let config of this.selectedConfigList) {
        this.tempBusinessAlgorithm.configList.push(config);
      }
    }
    else {
      console.log("defined algo");
      console.log(this.definedAlgorithms);
      for (let algo of  this.definedAlgorithms) {
        if (algo._id == this.tempBusinessAlgorithm.algorithmId) {
          for (let param in algo.configParameters) {
            console.log(param)
            this.tempBusinessAlgorithm.configList.push(new ConfigParams(param, algo.configParameters[param]));
          }
        }
      }
    }
    console.log("configlist");
    console.log(this.tempBusinessAlgorithm.configList);
  }

  onTrainingFileUpload(fileData: FormData) {
    console.log("onFileUpload");
    //console.log(fileData);
    const activeVersion = this.getActiveVersion();
    if (!activeVersion) {
      new showAlertModal('Error', "Activate atleast one version");
    }
    else {
      fileData.append("entityType", "automatons");
      fileData.append("functionInstanceName", this.functionInstanceName);
      fileData.append("entityRef", this.selectedBusinessObject.code);
      fileData.append("version", this.getActiveVersion());
      fileData.append("fileName", "trainingData.csv");
      console.log("fileData");
      console.log(fileData.get("entityType"));
      const companyId = this.universalUser.getUser().companyId;
      const headers = new HttpHeaders({'X-Consumer-Custom-Id' : companyId});
      const trainingFileUploadUrl = `${environment.interfaceService + environment.fileUploadUrl}`
      this.fileUploaderService.upload(fileData, trainingFileUploadUrl, headers)
        .subscribe(
          resposne => {
            console.log("success response");
            console.log(resposne);
            this.trainBusinessObject(this.getActiveVersion());
            
          },
          error => {
            console.log("error");
            console.log(error);
            new showAlertModal('Error', error);
          }
        )
    }
    
  }

  trainBusinessObject(version: string) {
    console.log("train business object ...")
    this.apiDesignService.trainBusinessObject(this.selectedBusinessObject, version)
      .subscribe(
        response => {
          console.log("train successfully");
          this.router.navigate(['/pg/apidgn/apidgn'], { relativeTo: this.route })
        },
        error => {
          console.log("error in training");
          console.log("Error", error);
          new showAlertModal('Error', error);
        }
      )
  }

  getActiveVersion(version?: string) {
    if (version) {
      return version;
    }
    if (!this.selectedBusinessObject.training || this.selectedBusinessObject.training.length == 0){
      return "v1";
    }
    for (let train of this.selectedBusinessObject.training) {
      if (train.status == "ACTIVE") {
        return train.version;
      }
    }
    var versions = []
    for (let train of this.selectedBusinessObject.training) {
      versions.push(parseInt(train.version.split("v")[1]));
    }
    var maxVersion = Math.max.apply(Math, versions);
    version = "v" + String(maxVersion + 1);
    return version;
  }

  testPredictRequestData() {
    if (this.testRequestData) {
      const requestData = JSON.parse(this.testRequestData);
      console.log("requesteddata");
      console.log(requestData);
      if (requestData["payload"]) {
        this.apiDesignService.predictRequestData(this.selectedBusinessObject, requestData)
          .subscribe(
            response => {
              console.log(response);
              this.testRequestdataResult = response;
            },
            error => {
              console.log(error);
              new showAlertModal("Error", error["error"]["message"]);
            }
          )
      }
    }
  }
}
