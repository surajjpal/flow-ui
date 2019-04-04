declare var closeModal: any;
declare var showModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AlertService, DataSharingService,UniversalUser } from '../../../../services/shared.service';
import { DataModelObject } from '../../../../services/shared.service';
import { DataModelService } from '../../../../services/setup.service';
import { DataModel,Field,ValidatorInstance, ExtractorInstance } from '../../../../models/datamodel.model';
import { CommonSearchModel } from '../../../../models/flow.model';

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

  private dataModelSubscription: Subscription;
  createMode:boolean;
  readOnlyMode:boolean;
  selectedDataModel:DataModel;
  fieldTypes:string[];
  process:string;
  validatorTypes:string[];
  extractorTypes:string[];
  dataModelList:DataModel[];
  


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharingService: DataSharingService,
    private slimLoadingBarService: SlimLoadingBarService,
    private user:UniversalUser,
    private sharingObject: DataModelObject,
    private dataModelService:DataModelService,
    private alertService: AlertService,
  )
  {
    this.createMode = false;
    this.readOnlyMode = false;
    this.selectedDataModel = new DataModel();
    this.dataModelList = [];
    this.fieldTypes = ['TEXT', 'FLOAT', 'INT', 'DATE', 'BOOLEAN', 'MODEL'];
    this.validatorTypes = ['ApiInvoker','Rquired'];
    this.extractorTypes = ["Regex","Picklist"];
  }

    ngOnInit(){
        const dataModel: DataModel = this.sharingObject.getDataModel();
        if(dataModel){
            this.createMode = false;
            this.selectedDataModel = dataModel;
            if(this.selectedDataModel.statusCd == "READ_ONLY"){
              this.readOnlyMode = true;
            }
        }
        else{
            this.selectedDataModel = new DataModel();
            this.createMode = true;
        }
        this.getActiveModels();

    }

    ngOnDestroy(){
      this.sharingObject.removeDataModel();
    }


    getActiveModels(){
      let commonsearchModel = new CommonSearchModel();
      commonsearchModel.searchParams = [{"statusCd":"ACTIVE"}];
      commonsearchModel.returnFields = ["name"];
      this.dataModelSubscription = this.dataModelService.getDataModelList(commonsearchModel)
        .subscribe(list => {
          if(list){
              for(let dt of list){
                if(dt._id!=this.selectedDataModel._id && dt.name!=this.selectedDataModel.name){
                  this.dataModelList.push(dt);
                }
              }
          }
          
        });
    }

    saveDataModel(){
     if(this.createMode){
       this.selectedDataModel.statusCd = this.DRAFT;
       this.selectedDataModel.version = 1;
       this.dataModelSubscription =  this.dataModelService.saveDataModel(this.selectedDataModel)
      .subscribe(
      dataModel => {
        if(dataModel){
          this.selectedDataModel = dataModel;
          this.createMode = false;
          this.alertService.success("Data Model saved successfully", false, 2000);
        }
      },
      error => {
        this.alertService.error(error["error"]["message"], false, 2000);
      }
    );
     }
     else if(!this.createMode){
       if(this.selectedDataModel.statusCd == this.DRAFT && this.selectedDataModel._id == null){
         this.selectedDataModel.version = this.selectedDataModel.version + 1;
       }
         this.dataModelSubscription =  this.dataModelService.updateDataModel(this.selectedDataModel)
      .subscribe(
      dataModel => {
        if(dataModel){
          this.selectedDataModel = dataModel;
          this.alertService.success("Data Model updated successfully", false, 2000);
        }
      },
      error => {
        this.alertService.error(error["error"]["message"], false, 2000);
      }
    );
    }
  }

    addNewField(){
        if (this.selectedDataModel && this.selectedDataModel.fields) {
          this.selectedDataModel.fields.push(new Field());
        }
      }
    addValidator(){
      if (this.selectedDataModel && this.selectedDataModel.validators) {
        this.selectedDataModel.validators.push(new ValidatorInstance());
      }
    }

    addFieldValidator(field:Field){
      if (field) {
        const index: number = this.selectedDataModel.fields.indexOf(field);
        if (index !== -1) {
          this.selectedDataModel.fields[index].validators.push(new ValidatorInstance());
        }
      }
    }

    addFieldExtractor(field:Field){
      if (field) {
        const index: number = this.selectedDataModel.fields.indexOf(field);
        if (index !== -1) {
          this.selectedDataModel.fields[index].extractors.push(new ExtractorInstance());
        }
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

      removeValidator(validator:ValidatorInstance){
        if (validator) {
          const index: number = this.selectedDataModel.validators.indexOf(validator);
          if (index !== -1) {
            this.selectedDataModel.validators.splice(index, 1);
          }
        }
      }

      removeFieldValidator(validator:ValidatorInstance,field:Field){
        if (validator && field) {
          const index: number = this.selectedDataModel.fields.indexOf(field);
          const valIndex: number = this.selectedDataModel.fields[index].validators.indexOf(validator)
          if (valIndex !== -1) {
            this.selectedDataModel.fields[index].validators.splice(valIndex, 1);
          }
        }
      }

      removeFieldExtractor(extractor:ExtractorInstance,field:Field){
        if (extractor && field) {
          const index: number = this.selectedDataModel.fields.indexOf(field);
          const valIndex: number = this.selectedDataModel.fields[index].extractors.indexOf(extractor)
          if (valIndex !== -1) {
            this.selectedDataModel.fields[index].extractors.splice(valIndex, 1);
          }
        }
      }

      onTypeSelect(event,field?:Field){
        if(field.type.toString() != "MODEL"){
            field.modelName = "";
         }
         else if(field.type.toString() == "MODEL"){
          if(this.dataModelList.length == 0){
            this.alertService.error("You must have an active data model to attach", false, 2000);
            field.type = null;
          }
         }
      }

      onModelSelect(event,field?:Field){
       
      }

      onValidatorSelect(event,validator){
        console.log(validator);
      }

      onFieldValidatorSelect(event,field,validator){
        console.log(validator);
      }
      onFieldExtractorSelect(event,field,extractor){

      }
}