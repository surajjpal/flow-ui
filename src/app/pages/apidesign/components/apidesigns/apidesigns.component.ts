import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { BusinessObject, Algorithm, BusinessObjectAlgorithm } from '../../../../models/businessobject.model';

import { AlertService, DataSharingService } from '../../../../services/shared.service';
import { ApiDesignService } from '../../../../services/apidesign.service'


@Component ({
  selector: 'api-designs',
  templateUrl: './apidesigns.component.html',
  styleUrls: ['./apidesigns.scss']
})
export class ApiDesignsComponent implements OnInit, OnDestroy {
  
  private subscription: Subscription;
  private businessObjects: BusinessObject[];
  private definedAlgorithms: Algorithm[];
  selectedBusinessObject: BusinessObject;
  filterQuery: string;
  
  constructor(
    private apiDesignService: ApiDesignService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private sharingService: DataSharingService
  ) {
    this.businessObjects = [];
    this.filterQuery = '';
    this.selectedBusinessObject = new BusinessObject();
  }
  
  ngOnInit() {
    this.subscription = this.apiDesignService.getAlgorithms()
    .subscribe(
      response => {
        console.log(response);
        this.definedAlgorithms = response;
      }, error => {
        this.definedAlgorithms = [];
      }
    );
    this.subscription = this.apiDesignService.getBusinessObjects()
                          .subscribe(
                            response => {
                              console.log("businessobjects");
                              console.log(response);
                              this.businessObjects = response;
                            },
                            error => {
                              console.log("error");
                              console.log(error);
                            }
                          )
  }
  
  ngOnDestroy(): void {
    
  }

  getActiveVersion(businessobject: BusinessObject) {
    for(let train of businessobject.training) {
      if (train.status == "ACTIVE") {
        return train.version;
      }
    }
    return "";
  }

  getAlgorithmName(algorithm: BusinessObjectAlgorithm) {
    for(let algo of this.definedAlgorithms) {
      if (algo._id == algorithm.algorithmId) {
        return algo.name;
      }
    }
    return '';
  }

  onBusinessObjectSelect(businessObject: BusinessObject) {
    if (businessObject) {
      this.selectedBusinessObject = businessObject;
    } else {
      this.selectedBusinessObject = null;
    }

    this.sharingService.setSharedObject(this.selectedBusinessObject);

    this.router.navigate(['/pg/apidgn/apidgnstp'], { relativeTo: this.route });
  }
}
