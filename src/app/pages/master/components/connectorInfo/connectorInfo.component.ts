import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ConnectorInfoService } from '../../../../services/setup.service';
import { DataSharingService, AlertService } from '../../../../services/shared.service';

import { ConnectorInfo } from '../../../../models/setup.model';

@Component({
  selector: 'connector-connectorInfo',
  templateUrl: './connectorInfo.component.html',
  styleUrls: ['./connectorInfo.scss'],
  providers: [ConnectorInfoService, AlertService]
})

export class ConnectorInfoComponent implements OnInit, OnDestroy {
  connectorInfoList: ConnectorInfo[];
  filterQuery: string;
  selectedConnectorInfo: ConnectorInfo;

  private subscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService,
    private connectorInfoService: ConnectorInfoService,
    private alertService: AlertService,

  ) {
    this.connectorInfoList = [];
    this.filterQuery = '';
    this.selectedConnectorInfo = new ConnectorInfo();
  }

  ngOnInit(): void {
    this.getConnectorInfoList();
  }

  ngOnDestroy(): void {

  }

  onSelect(connectorInfo: ConnectorInfo) {
    if (connectorInfo && connectorInfo._id && connectorInfo._id.length > 0) {
      this.selectedConnectorInfo = connectorInfo;
      this.sharingService.setSharedObject(this.selectedConnectorInfo);
      this.router.navigate(['/pg/stp/stcms'], { relativeTo: this.route });
    }
  }

  delete(connectorInfo) {
    this.subscription = this.connectorInfoService.deleteConnectorInfo(connectorInfo)
      .subscribe(
        data => {
          this.alertService.success('Connector Info deleted successfully', true);
          this.getConnectorInfoList();
        });
  }

  createConnecterInfo() {
    this.router.navigate(['/pg/stp/stcms'], { relativeTo: this.route });
  }

  getConnectorInfoList() {
    this.subscription = this.connectorInfoService.getConnecterInfos()
      .subscribe(connectorInfoList => {
        if (connectorInfoList) {
          for (let con of connectorInfoList) {
            if (!con._id != null) {
              this.connectorInfoList.push(con)
            }
          }
        }
      });
  }
}