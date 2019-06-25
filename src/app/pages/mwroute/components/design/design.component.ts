declare var designRouteEditor: any;
declare var renderRouteGraph: any;

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { MWRouteConfig, ApiRouteStep } from 'app/models/mwroute.model';

@Component({
    selector: 'api-mwroute-design',
    templateUrl: './design.component.html',
    styleUrls: ['./design.scss']
})
export class DesignComponent implements OnInit, OnDestroy {

    readOnly: boolean = false;
    routeConfig: MWRouteConfig;

    constructor(
        private zone: NgZone
    ) {
        window['routeComponentRef'] = { component: this, zone: zone };
    }

    ngOnInit() {
        if (!this.routeConfig) {
            this.routeConfig = new MWRouteConfig();
        }

        new designRouteEditor(this.routeConfig.routeSteps, false);
    }

    ngOnDestroy() {
        window['routeComponentRef'] = null;
    }

    deleteRouteStep(routeStepId: string) {

    }

    editRouteStep(routeStepId: string) {

    }

    addRouteStep(routeStepId: string) {
        const routeStep = new ApiRouteStep('Test' + this.routeConfig.routeSteps.length.toString(), 'https://www.automatapi.com');
        console.log(routeStep);
        this.routeConfig.routeSteps.push(routeStep);
        new renderRouteGraph(this.routeConfig.routeSteps, false);
    }

    addRouteStepBefore(routeStepId: string) {

    }
}