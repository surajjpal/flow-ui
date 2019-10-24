import { BaseModel } from './base.model';
import { Expression } from './flow.model';


export abstract class FtcstepConfig {
    "@type": "ConversationTestRouteStep" | "DelayRouteStep" | "VerifyRouteStep";
   routeStepId: string;
   routeStepType: string;

   routeStepName: string;

    constructor(existingObject?: FtcstepConfig) {
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

export class FTCondition {
    conditionName: string;
    operand: "AND" | "OR" ;
    conditions: Expression[];
    testCases: FtcstepConfig[];

    constructor(conditionName?: string, operand?: "AND" | "OR", conditions?: Expression[], testCases?: FtcstepConfig[]) {
        this.conditionName = conditionName ? conditionName : '';
        this.operand = operand ? operand : 'AND';
        this.conditions = conditions && conditions.length > 0 ? conditions : [new Expression()];
        this.testCases = testCases ? testCases : [];
    }
}

export class Conversation {
    request: string;
    response: string[];

    constructor(request: string, response: string[]) {
        this.request = request ? request : "";
        this.response = response ? response : [];
    }
}

export class ConversationConfigMap {
    agent: string;
    conversation: Conversation[];

    constructor(agent?: string, conversation?: Conversation[]) {
        this.agent = agent ? agent : "";
        this.conversation = conversation ? conversation : [];
    }
}

export class ResponseRoute
{
    testCaseStatus : string;

    constructor(testCaseStatus?:string)
    {
        this.testCaseStatus= testCaseStatus? testCaseStatus :"";
    }
}

export class ConversationTestRouteStep extends FtcstepConfig {
    "@type": "ConversationTestRouteStep";
    apiName: string;
    configMap: ConversationConfigMap;

    constructor(baseObject?: FtcstepConfig) {
        super(baseObject);

        this["@type"] = "ConversationTestRouteStep";
        this.apiName = '';
        this.configMap = new ConversationConfigMap();
    }
}

export class DelayRouteStep extends FtcstepConfig {
    "@type": "DelayRouteStep";
    delayTime: string;
    
    constructor(baseObject?: FtcstepConfig) {
        super(baseObject);

        this["@type"] = "DelayRouteStep";
        this.delayTime = '';
    }
}

export class VerifyRouteStep extends FtcstepConfig {
    "@type": "VerifyRouteStep";
	machineType: string;
	stateCd : string;
	statusCd : string;
	mvelExpression : string;
    //conditions: FTCondition[];

    constructor(baseObject?: FtcstepConfig) {
        super(baseObject);

        this["@type"] = "VerifyRouteStep";
		this.machineType = '';
		this.stateCd = '';
		this.statusCd = '';
		this.mvelExpression = '';
      //  this.conditions = [];
    }
}


export class FtcConfig extends BaseModel {
    routeCd: string; 
	//testcaseCd: string;
    routeLabel: string; 
    routeType: string; 
    version: number; 
    routeSteps: FtcstepConfig[];

    constructor(routeCd?: string, routeLabel?: string, routeType?: string, version?: number, routeSteps?: FtcstepConfig[]) {
        super();

        this.statusCd = 'ACTIVE';
        this.routeCd = routeCd ? routeCd : '';
        this.routeLabel = routeLabel ? routeLabel : '';
        this.routeType = "TEST";
        this.version = version ? version : 1;
        this.routeSteps = this.routeSteps ? routeSteps : [];
    }
}