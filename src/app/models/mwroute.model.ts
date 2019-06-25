import { BaseModel } from './base.model';
import { ApiKeyExpressionMap } from './setup.model';

export abstract class MWRouteStepConfig {
    "@type": "ApiRouteStep" | "CamelRouteStep" | "ChoiceRouteStep" | "ConnectorRouteStep" | "RuleRouteStep";
    routeStepId: string;
    routeStepName: string;

    constructor(routeStepName?: string) {
        this["@type"] = this["@type"] ? this["@type"] : 'ApiRouteStep';
        this.routeStepId = this.generateObjectId();
        this.routeStepName = routeStepName ? routeStepName : '';
    }

    private generateObjectId() {
        var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    };
}

export class MWCondition {
    conditions: string[];
    conditionName: string;
    routeSteps: MWRouteStepConfig[];

    constructor() {
        this.conditions = [];
        this.conditionName = '';
        this.routeSteps = [];
    }
}

export class ApiRouteStep extends MWRouteStepConfig {
    "@type": "ApiRouteStep";
    apiName: string;

    constructor(routeStepName?: string, apiName?: string) {
        super(routeStepName);

        this.apiName = apiName ? apiName : '';
    }
}

export class CamelRouteStep extends MWRouteStepConfig {
    "@type": "CamelRouteStep";
    routeDsl: string;

    constructor() {
        super();

        this.routeDsl = '';
    }
}

export class ChoiceRouteStep extends MWRouteStepConfig {
    "@type": "ChoiceRouteStep";
    conditions: MWCondition[];

    constructor() {
        super();

        this.conditions = [];
    }
}

export class ConnectorRouteStep extends MWRouteStepConfig {
    "@type": "ConnectorRouteStep";
    configName: string;
    configType: string;

    constructor() {
        super();

        this.configName = '';
        this.configType = '';
    }
}

export class RuleRouteStep extends MWRouteStepConfig {
    "@type": "RuleRouteStep";
    ruleList: ApiKeyExpressionMap[];

    constructor() {
        super();

        this.ruleList = [];
    }
}

export class MWRouteConfig extends BaseModel {
    routeCd: string;
    routeLabel: string;
    version: number;
    routeSteps: MWRouteStepConfig[];

    constructor() {
        super();

        this.routeCd = '';
        this.routeLabel = '';
        this.version = 0;
        this.routeSteps = [];
    }
}