declare var closeModal: any;
declare var showAlertModal: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';
import { Subscription } from 'rxjs/Subscription';

import { Domain, Intent, Entity, Goal, GoalStep, Response, Stage, ResponseData, ResponseOption, Settings, CardData } from '../../../../models/domain.model';

import { DomainService } from '../../../../services/domain.service';
import { AlertService, DataSharingService } from '../../../../services/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'api-agent-domain',
  templateUrl: './domainSetup.component.html'
})
export class DomainSetupComponent implements OnInit, OnDestroy {
  entityUploaderOptions: NgUploaderOptions;

  domainCreateMode: boolean;
  isAddFileUploadResponse: boolean;
  modalHeader: string;
  createMode: boolean;
  languageSource: string[];
  modelKeysSource: string[];
  validationKeysSource: string[];
  stagesSource: Stage[];
  templateNames: string[];
  suggestedTags:string[];


  intentFilterQuery: string;
  entityFilterQuery: string;
  goalFilterQuery: string;
  responseFilterQuery: string;
  cardsFilterQuery: string;

  selectedDomain: Domain;
  tempIntent: Intent;
  selectedIntent: Intent;
  tempEntity: Entity;
  selectedEntity: Entity;
  tempGoal: Goal;
  selectedGoal: Goal;
  tempResponse: Response;
  selectedResponse: Response;
  selectedCard: CardData;
  tempCard: CardData;
  domainUpdate: string;
  domainBody: string;
  domainSucess: boolean;
  operandSource: string[];
  bulkExpressions: string;

  showTags:boolean;

  private subscription: Subscription;
  private subscriptionModelKeys: Subscription;
  private subscriptionValidationKeys: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private domainService: DomainService,
    private sharingService: DataSharingService,
    private slimLoadingBarService: SlimLoadingBarService
  ) {
    this.isAddFileUploadResponse = false;
    this.domainCreateMode = true;
    this.modalHeader = '';
    this.createMode = false;
    this.showTags = false;
    this.languageSource = ['ENG', 'HIN', 'MAR', 'ID', 'ML', 'ARA'];
    this.operandSource = ['AND', 'OR'];
    this.modelKeysSource = [];
    this.domainUpdate = 'Domain';
    this.domainBody = 'Please wait updating domain........';
    this.domainSucess = false;
    this.templateNames = ["default"]
    this.stagesSource = [];
    this.stagesSource.push(new Stage('Initialization', 'INIT'));
    this.stagesSource.push(new Stage('Context Setting', 'CONTEXT'));
    this.stagesSource.push(new Stage('Information Input', 'INFO'));
    this.stagesSource.push(new Stage('Goal Seek', 'GOAL'));
    this.stagesSource.push(new Stage('Summarize', 'CLOSURE'));

    this.intentFilterQuery = '';
    this.entityFilterQuery = '';
    this.goalFilterQuery = '';
    this.responseFilterQuery = '';
    this.cardsFilterQuery = '';

    this.selectedDomain = new Domain();
    this.tempIntent = new Intent();
    this.selectedIntent = new Intent();
    this.tempEntity = new Entity();
    this.selectedEntity = new Entity();
    this.tempGoal = new Goal();
    this.selectedGoal = new Goal();
    this.tempResponse = new Response();
    this.selectedResponse = new Response();
    this.selectedCard = new CardData();
    this.tempCard = new CardData();

    const uploadIntentUrl = `${environment.autoServer}${environment.uploadintentexcelurl}`;
    this.intentUploaderOptions = {
      url: uploadIntentUrl
    };

    const uploadEntityUrl = `${environment.autoServer}${environment.uploadentityexcelurl}`;
    this.entityUploaderOptions = {
      url: uploadEntityUrl
    };

    this.slimLoadingBarService.color = '#2DACD1'; // Primary color
    this.slimLoadingBarService.height = '4px';
  }

  ngOnInit() {
    this.fetchValidationKeys();

    const domain: Domain = this.sharingService.getSharedObject();
    if (domain) {
      this.selectedDomain = domain;
      this.domainCreateMode = false;
    } else {
      this.selectedDomain = new Domain();
      this.domainCreateMode = true;
    }

    this.removeGoalStepResponseFromDomainResponse();
  }

  ngOnDestroy(): void {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionModelKeys && !this.subscriptionModelKeys.closed) {
      this.subscriptionModelKeys.unsubscribe();
    }
    if (this.subscriptionValidationKeys && !this.subscriptionValidationKeys.closed) {
      this.subscriptionValidationKeys.unsubscribe();
    }
  }

  intentUploaderOptions: NgUploaderOptions;

  fetchValidationKeys() {
    this.validationKeysSource = ['dobdate', 'phonenumber', 'email', 'otp', 'incidentdate', 'incidentdescreption', 'pincode', 'imeiemail', 'incidenttime', 'imei', 'emailmobile'];
  }

  resetFields() {
    this.selectedDomain = new Domain();
  }

  onIntentSelect(intent?: Intent) {
    if (intent) {
      this.modalHeader = 'Update Intent';
      this.createMode = false;
      this.selectedIntent = intent;
      this.tempIntent = JSON.parse(JSON.stringify(this.selectedIntent));
    } else {
      this.modalHeader = 'Create Intent';
      this.createMode = true;
      this.selectedIntent = null;
      this.tempIntent = new Intent();
    }
  }

  addIntent() {
    if (this.selectedIntent) {
      const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
      if (index !== -1) {
        this.selectedDomain.domainIntents[index] = this.tempIntent;
      }
    } else {
      this.selectedDomain.domainIntents.push(this.tempIntent);
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.intentFilterQuery = (` ${this.intentFilterQuery}`);
    setTimeout(() => {
      this.intentFilterQuery = this.intentFilterQuery.slice(1);
    }, 10);
  }

  removeIntent() {
    if (this.selectedIntent) {
      const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
      if (index !== -1) {
        this.selectedDomain.domainIntents.splice(index, 1);
      }

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.intentFilterQuery = (` ${this.intentFilterQuery}`);
      setTimeout(() => {
        this.intentFilterQuery = this.intentFilterQuery.slice(1);
      }, 10);
    }
  }

  onEntitySelect(entity?: Entity) {
    if (entity) {
      this.modalHeader = 'Update Entity';
      this.createMode = false;
      this.selectedEntity = entity;
      this.tempEntity = JSON.parse(JSON.stringify(this.selectedEntity));
    } else {
      this.modalHeader = 'Create Entity';
      this.createMode = true;
      this.selectedEntity = null;
      this.tempEntity = new Entity();
    }
  }

  addEntity() {
    if (this.selectedEntity) {
      const index: number = this.selectedDomain.domainEntities.indexOf(this.selectedEntity);
      if (index !== -1) {
        this.selectedDomain.domainEntities[index] = this.tempEntity;
      }
    } else {
      this.selectedDomain.domainEntities.push(this.tempEntity);
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.entityFilterQuery = (` ${this.entityFilterQuery}`);
    setTimeout(() => {
      this.entityFilterQuery = this.entityFilterQuery.slice(1);
    }, 10);
  }

  removeEntity() {
    if (this.selectedEntity) {
      const index: number = this.selectedDomain.domainEntities.indexOf(this.selectedEntity);
      if (index !== -1) {
        this.selectedDomain.domainEntities.splice(index, 1);
      }

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.entityFilterQuery = (` ${this.entityFilterQuery}`);
      setTimeout(() => {
        this.entityFilterQuery = this.entityFilterQuery.slice(1);
      }, 10);
    }
  }

  onGoalSelect(goal?: Goal) {
    if (goal) {
      this.modalHeader = 'Update Goal';
      this.createMode = false;
      this.selectedGoal = goal;
      this.tempGoal = JSON.parse(JSON.stringify(this.selectedGoal));
      this.populateBulkExpressions(this.tempGoal.expression);
    } else {
      this.modalHeader = 'Create Goal';
      this.createMode = true;
      this.selectedGoal = null;
      this.tempGoal = new Goal();
      this.populateBulkExpressions(this.tempGoal.expression);
    }
  }

  addGoal() {
    this.tempGoal.expression = this.readBulkExpressions();

    let error = this.isInvalidGoalSteps(this.tempGoal.domainGoalSteps);
    if (error) {
      new showAlertModal('Error', error);
    }

    error = this.checkStageCodeInGoalResponses(this.tempGoal.domainGoalSteps);
    if (error) {
      new showAlertModal('Error', error);
    } else {
      this.tempGoal.model = '{}';

      if (this.tempGoal && this.tempGoal.domainGoalSteps) {
        const tempMap: any = {};

        for (const goalStep of this.tempGoal.domainGoalSteps) {
          if (goalStep.key && goalStep.key.length > 0) {
            tempMap[goalStep.key] = 'NOTMET';
          }

          if (goalStep.responses) {
            for (const goalStepResponse of goalStep.responses) {
              goalStepResponse.expression = [goalStep.goalExpression];
            }
          }
        }

        this.tempGoal.model = JSON.stringify(tempMap);
      }

      if (this.selectedGoal) {
        const index: number = this.selectedDomain.domainGoals.indexOf(this.selectedGoal);
        if (index !== -1) {
          this.selectedDomain.domainGoals[index] = this.tempGoal;
        }
      } else {
        this.selectedDomain.domainGoals.push(this.tempGoal);
      }

      new closeModal('goalModal');

      // This is to forcefully call the digest cycle of angular so that,
      // the filtered list would get updated with these chanegs made in master list
      this.goalFilterQuery = (` ${this.goalFilterQuery}`);
      setTimeout(() => {
        this.goalFilterQuery = this.goalFilterQuery.slice(1);
      }, 10);
    }

  }

  checkStageCodeInGoalResponses(goalSteps: GoalStep[]) {
    const errorExpressionList: string[] = [];
    if (goalSteps && goalSteps.length > 0) {
      for (const goalStep of goalSteps) {
        if (goalStep && goalStep.responses && goalStep.responses.length > 0) {
          for (const response of goalStep.responses) {
            if (response) {
              if (!response.stage || response.stage.trim().length === 0) {
                errorExpressionList.push(response.expression != null && response.expression.length > 0 ? response.expression[0] : response.response);
              }
            }
          }
        }
      }
    }

    if (errorExpressionList && errorExpressionList.length > 0) {
      return `Stage is missing in the responses of the following goal steps: ${errorExpressionList}`;
    } else {
      return null;
    }
  }

  removeGoal() {
    if (this.selectedGoal) {
      const index: number = this.selectedDomain.domainGoals.indexOf(this.selectedGoal);
      if (index !== -1) {
        this.selectedDomain.domainGoals.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.goalFilterQuery = (` ${this.goalFilterQuery}`);
    setTimeout(() => {
      this.goalFilterQuery = this.goalFilterQuery.slice(1);
    }, 10);
  }

  addNewGoalStep() {
    if (this.tempGoal && this.tempGoal.domainGoalSteps) {
      this.tempGoal.domainGoalSteps.push(new GoalStep());
    }
  }

  deleteGoalStep(goalStep: GoalStep) {
    if (goalStep) {
      const index: number = this.tempGoal.domainGoalSteps.indexOf(goalStep);
      if (index !== -1) {
        this.tempGoal.domainGoalSteps.splice(index, 1);
      }
    }
  }

  goalStepToString(goalSteps: GoalStep[]) {
    let toString = '';

    if (goalSteps) {
      for (let i = 0, len = goalSteps.length; i < len; i++) {
        if (goalSteps[i] && goalSteps[i].responses) {
          for (let j = 0, innerLength = goalSteps[i].responses.length; j < innerLength; j++) {
            toString += goalSteps[i].responses[j].response;
            if (i < (len - 1) || j < (innerLength - 1)) {
              toString += ', ';
            }
          }
        }
      }
    }

    return toString;
  }

  removeGoalStepResponseFromDomainResponse() {
    if (this.selectedDomain && this.selectedDomain.domainGoals && this.selectedDomain.domainResponse) {
      if (this.selectedDomain.domainGoals.length > 0) {
        const responsesToBeRemoved: Response[] = [];

        for (const goal of this.selectedDomain.domainGoals) {
          if (goal.expression && (typeof goal.expression === 'string' || goal.expression instanceof String)) {
            goal.expression = [goal.expression];
          }

          goal.domainGoalSteps = goal.domainGoalSteps.sort((gs1, gs2) => {
            if (gs1.sequence > gs2.sequence) {
              return 1;
            } else if (gs1.sequence < gs2.sequence) {
              return -1;
            } else {
              return 0;
            }
          });

          for (const goalStep of goal.domainGoalSteps) {
            goalStep.responses = [];
            for (const response of this.selectedDomain.domainResponse) {
              if (!response.sequence || response.sequence === null) {
                response.sequence = 0;
              }
              if (!response.disableUserInput || response.disableUserInput === null) {
                response.disableUserInput = false;
              }
              if (!response.stage || response.stage === null) {
                response.stage = '';
              }

              if (!response.settings || response.settings === null) {
                response.settings = new Settings();
              }

              if (!response.selectionExpression || response.selectionExpression === null) {
                response.selectionExpression = '';
              }

              if (!response.options || response.options === null) {
                response.options = [];
              }

              if (!response.contextExpression || response.contextExpression === null) {
                response.contextExpression = '';
              }

              if (response.expression && (typeof response.expression === 'string' || response.expression instanceof String)) {
                response.expression = [response.expression];
              }

              if (!response.uploadDocument || response.uploadDocument === null) {
                response.uploadDocument = {};
              }

              for (const option of response.options) {
                if (!option.type || option.type === null) {
                  option.type = '';
                }
                if (!option.url || option.url === null) {
                  option.url = '';
                }
                if (!option.data || option.data === null) {
                  option.data = [];
                }

                for (const d of option.data) {
                  if (!d.label || d.label === null) {
                    d.label = '';
                  }
                  if (!d.value || d.value === null) {
                    d.value = '';
                  }
                  if (!d.url || d.url === null) {
                    d.url = '';
                  }
                  if (!d.language || d.language === null) {
                    d.language = '';
                  }
                  if (!d.agentId || d.agentId === null) {
                    d.agentId = '';
                  }
                }
              }

              if (response.expression && response.expression.length === 1 && response.expression[0] && goalStep.goalExpression && response.expression[0].trim().toLowerCase() === goalStep.goalExpression.trim().toLowerCase()) {
                responsesToBeRemoved.push(response);
                goalStep.responses.push(response);
              }
            }

            goalStep.responses = goalStep.responses.sort((gsr1, gsr2) => {
              if (gsr1.sequence > gsr2.sequence) {
                return 1;
              } else if (gsr1.sequence < gsr2.sequence) {
                return -1;
              } else {
                return 0;
              }
            });
          }
        }

        for (const response of responsesToBeRemoved) {
          this.removeResponse(response);
        }
      }
    }
  }

  isInvalidGoalSteps(goalSteps: GoalStep[]) {
    const tempGoalSteps = JSON.parse(JSON.stringify(goalSteps));
    for (const goalStep of goalSteps) {
      let occurance = 0;
      for (const tempGoalStep of tempGoalSteps) {
        if (goalStep.goalExpression === tempGoalStep.goalExpression) {
          occurance++;
        }
      }

      if (occurance > 1) {
        return `Duplicate goal response code: ${goalStep.goalExpression}`;
      }
    }

    for (const goal of this.selectedDomain.domainGoals) {
      if (goal !== this.selectedGoal) {
        for (const goalStep of goal.domainGoalSteps) {
          for (const tempGoalStep of goalSteps) {
            if (goalStep.goalExpression === tempGoalStep.goalExpression) {
              return `Duplicate goal response code present in other than current goal: ${goalStep.goalExpression}`;
            }
          }
        }
      }
    }

    return null;
  }

  onResponseSelect(response?: Response) {
    if (response) {
      this.modalHeader = 'Update Response';
      this.createMode = false;
      this.selectedResponse = response;
      this.tempResponse = JSON.parse(JSON.stringify(this.selectedResponse));
      if (this.tempResponse.uploadDocument) {
        this.isAddFileUploadResponse = true;
      }
      this.populateBulkExpressions(this.tempResponse.expression);
    } else {
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedResponse = null;
      this.tempResponse = new Response();
      this.populateBulkExpressions(this.tempResponse.expression);
    }
  }

  onAddFileUploadResponse() {
    this.isAddFileUploadResponse = true;
  }

  onCardSelect(card?: CardData) {
    if (card) {
      this.modalHeader = 'Update Card';
      this.createMode = false;
      this.selectedCard = card;
      this.tempCard = card;
    }
    else {
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedCard = null;
      this.tempCard = new CardData();
    }
  }

  addResponse(response?: Response) {
    if (response) {
      this.selectedDomain.domainResponse.push(response);
    } else if (this.selectedResponse) {
      this.tempResponse.expression = this.readBulkExpressions();

      if (!this.tempResponse.stage || this.tempResponse.stage.trim().length === 0) {
        new showAlertModal('Error', 'Stage can\'t be left empty.');
      } else {
        const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
        if (index !== -1) {
          this.selectedDomain.domainResponse[index] = this.tempResponse;
        }
        new closeModal('responseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
      }
    } else {
      if (!this.tempResponse.stage || this.tempResponse.stage.trim().length === 0) {
        new showAlertModal('Error', 'Stage can\'t be left empty.');
      } else {
        this.tempResponse.expression = this.readBulkExpressions();

        this.selectedDomain.domainResponse.push(this.tempResponse);
        new closeModal('responseModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.responseFilterQuery = (` ${this.responseFilterQuery}`);
        setTimeout(() => {
          this.responseFilterQuery = this.responseFilterQuery.slice(1);
        }, 10);
      }
    }

  }

  removeResponse(response?: Response) {
    if (response) {
      const index: number = this.selectedDomain.domainResponse.indexOf(response);
      if (index !== -1) {
        this.selectedDomain.domainResponse.splice(index, 1);
      }
    } else if (this.selectedResponse) {
      const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
      if (index !== -1) {
        this.selectedDomain.domainResponse.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.responseFilterQuery = (` ${this.responseFilterQuery}`);
    setTimeout(() => {
      this.responseFilterQuery = this.responseFilterQuery.slice(1);
    }, 10);
  }

  removeCard(card?: CardData) {
    if (card) {
      const index: number = this.selectedDomain.cards.indexOf(card);
      if (index !== -1) {
        this.selectedDomain.cards.splice(index, 1);
      }
    } else if (this.selectedResponse) {
      const index: number = this.selectedDomain.cards.indexOf(this.selectedCard);
      if (index !== -1) {
        this.selectedDomain.cards.splice(index, 1);
      }
    }

    // This is to forcefully call the digest cycle of angular so that,
    // the filtered list would get updated with these chanegs made in master list
    this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
    setTimeout(() => {
      this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
    }, 10);
  }

  addCard(card?: CardData) {
    if (card) {
      this.selectedDomain.cards.push(card);
    }
    else if (this.selectedCard) {
      if (!this.tempCard.cardName || !this.tempCard.templateName) {
        new showAlertModal('Error', 'card name can not be blank');
      }
      else {
        const index: number = this.selectedDomain.cards.indexOf(this.selectedCard);
        if (index !== -1) {
          this.selectedDomain.cards[index] = this.tempCard;
        }
        new closeModal('cardModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
        setTimeout(() => {
          this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
        }, 10);
      }

    }
    else {
      if (!this.tempCard.cardName || this.tempCard.cardName.trim().length === 0) {
        new showAlertModal('Error', 'card name can\'t be left empty.');
      } else {
        if (!this.selectedDomain.cards) {
          this.selectedDomain.cards = [];
        }
        this.selectedDomain.cards.push(this.tempCard);
        new closeModal('cardModal');

        // This is to forcefully call the digest cycle of angular so that,
        // the filtered list would get updated with these chanegs made in master list
        this.cardsFilterQuery = (` ${this.cardsFilterQuery}`);
        setTimeout(() => {
          this.cardsFilterQuery = this.cardsFilterQuery.slice(1);
        }, 10);
      }
    }

  }

  createDomain() {
    if (this.selectedDomain) {
      if (this.selectedDomain.domainGoals) {
        for (const goal of this.selectedDomain.domainGoals) {
          if (goal && goal.domainGoalSteps) {
            for (const goalStep of goal.domainGoalSteps) {
              if (goalStep && goalStep.responses) {
                for (const response of goalStep.responses) {
                  if (response) {
                    this.selectedDomain.domainResponse.push(response);
                  }
                }
                goalStep.responses = null;
              }
            }
          }
        }
      }
      this.subscription = this.domainService.saveDomain(this.selectedDomain)
        .subscribe(
          response => {
            this.updateClassifierTraining();

            //this.updateIntenTrainingData();

            // this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
          },
          error => {
            this.domainBody = `Something went wrong please try again!!`;
            this.domainSucess = true;
          }
        );
    }
  }

  updateClassifierTraining() {
    this.subscription = this.domainService.updateDomainClassifierTraining(this.selectedDomain)
      .subscribe(
        response => {
          if (response) {
            this.domainBody = `Domain updated successfully!!`;
            this.domainSucess = true;
            this.selectedDomain = response;
          } else {
            this.domainBody = `Something went wrong please try again!!`;
            this.domainSucess = true;
          }
          //this.updateEntityTrainingData();
          //this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      )
  }

  updateIntenTrainingData() {
    this.subscription = this.domainService.updateIntentTraining(this.selectedDomain)
      .subscribe(
        response => {
          this.updateEntityTrainingData();
          // this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      );
  }

  updateEntityTrainingData() {
    this.subscription = this.domainService.updateEntityTraining(this.selectedDomain)
      .subscribe(
        response => {
          this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      );
  }

  toggleCheck(checkBox: string, checked: boolean) {
    if (checkBox) {
      this.tempGoal.htmlFlag = checkBox === 'HTML_FLAG' && checked;
      this.tempGoal.responseChange = checkBox === 'RESPONSE_CHANGE' && checked;
      this.tempGoal.responseDependent = checkBox === 'RESPONSE_DEPENDENT' && checked;
    }
  }

  getLangSpecificResponses(responses: Response[], language: string) {
    const langResponse: Response[] = [];

    for (const response of responses) {
      if (response && response.lang && language && response.lang === language) {
        langResponse.push(response);
      }
    }

    return langResponse;
  }

  addNewGoalStepResponse(goalStep, language) {
    if (goalStep && language) {
      const gsResponse = new Response(goalStep.goalExpression, language);

      if (goalStep.responses) {
        goalStep.responses.push(gsResponse);
      } else {
        goalStep.responses = [];
        goalStep.responses.push(gsResponse);
      }
    }
  }

  deleteGoalStepResponse(goalStep, gsResponse) {
    if (goalStep && goalStep.responses && gsResponse) {
      const index: number = goalStep.responses.indexOf(gsResponse);
      if (index !== -1) {
        goalStep.responses.splice(index, 1);
      }
    }
  }

  // -------------------------------------------------------------------------------------------------

  onExcelUpload(event: any) {
    if (event) {
      if (event.hasOwnProperty('progress') && event['progress'].hasOwnProperty('percent')) {
        const percent = (event['progress'])['percent'];
        if (percent) {
          if (percent < 100) {
            this.slimLoadingBarService.progress = percent;
          } else {
            this.slimLoadingBarService.complete();
          }
        }
      }
    }
  }

  onExcelUploadComplete(event: UploadedFile) {
    this.slimLoadingBarService.complete();

    if (event.response && event.response.length > 0) {
      const responseObject = JSON.parse(event.response);

      if (responseObject) {
        if (responseObject.hasOwnProperty('domainIntents')) {
          const excelIntents: Intent[] = responseObject['domainIntents'];

          if (excelIntents && excelIntents.length > 0) {
            for (const intent of excelIntents) {
              this.selectedDomain.domainIntents.push(intent);
            }
          }
        } else if (responseObject.hasOwnProperty('domainEntities')) {
          const excelEntities: Entity[] = responseObject['domainEntities'];

          if (excelEntities && excelEntities.length > 0) {
            for (const entity of excelEntities) {
              this.selectedDomain.domainEntities.push(entity);
            }
          }
        }
      }
    }
  }

  onAddResponseOption(response) {
    if (!response.options) {
      response.options = [];
    }
    response.options.push(new ResponseData());
  }

  onAddData(option) {
    option.data.push(new ResponseOption());
  }

  onAddCardActinableData(option) {
    option.data.push(new ResponseOption());
  }

  onAddCardData(option) {
    option.cardData.push('');
  }

  onAddCardActionOption(cardData) {
    if (!cardData.actionable) {
      cardData.actionable = [];
    }
    cardData.actionable.push(new ResponseData())
  }



  deleteCardData(cardData, row) {
    const index: number = cardData.indexOf(row);
    if (index !== -1) {
      cardData.slice(index, 1);
    }
  }

  delete(data, row) {
    const index: number = data.indexOf(row);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }

  onAddSelectionExpression(expressionList) {
    if (expressionList) {
      expressionList.push('');
    }
  }

  // Don't remove. Very important.
  // Being used by for loop in html to keep track of a string in array of strings
  customTrackBy(index: number, obj: any): any {
    return index;
  }

  populateBulkExpressions(expressions) {
    this.bulkExpressions = '';
    if (expressions) {
      for (const exp of expressions) {
        if (exp) {
          if (this.bulkExpressions.length > 0) {
            this.bulkExpressions = this.bulkExpressions + '\n' + exp;
          } else {
            this.bulkExpressions = exp;
          }
        }
      }
    }
  }

  readBulkExpressions() {
    let expressions = [];
    if (this.bulkExpressions && this.bulkExpressions.trim().length > 0) {
      expressions = this.bulkExpressions.split("\n");
    }
    this.bulkExpressions = '';
    return expressions;
  }

  getSynonyms(){
    this.showTags = true;
    
    if(this.tempIntent.tags.length > 0){
      console.log("------------------------------------------");
      this.subscription = this.domainService.getSynonyms(this.tempIntent.tags[this.tempIntent.tags.length-1])
      .subscribe(
        response => {
          this.suggestedTags = response["synonyms"];
          // this.router.navigate(['/pg/dmn/dmsr'], { relativeTo: this.route });
        }
      );
    }
    }
    

}
