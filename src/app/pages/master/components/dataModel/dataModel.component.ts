import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataModelService } from '../../../../services/setup.service';
import { DataModelObject } from '../../../../services/shared.service';

import { DataModel } from '../../../../models/setup.model';

@Component({
  selector: 'datamodel-dataModel',
  templateUrl: './dataModel.component.html',
  styleUrls: ['./dataModel.scss']
})

export class DataModelComponent implements OnInit, OnDestroy {
  dataModelList: DataModel[];
  filterQuery: string;
  selectedDataModel: DataModel;

  private subscription: Subscription;
  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';

  private readonly OPEN_IN_READONLY_MODE = 1;
  private readonly OPEN_IN_EDIT_MODE = 2;
  private readonly CLONE_AND_EDIT_MODE = 3;

  data;
  rowsOnPage = 10;
  sortBy = 'machineType';
  sortOrder = 'asc';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharingObject: DataModelObject,
    private dataModelService:DataModelService
    
  ) {
    this.dataModelList = [];
    this.filterQuery = '';
    this.selectedDataModel = new DataModel();
  }

  ngOnInit(): void {
    this.getConList();
  }

  ngOnDestroy(): void {
    
  }

  onSelect(dataModel?: DataModel,task?:number) {
    this.subscription = this.dataModelService.getDataModel(dataModel._id)
    .subscribe(
      dataModel => {
        if(dataModel!=null && dataModel._id.length > 0)
        {
          this.selectedDataModel = dataModel;
          if (task) {
            if (task === this.OPEN_IN_READONLY_MODE) {
              this.sharingObject.setDataModel(this.selectedDataModel);
            } else if (task === this.OPEN_IN_EDIT_MODE) {
              this.sharingObject.setDataModel(this.selectedDataModel);
            } else if (task === this.CLONE_AND_EDIT_MODE) {
              this.selectedDataModel._id = null;
              this.selectedDataModel.statusCd = this.DRAFT;
      
              this.sharingObject.setDataModel(this.selectedDataModel);
            }
          }
        }
      });
  }

  createConnecterConfig(){
    this.router.navigate(['/pg/stp/stccs'], { relativeTo: this.route });
  }

  getConList(){
  this.subscription = this.dataModelService.getDataModelList()
      .subscribe(dataModelList => {
        if (dataModelList) {
          this.dataModelList = dataModelList;
        }
      });
  }
}