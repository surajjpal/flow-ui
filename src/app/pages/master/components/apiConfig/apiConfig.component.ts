import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiConfigService } from '../../../../services/setup.service';
import { DataSharingService } from '../../../../services/shared.service';

import { ApiConfig } from '../../../../models/setup.model';

@Component({
  selector: 'api-apiConfig',
  templateUrl: './apiConfig.component.html',
  styleUrls: ['./apiConfig.scss']
})

export class ApiConfigComponent implements OnInit, OnDestroy {
  apiConfigList: ApiConfig[];
  filterQuery: string;
  selectedApiConfig: ApiConfig;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private sharingService: DataSharingService
  ) {
    this.apiConfigList = [];
    this.filterQuery = '';
    this.selectedApiConfig = new ApiConfig();
  }

  ngOnInit(): void {
    this.subscription = this.apiConfigService.getAllApi()
      .subscribe(apiConfigList => {
        if (apiConfigList) {
          for(let api of apiConfigList){
            if(!api.taskConConfigApi){
              this.apiConfigList.push(api)
            }
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  onSelect(apiConfig: ApiConfig) {
    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      this.selectedApiConfig = apiConfig;

      this.sharingService.setSharedObject(this.selectedApiConfig);
      this.router.navigate(['/pg/stp/stas'], { relativeTo: this.route });
    }
  }

  createApi() {
    this.router.navigate(['/pg/stp/stas'], { relativeTo: this.route });
  }
}
