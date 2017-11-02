declare var closeModal: any;

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgUploaderOptions, UploadedFile } from 'ngx-uploader';

import { Domain, Intent, Entity, Goal, GoalStep, Response } from '../../agent.model';

import { AgentService } from '../../agent.services';
import { AlertService, DataSharingService } from '../../../../shared/shared.service';

import { environment } from '../../../../../environments/environment';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Component({
  selector: 'api-agent-domain',
  templateUrl: './domainSetup.component.html'
})
export class DomainSetupComponent implements OnInit {

  intentUploaderOptions: NgUploaderOptions;
  entityUploaderOptions: NgUploaderOptions;

  domainCreateMode: boolean;
  modalHeader: string;
  createMode: boolean;
  filterQuery: string;
  languageSource: string[];
  tempKeySource: string[];

  selectedDomain: Domain;
  tempIntent: Intent;
  selectedIntent: Intent;
  tempEntity: Entity;
  selectedEntity: Entity;
  tempGoal: Goal;
  selectedGoal: Goal;
  tempResponse: Response;
  selectedResponse: Response;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private agentService: AgentService,
    private sharingService: DataSharingService,
    private slimLoadingBarService: SlimLoadingBarService
  ) {
    this.domainCreateMode = true;
    this.modalHeader = '';
    this.createMode = false;
    this.filterQuery = '';
    this.languageSource = ['ENG', 'HIN', 'MAR', 'Bahasa'];
    this.tempKeySource = ['name', 'dob', 'phoneNumber', 'email', 'panNumber', 'aadharNumber', 'income', 'emi'];

    this.selectedDomain = new Domain();
    this.tempIntent = new Intent();
    this.selectedIntent = new Intent();
    this.tempEntity = new Entity();
    this.selectedEntity = new Entity();
    this.tempGoal = new Goal();
    this.selectedGoal = new Goal();
    this.tempResponse = new Response();
    this.selectedResponse = new Response();

    const uploadIntentUrl = `${environment.wheelsemiserver}${environment.uploadintentexcelurl}`;
    this.intentUploaderOptions = {
      url: uploadIntentUrl
    };

    const uploadEntityUrl = `${environment.wheelsemiserver}${environment.uploadentityexcelurl}`;
    this.entityUploaderOptions = {
      url: uploadEntityUrl
    };

    this.slimLoadingBarService.color = '#2DACD1'; // Primary color
    this.slimLoadingBarService.height = '4px';
  }

  ngOnInit() {
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
  }

  removeIntent() {
    if (this.selectedIntent) {
      const index: number = this.selectedDomain.domainIntents.indexOf(this.selectedIntent);
      if (index !== -1) {
        this.selectedDomain.domainIntents.splice(index, 1);
      }
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
  }

  removeEntity() {
    if (this.selectedEntity) {
      const index: number = this.selectedDomain.domainEntities.indexOf(this.selectedEntity);
      if (index !== -1) {
        this.selectedDomain.domainEntities.splice(index, 1);
      }
    }
  }

  onGoalSelect(goal?: Goal) {
    if (goal) {
      this.modalHeader = 'Update Goal';
      this.createMode = false;
      this.selectedGoal = goal;
      this.tempGoal = JSON.parse(JSON.stringify(this.selectedGoal));
    } else {
      this.modalHeader = 'Create Goal';
      this.createMode = true;
      this.selectedGoal = null;
      this.tempGoal = new Goal();
    }
  }

  addGoal() {
    const error = this.isInvalidGoalSteps(this.tempGoal.domainGoalSteps);
    if (error) {
      this.alertService.error(error, false, 5000);
    } else {
      this.removeGoalStepResponseFromDomainResponse();
      this.tempGoal.model = '{}';

      if (this.tempGoal && this.tempGoal.domainGoalSteps) {
        const tempMap: any = {};

        for (const goalStep of this.tempGoal.domainGoalSteps) {
          if (goalStep.key && goalStep.key.length > 0) {
            tempMap[goalStep.key] = 'NOTMET';
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
    }
  }

  removeGoal() {
    if (this.selectedGoal) {
      const index: number = this.selectedDomain.domainGoals.indexOf(this.selectedGoal);
      if (index !== -1) {
        this.selectedDomain.domainGoals.splice(index, 1);
      }
    }
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
        toString += goalSteps[i].goalResponse;

        if (i < (len - 1)) {
          toString += ', ';
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
          for (const goalStep of goal.domainGoalSteps) {
            for (const response of this.selectedDomain.domainResponse) {
              if (response.expression === goalStep.goalExpression) {
                responsesToBeRemoved.push(response);
              }
            }
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
        return 'Duplicate goal response code: ' + goalStep.goalExpression;
      }
    }

    for (const goal of this.selectedDomain.domainGoals) {
      if (goal !== this.selectedGoal) {
        for (const goalStep of goal.domainGoalSteps) {
          for (const tempGoalStep of goalSteps) {
            if (goalStep.goalExpression === tempGoalStep.goalExpression) {
              return 'Duplicate goal response code present in other than current goal: ' + goalStep.goalExpression;
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
    } else {
      this.modalHeader = 'Create Response';
      this.createMode = true;
      this.selectedResponse = null;
      this.tempResponse = new Response();
    }
  }

  addResponse(response?: Response) {
    if (response) {
      this.selectedDomain.domainResponse.push(response);
    } else if (this.selectedResponse) {
      const index: number = this.selectedDomain.domainResponse.indexOf(this.selectedResponse);
      if (index !== -1) {
        this.selectedDomain.domainResponse[index] = this.tempResponse;
      }
    } else {
      this.selectedDomain.domainResponse.push(this.tempResponse);
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
  }

  createDomain() {
    if (this.selectedDomain) {
      if (this.selectedDomain.domainGoals) {
        for (const goal of this.selectedDomain.domainGoals) {
          if (goal && goal.domainGoalSteps) {
            for (const goalStep of goal.domainGoalSteps) {
              const response: Response = new Response(goalStep.goalExpression, goalStep.lang, goalStep.goalResponse);
              this.addResponse(response);
            }
          }
        }
      }

      this.agentService.saveDomain(this.selectedDomain)
        .then(
        response => {
          this.router.navigate(['/pages/agent/domains'], { relativeTo: this.route });
        }
        );
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
}
