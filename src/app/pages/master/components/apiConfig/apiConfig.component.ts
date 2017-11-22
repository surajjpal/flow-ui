import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ApiConfigService } from '../../master.service';
import { DataSharingService } from '../../../../shared/shared.service';

import { ApiConfig } from '../../../../models/setup.model';

@Component({
  selector: 'api-apiConfig',
  templateUrl: './apiConfig.component.html',
  styleUrls: ['./apiConfig.scss']
})

export class ApiConfigComponent implements OnInit {
  apiConfigList: ApiConfig[];
  filterQuery: string;
  selectedApiConfig: ApiConfig;

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

  ngOnInit() {
    this.apiConfigService.getAllApi()
      .then(
        apiConfigList => {
          if (apiConfigList) {
            this.apiConfigList = apiConfigList;
          }
        },
        error => {

        }
      )
      .catch(
        error => {

        }
      );
  }

  onSelect(apiConfig: ApiConfig) {
    if (apiConfig && apiConfig._id && apiConfig._id.length > 0) {
      this.selectedApiConfig = apiConfig;

      this.sharingService.setSharedObject(this.selectedApiConfig);
      this.router.navigate(['/pages/master/apiSetup'], { relativeTo: this.route });
    }
  }

  createApi() {
    this.router.navigate(['/pages/master/apiSetup'], { relativeTo: this.route });
  }
}
