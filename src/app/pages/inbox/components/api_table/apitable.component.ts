declare var designFlowEditor: any;
declare var styleStates: any;
declare var closeModal: any;

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { StateService, DataSharingService } from '../../inbox.service';
import { GraphObject } from '../../../flow/flow.model';
import { State } from '../../inbox.model';


@Component({
  selector: 'apitable',
  templateUrl: './apitable.component.html',
  styleUrls: ['./apitable.scss']
})

export class ApiTableComponent implements OnInit {
  rowsOnPage = 10;
  sortBy = '';
  sortOrder = 'asc';
  filterQuery = '';

  @Input()
  tableTitle: string;
  @Input()
  rawDataArray: Map<string, string>[];

  objectKeys: any = Object.keys;

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();

  selectedState: State;
  selectedStateCd: string;


  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private stateService: StateService,
    private dataSharingService: DataSharingService
  ) { }

  ngOnInit(): void {
    if (!this.rawDataArray) {
      this.tableTitle = '';
      this.rawDataArray = [];
    }
  }

  onSelect(selectedData: any): void {
    this.selectedData.emit(selectedData);
    this.selectedState = selectedData;
    this.selectedStateCd = selectedData.stateCd;

    this.stateService.getXMLforActiveState(selectedData.stateMachineInstanceModelId)
    .then(
      graphObject => {
        this.dataSharingService.setSharedObject(graphObject, this.selectedState);
        this.router.navigate(['/pages/inbox/taskDetails'], { relativeTo: this.route });
      },
      error => {
        console.log("error in fetch");
      }      
    );
  }

  save(): void {
    this.stateService.update(this.selectedState, this.selectedState.machineType,
      this.selectedState.entityId, this.selectedState.payload)
      .then(() => this.goBack());
  }

  goBack(): void {
    new closeModal('detailsModal');
    this.ngOnInit();
  }
}
