declare var closeModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription';


import { AlertService, DataSharingService } from '../../../../services/shared.service';
import { ApiDesignService } from '../../../../services/apidesign.service'
import { environment } from '../../../../../environments/environment';
import { error } from 'selenium-webdriver';
import { Algorithm, BusinessObject, BusinessObjectAlgorithm, ConfigParams } from '../../../../models/businessobject.model';


@Component({
  selector: 'api-apidesign-setup',
  templateUrl: './apidesignSetup.component.html'
})
export class ApiDesignSetupComponent implements OnInit, OnDestroy {
    apiDesignCreateMode: boolean;
    algorithmAddUpdateMode: boolean;
    private subscription: Subscription;
    private definedAlgorithms: Algorithm[];
    private selectedBusinessObject: BusinessObject;
    selectedBusinessObjectAlgorithm: BusinessObjectAlgorithm;
    tempBusinessAlgorithm: BusinessObjectAlgorithm;
    selectedAlgorithmName: string;

    businessObjectUpdateCreateMsg = '';
    algorithmsModalHeader = '';
    supportedAlgorithmCategory = ["CLASSIFIER", "REGRESSION"];

    constructor(
          private apiDesignService: ApiDesignService,
          private router: Router,
          private route: ActivatedRoute,
          private alertService: AlertService,
          private sharingService: DataSharingService
        ) {
        this.apiDesignCreateMode = true;
        this.algorithmAddUpdateMode = true;
        this.definedAlgorithms = [];
        this.selectedBusinessObject = new BusinessObject();
        this.businessObjectUpdateCreateMsg = '';
        this.selectedAlgorithmName = '';
        this.tempBusinessAlgorithm = new BusinessObjectAlgorithm();
        this.selectedBusinessObjectAlgorithm = new BusinessObjectAlgorithm();
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
      this.tempBusinessAlgorithm = businessAlgorithm;
      this.algorithmAddUpdateMode = false;
      if(businessAlgorithm.configParametrs) {
        businessAlgorithm.configParametrs.forEach((value, key) => {
          if(this.tempBusinessAlgorithm.configList.length == 0) {
            this.tempBusinessAlgorithm.configList.push(new ConfigParams(key, value));
          }
        })
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
        this.tempBusinessAlgorithm.configParametrs.set(configParam.param, configParam.value);
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
            
          }, error => {
            console.log(error);
          }
        );
    }
  }
  
}
