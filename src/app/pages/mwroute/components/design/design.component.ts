declare var designRouteEditor: any;
declare var renderRouteGraph: any;
declare var routeGraphTools: any;
declare var showModal: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import {
    MWRouteConfig, ApiRouteStep, CamelRouteStep, ChoiceRouteStep, ConnectorRouteStep,
    RuleRouteStep, JaxbMarshallRouteStep, JaxbUnmarshallRouteStep, JsonMarshallRouteStep,
    JsonUnmarshallRouteStep, MWRouteStepConfig, MWCondition, FlowCreateRouteStep, FlowUpdateRouteStep
} from 'app/models/mwroute.model';
import { ApiKeyExpressionMap, MVELObject } from 'app/models/setup.model';
import { GraphService } from 'app/services/flow.service';
import { Expression } from 'app/models/flow.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MWRouteService } from 'app/services/mwroute.service';
import { DataSharingService } from 'app/services/shared.service';

@Component({
    selector: 'api-mwroute-design',
    templateUrl: './design.component.html',
    styleUrls: ['./design.scss']
})
export class DesignComponent implements OnInit, OnDestroy {

    readOnly: boolean = false;
    routeConfig: MWRouteConfig;
    tempRouteConfig: MWRouteConfig;
    routeStep: ApiRouteStep | CamelRouteStep | ChoiceRouteStep |
        ConnectorRouteStep | RuleRouteStep | JaxbMarshallRouteStep |
        JaxbUnmarshallRouteStep | JsonMarshallRouteStep | JsonUnmarshallRouteStep | FlowCreateRouteStep | FlowUpdateRouteStep = null;
    branchCondition: MWCondition = null;
    parentChoiceRouteStep: ChoiceRouteStep;
    parentChoiceConditionIndex: number = -1;

    selectedRule: ApiKeyExpressionMap = null;
    ruleIndex: number = -1
    mvelObject: MVELObject = null;

    sourceRouteStepId: string = null;
    sourceRouteArray: MWRouteStepConfig[] = null;
    routeIndex: number = -1;
    mode: "CREATE" | "INSERT" | "UPDATE" = null;

    bulkEdit: boolean = false;
    selectedCondition: MWCondition = null;
    bulkExpressions: string = '';

    private subscriptionSaveRoute: Subscription;

    // Final strings used in html as method parameter
    readonly ZOOM_IN = 'ZOOM_IN';
    readonly ZOOM_OUT = 'ZOOM_OUT';
    readonly ZOOM_ACTUAL = 'ZOOM_ACTUAL';
    readonly PRINT_PREVIEW = 'PRINT_PREVIEW';
    readonly POSTER_PRINT = 'POSTER_PRINT';

    readonly sourceRouteStepTypes: string[] = [
        "ApiRouteStep",
        "CamelRouteStep",
        "ChoiceRouteStep",
        "ConnectorRouteStep",
        "RuleRouteStep",
        "JaxbMarshallRouteStep",
        "JaxbUnmarshallRouteStep",
        "JsonMarshallRouteStep",
        "JsonUnmarshallRouteStep"
    ];
    readonly sourceOperands: string[] = ['AND', 'OR'];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private graphService: GraphService,
        private mwRouteService: MWRouteService,
        private dataSharingService: DataSharingService
    ) {
        window['routeComponentRef'] = { component: this, zone: zone };
    }

    ngOnInit() {
        this.routeConfig = this.dataSharingService.getSharedObject();

        if (!this.routeConfig) {
            this.routeConfig = new MWRouteConfig();
        }

        new designRouteEditor(this.routeConfig.routeSteps, false);
    }

    ngOnDestroy() {
        window['routeComponentRef'] = null;

        if (this.subscriptionSaveRoute && !this.subscriptionSaveRoute.closed) {
            this.subscriptionSaveRoute.unsubscribe();
        }
    }

    prepareDummyRouteConfig() {
        this.tempRouteConfig = JSON.parse(JSON.stringify(this.routeConfig));
    }

    updateRouteConfig() {
        this.routeConfig = this.tempRouteConfig;
        this.tempRouteConfig = null;

        new renderRouteGraph(this.routeConfig.routeSteps, false);
    }

    toolsChoice(choice: string): void {
        new routeGraphTools(choice);
    }

    deleteRouteStep(routeStepId: string, deleteAll?: boolean) {
        const found = this.locateSource(this.routeConfig.routeSteps, routeStepId);

        if (found) {
            if (deleteAll) {
                this.sourceRouteArray.length = this.routeIndex;
            } else {
                this.sourceRouteArray.splice(this.routeIndex, 1);
            }

            if (this.parentChoiceConditionIndex > -1 && this.sourceRouteArray.length == 0) {
                this.parentChoiceRouteStep.conditions.splice(this.parentChoiceConditionIndex, 1);
            }

            new renderRouteGraph(this.routeConfig.routeSteps, false);
        }

        this.resetTempFields();
    }

    editRouteStep(routeStepId: string) {
        const found = this.locateSource(this.routeConfig.routeSteps, routeStepId);

        if (found) {
            this.mode = 'UPDATE';
            this.routeStep = this.typeCastRouteStep(this.sourceRouteArray[this.routeIndex]);
            new showModal('saveRouteStepModal');
        } else {
            this.resetTempFields();
        }
    }

    addRouteStep(routeStepId: string) {
        const found = this.locateSource(this.routeConfig.routeSteps, routeStepId);

        if (!found) {
            this.sourceRouteArray = this.routeConfig.routeSteps;
            this.sourceRouteStepId = null;
            this.routeIndex = -1;
        }

        this.mode = 'CREATE';
        this.routeStep = new CamelRouteStep();
        new showModal('saveRouteStepModal');
    }

    insertRouteStep(routeStepId: string) {
        const found = this.locateSource(this.routeConfig.routeSteps, routeStepId);

        if (found) {
            this.mode = 'INSERT';
            this.routeStep = new CamelRouteStep();
            new showModal('saveRouteStepModal');
        } else {
            this.resetTempFields();
        }

    }

    saveRouteStep() {
        if (this.sourceRouteArray && this.routeStep) {
            if (this.mode == "CREATE") {
                if (this.branchCondition) {
                    this.branchCondition.routeSteps.push(this.routeStep);
                    (<ChoiceRouteStep>this.sourceRouteArray[this.routeIndex]).conditions.push(this.branchCondition);
                } else {
                    this.sourceRouteArray.push(this.routeStep);
                }
            } else if (this.mode == "INSERT") {
                if (this.routeIndex != null && this.routeIndex != undefined && this.routeIndex > -1 && this.routeIndex < this.sourceRouteArray.length) {
                    if (this.branchCondition && this.routeStep["@type"] == "ChoiceRouteStep") {
                        this.branchCondition.routeSteps = this.sourceRouteArray.splice(this.routeIndex, this.sourceRouteArray.length - this.routeIndex);
                        (<ChoiceRouteStep>this.routeStep).conditions.push(this.branchCondition);
                        this.sourceRouteArray.push(this.routeStep);
                    } else {
                        this.sourceRouteArray.splice(this.routeIndex, 0, this.routeStep);
                    }
                }
            } else {
                if (this.routeIndex != null && this.routeIndex != undefined && this.routeIndex > 0 && this.routeIndex < this.sourceRouteArray.length) {
                    this.sourceRouteArray[this.routeIndex] = this.routeStep;
                }
            }
        }

        new renderRouteGraph(this.routeConfig.routeSteps, false);
        this.resetTempFields();
    }

    discardChanges() {
        this.router.navigate(['/pg/mwrt/rtsr'], { relativeTo: this.route });
    }

    saveRouteConfig() {
        // TODO: Add validations over RouteConfig and RouteConfigSteps before saving it.
        if (!this.readOnly) {
            this.subscriptionSaveRoute = this.mwRouteService.save(this.routeConfig).subscribe(
                result => {
                    if (result) {
                        this.routeConfig = result;
                    }
                }, error => {

                }
            );
        }
    }

    resetTempFields() {
        this.disableBulkEdit();

        this.routeIndex = -1;
        this.routeStep = null;
        this.branchCondition = null;
        this.parentChoiceRouteStep = null;
        this.parentChoiceConditionIndex = -1;
        this.sourceRouteArray = null;
        this.sourceRouteStepId = null;
    }

    locateSource(routeSource: MWRouteStepConfig[], routeStepId: string) {
        if (routeSource) {
            for (const routeStep of routeSource) {
                if (routeStep) {
                    if (routeStep.routeStepId && routeStep.routeStepId == routeStepId) {
                        this.sourceRouteArray = routeSource;
                        this.sourceRouteStepId = routeStepId;
                        this.routeIndex = routeSource.indexOf(routeStep);

                        if (routeStep["@type"] && routeStep["@type"] == "ChoiceRouteStep") {
                            this.branchCondition = new MWCondition();
                        } else {
                            this.branchCondition = null;
                        }

                        return true;
                    } else if (routeStep["@type"] && routeStep["@type"] == "ChoiceRouteStep") {
                        for (let conditionIndex = 0; conditionIndex < (<ChoiceRouteStep>routeStep).conditions.length; conditionIndex++) {
                            const condition = (<ChoiceRouteStep>routeStep).conditions[conditionIndex];

                            if (condition && condition.routeSteps) {
                                if (this.locateSource(condition.routeSteps, routeStepId)) {
                                    this.parentChoiceRouteStep = <ChoiceRouteStep>routeStep;
                                    this.parentChoiceConditionIndex = conditionIndex;
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }

        return false;
    }

    onRouteStepTypeChange(newType: string) {
        this.disableBulkEdit();

        if (newType && this.routeStep && this.sourceRouteStepTypes.includes(newType) && newType != this.routeStep["@type"]) {
            if (newType == "ApiRouteStep") {
                this.routeStep = new ApiRouteStep(this.routeStep);
            } else if (newType == "CamelRouteStep") {
                this.routeStep = new CamelRouteStep(this.routeStep);
            } else if (newType == "ChoiceRouteStep") {
                this.routeStep = new ChoiceRouteStep(this.routeStep);
            } else if (newType == "ConnectorRouteStep") {
                this.routeStep = new ConnectorRouteStep(this.routeStep);
            } else if (newType == "RuleRouteStep") {
                this.routeStep = new RuleRouteStep(this.routeStep);
            } else if (newType == "JaxbMarshallRouteStep") {
                this.routeStep = new JaxbMarshallRouteStep(this.routeStep);
            } else if (newType == "JaxbUnmarshallRouteStep") {
                this.routeStep = new JaxbUnmarshallRouteStep(this.routeStep);
            } else if (newType == "JsonMarshallRouteStep") {
                this.routeStep = new JsonMarshallRouteStep(this.routeStep);
            } else if (newType == "JsonUnmarshallRouteStep") {
                this.routeStep = new JsonUnmarshallRouteStep(this.routeStep);
            }

            if (this.mode && this.mode == "INSERT") {
                if (newType == "ChoiceRouteStep") {
                    this.branchCondition = new MWCondition();
                } else {
                    this.branchCondition = null;
                }
            }
        }
    }

    typeCastRouteStep(routeStep: MWRouteStepConfig) {
        if (routeStep) {
            if (routeStep["@type"] == "ApiRouteStep") {
                return <ApiRouteStep>routeStep;
            } else if (routeStep["@type"] == "CamelRouteStep") {
                return <CamelRouteStep>routeStep;
            } else if (routeStep["@type"] == "ChoiceRouteStep") {
                return <ChoiceRouteStep>routeStep;
            } else if (routeStep["@type"] == "ConnectorRouteStep") {
                return <ConnectorRouteStep>routeStep;
            } else if (routeStep["@type"] == "RuleRouteStep") {
                return <RuleRouteStep>routeStep;
            } else if (routeStep["@type"] == "JaxbMarshallRouteStep") {
                return <JaxbMarshallRouteStep>routeStep;
            } else if (routeStep["@type"] == "JaxbUnmarshallRouteStep") {
                return <JaxbUnmarshallRouteStep>routeStep;
            } else if (routeStep["@type"] == "JsonMarshallRouteStep") {
                return <JsonMarshallRouteStep>routeStep;
            } else if (routeStep["@type"] == "JsonUnmarshallRouteStep") {
                return <JsonUnmarshallRouteStep>routeStep;
            }
        }

        return null;
    }

    removeFromList(item: any, list: any[]) {
        if (item && list) {
            const index = list.indexOf(item);
            if (index > -1) {
                list.splice(index, 1);
            }
        }
    }

    expandRule(rule: ApiKeyExpressionMap) {
        if (rule && this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "RuleRouteStep" &&
            (<RuleRouteStep>this.routeStep).ruleList && (<RuleRouteStep>this.routeStep).ruleList.includes(rule)) {

            this.selectedRule = JSON.parse(JSON.stringify(rule));
            this.ruleIndex = (<RuleRouteStep>this.routeStep).ruleList.indexOf(rule);
            this.mvelObject = new MVELObject();
        }
    }

    testRule() {
        if (this.selectedRule) {
            this.mvelObject.expression = this.selectedRule.expression;
            this.graphService.testMVELExpression(this.mvelObject)
                .subscribe(mvelObject => {
                    if (mvelObject) {
                        this.mvelObject = mvelObject;
                    }
                });
        }
    }

    addRule() {
        if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "RuleRouteStep" &&
            (<RuleRouteStep>this.routeStep).ruleList) {
            (<RuleRouteStep>this.routeStep).ruleList.push(new ApiKeyExpressionMap());
        }
    }

    saveRule() {
        if (this.selectedRule && this.ruleIndex != null && this.ruleIndex != undefined && this.ruleIndex > -1 && this.routeStep &&
            this.routeStep["@type"] && this.routeStep["@type"] == "RuleRouteStep" &&
            (<RuleRouteStep>this.routeStep).ruleList && this.ruleIndex < (<RuleRouteStep>this.routeStep).ruleList.length) {

            if (this.mvelObject && this.mvelObject.expression) {
                this.selectedRule.expression = this.mvelObject.expression;
            }

            (<RuleRouteStep>this.routeStep).ruleList[this.ruleIndex] = this.selectedRule;
        }

        this.dismissRuleDialog();
    }

    dismissRuleDialog() {
        this.ruleIndex = -1;
        this.selectedRule = null;
        this.mvelObject = null;

        new closeModal("mvelEditModal");
    }

    enableBulkEdit(condition: MWCondition) {
        if (this.bulkEdit) {
            return;
        }

        this.bulkEdit = true;
        this.selectedCondition = condition;
        this.bulkExpressions = '';

        if (this.selectedCondition && this.selectedCondition.conditions && this.selectedCondition.conditions.length > 0) {
            for (let index = 0; index < this.selectedCondition.conditions.length; index++) {
                this.bulkExpressions += this.selectedCondition.conditions[index].value;

                if (index < this.selectedCondition.conditions.length - 1) {
                    this.bulkExpressions += '\n';
                }
            }
        }
    }

    disableBulkEdit() {
        if (this.bulkEdit) {
            this.selectedCondition.conditions = [];

            if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
                for (const expression of this.bulkExpressions.split('\n')) {
                    this.selectedCondition.conditions.push(new Expression(expression));
                }
            } else {
                this.addExpression(this.selectedCondition);
            }
        }

        this.bulkEdit = false;
        this.selectedCondition = null;
        this.bulkExpressions = '';
    }

    addExpression(condition: MWCondition) {
        const tempExpression: Expression = new Expression();
        condition.conditions.push(tempExpression);
    }

    deleteExpression(expression: Expression, condition: MWCondition) {
        const index = condition.conditions.indexOf(expression);
        condition.conditions.splice(index, 1);
    }

    addCondition() {
        if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "ChoiceRouteStep" && (<ChoiceRouteStep>this.routeStep).conditions) {
            (<ChoiceRouteStep>this.routeStep).conditions.push(new MWCondition());
        }
    }

    deleteCondition(condition: MWCondition) {
        if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "ChoiceRouteStep" && (<ChoiceRouteStep>this.routeStep).conditions) {
            const index = (<ChoiceRouteStep>this.routeStep).conditions.indexOf(condition);
            (<ChoiceRouteStep>this.routeStep).conditions.splice(index, 1);
        }
    }
}