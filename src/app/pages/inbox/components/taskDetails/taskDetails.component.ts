declare var designFlowEditor: any;
declare var styleStates: any;

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { State } from '../../../../models/tasks.model';
import { GraphObject, DataPoint, StateModel, ManualAction } from '../../../../models/flow.model';
import { Episode, ChatMessage } from '../../../../models/conversation.model';

import { StateService, DataCachingService } from '../../../../services/inbox.service';
import { ConversationService } from '../../../../services/agent.service';

@Component({
  selector: 'api-task-details',
  templateUrl: './taskDetails.component.html',
  styleUrls: ['./taskDetails.scss']
})

export class TaskDetailsComponent implements OnInit, OnDestroy {

  selectedState: State;
  manualActions: ManualAction[];
  actionMap: any;
  graphObject: GraphObject;
  // parameterKeys: Map<string, string> = new Map(); // to be removed

  selectedEpisode: Episode;
  chatMessageList: ChatMessage[];

  // dataPointList: DataPoint[]; // to be removed

  private subscription: Subscription;
  private subscriptionEpisode: Subscription;
  private subscriptionChatMessages: Subscription;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private stateService: StateService,
    private conversationService: ConversationService,
    private dataCachingService: DataCachingService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.selectedState = this.dataCachingService.getSelectedState();
    if (!this.selectedState) {
      this.router.navigate(['/pg/tsk/tact'], { relativeTo: this.route });
    }
    
    this.graphObject = this.dataCachingService.getGraphObject();
    if (!this.graphObject) {
      this.graphObject = new GraphObject();
    }

    this.getEpisode();
    this.extractParams();
    this.extractManualStateAction();
    this.initUI();
  }

  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    if (this.subscriptionEpisode && !this.subscriptionEpisode.closed) {
      this.subscriptionEpisode.unsubscribe();
    }
    if (this.subscriptionChatMessages && !this.subscriptionChatMessages.closed) {
      this.subscriptionChatMessages.unsubscribe();
    }
  }

  onBack() {
    this.location.back();
  }

  getEpisode() {
    this.subscriptionEpisode = this.conversationService.getEpisode(this.selectedState.entityId)
    .subscribe(episode => {
      if (episode) {
        this.selectedEpisode = episode;
        this.getChatMessages();
      }
    });
  }

  getChatMessages() {
    this.subscriptionChatMessages = this.conversationService.getChat(this.selectedEpisode._id)
    .subscribe(chatMessages => {
      if (chatMessages) {
        this.chatMessageList = chatMessages;
      }
    });
  }

  extractParams() {
    if (this.selectedState) {

      // Comment to be able to edit params of CLOSED states
      // if (this.selectedState.statusCd === 'CLOSED') {
      //   this.manualActions = [];
      //   this.actionMap = {};
      //   return;
      // }
  
      if (!this.actionMap) {
        this.actionMap = {};
      }
      if (!this.manualActions) {
        this.manualActions = [];
      }

      if (this.selectedState.parameters) {
        for (const key in this.selectedState.parameters) {
          const paramValue: any = this.selectedState.parameters[key];
          
          if (key) {
            let manualAction: ManualAction;

            if (paramValue) {
              if (typeof paramValue === 'string' || paramValue instanceof String) {
                manualAction = new ManualAction(key, paramValue, 'STRING');
              } else if (typeof paramValue === 'number' || paramValue instanceof Number) {
                manualAction = new ManualAction(key, paramValue, 'NUMBER');
              } else if (typeof paramValue === 'boolean' || paramValue instanceof Boolean) {
                manualAction = new ManualAction(key, paramValue, 'BOOLEAN');
              } else if (paramValue instanceof Array) {
                manualAction = new ManualAction(key, paramValue, 'ARRAY');
              } else {
                manualAction = new ManualAction(key, paramValue, '');
              }
            } else {
              manualAction = new ManualAction(key, '', 'STRING');
            }

            this.manualActions.push(manualAction);
            this.actionMap[key] = paramValue;
          }
        }

        /*
        let dataPoint = this.getDataPoint(key);

        if (dataPoint.type === 'STRING' || dataPoint.type === 'NUMBER' || dataPoint.type === 'BOOLEAN') {
          this.actionMap[key] = (this.selectedState.parameters[key] !== null && this.selectedState.parameters[key].toString().trim().length > 0) ? this.selectedState.parameters[key] : dataPoint.value;
        } else if (dataPoint.type === 'EXPRESSION') {
          this.actionMap[key] = (this.selectedState.parameters[key] !== null && this.selectedState.parameters[key].toString().trim().length > 0) ? this.selectedState.parameters[key] : '';
        } else if (dataPoint.type === 'SINGLE_SELECT') {
          this.actionMap[key] = (this.selectedState.parameters[key] !== null && this.selectedState.parameters[key].toString().trim().length > 0) ? this.selectedState.parameters[key] : '';
        } else if (dataPoint.type === 'MULTI_SELECT') {
          this.actionMap[key] = this.selectedState.parameters[key] !== null ? this.selectedState.parameters[key] : [];
        } else {
          this.actionMap[key] = this.selectedState.parameters[key];
          dataPoint.key = key;
          dataPoint.value = this.selectedState.parameters[key];
          dataPoint.type = '';
        }

        this.dataPointList.push(dataPoint);

        for (const dataPoint of this.graphObject.dataPointConfigurationList) {
          let unique = true;
          for (const innerDataPoint of this.dataPointList) {
            if (innerDataPoint.key === dataPoint.key) {
              unique = false;
            }
          }

          if (unique) {
            this.dataPointList.push(dataPoint);

            if (dataPoint.type === 'STRING' || dataPoint.type === 'NUMBER' || dataPoint.type === 'BOOLEAN') {
              this.actionMap[dataPoint.key] = dataPoint.value;
            } else if (dataPoint.type === 'EXPRESSION' || dataPoint.type === 'SINGLE_SELECT') {
              this.actionMap[dataPoint.key] = '';
            } else if (dataPoint.type === 'MULTI_SELECT') {
              this.actionMap[dataPoint.key] = [];
            }
          }
        }
        */
      }
    }
  }

  extractManualStateAction() {
    if (this.graphObject.states) {
      if (!this.manualActions) {
        this.manualActions = [];
      }

      for (const state of this.graphObject.states) {
        if (state && state.stateCd && state.manualActions && this.selectedState.stageCd && this.selectedState.stateCd === state.stateCd) {
          if (state.manualActions) {
            for (const manualAction of state.manualActions) {
              let uniqueAction: boolean = true;

              for (const globalAction of this.manualActions) {
                if (manualAction.key === globalAction.key) {
                  uniqueAction = false;

                  if (manualAction.type === 'SINGLE_SELECT') {
                    const source: any[] = manualAction.value;
                    if (globalAction.type !== 'ARRAY' && !source.includes(globalAction.value)) {
                      source.push(globalAction.value);
                    }

                    globalAction.type = manualAction.type;
                    globalAction.value = source;
                  } else if (manualAction.type === 'MULTI_SELECT') {
                    const source: any[] = manualAction.value;
                    if (globalAction.type === 'ARRAY') {
                      const oldSource: any[] = globalAction.value;
                      
                      for (const oldValue of oldSource) {
                        let uniqueValue = true;
                        for (const newValue of source) {
                          if (oldValue === newValue) {
                            uniqueValue = false;
                            break;
                          }
                        }

                        if (uniqueValue) {
                          source.push(oldValue);
                        }
                      }
                    }

                    globalAction.type = manualAction.type;
                    globalAction.value = source;
                  }

                  break;
                }
              }

              if (uniqueAction) {
                this.manualActions.push(manualAction);

                if (manualAction.type === 'STRING' || manualAction.type === '') {
                  this.actionMap[manualAction.key] = (manualAction.value && manualAction.value.toString().trim().length > 0) ? manualAction.value : '';
                } else if (manualAction.type === 'NUMBER') {
                  this.actionMap[manualAction.key] = (manualAction.value && (typeof manualAction.value === 'number' || manualAction.value instanceof Number)) ? manualAction.value : 0;
                } else if (manualAction.type === 'BOOLEAN') {
                  this.actionMap[manualAction.key] = (manualAction.value && (typeof manualAction.value === 'boolean' || manualAction.value instanceof Boolean)) ? manualAction.value : false;
                } else if (manualAction.type === 'SINGLE_SELECT' || manualAction.type === 'MULTI_SELECT') {
                  this.actionMap[manualAction.key] = (manualAction.value && manualAction.value instanceof Array && manualAction.value.length > 0) ? manualAction.value[0] : '';
                }
              }
            }
          }
          break;
        }
      }
    }
  }

  initUI() {
    new designFlowEditor(this.graphObject.xml, true);
    new styleStates(this.graphObject.activeStateIdList, this.graphObject.closedStateIdList);
  }

  updateFlow() {
    if (!this.actionMap) {
      this.actionMap = {};
    }

    this.subscription = this.stateService.update(this.selectedState.machineType,
      this.selectedState.entityId, this.actionMap)
      .subscribe(state => {
        this.onBack();
      });
  }

  // getDataPoint(key: string) {
  //   if (key && this.graphObject && this.graphObject.dataPointConfigurationList) {
  //     for (const dataPoint of this.graphObject.dataPointConfigurationList) {
  //       if (dataPoint.key === key) {
  //         return dataPoint;
  //       }
  //     }
  //   }

  //   return new DataPoint();
  // }
}
