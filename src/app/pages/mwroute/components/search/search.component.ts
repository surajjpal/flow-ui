declare var closeModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MWRouteConfig } from 'app/models/mwroute.model';
import { MWRouteService } from 'app/services/mwroute.service';
import { DataSharingService } from 'app/services/shared.service';

@Component({
    selector: 'api-mwroute-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.scss']
})
export class SearchComponent implements OnInit, OnDestroy {

    filterQuery = '';
    rowsOnPage = 10;
    sortBy = 'routeCd';
    sortOrder = 'asc';

    // Models to bind with html
    mwRouteList: MWRouteConfig[];
    selectedRoute: MWRouteConfig = new MWRouteConfig();

    progressBarFlag: boolean = false;

    private subscriptionFetchRoute: Subscription;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private mwRouteService: MWRouteService,
        private dataSharingService: DataSharingService
    ) {

    }

    ngOnInit() {
        this.fetchRoutes();
    }

    private fetchRoutes() {
        this.subscriptionFetchRoute = this.mwRouteService.fetch().subscribe(
            result => {
                if (result && result.length > 0) {
                    this.mwRouteList = result;
                }
            }, error => {

            }
        );
    }

    ngOnDestroy() {
        if (this.subscriptionFetchRoute && !this.subscriptionFetchRoute.closed) {
            this.subscriptionFetchRoute.unsubscribe();
        }
    }

    deleteRoute(modalId: string): void {
        if (this.selectedRoute) {
            // this.subscriptionFetchRoute = this.mwRouteService.delete().subscribe(
            //     result => {
            //         this.fetchRoutes();
            //     }, error => {
    
            //     }
            // );
        }

        new closeModal(modalId);
    }

    onSelect(routeConfig: MWRouteConfig): void {
        if (routeConfig) {
            this.dataSharingService.setSharedObject(routeConfig);
            this.router.navigate(['/pg/mwrt/rtd'], { relativeTo: this.route });
        }
    }

    toInt(){
        //please check this
    }
}