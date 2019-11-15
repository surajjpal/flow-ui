declare var designFtcRouteEditor: any;
declare var renderFtcRouteGraph: any;
declare var ftcRouteGraphTools: any;
declare var showModal: any;
declare var closeModal: any;

import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import {
    FtcConfig, ConversationTestRouteStep, DelayRouteStep, VerifyRouteStep, FtcstepConfig, ConversationConfigMap,FlowCreateRouteStep,FlowUpdateRouteStep
} from 'app/models/ftc.model';
import { ApiKeyExpressionMap, MVELObject } from 'app/models/setup.model';
import { GraphService } from 'app/services/flow.service';
import { Expression } from 'app/models/flow.model';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { FtcService } from 'app/services/ftc.service';
import { DataSharingService, AlertService } from 'app/services/shared.service';
import { FormBuilder, FormGroup, FormArray, FormControl,Validators } from '@angular/forms';

@Component({
    selector: 'api-ftc-design',
    templateUrl: './design.component.html',
    styleUrls: ['./design.scss']
})
export class DesignComponent implements OnInit, OnDestroy {

    readOnly: boolean = false;
    ftcConfig: FtcConfig;
    tempFtcConfig: FtcConfig;
    tempConfig: string;
    routeStep: ConversationTestRouteStep | DelayRouteStep | VerifyRouteStep | FlowCreateRouteStep |FlowUpdateRouteStep = null;
   // branchCondition: MWCondition = null;
   // parentChoiceRouteStep: ChoiceRouteStep;
    //parentChoiceConditionIndex: number = -1;

    selectedFtcRule: ApiKeyExpressionMap = null;
    ruleIndex: number = -1
    mvelObject: MVELObject = null;

    sourceFtcRouteStepId: string = null;
    sourceFtcRouteArray: FtcstepConfig[] = null;
    routeIndex: number = -1;
    mode: "CREATE" | "INSERT" | "UPDATE" = null;
    //bulkEdit: boolean = false;
    //selectedCondition: MWCondition = null;
    bulkExpressions: string = '';

    private subscriptionSaveRoute: Subscription;

    // Final strings used in html as method parameter
    readonly ZOOM_IN = 'ZOOM_IN';
    readonly ZOOM_OUT = 'ZOOM_OUT';
    readonly ZOOM_ACTUAL = 'ZOOM_ACTUAL';
    readonly PRINT_PREVIEW = 'PRINT_PREVIEW';
    readonly POSTER_PRINT = 'POSTER_PRINT';

    readonly sourceFtcRouteStepTypes: string[] = [
        "ConversationTestRouteStep",
        "DelayRouteStep",
        "VerifyRouteStep",
        "FlowCreateRouteStep",
        "FlowUpdateRouteStep"
    ];
    readonly sourceOperands: string[] = ['AND', 'OR'];

    ftConvForm: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private zone: NgZone,
        private graphService: GraphService,
        private ftcService: FtcService,
        private alertService: AlertService,
        private dataSharingService: DataSharingService,
        private fb: FormBuilder
    ) {
        window['ftcrouteComponentRef'] = { component: this, zone: zone };
    }

    ngOnInit() {
        this.ftcConfig = this.dataSharingService.getSharedObject();

        if (!this.ftcConfig) {
            this.ftcConfig = new FtcConfig();
        }

        new designFtcRouteEditor(this.ftcConfig.routeSteps, false);

        this.ftConvForm = this.fb.group({
            'agent': [''],
            'conversation': this.fb.array(
                [
                    this.initX()
                ]
            )
          })
    }
    initX(){
        return this.fb.group({
            'request':[''],
            'response':this.fb.array([
                this.initY()
            ])
        })
    }
    initY(){
        return this.fb.group({
            'res':['']
        })
    }
    addX() {
    const control = <FormArray>this.ftConvForm.controls['conversation'];
    control.push(this.initX());
    }
    
    removeX(idx) {
        const control = (this.ftConvForm).get('conversation') as FormArray;
        control.removeAt(idx);
    }
    addY(ix) {
    const control = (<FormArray>this.ftConvForm.controls['conversation']).at(ix).get('response') as FormArray;
    control.push(this.initY());
    }
    removeY(idx,idy) {
        const control = (<FormArray>this.ftConvForm.controls['conversation']).at(idx).get('response') as FormArray;
        control.removeAt(idy);
    }
    ngOnDestroy() {
        window['ftcrouteComponentRef'] = null;

        if (this.subscriptionSaveRoute && !this.subscriptionSaveRoute.closed) {
            this.subscriptionSaveRoute.unsubscribe();
        }
    }

    prepareDummyFtcRouteConfig() {
        this.tempFtcConfig = JSON.parse(JSON.stringify(this.ftcConfig));
    }

    updateFtcRouteConfig() {
        this.ftcConfig = this.tempFtcConfig;
        this.tempFtcConfig = null;

        new renderFtcRouteGraph(this.ftcConfig.routeSteps, false);
    }

    toolsChoice(choice: string): void {
        new ftcRouteGraphTools(choice);
    }

    deleteRouteStep(routeStepId: string, deleteAll?: boolean) {
        const found = this.locateSource(this.ftcConfig.routeSteps, routeStepId);

        if (found) {
            if (deleteAll) {
                this.sourceFtcRouteArray.length = this.routeIndex;
            } else {
                this.sourceFtcRouteArray.splice(this.routeIndex, 1);
            }

            //if (this.parentChoiceConditionIndex > -1 && this.sourceFtcRouteArray.length == 0) {
            //    this.parentChoiceRouteStep.conditions.splice(this.parentChoiceConditionIndex, 1);
            //}

            new renderFtcRouteGraph(this.ftcConfig.routeSteps, false);
        }

        this.resetTempFields();
    }

    editFtcRouteStep(routeStepId: string) {
        const found = this.locateSource(this.ftcConfig.routeSteps, routeStepId);

        if (found) {
            this.mode = 'UPDATE';
            this.routeStep = this.typeCastRouteStep(this.sourceFtcRouteArray[this.routeIndex]);
            // console.log(this.unstruct((this.routeStep['configMap'])));
            // this.retArray = this.unstruct((this.routeStep['configMap']));
            // console.log(this.routeStep['configMap'])
            this.unstruct(this.routeStep['configMap'])
            // this.ftConvForm.patchValue();
            new showModal('saveRouteStepModal');
            if(this.routeStep["@type"]=="ConversationTestRouteStep")
            {
                this.tempConfig = JSON.stringify((<ConversationTestRouteStep> this.routeStep).configMap);
            }
        } else {
            this.resetTempFields();
        }
    }
    unstruct(res){
        this.ftConvForm.reset();// This will remove only values not the elements
        (this.ftConvForm.get("conversation") as FormArray)['controls'].splice(0); //this removes elements
        for (var prop in res) {
            // console.log(prop,res[prop]);
            if(prop === 'conversation'){
                for (let conversation = 0; conversation < res[prop].length; conversation++){
                    const conversationFormArray = this.ftConvForm.get("conversation") as FormArray;
                    conversationFormArray.push(this.conversation);

                    for (let response=0; response < res[prop][conversation].response.length; response++){
                        const responseFormArray =  conversationFormArray.at(conversation).get("response") as FormArray;
                        responseFormArray.push(this.response);
                    }
                }
            }
        }



        
        let retArray ={};

        for (var prop in res) {
            // console.log(prop,res[prop]);
            if (prop === 'agent') {
                retArray['agent'] = res[prop];
            }else if(prop === 'conversation'){
                retArray['conversation'] = [];
                for(let j =0; j< res[prop].length; j++){
                    let tempLev2 = {};

                    for(var convProp in res[prop][j]){
                        let element = res[prop][j];
                        
                        if(convProp === 'request'){
                            tempLev2['request'] = element[convProp]
                        }else{
                            tempLev2['response'] = []
                            for (let y = 0; y < element[convProp].length; y++) {
                                let el2 = element[convProp][y];
                                let tempLev3 = {'res':el2};
                                tempLev2['response'][y] = tempLev3;
                            }
                        }
                    }




                    retArray['conversation'][j] = tempLev2;
                }
            }
        }
        this.ftConvForm.patchValue(retArray);
    }


    get response():FormGroup{
        return this.fb.group({
            res: ''
        });
    }
    
    get conversation():FormGroup{
        return this.fb.group({
            request: '',
            response: this.fb.array([
             ]),
        })
    }


    addFtcRouteStep(routeStepId: string) {
        const found = this.locateSource(this.ftcConfig.routeSteps, routeStepId);

        if (!found) {
            this.sourceFtcRouteArray = this.ftcConfig.routeSteps;
            this.sourceFtcRouteStepId = null;
            this.routeIndex = -1;
        }

        this.mode = 'CREATE';
        this.routeStep = new ConversationTestRouteStep();
        new showModal('saveRouteStepModal');
    }

    insertFtcRouteStep(routeStepId: string) {
        const found = this.locateSource(this.ftcConfig.routeSteps, routeStepId);

        if (found) {
            this.mode = 'INSERT';
            this.routeStep = new ConversationTestRouteStep();
            new showModal('saveRouteStepModal');
        } else {
            this.resetTempFields();
        }

    }

    saveFtcRouteStep() {
        // console.log("routeStep", this.routeStep);

        // if(!this.tempConfig){
            this.tempConfig = JSON.stringify(this.restruct(this.ftConvForm.value));
        // }
        if (this.sourceFtcRouteArray && this.routeStep) {
            if(this.routeStep["@type"]=="ConversationTestRouteStep")
            {
                if(this.tempConfig && this.tempConfig.length>0)
                {
                    (<ConversationTestRouteStep> this.routeStep).configMap=JSON.parse(this.tempConfig);
                   // console.log("configMap in if",(<ConversationTestRouteStep> this.routeStep).configMap);
                }
                else
                {
                    (<ConversationTestRouteStep> this.routeStep).configMap = new ConversationConfigMap;
                    //console.log("configMap in else", (<ConversationTestRouteStep> this.routeStep).configMap);

                }

            }
            if (this.mode == "CREATE") {
                // if (this.branchCondition) {
                 //   this.branchCondition.routeSteps.push(this.routeStep);
                 //   (<ChoiceRouteStep>this.sourceRouteArray[this.routeIndex]).conditions.push(this.branchCondition);
                 //} else {
                     this.sourceFtcRouteArray.push(this.routeStep);
                     //}
                    } else if (this.mode == "INSERT") {
                        if (this.routeIndex != null && this.routeIndex != undefined && this.routeIndex > -1 && this.routeIndex < this.sourceFtcRouteArray.length) {
                            // if (this.branchCondition && this.routeStep["@type"] == "ChoiceRouteStep") {
                                //     this.branchCondition.routeSteps = this.sourceRouteArray.splice(this.routeIndex, this.sourceRouteArray.length - this.routeIndex);
                                //    (<ChoiceRouteStep>this.routeStep).conditions.push(this.branchCondition);
                                //     this.sourceRouteArray.push(this.routeStep);
                                // } else {
                                    this.sourceFtcRouteArray.splice(this.routeIndex, 0, this.routeStep);
                                    // }
               }
            } else {
                if (this.routeIndex != null && this.routeIndex != undefined && this.routeIndex > 0 && this.routeIndex < this.sourceFtcRouteArray.length) {
                    this.sourceFtcRouteArray[this.routeIndex] = this.routeStep;
                }
            }
        }
        
        // console.log("sourceRouteArray", this.sourceFtcRouteArray);
        // console.log("routeStepConfig", this.ftcConfig.routeSteps);
        new renderFtcRouteGraph(this.ftcConfig.routeSteps, false);
        this.resetTempFields();
        
    }

    discardChanges() {
        this.router.navigate(['/pg/ftc/ftcsr'], { relativeTo: this.route });
    }

    saveFtcRouteConfig() {
        // TODO: Add validations over RouteConfig and RouteConfigSteps before saving it.
        if (!this.readOnly) {
            this.subscriptionSaveRoute = this.ftcService.save(this.ftcConfig).subscribe(
                result => {
                    if (result) {
                        this.ftcConfig = result;
                        this.alertService.success("Testcase saved successfully",false,2000);
                    }
                }, error => {
                    this.alertService.error(error,false,2000);   
                }
            );
        }
    }

    resetTempFields() {
       // this.disableBulkEdit();

        this.routeIndex = -1;
        this.routeStep = null;
       // this.branchCondition = null;
        //this.parentChoiceRouteStep = null;
        //this.parentChoiceConditionIndex = -1;
        this.sourceFtcRouteArray = null;
        this.sourceFtcRouteStepId = null;
        this.tempConfig= null;
    }

    locateSource(routeSource: FtcstepConfig[], routeStepId: string) {
        if (routeSource) {
            for (const routeStep of routeSource) {
                if (routeStep) {
                    if (routeStep.routeStepId && routeStep.routeStepId== routeStepId) {
                        this.sourceFtcRouteArray = routeSource;
                        this.sourceFtcRouteStepId = routeStepId;
                        this.routeIndex = routeSource.indexOf(routeStep);

                        // if (routeStep["@type"] && routeStep["@type"] == "ChoiceRouteStep") {
                        //     this.branchCondition = new MWCondition();
                        // } else {
                        //     this.branchCondition = null;
                        // }

                        return true;
                     } //else if (routeStep["@type"] && routeStep["@type"] == "ChoiceRouteStep") {
                    //     for (let conditionIndex = 0; conditionIndex < (<ChoiceRouteStep>routeStep).conditions.length; conditionIndex++) {
                    //         const condition = (<ChoiceRouteStep>routeStep).conditions[conditionIndex];

                    //         if (condition && condition.routeSteps) {
                    //             if (this.locateSource(condition.routeSteps, routeStepId)) {
                    //                 this.parentChoiceRouteStep = <ChoiceRouteStep>routeStep;
                    //                 this.parentChoiceConditionIndex = conditionIndex;
                    //                 return true;
                    //             }
                    //         }
                    //     }
                    // }
                }
            }
        }

        return false;
    }
    // Restructure response from the dynamic form
    restruct(res){
        let retArray = {}
        for (var prop in res) {
          // console.log(prop,res[prop]);
          if (prop === 'agent') {
            retArray['agent'] = res[prop];
          }else if(prop === 'conversation'){
            retArray['conversation'] =[]
            res[prop].forEach(element => {
              let tempLev2 = {}
              for(var convProp in element){
                if(convProp === 'request'){
                  tempLev2['request'] = element[convProp]
                }else{
                  tempLev2['response'] = []
                  element[convProp].forEach(el2 => {
                    tempLev2['response'].push(el2.res);
                  });
                }
              }
              retArray['conversation'].push(tempLev2);
            });
          }
        }
        return retArray;
      }
    
    onRouteStepTypeChange(newType: string) {
        //this.disableBulkEdit();

        if (newType && this.routeStep && this.sourceFtcRouteStepTypes.includes(newType) && newType != this.routeStep["@type"]) {
            if (newType == "ConversationTestRouteStep") {
                this.routeStep = new ConversationTestRouteStep(this.routeStep);
            } else if (newType == "DelayRouteStep") {
                this.routeStep = new DelayRouteStep(this.routeStep);
            } else if (newType == "VerifyRouteStep") {
                this.routeStep = new VerifyRouteStep(this.routeStep);
            } else if (newType == "FlowCreateRouteStep") {
                this.routeStep = new FlowCreateRouteStep(this.routeStep);
            }else if (newType=="FlowUpdateRouteStep"){
                this.routeStep = new FlowUpdateRouteStep(this.routeStep);
            }

            //if (this.mode && this.mode == "INSERT") {
                // if (newType == "ChoiceRouteStep") {
                //     this.branchCondition = new MWCondition();
                // } else {
                //    this.branchCondition = null;
              //  }
            //}
        }
    }

    typeCastRouteStep(routeStep: FtcstepConfig) {
        if (routeStep) {
            if (routeStep["@type"] == "ConversationTestRouteStep") {
                return <ConversationTestRouteStep>routeStep;
            } else if (routeStep["@type"] == "DelayRouteStep") {
                return <DelayRouteStep>routeStep;
            } else if (routeStep["@type"] == "VerifyRouteStep") {
                return <VerifyRouteStep>routeStep;
            }else if (routeStep["@type"] == "FlowCreateRouteStep") {
                return <FlowCreateRouteStep>routeStep;
            }else if (routeStep["@type"] == "FlowUpdateRouteStep") {
                return <FlowUpdateRouteStep>routeStep;
            }// else if (routeStep["@type"] == "ConnectorRouteStep") {
            //     return <ConnectorRouteStep>routeStep;
            // } else if (routeStep["@type"] == "RuleRouteStep") {
            //     return <RuleRouteStep>routeStep;
            // } else if (routeStep["@type"] == "JaxbMarshallRouteStep") {
            //     return <JaxbMarshallRouteStep>routeStep;
            // } else if (routeStep["@type"] == "JaxbUnmarshallRouteStep") {
            //     return <JaxbUnmarshallRouteStep>routeStep;
            // } else if (routeStep["@type"] == "JsonMarshallRouteStep") {
            //     return <JsonMarshallRouteStep>routeStep;
            // } else if (routeStep["@type"] == "JsonUnmarshallRouteStep") {
            //     return <JsonUnmarshallRouteStep>routeStep;
            // }
        }

        return null;
    }

    // removeFromList(item: any, list: any[]) {
    //     if (item && list) {
    //         const index = list.indexOf(item);
    //         if (index > -1) {
    //             list.splice(index, 1);
    //         }
    //     }
    // }

    // expandRule(rule: ApiKeyExpressionMap) {
    //     if (rule && this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "VerifyRouteStep" &&
    //         (<VerifyRouteStep>this.routeStep).mvelExpression && (<VerifyRouteStep>this.routeStep).mvelExpression.includes(rule)) {

    //         this.selectedFtcRule = JSON.parse(JSON.stringify(rule));
    //         this.ruleIndex = (<VerifyRouteStep>this.routeStep).mvelExpression.indexOf(rule);
    //         this.mvelObject = new MVELObject();
    //     }
    // }

    // testRule() {
    //     if (this.selectedFtcRule) {
    //         this.mvelObject.expression = this.selectedFtcRule.expression;
    //         this.graphService.testMVELExpression(this.mvelObject)
    //             .subscribe(mvelObject => {
    //                 if (mvelObject) {
    //                     this.mvelObject = mvelObject;
    //                 }
    //             });
    //     }
    // }

    // addRule() {
    //     if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "VerifyRouteStep" &&
    //         (<VerifyRouteStep>this.routeStep).mvelExpression) {
    //         (<VerifyRouteStep>this.routeStep).mvelExpression.push(new ApiKeyExpressionMap());
    //     }
    // }

    // saveRule() {
    //     if (this.selectedFtcRule && this.ruleIndex != null && this.ruleIndex != undefined && this.ruleIndex > -1 && this.routeStep &&
    //         this.routeStep["@type"] && this.routeStep["@type"] == "VerifyRouteStep" &&
    //         (<VerifyRouteStep>this.routeStep).mvelExpression && this.ruleIndex < (<VerifyRouteStep>this.routeStep).mvelExpression.length) {

    //         if (this.mvelObject && this.mvelObject.expression) {
    //             this.selectedFtcRule.expression = this.mvelObject.expression;
    //         }

    //         (<VerifyRouteStep>this.routeStep).mvelExpression[this.ruleIndex] = this.selectedFtcRule;
    //     }

    //     this.dismissRuleDialog();
    // }

    dismissRuleDialog() {
        this.ruleIndex = -1;
        this.selectedFtcRule = null;
        this.mvelObject = null;

        new closeModal("mvelEditModal");
    }

    // enableBulkEdit(condition: MWCondition) {
    //     if (this.bulkEdit) {
    //         return;
    //     }

    //     this.bulkEdit = true;
    //     this.selectedCondition = condition;
    //     this.bulkExpressions = '';

    //     if (this.selectedCondition && this.selectedCondition.conditions && this.selectedCondition.conditions.length > 0) {
    //         for (let index = 0; index < this.selectedCondition.conditions.length; index++) {
    //             this.bulkExpressions += this.selectedCondition.conditions[index].value;

    //             if (index < this.selectedCondition.conditions.length - 1) {
    //                 this.bulkExpressions += '\n';
    //             }
    //         }
    //     }
    // }

    // disableBulkEdit() {
    //     if (this.bulkEdit) {
    //         this.selectedCondition.conditions = [];

    //         if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
    //             for (const expression of this.bulkExpressions.split('\n')) {
    //                 this.selectedCondition.conditions.push(new Expression(expression));
    //             }
    //         } else {
    //             this.addExpression(this.selectedCondition);
    //         }
    //     }

    //     this.bulkEdit = false;
    //     this.selectedCondition = null;
    //     this.bulkExpressions = '';
    // }

    // addExpression(condition: MWCondition) {
    //     const tempExpression: Expression = new Expression();
    //     condition.conditions.push(tempExpression);
    // }

    // deleteExpression(expression: Expression, condition: MWCondition) {
    //     const index = condition.conditions.indexOf(expression);
    //     condition.conditions.splice(index, 1);
    // }

    // addCondition() {
    //     if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "ChoiceRouteStep" && (<ChoiceRouteStep>this.routeStep).conditions) {
    //         (<ChoiceRouteStep>this.routeStep).conditions.push(new MWCondition());
    //     }
    // }

    // deleteCondition(condition: MWCondition) {
    //     if (this.routeStep && this.routeStep["@type"] && this.routeStep["@type"] == "ChoiceRouteStep" && (<ChoiceRouteStep>this.routeStep).conditions) {
    //         const index = (<ChoiceRouteStep>this.routeStep).conditions.indexOf(condition);
    //         (<ChoiceRouteStep>this.routeStep).conditions.splice(index, 1);
    //     }
    // }
}