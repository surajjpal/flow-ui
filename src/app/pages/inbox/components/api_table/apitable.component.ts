declare var designFlowEditor: any;
declare var styleStates: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { environment } from '../../../../../environments/environment';

import { StateService, DataCachingService } from '../../../../services/inbox.service';

import { GraphObject } from '../../../../models/flow.model';
import { State } from '../../../../models/tasks.model';

@Component({
  selector: 'apitable',
  templateUrl: './apitable.component.html',
  styleUrls: ['./apitable.scss']
})

export class ApiTableComponent implements OnInit, OnDestroy {
  rowsOnPage = 10;
  sortBy = '';
  sortOrder = 'asc';
  filterQuery = '';

  @Input()
  rawDataArray: Map<string, string>[];

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();

  selectedState: State;
  selectedStateCd: string;

  private subscription: Subscription;
  private subscriptionXML: Subscription;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private stateService: StateService,
    private dataCachingService: DataCachingService
  ) { }

  ngOnInit(): void {
    if (!this.rawDataArray) {
      this.rawDataArray = [];
    }
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionXML && !this.subscriptionXML.closed) {
      this.subscriptionXML.unsubscribe();
    }
  }

  onSelect(selectedData: any): void {
    this.selectedData.emit(selectedData);
    this.selectedState = selectedData;
    this.selectedStateCd = selectedData.stateCd;

    this.subscriptionXML = this.stateService.getXMLforActiveState(selectedData.stateMachineInstanceModelId)
      .subscribe(graphObject => {
        this.dataCachingService.setSharedObject(graphObject, this.selectedState);
        this.router.navigate(['/pg/tsk/tdts'], { relativeTo: this.route });
      });
  }

  save(): void {
    this.subscription = this.stateService.update(this.selectedState, this.selectedState.machineType,
      this.selectedState.entityId, this.selectedState.payload)
      .subscribe(() => this.goBack());
  }

  goBack(): void {
    new closeModal('detailsModal');
    this.ngOnInit();
  }
}
