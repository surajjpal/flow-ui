declare var closeModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription';


import { AlertService, DataSharingService } from '../../../../services/shared.service';
import { ApiDesignService } from '../../../../services/apidesign.service'
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'api-apidesign-setup',
  templateUrl: './apidesignSetup.component.html'
})
export class ApiDesignSetupComponent implements OnInit, OnDestroy {
    apiDesignCreateMode: boolean;
    private subscription: Subscription;

    constructor(
          private apiDesignService: ApiDesignService
        ) {
        this.apiDesignCreateMode = true;
    }

  ngOnInit() {
    console.log("apidesign setup on init");
    this.subscription = this.apiDesignService.getAlgorithms()
    .subscribe(
      response => {
        console.log(response);
      }
    );
  }

  ngOnDestroy(): void {
    console.log("apidesign setup on destroy");
  }

  
}
