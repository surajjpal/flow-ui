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
import { Algorithm, BusinessObject, BusinessObjectAlgorithm } from '../../../../models/businessobject.model';


@Component({
  selector: 'api-apidesign-setup',
  templateUrl: './apidesignSetup.component.html'
})
export class ApiDesignSetupComponent implements OnInit, OnDestroy {
    apiDesignCreateMode: boolean;
    private subscription: Subscription;
    private definedAlgorithms: Algorithm[];
    private selectedBusinessObject: BusinessObject;
    tempAlgorithm: BusinessObjectAlgorithm;

    businessObjectUpdateCreateMsg = '';
    supportedAlgorithmCategory = ["CLASSIFIER", "REGRESSION"];

    constructor(
          private apiDesignService: ApiDesignService,
          private router: Router,
          private route: ActivatedRoute,
          private alertService: AlertService,
          private sharingService: DataSharingService
        ) {
        this.apiDesignCreateMode = true;
        this.definedAlgorithms = [];
        this.selectedBusinessObject = new BusinessObject();
        this.businessObjectUpdateCreateMsg = '';
        this.tempAlgorithm = new BusinessObjectAlgorithm();
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

  onAlgorithmAdd() {
    if (this.selectedBusinessObject && this.selectedBusinessObject.algorithms) {
      this.selectedBusinessObject.algorithms.push(new BusinessObjectAlgorithm());
    }
    else{
      this.selectedBusinessObject.algorithms = [];
    }
  }
  
}
