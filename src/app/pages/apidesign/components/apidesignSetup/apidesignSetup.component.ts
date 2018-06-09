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
      this.tempBusinessAlgorithm = businessAlgorithm;
      for(var i; i<=this.definedAlgorithms.length; i++) {
        if (this.definedAlgorithms[i]._id == this.tempBusinessAlgorithm.algorithmId) {
          this.selectedAlgorithmName = this.definedAlgorithms[i].name;
        }
      }
      if(businessAlgorithm.configParametrs) {
        businessAlgorithm.configParametrs.forEach((value, key) => {
          businessAlgorithm.configList.push(new ConfigParams(key, value));
        })
      }
    }
    else{
      this.algorithmsModalHeader = 'Add Algorithm';
      this.selectedAlgorithmName = '';
      this.tempBusinessAlgorithm = new BusinessObjectAlgorithm();
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
    console.log("addAlgorithm");
    console.log(this.tempBusinessAlgorithm.configParametrs);
    new closeModal('algorithmModal');
  }
  
}
