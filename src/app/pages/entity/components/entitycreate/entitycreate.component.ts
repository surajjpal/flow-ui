


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
    selector: 'api-entity-entitycreate',
    templateUrl: './entitycreate.component.html',
    styleUrls: ['./entitycreate.scss']
  })

export class EntityCreateComponent implements OnInit, OnDestroy {

    ngOnInit(){

    }

    ngOnDestroy(){

    }

}