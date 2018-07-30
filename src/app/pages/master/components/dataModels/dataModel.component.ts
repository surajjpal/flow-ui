import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DataModel } from '../../../../models/dataModel.model'
import { DataModelService } from '../../../../services/dataModel.service';
import { DataSharingService } from '../../../../services/shared.service';

@Component({
    selector: 'api-dataModel',
    templateUrl: './dataModel.component.html',
    styleUrls: ['./dataModel.scss']
  })
  
  export class DataModelComponent implements OnInit, OnDestroy {
    
    dataModelList: DataModel[];
    filterQuery: string;
    selectedDataModel: DataModel;

    private subscription: Subscription;

    constructor(private router: Router, private route: ActivatedRoute, private dataModelService: DataModelService, private sharingService: DataSharingService) {
        this.dataModelList = [];
        this.filterQuery = ''
        this.selectedDataModel = null
    }

    ngOnInit(): void {
        this.subscription = this.dataModelService.getAllDataModels()
            .subscribe(apiConfigList => {
                if (apiConfigList) {
                    this.dataModelList = apiConfigList;
                }
            }
        );
    }
    
    ngOnDestroy(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    onSelect(dataModel: DataModel) {
        if (dataModel && dataModel._id && dataModel._id.length > 0) {
            this.selectedDataModel = dataModel;
            this.sharingService.setSharedObject(this.selectedDataModel);
            this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
        }
    }
    
    createDataModel() {
        this.router.navigate(['/pg/stp/stdms'], { relativeTo: this.route });
    }
}