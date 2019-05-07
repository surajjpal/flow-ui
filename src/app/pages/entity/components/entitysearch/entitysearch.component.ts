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
    selector: 'api-entity-entitysearch',
    templateUrl: './entitysearch.component.html',
    styleUrls: ['./entitysearch.scss']
  })

export class EntitySearchComponent implements OnInit, OnDestroy {
    TABLINKS_ACTIVE = "block active";
    TABLINKS = "block";
    progressBarFlag: boolean;
    pageNumber: any;
    fetchRecords: number;
    entityTabclass: any;
    entityList: Entity[];
    selectedEntity: Entity;
    scrollId: string; 
    subscription: Subscription;
    filterQuery: string;
    
    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sharingObject: DataModelObject,
        private dataModelService: DataModelService,
        private entityService: EntityService,
        private alertService: AlertService
        
      ) {
        this.entityList = [];
        this.selectedEntity = null;
        this.entityTabclass = {};
        this.scrollId = null;
        this.filterQuery = '';
      }

    ngOnInit() {
        
        this.pageNumber = 0;
        this.fetchRecords = 10;
        this.getEntitylList();
    }

    ngOnDestroy() {

    }

    getEntitiesFromUsp() {
        this.progressBarFlag = true;
        this.subscription = this.entityService.entityUspSearch(this.scrollId, this.filterQuery)
          .subscribe(response => {
              if(response){
                  this.scrollId = response.scrollId;
                  const list = [];
                  if(response.result.length > 0){
                    this.selectedEntity = response.result[0].payload;
                    for (const en of response.result) {
                        this.entityTabclass[en.payload._id] = this.TABLINKS;
                        list.push(en.payload);
                    }
                    this.entityTabclass[this.selectedEntity._id] = this.TABLINKS_ACTIVE;
                    this.progressBarFlag = false;
                  }
              }
            //   this.progressBarFlag = false;
            //   if ( list.length > 0) {
            //     this.selectedEntity = list[0];
            //     for (const en of list) {
            //         this.entityTabclass[en._id] = this.TABLINKS;
            //     }
            //     this.entityTabclass[this.selectedEntity._id] = this.TABLINKS_ACTIVE;
            //   }
            //   this.entityList = list;
            });
    }

    
    

    getEntitylList() {
        this.subscription = this.entityService.getEntityList(this.pageNumber, this.fetchRecords)
          .subscribe(list => {
              this.progressBarFlag = false;
              if ( list.length > 0) {
                this.selectedEntity = list[0];
                for (const en of list) {
                    this.entityTabclass[en._id] = this.TABLINKS;
                }
                this.entityTabclass[this.selectedEntity._id] = this.TABLINKS_ACTIVE;
              }
              this.entityList = list;
            });
    }

    loadMore() {
        this.subscription = this.entityService.getEntityList(this.pageNumber, this.fetchRecords)
        .subscribe(list => this.entityList.concat(list));
    }

    selectEntity(entity) {
        this.selectedEntity = entity;
        for (const en of this.entityList) {
            this.entityTabclass[en._id] = this.TABLINKS;
          }
          this.entityTabclass[entity._id] = this.TABLINKS_ACTIVE;
    }

    submitEntity() {

    }    

    saveEntity() {

    }

    showDetails() {

    }

    onDateRangeSelect(event) {

    }

}
