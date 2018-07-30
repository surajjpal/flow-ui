import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { environment } from '../../../../../environments/environment';
import { DataModelService } from '../../../../services/dataModel.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';
import { DataModel } from '../../../../models/dataModel.model';

@Component({
    selector: 'con-dataModelSetup',
    templateUrl: './dataModelSetup.component.html',
    styleUrls: ['./dataModelSetup.scss']
})

export class DataModelSetupComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    private dataModel: DataModel;
    private createMode: boolean;

    ngOnInit(): void {
        //TODO fetch validators and extractor list from server to populate drop downs
        const dataModel: DataModel = this.sharingService.getSharedObject();
        if (dataModel) {
            this.createMode = false;
            this.dataModel = dataModel
        } else {
            this.createMode = true;
            this.dataModel = new DataModel();
        }

    }
    ngOnDestroy(): void {
        if (this.subscription && !this.subscription.closed) {
            this.subscription.unsubscribe();
        }
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private dataModelService: DataModelService,
        private sharingService: DataSharingService,
        private alertService: AlertService
    ) {

    }

    updateDataModel() {
        this.subscription = this.dataModelService.update(this.dataModel)
            .subscribe(
                data => {
                    this.alertService.success('API Config updated successfully', true);
                    this.router.navigate(['/pg/stp/stdm'], { relativeTo: this.route });
                }
            );
    }

    createDataModel() {
        this.subscription = this.dataModelService.create(this.dataModel)
            .subscribe(
                data => {
                    this.alertService.success('API Config created successfully', true);
                    this.router.navigate(['/pg/stp/stdm'], { relativeTo: this.route });
                }
            );
    }

    deleteDataModel() {
        this.subscription = this.dataModelService.delete(this.dataModel)
            .subscribe(
                data => {
                    this.alertService.success('API Config deleted successfully', true);
                    this.router.navigate(['/pg/stp/stdm'], { relativeTo: this.route });
                }
            );
    }

    saveDataModel() {
        if (this.dataModel._id && this.dataModel._id.length > 0) {
            this.updateDataModel();
        } else {
            this.createDataModel();
        }
    }
}