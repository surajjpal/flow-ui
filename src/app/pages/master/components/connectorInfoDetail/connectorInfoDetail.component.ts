import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ConnectorInfoService } from '../../../../services/setup.service';
import { DataSharingService, AlertService } from '../../../../services/shared.service';

import { ConnectorInfo } from '../../../../models/setup.model';


@Component({
  selector: 'connector-connectorInfoDetail',
  templateUrl: './connectorInfoDetail.component.html',
  providers: [ConnectorInfoService, AlertService]
})
export class ConnectorInfoDetailComponent implements OnInit, OnDestroy {

  connectorInfo: ConnectorInfo;
  createMode: boolean;

  private subscription: Subscription;

  constructor(
    private connectorInfoService: ConnectorInfoService,
    private alertService: AlertService,
    private sharingService: DataSharingService
  ) {
    this.connectorInfo = new ConnectorInfo();
  }

  ngOnInit(): void {
    const connectorInfo: ConnectorInfo = this.sharingService.getSharedObject();
    if (connectorInfo) {
      this.createMode = false;
      this.connectorInfo = connectorInfo;
    } else {
      this.createMode = true;
      this.connectorInfo = new ConnectorInfo();
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  createConnectorInfo() {
    if (this.createMode) {
      this.subscription = this.connectorInfoService.createConnectorInfo(this.connectorInfo)
        .subscribe(response => {
          if (response && response._id) {
            this.connectorInfo = response;

          }
        });
    }
    else {
      this.subscription = this.connectorInfoService.updateConnectorInfo(this.connectorInfo)
        .subscribe(response => {
          if (response && response._id) {
            this.connectorInfo = response;
          }
        });
    }
  }

}
