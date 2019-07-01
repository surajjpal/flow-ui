import { BaseModel } from './base.model';
import { ApiKeyExpressionMap } from './setup.model';
import { Expression } from './flow.model';

export interface CamelExecutable {

}

export abstract class MWRouteStepConfig {
    "@type": "ApiRouteStep" | "CamelRouteStep" | "ChoiceRouteStep" | "ConnectorRouteStep" | "RuleRouteStep" | "JaxbMarshallRouteStep" | "JaxbUnmarshallRouteStep" | "JsonMarshallRouteStep" | "JsonUnmarshallRouteStep";
    routeStepId: string;
    routeStepName: string;

    constructor(existingObject?: MWRouteStepConfig) {
        if (existingObject) {
            this.routeStepId = existingObject.routeStepId;
            this.routeStepName = existingObject.routeStepName;
        } else {
            this.routeStepId = this.generateObjectId();
            this.routeStepName = '';
        }
    }

    private generateObjectId() {
        var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
        return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
            return (Math.random() * 16 | 0).toString(16);
        }).toLowerCase();
    };
}

export class MWCondition {
    conditionName: string;
    operand: "AND" | "OR" ;
    conditions: Expression[];
    routeSteps: MWRouteStepConfig[];

    constructor(conditionName?: string, operand?: "AND" | "OR", conditions?: Expression[], routeSteps?: MWRouteStepConfig[]) {
        this.conditionName = conditionName ? conditionName : '';
        this.operand = operand ? operand : 'AND';
        this.conditions = conditions && conditions.length > 0 ? conditions : [new Expression()];
        this.routeSteps = routeSteps ? routeSteps : [];
    }
}

export class ApiRouteStep extends MWRouteStepConfig {
    "@type": "ApiRouteStep";
    apiName: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "ApiRouteStep";
        this.apiName = '';
    }
}

export class CamelRouteStep extends MWRouteStepConfig {
    "@type": "CamelRouteStep";
    routeDsl: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "CamelRouteStep";
        this.routeDsl = '';
    }
}

export class ChoiceRouteStep extends MWRouteStepConfig {
    "@type": "ChoiceRouteStep";
    conditions: MWCondition[];

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "ChoiceRouteStep";
        this.conditions = [];
    }
}

export class ConnectorRouteStep extends MWRouteStepConfig {
    "@type": "ConnectorRouteStep";
    configName: string;
    configType: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);
        
        this["@type"] = "ConnectorRouteStep";
        this.configName = '';
        this.configType = '';
    }
}

export class RuleRouteStep extends MWRouteStepConfig {
    "@type": "RuleRouteStep";
    ruleList: ApiKeyExpressionMap[];

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "RuleRouteStep";
        this.ruleList = [];
    }
}

export class JaxbMarshallRouteStep extends MWRouteStepConfig implements CamelExecutable {
    "@type": "JaxbMarshallRouteStep";
    type: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "JaxbMarshallRouteStep";
        this.type = '';
    }
}

export class JaxbUnmarshallRouteStep extends MWRouteStepConfig implements CamelExecutable {
    "@type": "JaxbUnmarshallRouteStep";
    type: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "JaxbUnmarshallRouteStep";
        this.type = '';
    }
}

export class JsonMarshallRouteStep extends MWRouteStepConfig implements CamelExecutable {
    "@type": "JsonMarshallRouteStep";
    type: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "JsonMarshallRouteStep";
        this.type = '';
    }
}

export class JsonUnmarshallRouteStep extends MWRouteStepConfig implements CamelExecutable {
    "@type": "JsonUnmarshallRouteStep";
    type: string;

    constructor(baseObject?: MWRouteStepConfig) {
        super(baseObject);

        this["@type"] = "JsonUnmarshallRouteStep";
        this.type = '';
    }
}

export class MWRouteConfig extends BaseModel {
    routeCd: string;
    routeLabel: string;
    version: number;
    routeSteps: MWRouteStepConfig[];

    constructor(routeCd?: string, routeLabel?: string, version?: number, routeSteps?: MWRouteStepConfig[]) {
        super();

        this.routeCd = routeCd ? routeCd : '';
        this.routeLabel = routeLabel ? routeLabel : '';
        this.version = version ? version : 0;
        this.routeSteps = routeSteps ? routeSteps : [];
    }
}