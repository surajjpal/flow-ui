declare var closeModal: any;
declare var showModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AlertService, DataSharingService,UniversalUser } from '../../../../services/shared.service';
import { DataModelObject } from '../../../../services/shared.service';
import { DataModelService } from '../../../../services/setup.service';
import { DataModel,Field } from '../../../../models/datamodel.model';
import {FieldTypes} from '../../../../models/constants';
import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Body } from '@angular/http/src/body';

@Component({
  selector: 'dataModelSetup-dataModelSetup',
  templateUrl: './dataModelSetup.component.html',
  styleUrls: ['./dataModelSetup.scss']
})
export class DataModelSetupComponent implements OnInit, OnDestroy {

  private readonly ACTIVE = 'ACTIVE';
  private readonly CLOSED = 'CLOSED';
  private readonly DRAFT = 'DRAFT';
  private readonly READ = "READ";
  private readonly CLONED = 'CLONED';

  createMode:boolean;
  selectedDataModel:DataModel;
  


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService,
    private slimLoadingBarService: SlimLoadingBarService,
    private user:UniversalUser,
    private sharingObject: DataModelObject,
    private dataModelService:DataModelService
  )
  {
    this.createMode = false;
    this.selectedDataModel = new DataModel();
  }

    ngOnInit(){
        const dataModel: DataModel = this.sharingObject.getDataModel();
        if(dataModel){
            this.createMode = false;
            this.selectedDataModel = dataModel;
        }
        else{
            this.selectedDataModel = new DataModel();
            this.createMode = true;
        }

    }

    ngOnDestroy(){
      this.sharingObject.removeDataModel();
    }

    addNewField(){
        if (this.selectedDataModel && this.selectedDataModel.fields) {
          this.selectedDataModel.fields.push(new Field());
        }
      }

    removeAttribute(field: Field) {
        if (field) {
          const index: number = this.selectedDataModel.fields.indexOf(field);
          if (index !== -1) {
            this.selectedDataModel.fields.splice(index, 1);
          }
        }
      }
}