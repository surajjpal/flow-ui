import { BaseModel } from './base.model';
import { ApiKeyExpressionMap } from './setup.model';

export abstract class MWRouteStepConfig {
    "@type": "ApiRouteStep" | "CamelRouteStep" | "ChoiceRouteStep" | "ConnectorRouteStep" | "RuleRouteStep";
    routeId: string;
    constructor() {

    }

    private 
}

export class MWCondition {
    condition: string;
    routeSteps: MWRouteStepConfig[];

    constructor() {
        this.condition = '';
        this.routeSteps = [];
    }
}

export class ApiRouteStep extends MWRouteStepConfig {
    "@type": "ApiRouteStep";
    apiName: string;

    constructor() {
        super();

        this.apiName = '';
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