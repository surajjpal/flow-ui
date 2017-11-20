declare var designFlowEditor: any;
declare var styleStates: any;
declare var closeModal: any;

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { StateService } from '../../inbox.service';
import { GraphObject } from '../../../flow/flow.model';


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
  @Input()
  parameterKeys: Map<string, string>;

  objectKeys: any = Object.keys;

  @Output()
  selectedData: EventEmitter<any> = new EventEmitter<any>();

  selectedState: any;
  selectedStateCd: string;


  constructor(private stateService: StateService) { }

  ngOnInit(): void {
    if (this.rawDataArray && this.parameterKeys) {
      // this.parameterKeys.forEach((key: string, value: string) => {
      //   for (const data of this.rawDataArray) {
      //     if (data) {
      //       console.log('Key: ' + key + ' Data: ' + data.get(key));
      //     }
      //   }
      // });

      // this.sortBy = this.parameterKeys.keys().next().value;

      // console.log(this.parameterKeys);
    } else {
      this.tableTitle = '';
      this.rawDataArray = [];
      this.parameterKeys = new Map();
    }
  }

  onSelect(selectedData: any): void {
    this.selectedData.emit(selectedData);
    this.selectedState = selectedData;
    this.selectedStateCd = selectedData.stateCd;

    this.stateService.getXMLforActiveState(selectedData.stateMachineInstanceModelId)
    .then(
      graphObject => {
        console.log(graphObject);
        new designFlowEditor(graphObject.xml, true);
        new styleStates(graphObject.activeStateIdList,graphObject.closedStateIdList);
      },
      error => {
        console.log("error in fetch");
      }      
    );
  }

  save(): void {
    this.stateService.update(this.selectedState, this.selectedState.machineType, this.selectedState.entityId, this.selectedState.payload)
      .then(() => this.goBack());
  }

  goBack(): void {
    new closeModal('detailsModal');
    this.ngOnInit();
  }
}
