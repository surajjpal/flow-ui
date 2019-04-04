declare var closeModal: any;
declare var showModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DataModelService } from '../../../../services/setup.service';
import { DataModelObject } from '../../../../services/shared.service';

import { DataModel } from '../../../../models/datamodel.model';
import { CommonSearchModel } from '../../../../models/flow.model';


@Component({
  selector: 'datamodel-dataModel',
  templateUrl: './dataModel.component.html',
  styleUrls: ['./dataModel.scss']
})

export class DataModelComponent implements OnInit, OnDestroy {
  dataModelList: DataModel[];
  closedDataModels:DataModel[];
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
  sortOrder = 'asc';
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharingObject: DataModelObject,
    private dataModelService:DataModelService
    
  ) {
    this.dataModelList = [];
    this.closedDataModels = [];
    this.filterQuery = '';
    this.selectedDataModel = new DataModel();
  }

  ngOnInit(): void {
    this.getDataModelList();
  }

  ngOnDestroy(): void {
    
  }

  onDataModelSelect(dataModel?: DataModel,task?:number) {
    this.subscription = this.dataModelService.getDataModel(dataModel._id)
    .subscribe(
      dataModel => {
        if(dataModel!=null && dataModel._id.length > 0)
        {
          this.selectedDataModel = dataModel;
          if (task) {
            if (task === this.OPEN_IN_READONLY_MODE) {
              this.selectedDataModel.statusCd = "READ_ONLY";
              this.sharingObject.setDataModel(this.selectedDataModel);
            } else if (task === this.OPEN_IN_EDIT_MODE) {
              this.sharingObject.setDataModel(this.selectedDataModel);
            } else if (task === this.CLONE_AND_EDIT_MODE) {
              this.selectedDataModel._id = null;
              this.selectedDataModel.statusCd = this.DRAFT;
      
              this.sharingObject.setDataModel(this.selectedDataModel);
            }
            this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
          }
        }
      });
  }

  createDataModel(){
    this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
  }

  getDataModelList(){
    let commonsearchModel = new CommonSearchModel();
    commonsearchModel.searchParams = [{"statusCd":"ACTIVE"},{"statusCd":"DRAFT"}];
    commonsearchModel.returnFields = ["label","version","statusCd"];
    this.subscription = this.dataModelService.getDataModelList(commonsearchModel)
      .subscribe(list => this.dataModelList = list);

    commonsearchModel = new CommonSearchModel();
    commonsearchModel.searchParams = [{"statusCd":"CLOSED"}];
    commonsearchModel.returnFields = ["label","version","statusCd"];
    this.subscription = this.dataModelService.getDataModelList(commonsearchModel)
      .subscribe(dataModelList => this.closedDataModels = dataModelList);
  
  }


  activateDataModel(dataModel?:DataModel,modalName?:string){
      this.subscription = this.dataModelService.activate(dataModel._id)
      .subscribe(response => {
        if (modalName && modalName.length > 0) {
          new closeModal(modalName);
        }
        this.getDataModelList();
      });
  }
}