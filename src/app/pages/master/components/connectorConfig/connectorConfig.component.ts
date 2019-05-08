import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ApiConfigService, ConnectorConfigService } from '../../../../services/setup.service';
import { DataSharingService, AlertService } from '../../../../services/shared.service';

import { ApiConfig, ConnectorConfig } from '../../../../models/setup.model';

@Component({
  selector: 'connector-connectorConfig',
  templateUrl: './connectorConfig.component.html',
  styleUrls: ['./connectorConfig.scss'],
  providers: [ConnectorConfigService, AlertService]
})

export class ConnectorConfigComponent implements OnInit, OnDestroy {
  conConfigList: ConnectorConfig[];
  filterQuery: string;
  selectedConConfig: ConnectorConfig;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiConfigService: ApiConfigService,
    private sharingService: DataSharingService,
    private connectorConfigService: ConnectorConfigService,
    private alertService: AlertService,

  ) {
    this.conConfigList = [];
    this.filterQuery = '';
    this.selectedConConfig = new ConnectorConfig();
  }

  ngOnInit(): void {
    this.getConList();
  }

  ngOnDestroy(): void {

  }

  onSelect(conConfig: ConnectorConfig) {
    if (conConfig && conConfig._id && conConfig._id.length > 0) {
      this.selectedConConfig = conConfig;
      this.sharingService.setSharedObject(this.selectedConConfig);
      this.router.navigate(['/pg/stp/stccs'], { relativeTo: this.route });
    }
  }

  deleteConfig(conConfig) {
    this.subscription = this.connectorConfigService.deleteConConfig(conConfig)
      .subscribe(
        data => {
          this.getConList();
          this.alertService.success('Connector Config deleted successfully', true);
        });
  }

  createConnecterConfig() {
    this.router.navigate(['/pg/stp/stccs'], { relativeTo: this.route });
  }

  getConList() {
    this.subscription = this.connectorConfigService.getAllCons()
      .subscribe(conConfigList => {
        if (conConfigList) {
          for (let con of conConfigList) {
            if (!con.taskConfig && con.configType != null) {
              this.conConfigList.push(con)
            }
          }
        }
      });
  }
}