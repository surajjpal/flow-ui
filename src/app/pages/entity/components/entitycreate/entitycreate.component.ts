declare var closeModal: any;
declare var showModal: any;


import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms'
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AlertService, DataSharingService, UniversalUser } from '../../../../services/shared.service';
import { DataModelObject } from '../../../../services/shared.service';
import { DataModelService } from '../../../../services/setup.service';
import { EntityService } from '../../../../services/entity.service';
import { DataModel, Field, ValidatorInstance, ExtractorInstance, Entity } from '../../../../models/datamodel.model';
import { CommonSearchModel } from '../../../../models/flow.model';

import { FieldTypes } from '../../../../models/constants';
import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import { Body } from '@angular/http/src/body';
import { IMyDpOptions } from 'mydatepicker';

@Component({
    selector: 'api-entity-entitycreate',
    templateUrl: './entitycreate.component.html',
    styleUrls: ['./entitycreate.scss'],
    animations: [
      trigger('slideInOut', [
        transition(':enter', [
          style({ transform: 'translateY(-100%)' }),
          animate('600ms ease-in', style({ transform: 'translateY(0%)' }))
        ]),
        transition(':leave', [
          animate('600ms ease-in', style({ transform: 'translateY(-100%)' }))
        ])
      ])
    ]
  })

export class EntityCreateComponent implements OnInit, OnDestroy {

    dataModelList: DataModel[];
    boolean: any[];
    filterQuery: string;
    selectedDataModel: DataModel;
    form: FormGroup;
    private subscription: Subscription;


    public myDatePickerOptions: IMyDpOptions = {
      dateFormat: 'dd/mm/yyyy'
  };

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sharingObject: DataModelObject,
        private dataModelService: DataModelService,
        private entityService: EntityService,
        private alertService: AlertService
        
      ) {
        this.dataModelList = [];
        this.boolean = [true, false];
        this.filterQuery = '';
        this.selectedDataModel = new DataModel();
      }
    
    ngOnInit() {
        this.getDataModelList();
        this.form = new FormGroup({});

    }

    ngOnDestroy() {

    }

    createEntityModal(dataModel?: DataModel) {
      this.subscription = this.dataModelService.getDataModel(dataModel._id)
    .subscribe(
      datamodel => {
        if (datamodel) {
          this.selectedDataModel = datamodel;
          this.form = this.toFormGroup(this.selectedDataModel.fields);
          new showModal('entityCreateModal');
        }
      });
    }

    getDataModelList() {
        const commonsearchModel = new CommonSearchModel();
        commonsearchModel.searchParams = [{ 'statusCd': 'ACTIVE' }, { 'statusCd': 'DRAFT' }];
        commonsearchModel.returnFields = ['label', 'version', 'statusCd'];
        this.subscription = this.dataModelService.getDataModelList(commonsearchModel)
          .subscribe(list => this.dataModelList = list);
    }

    isValid(field) { 
      return this.form.controls[field.name].valid; 
    }

    toFormGroup(fields: Field[] ) {
      const group: any = {};

      fields.forEach(field => {
        let required = false;
        for ( const validator of field.validators) {
          if ( validator.name === 'Required') {
            required = true;
          }
        }
        group[field.name] = required ? new FormControl(field.value || '', Validators.required)
        : new FormControl(field.value || '');
      });   
      return new FormGroup(group);
    }


    onBooleanChange(event, field?: Field) {

    }

    designEntity() {
      this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
    }

    onDateChanged(event) {
      if (event) {
        // this.selectedAgent.uiComponent.startTime = event["jsdate"];
      }
    } 

    saveEntity() {
      const entity = new Entity();
      entity.fields = this.selectedDataModel.fields;
      entity.label = this.selectedDataModel.label;
      entity.name = this.selectedDataModel.name;
      entity.version = this.selectedDataModel.version;
      entity.process = this.selectedDataModel.process;
      this.subscription = this.entityService.saveEntity(entity)
      .subscribe(
        entity => {
        if ( entity ) {
          new closeModal('entityCreateModal');
          this.alertService.success(entity.label.toString() + ' has been created successfully', false, 2000);
        }
      },
      error => {
        this.alertService.error(error["error"]["message"], false, 2000);
      }
    );
    }

}
